# Prevod feedu Moris Distribution (Google format) do formatu Shoptet.
# Autor: Martin Holcak
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

ZDROJ = "https://eshop.moris-distribution.cz/zbozigooglecustom.xml"
ZNACKY = {
    # hledany text ve znacce feedu : nazev vyrobce na e-shopu
    "grund": "GRUNDÉNS",
}
KATEGORIE = "Grundens"  # skryta hlavni kategorie na e-shopu
VYSTUP = "public/grundens.xml"
G = "{http://base.google.com/ns/1.0}"


def text(item, tag):
    el = item.find(tag)
    return (el.text or "").strip() if el is not None and el.text else ""


def cdata(value):
    return "<![CDATA[" + value.replace("]]>", "]]]]><![CDATA[>") + "]]>"


# Velikost na konci nazvu (Moris ji nema v samostatnem poli).
VELIKOST = re.compile(
    r"^(?P<zaklad>.*?)\s+(?:vel\.\s*)?(?P<velikost>"
    r"(?:\d{1,2}(?:[.,]5)?\s*/\s*)?[Ee][Uu]\s*\d{2}(?:[.,]5)?"           # 10 / EU 43, EU 43
    r"|(?:(?:\d?X{0,3}[SML])\s+)?(?:(?:King|TALL|Tall|Short|Regular)\s+)?\d{2}-\d{2}"  # L King 42-44
    r"|[SML]\s+\d{1,2}"                                              # M 8
    r"|\d?X{0,3}[SML](?:/\d?X{0,3}[SML])?"                            # S, XL, 3XL, S/M
    r"|O/S|ONE SIZE"
    r"|\d{2}"                                                       # pas 32, bota 43
    r")$"
)
BEZ_VELIKOSTI = {"O/S", "ONE SIZE"}
PORADI = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL", "5XL"]


def popis_velikosti(v):
    v = re.sub(r"\s+", " ", v).strip()
    m = re.match(r"(\d{1,2}(?:[.,]5)?)\s*/\s*EU\s*(\S+)$", v)
    if m:
        return f"EU {m.group(2)} (US {m.group(1)})"
    return re.sub(r"^[Ee][Uu]\s*", "EU ", v)


def klic_velikosti(v):
    cisla = re.findall(r"\d+(?:[.,]5)?", v.replace("XL", ""))
    pismeno = re.match(r"(\d?X{0,3}[SML])\b", v)
    rank = PORADI.index(pismeno.group(1)) if pismeno and pismeno.group(1) in PORADI else 99
    if v[:1].isdigit() and "XL" in v:
        rank = PORADI.index(v.split()[0]) if v.split()[0] in PORADI else rank
    return (rank, [float(c.replace(",", ".")) for c in cisla], v)


def nacti_polozky(root):
    for item in root.iter("item"):
        znacka = text(item, G + "brand")
        vyrobce = next((v for k, v in ZNACKY.items() if k in znacka.lower()), None)
        if not vyrobce:
            continue
        kod = text(item, G + "id")
        nazev = re.sub(r"\s+", " ", text(item, "title")).strip()
        if not kod or not nazev:
            continue
        cena = re.sub(r"[^0-9.,]", "", text(item, G + "price")).replace(",", ".")
        try:
            sklad = max(0, int(float(text(item, G + "availability") or 0)))
        except ValueError:
            sklad = 0
        obrazky = [text(item, G + "image_link")] + [
            (e.text or "").strip() for e in item.findall(G + "additional_image_link")
        ]
        yield {
            "kod": kod, "nazev": nazev, "vyrobce": vyrobce, "cena": cena, "sklad": sklad,
            "obrazky": [o for o in dict.fromkeys(obrazky) if o],
            "popis": text(item, G + "description"),
            "ean": text(item, G + "gtin"), "mpn": text(item, G + "mpn"),
        }


def hlavicka(out, p, nazev):
    out.append(f"    <NAME>{cdata(nazev)}</NAME>")
    if p["popis"]:
        out.append(f"    <DESCRIPTION>{cdata(p['popis'])}</DESCRIPTION>")
    out.append(f"    <MANUFACTURER>{escape(p['vyrobce'])}</MANUFACTURER>")
    out.append("    <SUPPLIER>Moris Distribution</SUPPLIER>")
    out.append("    <CATEGORIES>")
    out.append(f"      <CATEGORY>{cdata(KATEGORIE)}</CATEGORY>")
    out.append(f"      <DEFAULT_CATEGORY>{cdata(KATEGORIE)}</DEFAULT_CATEGORY>")
    out.append("    </CATEGORIES>")
    if p["obrazky"]:
        out.append("    <IMAGES>")
        out.extend(f"      <IMAGE>{cdata(o)}</IMAGE>" for o in p["obrazky"])
        out.append("    </IMAGES>")


def detail(out, p, odsazeni):
    o = " " * odsazeni
    out.append(f"{o}<CODE>{escape(p['kod'])}</CODE>")
    if p["ean"]:
        out.append(f"{o}<EAN>{escape(p['ean'])}</EAN>")
    if p["cena"]:
        out.append(f"{o}<PRICE_VAT>{escape(p['cena'])}</PRICE_VAT>")
    out.append(f"{o}<CURRENCY>CZK</CURRENCY>")
    out.append(f"{o}<VAT>21</VAT>")
    out.append(f"{o}<STOCK>")
    out.append(f"{o}  <AMOUNT>{p['sklad']}</AMOUNT>")
    out.append(f"{o}</STOCK>")


def main():
    req = urllib.request.Request(ZDROJ, headers={"User-Agent": "feed-prevod/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    root = ET.fromstring(data)

    # Seskupeni velikosti do variant: produkt = model + barva, varianta = velikost.
    skupiny = {}
    for p in nacti_polozky(root):
        m = VELIKOST.match(p["nazev"])
        if m and m.group("velikost") not in BEZ_VELIKOSTI:
            p["velikost"] = popis_velikosti(m.group("velikost"))
            if p["velikost"].isdigit() and re.search(r"Boot|Shoe|Slide|Sandal", p["nazev"], re.I):
                p["velikost"] = "EU " + p["velikost"]
            skupiny.setdefault(("V", m.group("zaklad").rstrip(" -/,")), []).append(p)
        else:
            nazev = (m.group("zaklad") if m else p["nazev"]).rstrip(" -/,")
            skupiny.setdefault(("P", p["kod"]), []).append(dict(p, nazev=nazev))

    out = ['<?xml version="1.0" encoding="utf-8"?>', "<SHOP>"]
    produkty = varianty = 0
    for (typ, klic), polozky in skupiny.items():
        out.append("  <SHOPITEM>")
        if typ == "P":
            p = polozky[0]
            hlavicka(out, p, p["nazev"])
            if p["mpn"]:
                out.append(f"    <MANUFACTURER_CODE>{escape(p['mpn'])}</MANUFACTURER_CODE>")
            detail(out, p, 4)
        else:
            polozky.sort(key=lambda x: klic_velikosti(x["velikost"]))
            hlavicka(out, polozky[0], klic)
            out.append("    <VARIANTS>")
            for p in polozky:
                out.append("      <VARIANT>")
                detail(out, p, 8)
                out.append("        <PARAMETERS>")
                out.append("          <PARAMETER>")
                out.append("            <NAME>Velikost</NAME>")
                out.append(f"            <VALUE>{cdata(p['velikost'])}</VALUE>")
                out.append("          </PARAMETER>")
                out.append("        </PARAMETERS>")
                out.append("      </VARIANT>")
                varianty += 1
            out.append("    </VARIANTS>")
        out.append("  </SHOPITEM>")
        produkty += 1
    out.append("</SHOP>")

    if produkty == 0:
        sys.exit("Ve feedu nebyl nalezen zadny produkt - feed nebyl prepsan.")
    os.makedirs("public", exist_ok=True)
    with open(VYSTUP, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    print(f"Hotovo: {produkty} produktu, {varianty} variant -> {VYSTUP}")


if __name__ == "__main__":
    main()
