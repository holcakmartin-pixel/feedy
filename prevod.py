# Prevod feedu Moris Distribution (Google format) do formatu Shoptet.
# Autor: Martin Holcak
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


def main():
    req = urllib.request.Request(ZDROJ, headers={"User-Agent": "feed-prevod/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    root = ET.fromstring(data)
    out = ['<?xml version="1.0" encoding="utf-8"?>', "<SHOP>"]
    pocet = 0
    for item in root.iter("item"):
        znacka = text(item, G + "brand")
        vyrobce = next((v for k, v in ZNACKY.items() if k in znacka.lower()), None)
        if not vyrobce:
            continue
        kod = text(item, G + "id")
        nazev = text(item, "title")
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
        obrazky = [o for o in dict.fromkeys(obrazky) if o]
        popis = text(item, G + "description")
        ean = text(item, G + "gtin")
        mpn = text(item, G + "mpn")

        out.append("  <SHOPITEM>")
        out.append(f"    <CODE>{escape(kod)}</CODE>")
        out.append(f"    <NAME>{cdata(nazev)}</NAME>")
        if popis:
            out.append(f"    <DESCRIPTION>{cdata(popis)}</DESCRIPTION>")
        out.append(f"    <MANUFACTURER>{escape(vyrobce)}</MANUFACTURER>")
        out.append("    <SUPPLIER>Moris Distribution</SUPPLIER>")
        if ean:
            out.append(f"    <EAN>{escape(ean)}</EAN>")
        if mpn:
            out.append(f"    <MANUFACTURER_CODE>{escape(mpn)}</MANUFACTURER_CODE>")
        out.append("    <CATEGORIES>")
        out.append(f"      <CATEGORY>{cdata(KATEGORIE)}</CATEGORY>")
        out.append(f"      <DEFAULT_CATEGORY>{cdata(KATEGORIE)}</DEFAULT_CATEGORY>")
        out.append("    </CATEGORIES>")
        if obrazky:
            out.append("    <IMAGES>")
            out.extend(f"      <IMAGE>{cdata(o)}</IMAGE>" for o in obrazky)
            out.append("    </IMAGES>")
        if cena:
            out.append(f"    <PRICE_VAT>{escape(cena)}</PRICE_VAT>")
        out.append("    <CURRENCY>CZK</CURRENCY>")
        out.append("    <VAT>21</VAT>")
        out.append("    <STOCK>")
        out.append(f"      <AMOUNT>{sklad}</AMOUNT>")
        out.append("    </STOCK>")
        out.append("  </SHOPITEM>")
        pocet += 1
    out.append("</SHOP>")
    import os
    os.makedirs("public", exist_ok=True)
    with open(VYSTUP, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    print(f"Hotovo: {pocet} produktu -> {VYSTUP}")
    if pocet == 0:
        sys.exit("Ve feedu nebyl nalezen zadny produkt - feed nebyl prepsan.")


if __name__ == "__main__":
    main()
