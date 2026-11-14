# Prevod feedu Zfish do formatu Shoptet.
# Autor: Martin Holcak
#
# Kazda varianta dodavatele (velikost, gramaz...) je samostatny produkt.
# Vse jde do skryte kategorie "Zfish feed", produkty jsou skryte.
import html
import json
import os
import re
import sys
import urllib.request
from xml.sax.saxutils import escape, quoteattr

ZDROJ = "https://www.zfish.eu/xml/products.xml"
KATEGORIE = "Zfish feed"
DODAVATEL = "Zfish"
VYSTUP = "public/zfish.xml"
ZDROJ_JSON = "public/zfish-zdroj.json"
ZNACKY = {"FILFISHING": "Filfishing"}


def pole(blok, tag):
    m = re.search(r"<" + tag + r">(.*?)</" + tag + r">", blok, re.S)
    if not m:
        return ""
    v = m.group(1).strip()
    c = re.fullmatch(r"<!\[CDATA\[(.*)\]\]>", v, re.S)
    if c:
        return c.group(1).strip()
    return html.unescape(v).strip()


def bloky(text, tag):
    return re.findall(r"<" + tag + r">(.*?)</" + tag + r">", text, re.S)


def cdata(value):
    return "<![CDATA[" + value.replace("]]>", "]]]]><![CDATA[>") + "]]>"


def cena(v):
    v = re.sub(r"[^0-9.,]", "", v).replace(",", ".")
    try:
        c = float(v)
    except ValueError:
        return ""
    return str(int(c)) if c == int(c) else f"{c:.2f}"


def sklad(v):
    cisla = re.findall(r"\d+", v or "")
    return int(cisla[0]) if cisla else 0


def cisty_popis(t):
    t = re.sub(r"<iframe.*?</iframe>", "", t, flags=re.S | re.I)
    t = re.sub(r"<(script|style)\b.*?</\1>", "", t, flags=re.S | re.I)
    t = re.sub(r"\s(style|class|id)=\"[^\"]*\"", "", t)
    t = re.sub(r"<p>\s*(&nbsp;)?\s*</p>", "", t)
    return t.strip()


def obrazky(blok):
    url = [pole(blok, "PRODUCT_IMAGE")]
    for g in bloky(blok, "PRODUCT_GALLERY"):
        url += [html.unescape(re.sub(r"<!\[CDATA\[|\]\]>", "", u)).strip() for u in bloky(g, "PHOTO")]
    return [u for u in dict.fromkeys(url) if u.startswith("http")]


def main():
    req = urllib.request.Request(ZDROJ, headers={"User-Agent": "Mozilla/5.0 feed-prevod/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r:
        data = r.read().decode("utf-8", "replace")

    out = ['<?xml version="1.0" encoding="utf-8"?>', "<SHOP>"]
    kody = set()
    pocet = 0
    zdroj = []
    for item in bloky(data, "ITEM"):
        nazev = re.sub(r"\s+", " ", pole(item, "PRODUCT_NAME")).strip()
        kod = pole(item, "PRODUCT_CODE")
        if not nazev or not kod:
            continue
        vyrobce = pole(item, "PRODUCT_PRODUCER")
        vyrobce = ZNACKY.get(vyrobce, vyrobce)
        popis = cisty_popis(pole(item, "PRODUCT_DESCRIPTION"))
        fotky = obrazky(item)
        zaklad = {
            "nazev": nazev, "kod": kod, "ean": pole(item, "PRODUCT_EAN"),
            "cena": cena(pole(item, "PRODUCT_PRICE_INCVAT")),
            "dph": pole(item, "PRODUCT_VATRATE") or "21",
            "sklad": sklad(pole(item, "PRODUCT_STOCK_VALUE")),
        }
        cesty = [pole(c, "CATEGORY_PATH") for c in bloky(item, "PRODUCT_MAIN_CATEGORY")]
        for oc in bloky(item, "PRODUCT_OTHER_CATEGORIES"):
            cesty += [pole(c, "CATEGORY_PATH") for c in bloky(oc, "CATEGORY")]
        dalsi = [[pole(p, "PARAM_NAME"), pole(p, "PARAM_VALUE")]
                 for op in bloky(item, "PRODUCT_OTHER_PARAMS") for p in bloky(op, "PARAM")]
        varianty = []
        for pp in bloky(item, "PRODUCT_PARAMS"):
            for p in bloky(pp, "PARAM"):
                vkod = pole(p, "PARAM_CODE")
                hodnota = pole(p, "PARAM_VALUE")
                if not vkod:
                    continue
                vnazev = nazev if hodnota and hodnota.lower() in nazev.lower() else f"{nazev} {hodnota}".strip()
                varianty.append(dict(zaklad, nazev=vnazev, kod=vkod,
                                     vparam=pole(p, "PARAM_NAME"), vhodnota=hodnota,
                                     ean=pole(p, "PARAM_EAN"),
                                     cena=cena(pole(p, "PARAM_PRICE_INCVAT")) or zaklad["cena"],
                                     sklad=sklad(pole(p, "PARAM_STOCK_VALUE"))))
        for v in varianty or [zaklad]:
            if v["kod"] in kody:
                continue
            kody.add(v["kod"])
            zdroj.append({"kod": v["kod"], "rodic": kod, "nazev": v["nazev"], "zaklad": nazev,
                          "vparam": v.get("vparam", ""), "vhodnota": v.get("vhodnota", ""),
                          "vyrobce": vyrobce, "kategorie": cesty, "parametry": dalsi,
                          "cena": v["cena"], "sklad": v["sklad"], "ean": v["ean"],
                          "fotky": len(fotky), "popis": popis})
            out.append("  <SHOPITEM>")
            out.append(f"    <NAME>{cdata(v['nazev'])}</NAME>")
            if popis:
                out.append(f"    <DESCRIPTION>{cdata(popis)}</DESCRIPTION>")
            if vyrobce:
                out.append(f"    <MANUFACTURER>{escape(vyrobce)}</MANUFACTURER>")
            out.append(f"    <SUPPLIER>{DODAVATEL}</SUPPLIER>")
            out.append("    <CATEGORIES>")
            out.append(f"      <CATEGORY>{cdata(KATEGORIE)}</CATEGORY>")
            out.append(f"      <DEFAULT_CATEGORY>{cdata(KATEGORIE)}</DEFAULT_CATEGORY>")
            out.append("    </CATEGORIES>")
            if fotky:
                out.append("    <IMAGES>")
                for i, o in enumerate(fotky):
                    popisek = v["nazev"] if i == 0 else f"{v['nazev']} – foto {i + 1}"
                    out.append(f"      <IMAGE description={quoteattr(popisek)}>{cdata(o)}</IMAGE>")
                out.append("    </IMAGES>")
            out.append("    <VISIBILITY>hidden</VISIBILITY>")
            out.append(f"    <CODE>{escape(v['kod'])}</CODE>")
            if v["ean"]:
                out.append(f"    <EAN>{escape(v['ean'])}</EAN>")
            if v["cena"]:
                out.append(f"    <PRICE_VAT>{v['cena']}</PRICE_VAT>")
            out.append("    <CURRENCY>CZK</CURRENCY>")
            out.append(f"    <VAT>{escape(v['dph'])}</VAT>")
            out.append("    <STOCK>")
            out.append(f"      <AMOUNT>{v['sklad']}</AMOUNT>")
            out.append("    </STOCK>")
            out.append("  </SHOPITEM>")
            pocet += 1
    out.append("</SHOP>")

    if pocet == 0:
        sys.exit("Ve feedu Zfish nebyl nalezen zadny produkt - feed nebyl prepsan.")
    os.makedirs("public", exist_ok=True)
    with open(VYSTUP, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    with open(ZDROJ_JSON, "w", encoding="utf-8") as f:
        json.dump(zdroj, f, ensure_ascii=False)
    print(f"Hotovo: {pocet} produktu -> {VYSTUP}")


if __name__ == "__main__":
    main()
