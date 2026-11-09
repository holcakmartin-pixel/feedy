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


# ---------------------------------------------------------------------------
# Doplneni pro e-shop: typ produktu, cesky nazev, kategorie, popisky, filtry.
TECHNIKY = ["PŘÍVLAČ", "KAPRAŘINA", "MOŘE", "MUŠKAŘENÍ", "SUMCAŘINA",
            "PLAVANÁ A FEEDER", "TROUT AREA"]
URCENI = "přívlač, kaprařina, moře, muškaření, sumcařina, plavaná a feeder, trout area"
ZNACKA_KAT = "Grundéns"
NOVINKA_DO = "2027-03-01"

# (regex na anglicky nazev, typ kategorie, cesky nazev, uvodni veta, parametry)
TYPY = [
    (r"Dog Collar|Dog Leash|BRIS|Tool Belt|Knee pad|Plastic Hook|Suspenders|Patch Kit|HEXAGRIP", None, "", "", {}),
    (r"Knife", "Nože", "Nůž", "je rybářský nůž švédské značky Grundéns s ochranným pouzdrem.", {}),
    (r"Backpack|Roll Top", "Tašky", "Batoh", "je batoh švédské značky Grundéns na rybářskou výbavu i výpravy k vodě.", {"Druh tašky": "batoh"}),
    (r"Bag|Duffel|Tote", "Tašky", "Taška", "je taška švédské značky Grundéns na rybářskou výbavu i výpravy k vodě.", {"Druh tašky": "taška"}),
    (r"Wader", "Brodící kalhoty", "Brodicí kalhoty", "jsou brodicí kalhoty (prsačky) švédské značky Grundéns pro lov přímo z vody.", {}),
    (r"Wading Boot", "Brodící boty", "Brodicí boty", "jsou brodicí boty švédské značky Grundéns k prsačkám se stockingfoot ponožkou.", {}),
    (r"Sock", "Ponožky", "Ponožky", "jsou funkční ponožky švédské značky Grundéns do holínek a brodicích bot.", {}),
    (r"Sneaker", "Boty", "Tenisky", "jsou tenisky švédské značky Grundéns s protiskluzovou podrážkou pro loď i břeh.", {}),
    (r"Slip-On", "Boty", "Nazouváky", "jsou nazouváky švédské značky Grundéns s protiskluzovou podrážkou pro loď i břeh.", {}),
    (r"Slide", "Boty", "Pantofle", "jsou pantofle švédské značky Grundéns s protiskluzovou podrážkou pro loď i břeh.", {}),
    (r"Boat Shoe|\bShoe\b", "Boty", "Lodní boty", "jsou lodní boty švédské značky Grundéns s protiskluzovou podrážkou pro palubu i břeh.", {}),
    (r"Sandal", "Boty", "Sandály", "jsou sandály švédské značky Grundéns s protiskluzovou podrážkou pro loď i břeh.", {}),
    (r"Ankle Boot|Deck-Boss", "Holinky", "Kotníkové boty", "jsou kotníkové boty švédské značky Grundéns do mokra s protiskluzovou podrážkou.", {}),
    (r"Boot", "Holinky", "Holínky", "jsou palubní holínky švédské značky Grundéns s protiskluzovou podrážkou.", {}),
    (r"Grundies.*(Bottom|Pant)|Thermal Bottom", "Termoprádlo", "Termokalhoty", "jsou funkční spodní vrstva švédské značky Grundéns, která hřeje a odvádí pot.", {}),
    (r"Grundies|Thermal 1/2", "Termoprádlo", "Termotriko", "je funkční spodní vrstva švédské značky Grundéns, která hřeje a odvádí pot.", {}),
    (r"\bBib\b", "Kalhoty", "Laclové kalhoty", "jsou rybářské laclové kalhoty švédské značky Grundéns pro práci na lodi i lov v dešti.", {}),
    (r"Pant|Trouser", "Kalhoty", "Kalhoty", "jsou rybářské kalhoty švédské značky Grundéns pro lov i pobyt venku.", {}),
    (r"\bShort\b", "Kraťasy", "Kraťasy", "jsou kraťasy švédské značky Grundéns na letní lov.", {}),
    (r"Vest", "Vesty", "Vesta", "je vesta švédské značky Grundéns jako teplá vrstva pod bundu.", {}),
    (r"Jacket|Anorak|Parka|Shell|Shacket|Coat|Smock", "Bundy", "Bunda", "je rybářská bunda švédské značky Grundéns pro lov z lodi i ze břehu.", {}),
    (r"Beanie", "Čepice", "Čepice", "je zimní čepice švédské značky Grundéns pro chladné dny u vody.", {}),
    (r"Sou'wester|\bHat\b|Bucket", "Čepice", "Klobouk", "je klobouk švédské značky Grundéns do deště i slunce.", {}),
    (r"Trucker|Truck\b|\bCap\b|Visor", "Čepice", "Kšiltovka", "je kšiltovka švédské značky Grundéns, která chrání před sluncem u vody.", {}),
    (r"Glove", "Rukavice", "Rukavice", "jsou rybářské rukavice švédské značky Grundéns.", {}),
    (r"Gaiter|Neck", "Nákrčníky", "Nákrčník", "je nákrčník švédské značky Grundéns.", {}),
    (r"Hoodie|Sweatshirt|Fleece|Crew|1/4|Pullover|\bZip\b", "Mikiny", "Mikina", "je pohodlná mikina švédské značky Grundéns pro chladnější dny u vody.", {}),
    (r"Tee|T-Shirt|Shirt|\bSun\b|\bLS\b|\bSS\b|Polo", "Trička", "Tričko", "je tričko švédské značky Grundéns pro lov i běžné nošení.", {}),
]
# typ -> (cesta v PŘÍVLAČ, cesta pod ostatnimi technikami, filtr barvy, filtr velikosti)
KATEGORIE_TYPU = {
    "Boty": ("Oblečení > Boty", "Velikost boty", "Barva oblečení"),
    "Brodící boty": ("Oblečení > Brodící oblečení > Brodící boty", "Velikost boty", None),
    "Brodící kalhoty": ("Oblečení > Brodící oblečení > Brodící kalhoty", None, None),
    "Bundy": ("Oblečení > Bundy", "Velikost bundy", "Barva bundy"),
    "Čepice": ("Oblečení > Čepice", None, "Barva čepice"),
    "Holinky": ("Oblečení > Holinky", "Velikost boty", "Barva oblečení"),
    "Kalhoty": ("Oblečení > Kalhoty", "Velikost kalhot", "Barva oblečení"),
    "Kraťasy": ("Oblečení > Kraťasy", "Velikost kalhot", "Barva oblečení"),
    "Mikiny": ("Oblečení > Mikiny", "Velikost mikiny", "Barva oblečení"),
    "Nákrčníky": ("Oblečení > Nákrčníky", None, "Barva oblečení"),
    "Ponožky": ("Oblečení > Ponožky", None, None),
    "Rukavice": ("Oblečení > Rukavice", None, "Barva rukavic"),
    "Termoprádlo": ("Oblečení > Termoprádlo", "Velikost trika", "Barva oblečení"),
    "Trička": ("Oblečení > Trička", "Velikost trika", "Barva oblečení"),
    "Vesty": ("Oblečení > Vesty", "Velikost bundy", "Barva oblečení"),
    "Tašky": ("Příslušenství > Tašky a obaly", None, "Barva tašky/pouzdra"),
    "Nože": ("Příslušenství > Nože a brousky > Nože", None, None),
}
BARVY = [  # klicove slovo v anglickem nazvu barvy -> cesky
    ("camo", "maskovací"), ("plaid", "kostkovaná"), ("black", "černá"), ("smoke", "černá"),
    ("anchor", "šedá"), ("charcoal", "šedá"), ("metal", "šedá"), ("heather", "šedá"),
    ("grey", "šedá"), ("gray", "šedá"), ("stone", "šedá"), ("silver", "šedá"),
    ("red orange", "oranžová"), ("orange", "oranžová"), ("red", "červená"),
    ("navy", "modrá"), ("blue", "modrá"), ("abyss", "modrá"), ("depths", "modrá"),
    ("green", "zelená"), ("loden", "zelená"), ("forest", "zelená"), ("lichen", "zelená"),
    ("sagebrush", "zelená"), ("grass", "zelená"), ("seneca", "zelená"),
    ("otter", "hnědá"), ("brown", "hnědá"), ("cedar", "hnědá"), ("driftwood", "hnědá"),
    ("khaki", "béžová"), ("bronze", "hnědá"), ("whiskey", "hnědá"), ("clay", "hnědá"),
    ("reed", "béžová"), ("oyster", "béžová"), ("white", "bílá"), ("yellow", "žlutá"),
]
VLASTNOSTI = [
    (r"gore-tex", "Gore-Tex"),
    (r"nepromok|vodotěsn|voděodoln|waterproof", "nepromokavé"),
    (r"zateplen|izolac|insulat|hřej", "zateplené"),
    (r"\bUV\b|UPF", "UV ochrana"),
    (r"protiskluz|přilnavost|neklouz", "protiskluzová podrážka"),
]
VELIKOST_PARAM = {"2XL": "XXL", "3XL": "XXXL", "4XL": "XXXXL"}


def urci_typ(nazev):
    for vzor, typ, cz, uvod, par in TYPY:
        if re.search(vzor, nazev, re.I):
            return typ, cz, uvod, par
    return None, "", "", {}


def barva(nazev):
    n = nazev.lower()
    slova = n.split()
    for k in range(len(slova)):  # od konce nazvu
        konec = " ".join(slova[k:])
        for kl, cz in BARVY:
            if kl in konec:
                return cz
    return ""


def vycisti_popis(text, nazev):
    t = text.replace("\r", "")
    # nadpis slepeny s prvni vetou ("... Ankle BootKolekce ...")
    m = re.match(r"^(.{0,140}?Grund[eé]ns(?:.{0,100}?[A-Za-z0-9\u2122\u00ae\"])?)(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž])", t)
    nadpis = ""
    if m:
        t = t[m.end():]
    else:
        # nadpis bez nazvu znacky slepeny s textem ("... severské tradiciAegir ...")
        m = re.match(r"^(.{8,120}?(?:^|\s)[a-záčďéěíňóřšťúůýž]+)(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž])", t)
        if m:
            nadpis, t = m.group(1).strip(), t[m.end():]
    # slepene casti bez mezery ("velikostČepice", "Tech TeeObjevte")
    def rozdel(m):
        levy = m.group(1)
        if re.fullmatch(r"[a-záčďéěíňóřšťúůýž]{3,}", levy) or re.search(r"(Tee|Hoodie|Jacket|Bib|Boot|Shirt|Cap|Hat|Beanie|Vest|Pant|Short|Sock|Bag|Backpack|Wader|Sneaker|Sandal|Slide|Trucker|Zip|Crew|Top|Bottom)$", levy):
            return levy + "\n" + m.group(2)
        return m.group(0)
    t = re.sub(r"(?<![\w-])([A-Za-záčďéěíňóřšťúůýž]+)(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]{2})([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])", rozdel, t)
    # slepene vety ("terénu.12 Inch")
    t = re.sub(r"(?<=[a-záčďéěíňóřšťúůýž\)])([.!?:])(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ0-9])", r"\1 ", t)
    casti = [c.strip() for c in re.split(r"\t+|\n+", t) if c.strip()]
    html, seznam = [], []
    for i, c in enumerate(casti):
        polozka = i > 0 and len(c) < 200 and (seznam or casti[i - 1].endswith(":"))
        if polozka:
            seznam.append("<li>" + escape(c) + "</li>")
            continue
        if seznam:
            html.append("<ul>" + "".join(seznam) + "</ul>")
            seznam = []
        html.append("<p>" + escape(c) + "</p>")
    if seznam:
        html.append("<ul>" + "".join(seznam) + "</ul>")
    if nadpis:
        html.insert(0, "<p><strong>" + escape(nadpis) + "</strong></p>")
    return "".join(html)


def obohat(skupina, zaklad, velikosti):
    """Vrati slovnik s nazvem, popisky, kategoriemi, parametry a viditelnosti."""
    p = skupina[0]
    typ, cz, uvod, par = urci_typ(zaklad)
    sklad = sum(x["sklad"] for x in skupina)
    if not typ:
        return {"nazev": zaklad, "kategorie": [KATEGORIE], "vychozi": KATEGORIE,
                "viditelnost": "hidden", "kratky": "", "popis": "", "param": {},
                "seo": "", "meta": "", "novinka": False}
    nazev = f"{cz} Grundéns {zaklad}"
    cesta, vel_par, bar_par = KATEGORIE_TYPU[typ]
    def s_predky(koren, cesta_k):
        casti = [koren] + cesta_k.split(" > ")
        return [" > ".join(casti[:i]) for i in range(1, len(casti) + 1)]

    znacka_kat = "PŘÍVLAČ > " + cesta + (" > " + ZNACKA_KAT if typ != "Nože" else "")
    model_nazev = MODELY.get((typ, model_klic(zaklad)))
    hlavni = znacka_kat + (" > " + model_nazev if model_nazev and typ != "Nože" else "")
    kat = [hlavni, znacka_kat] + s_predky("PŘÍVLAČ", cesta)
    if typ not in ("Tašky", "Nože"):
        for t in TECHNIKY[1:]:
            kat += s_predky(t, cesta)
    znacka_sub = {"Tašky": "Tašky a batohy", "Brodící boty": "Brodící oblečení",
                  "Brodící kalhoty": "Brodící oblečení", "Nože": None}.get(typ, typ)
    kat += ["ZNAČKY", "ZNAČKY > GRUNDÉNS"] + (["ZNAČKY > GRUNDÉNS > " + znacka_sub] if znacka_sub else [])
    kat = list(dict.fromkeys(kat))
    cz_barva = barva(zaklad)
    popis_txt = p["popis"]
    vlast = [v for vz, v in VLASTNOSTI if re.search(vz, popis_txt + " " + zaklad, re.I)]
    if typ not in ("Boty", "Holinky", "Brodící boty") and "protiskluzová podrážka" in vlast:
        vlast.remove("protiskluzová podrážka")
    param = dict(par)
    if typ not in ("Tašky", "Nože"):
        param["Druh oblečení"] = [cz.lower()]
        if cz_barva:
            param["Barva oblečení"] = [cz_barva]
    if bar_par and cz_barva:
        param[bar_par] = [cz_barva]
    if vel_par and velikosti:
        vals = []
        for v in velikosti:
            v2 = re.sub(r"^EU\s*", "", v.split(" (")[0])
            v2 = VELIKOST_PARAM.get(v2, v2)
            if v2 not in vals:
                vals.append(v2)
        param[vel_par] = vals
    if vlast and typ not in ("Tašky", "Nože"):
        param["Vlastnosti oblečení"] = vlast
    radky = [("značka", "Grundéns"), ("model", zaklad)]
    if cz_barva:
        radky.append(("barva", cz_barva))
    if velikosti:
        radky.append(("velikosti", ", ".join(velikosti)))
    if vlast:
        radky.append(("vlastnosti", ", ".join(vlast)))
    radky.append(("určení", URCENI if typ not in ("Tašky", "Nože") else "všechny druhy rybolovu"))
    tab = "".join(f"<tr><td><strong>{escape(a)}:</strong></td><td>{escape(b)}</td></tr>" for a, b in radky)
    uvodni = f"{zaklad} {uvod}"
    kratky = f"<p>{escape(uvodni)}</p><table border=\"2\" cellspacing=\"2\" cellpadding=\"2\"><tbody>{tab}</tbody></table>"
    dlouhy = vycisti_popis(popis_txt, zaklad)
    doplnek = ("<p>Grundéns vyrábí oblečení pro rybáře od roku 1926 a vychází z potřeb profesionálních "
               "rybářů ze severského pobřeží. Proto klade důraz na odolné materiály, praktické detaily "
               "a pohodlí i při celodenním nošení v náročném počasí.</p>")
    delka = lambda h: len(re.sub(r"<[^>]+>", "", h))
    if delka(dlouhy) < max(300, 2 * len(uvodni) + 120):
        dlouhy += doplnek
    if delka(dlouhy) < max(300, 2 * len(uvodni) + 120) and velikosti:
        dlouhy += ("<p>Velikost vyberte podle tabulky výrobce. Pokud si nejste jistí, poradíme vám "
                   "na prodejně v Písku nebo e-mailem.</p>")
    meta = f"{nazev}. Originál Grundéns, nákup online i na prodejně v Písku."
    return {"nazev": nazev, "kategorie": kat, "vychozi": kat[0],
            "viditelnost": "visible" if sklad > 0 and p["obrazky"] else "hidden",
            "kratky": kratky, "popis": dlouhy, "param": param,
            "seo": f"{nazev} | Moje přívlač", "meta": meta[:160], "novinka": True}


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
            cena = str(int(round(float(cena)))) if cena else ""
        except ValueError:
            cena = ""
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


SOUVISEJICI_TYP = {
    "Bundy": "Kalhoty", "Kalhoty": "Bundy", "Mikiny": "Bundy", "Trička": "Mikiny",
    "Čepice": "Mikiny", "Holinky": "Kalhoty", "Boty": "Trička", "Vesty": "Bundy",
    "Brodící kalhoty": "Brodící boty", "Brodící boty": "Brodící kalhoty",
    "Kraťasy": "Trička", "Ponožky": "Holinky", "Termoprádlo": "Mikiny",
    "Tašky": "Čepice", "Nože": "Tašky",
}
VAZBY = {}  # kod produktu -> (podobne, souvisejici)
MODELY = {}  # (typ, model) -> nazev modelove kategorie (jen modely ve 2+ barvach)


def model_nazev(zaklad):
    m = re.match(r"^(.*\b(Hoodie|Sweatshirt|Crew|Tee|T-Shirt|Shirt|Jacket|Anorak|Parka|Shacket|Coat|Bib|Pants?|Boot|Sneaker|Slip-On|Slide|Sandal|Shoe|Beanie|Trucker|Cap|Hat|Vest|Short|Wader|Sock|Bag|Backpack|Duffel|Tote|Zip|Bottom|Top|Smock|Glove|Gaiter|Polo))\b", zaklad, re.I)
    return (m.group(1) if m else zaklad).strip()


def model_klic(zaklad):
    m = re.match(r"^(.*\b(Hoodie|Sweatshirt|Crew|Tee|T-Shirt|Shirt|Jacket|Anorak|Parka|Shacket|Coat|Bib|Pants?|Boot|Sneaker|Slip-On|Slide|Sandal|Shoe|Beanie|Trucker|Cap|Hat|Vest|Short|Wader|Sock|Bag|Backpack|Duffel|Tote|Zip|Bottom|Top|Smock|Glove|Gaiter|Polo))\b", zaklad, re.I)
    return (m.group(1) if m else zaklad).strip().lower()


def priprav_vazby(seznam):
    """seznam: [(kod, typ, model, sklad)] -> naplni VAZBY (max 4 + 4 produkty skladem)."""
    import zlib
    podle_typu = {}
    for kod, typ, model, sklad in seznam:
        if typ and sklad > 0:
            podle_typu.setdefault(typ, []).append((sklad, kod, model))
    for v in podle_typu.values():
        v.sort(key=lambda x: (-x[0], x[1]))
    for kod, typ, model, sklad in seznam:
        if not typ:
            continue
        posun = zlib.crc32(kod.encode()) % 7
        def vyber(kandidati, pocet=4):
            k = [c for c in kandidati if c[1] != kod and c[2] != model][:12]
            if not k:
                return []
            k = k[posun % len(k):] + k[:posun % len(k)]
            return [c[1] for c in k[:pocet]]
        VAZBY[kod] = (vyber(podle_typu.get(typ, [])),
                      vyber(podle_typu.get(SOUVISEJICI_TYP.get(typ), [])))


def hlavicka(out, skupina, zaklad, velikosti):
    p = skupina[0]
    e = obohat(skupina, zaklad, velikosti)
    out.append(f"    <NAME>{cdata(e['nazev'])}</NAME>")
    if e["kratky"]:
        out.append(f"    <SHORT_DESCRIPTION>{cdata(e['kratky'])}</SHORT_DESCRIPTION>")
    popis = e["popis"] or p["popis"]
    if popis:
        out.append(f"    <DESCRIPTION>{cdata(popis)}</DESCRIPTION>")
    out.append(f"    <MANUFACTURER>{escape(p['vyrobce'])}</MANUFACTURER>")
    out.append("    <SUPPLIER>Moris Distribution</SUPPLIER>")
    out.append("    <CATEGORIES>")
    for k in e["kategorie"]:
        out.append(f"      <CATEGORY>{cdata(k)}</CATEGORY>")
    out.append(f"      <DEFAULT_CATEGORY>{cdata(e['vychozi'])}</DEFAULT_CATEGORY>")
    out.append("    </CATEGORIES>")
    if p["obrazky"]:
        out.append("    <IMAGES>")
        out.extend(f"      <IMAGE>{cdata(o)}</IMAGE>" for o in p["obrazky"])
        out.append("    </IMAGES>")
    if e["param"]:
        out.append("    <INFORMATION_PARAMETERS>")
        for n, vals in e["param"].items():
            vals = vals if isinstance(vals, list) else [vals]
            out.append("      <INFORMATION_PARAMETER>")
            out.append(f"        <NAME>{cdata(n)}</NAME>")
            out.extend(f"        <VALUE>{cdata(v)}</VALUE>" for v in vals)
            out.append("      </INFORMATION_PARAMETER>")
        out.append("    </INFORMATION_PARAMETERS>")
    if e["novinka"]:
        out.append(f"    <FLAGS><FLAG><CODE>new</CODE><VALID_UNTIL>{NOVINKA_DO}</VALID_UNTIL></FLAG></FLAGS>")
    podobne, souvisejici = VAZBY.get(p["kod"], ([], []))
    if souvisejici:
        out.append("    <RELATED_PRODUCTS>" + "".join(f"<CODE>{escape(k)}</CODE>" for k in souvisejici) + "</RELATED_PRODUCTS>")
    if podobne:
        out.append("    <ALTERNATIVE_PRODUCTS>" + "".join(f"<CODE>{escape(k)}</CODE>" for k in podobne) + "</ALTERNATIVE_PRODUCTS>")
    out.append(f"    <VISIBILITY>{e['viditelnost']}</VISIBILITY>")
    if e["seo"]:
        out.append(f"    <SEO_TITLE>{cdata(e['seo'])}</SEO_TITLE>")
        out.append(f"    <META_DESCRIPTION>{cdata(e['meta'])}</META_DESCRIPTION>")


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

    prehled = []
    for (typ_s, klic), polozky in skupiny.items():
        zaklad = polozky[0]["nazev"] if typ_s == "P" else klic
        polozky_sorted = sorted(polozky, key=lambda x: klic_velikosti(x.get("velikost", ""))) if typ_s == "V" else polozky
        prehled.append((polozky_sorted[0]["kod"], urci_typ(zaklad)[0], model_klic(zaklad),
                        sum(x["sklad"] for x in polozky)))
    priprav_vazby(prehled)
    pocty, nazvy = {}, {}
    for (typ_s, klic), polozky in skupiny.items():
        zaklad = polozky[0]["nazev"] if typ_s == "P" else klic
        typ = urci_typ(zaklad)[0]
        if typ:
            k = (typ, model_klic(zaklad))
            pocty[k] = pocty.get(k, 0) + 1
            nazvy.setdefault(k, model_nazev(zaklad))
    MODELY.update({k: nazvy[k] for k, n in pocty.items() if n >= 2})

    out = ['<?xml version="1.0" encoding="utf-8"?>', "<SHOP>"]
    produkty = varianty = 0
    for (typ, klic), polozky in skupiny.items():
        out.append("  <SHOPITEM>")
        if typ == "P":
            p = polozky[0]
            hlavicka(out, polozky, p["nazev"], [])
            if p["mpn"]:
                out.append(f"    <MANUFACTURER_CODE>{escape(p['mpn'])}</MANUFACTURER_CODE>")
            detail(out, p, 4)
        else:
            polozky.sort(key=lambda x: klic_velikosti(x["velikost"]))
            hlavicka(out, polozky, klic, [x["velikost"] for x in polozky])
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
