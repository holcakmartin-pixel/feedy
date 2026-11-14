// Generator importu Zfish -> mojeprivlac.cz (Shoptet XML). Autor: Martin
function GEN(D) {
const P = 'PŘÍVLAČ', K = 'KAPRAŘINA', F = 'PLAVANÁ A FEEDER', S = 'SUMCAŘINA';
const TECH = { [P]: 'Přívlač', [K]: 'Kaprařina', [F]: 'Plavaná a feeder', [S]: 'Sumcařina' };
const RYBY = { [P]: ['Štika', 'Candát', 'Okoun'], [K]: ['Kapr', 'Amur'], [F]: ['Kapr', 'Cejn'], [S]: ['Sumec'] };
const KP = K + ' > Koncové montáže', BK = K + ' > Bivaky a kempink', ZV = K + ' > Zavážení a vnadění', HS = K + ' > Hlásiče a stojany';
const NOVINKA = '2027-03-01';
const ZNACKY = { ZFISH: 'Zfish', FILFISHING: 'Filfishing', HAYABUSA: 'Hayabusa', 'EXTRA CARP': 'Extra Carp', NGT: 'NGT', ASSO: 'Asso', FALCON: 'Falcon', 'ANGLING PURSUITS': 'Angling Pursuits', VENTURIERI: 'Venturieri', RELAX: 'Relax' };
const PREFIX = /^(ZFISH|Zfish|FILFISHING|Filfishing|FilFishing|Hayabusa|EXC|EXTRA CARP|Extra Carp|NGT|AP|FALCON|Falcon|Venturieri|Relax)\s+/;

// Pravidla: m = regex na hlavní kategorii dodavatele, n = regex na název (volitelně)
// c = cesty typových kategorií, z = podkategorie ve ZNAČKY, s = podstatné jméno do názvu,
// st = slova k odstranění ze začátku modelu, u = úvodní věta (po názvu modelu), t = odstavec do dlouhého popisu, p = parametry
const R = [
 { m: /TRADE PACKY|VYBAVENÍ PRODEJEN|PREZENTAČNÍ STOJANY/, skryt: true },
 { n: /Trade Pack/i, skryt: true },
 // --- krmítka a feeder
 { m: /Krmítka Method Feeder/, n: /Formičk|Mould|Mold/i, c: [F + ' > Krmítka a zátěže'], z: 'Krmítka', s: 'Formička na method feeder', st: /^(Filex )?(Formička|Krmítko)\s+(Method Feeder\s+)?/i, u: 'je formička pro rychlé a pevné obalení krmítka method feeder krmnou směsí.', t: 'Formička zajistí, že krmná směs drží na krmítku stejně při každém nahození. Krmení se tak rozpadá na stejném místě a ryby se na lovné místo rychleji stahují.', p: { 'Druh lovu': ['Plavaná a feeder', 'Kaprařina'] } },
 { m: /Krmítka Method Feeder/, n: /Set|Sada/i, c: [F + ' > Krmítka a zátěže'], z: 'Krmítka', s: 'Sada krmítek method feeder', st: /^(Sada |Method Feeder )*(Method Feeder )?(Set )?/i, u: 'je sada krmítek method feeder s formičkou pro rychlé plnění krmnou směsí.', t: 'Sada obsahuje krmítka ve dvou hmotnostech a formičku, takže můžete hned začít lovit a krmítko měnit podle vzdálenosti a proudu. Method feeder je dnes nejúčinnější způsob, jak podávat nástrahu přímo do hromádky krmení.', p: { 'Druh krmítka': ['Method feeder'] } },
 { m: /Krmítka Method Feeder/, n: /Trubičk/i, c: [F + ' > Feederové doplňky'], z: 'Krmítka', s: 'Trubička do krmítka', st: /^Trubička do Krmítka\s*/i, u: 'je náhradní trubička do krmítka method feeder.', t: 'Trubička chrání vlasec před poškozením o tělo krmítka a umožňuje jeho volný průjezd, takže ryba necítí zbytečný odpor.' },
 { m: /Krmítka Method Feeder/, c: [F + ' > Krmítka a zátěže'], z: 'Krmítka', s: 'Krmítko method feeder', st: /^(Filex\s+)?Krmítko\s+(Method Feeder\s+)?/i, u: 'je krmítko typu method feeder pro lov kaprovitých ryb na feeder.', t: 'Krmítko method feeder nese krmnou směs, ve které je zabalená nástraha. Po dopadu na dno se směs pomalu rozpadá a vytvoří atraktivní hromádku přímo kolem háčku. Zátěž ve spodní části zajišťuje stabilní dopad žebry vzhůru.', p: { 'Druh krmítka': ['Method feeder'] } },
 { m: /Krmítka Feederová/, c: [F + ' > Krmítka a zátěže'], z: 'Krmítka', s: 'Krmítko feederové', st: /^(Zakrmovací\s+)?Krmítko\s+/i, u: 'je feederové krmítko pro přesné zakrmení lovného místa.', t: 'Feederový košík se plní krmnou směsí nebo partiklem a při každém nahození dopraví krmení přesně k nástraze. Je vhodný pro lov na stojatých i tekoucích vodách.', p: { 'Druh krmítka': ['Feederový košík'] } },
 { m: /Krmítka (Koncová|Průběžná|s Obratlíkem)/, c: [F + ' > Krmítka a zátěže', K + ' > Koncové montáže > Olova'], z: 'Krmítka', s: 'Krmítko', st: /^Krmítko\s+/i, u: 'je krmítko se zátěží pro lov na položenou.', t: 'Kombinace zátěže a krmítka umožňuje lovit i na větší vzdálenost a zároveň mít krmení přesně u nástrahy. Hodí se pro feederový i klasický kaprový lov.', p: { 'Druh krmítka': ['Zátěž'] } },
 { m: /Feeder gumy/, c: [F + ' > Feederové doplňky'], z: 'Feederové doplňky', s: 'Feederová guma', st: /^Feeder Guma\s*/i, u: 'je feederová guma, která tlumí výpady ryby a chrání tenký návazec.', t: 'Guma pruží při záběru i zdolávání a výrazně snižuje riziko utržení ryby na jemné montáži.' },
 { m: /Feeder a Krmítka > Hotové návazce/, c: [F + ' > Háčky a návazce'], z: 'Hotové návazce', s: 'Feederová montáž', st: /^Feeder Montáž\s*/i, u: 'je hotová feederová montáž připravená k okamžitému použití.', t: 'Hotová montáž šetří čas u vody a zajistí správnou funkci krmítka bez zamotávání.' },
 { m: /Konektory/, c: [F + ' > Feederové doplňky'], z: 'Feederové doplňky', s: 'Konektor', st: /^(Konektory?|Method Connector)\s*/i, u: 'je konektor pro rychlé připojení krmítka nebo návazce.', t: 'Rychlospojka umožňuje během pár vteřin vyměnit krmítko či návazec bez převazování hlavního vlasce.' },
 { m: /Průjezdy/, c: [F + ' > Feederové doplňky'], z: 'Feederové doplňky', s: 'Průjezd', st: /^(Průjezd|Protahovací Struna)\s*/i, u: 'je feederový průjezd, který zabraňuje zamotání návazce při nahození.', t: 'Průjezd odsadí krmítko od hlavního vlasce a návazec díky tomu při nahození nelétá kolem krmítka. Montáž je citlivější a záběry se lépe přenáší na špičku.' },
 // --- bižuterie
 { m: /Gumové korálky/, c: [KP + ' > Převleky a hadičky'], z: 'Koncové montáže', s: 'Gumové korálky', st: /^Gumové Korálky\s*/i, u: 'jsou gumové korálky na ochranu uzlu a obratlíku v montáži.', t: 'Korálek tlumí náraz zátěže nebo krmítka na uzel a chrání ho před poškozením.' },
 { m: /^BIŽUTERIE A BOXY > Hotové návazce/, n: /Method|Feeder/i, c: [F + ' > Háčky a návazce'], z: 'Hotové návazce', s: 'Návazec method feeder', st: /^Návazec\s+(Method Feeder\s+)?/i, u: 'je hotový návazec pro lov na method feeder.', t: 'Návazec je navázaný na kvalitní háček s vlasem nebo trnem pro nástrahu, takže stačí nasadit pelet či wafter a nahodit.' },
 { m: /^BIŽUTERIE A BOXY > Hotové návazce/, c: [KP + ' > Hotové návazce'], z: 'Hotové návazce', s: 'Kaprový návazec', st: /^(Zatavený |Krimpovaný )?(Návazec|Montáž)\s*/i, u: 'je hotový kaprový návazec připravený k okamžitému použití.', t: 'Hotový návazec ušetří čas při chystání montáže a zajistí správnou funkci i v náročných podmínkách. Stačí nasadit nástrahu a nahodit.' },
 { m: /Háčky Feeder a plavaná/, c: [F + ' > Háčky a návazce'], z: 'Háčky', s: 'Háčky', st: /^Háčky\s*/i, u: 'jsou háčky pro lov na feeder a plavanou.', t: 'Ostré háčky z kvalitní oceli spolehlivě zasekávají i opatrné ryby a vydrží i zdolávání větších kusů.', p: { 'Druh háčku': ['Jednoháček s protihrotem'] }, hacek: 'velikost-jednohacku' },
 { m: /Kaprové Háčky/, c: [KP + ' > Háčky'], z: 'Háčky', s: 'Kaprové háčky', st: /^(Teflonové\s+)?Háčky\s+(Model\s+|Carp Hooks\s+)?/i, u: 'jsou kaprové háčky pro stavbu vlastních návazců.', t: 'Kaprový háček musí být extrémně ostrý a pevný. Tyto háčky drží hrot i po opakovaném použití a jejich tvar zajišťuje spolehlivé zaseknutí kapra.', p: { 'Druh háčku': ['Kaprový háček'] }, hacek: 'velikost-jednohacku' },
 { m: /Sumcové Háčky/, c: [S + ' > Háčky'], z: 'Háčky', s: 'Sumcové háčky', st: /^Háčky\s*/i, u: 'jsou silné háčky na lov sumců.', t: 'Sumcový háček má silný drát, který se neohne ani při zdolávání velkých ryb.', p: { 'Druh háčku': ['Sumcový'] }, hacek: 'velikost-jednohacku' },
 { m: /Trojháčky/, c: [P + ' > Háčky, lanka a drobnosti > Háčky > Trojháčky'], z: 'Háčky', s: 'Trojháčky', st: /^Trojháčky\s*/i, u: 'jsou trojháčky pro výměnu na woblerech a dalších nástrahách.', t: 'Kvalitní trojháček výrazně zvyšuje procento proměněných záběrů a je dobré ho na nástrahách pravidelně měnit.', p: { 'Druh háčku': ['Trojháček s protihrotem'] }, hacek: 'velikost-trojhacku-2' },
 { m: /Jehly & Vrtáky/, c: [KP + ' > Nástroje a jehly'], z: 'Nástroje a jehly', s: 'Nástražní pomůcka', st: /^(Jehla|Vrtáček|Prošívací Jehla|Set jehel|Sada Nástražních Pomůcek)\s*/i, u: 'je pomůcka pro nasazování nástrah a stavbu montáží.', t: 'Jehly a vrtáčky usnadní nasazení boilies, pelet či tvrdých nástrah na vlas a stavbu PVA montáží.' },
 { m: /Karabinky a Obratlíky/, c: [KP + ' > Obratlíky a klipy'], z: 'Obratlíky a karabinky', s: 'Obratlík', st: /^(Obratlík|Mikroobratlík|Karabinka)\s*/i, u: 'je pevný obratlík pro stavbu montáží.', t: 'Obratlík zabraňuje zakrucování vlasce a spolehlivě spojuje hlavní vlasec s návazcem či zátěží.' },
 { m: /Kleště, Peany/, c: [P + ' > Příslušenství > Kleště a peány', KP + ' > Nástroje a jehly'], z: 'Kleště a nůžky', s: 'Rybářské nářadí', st: /^/, u: 'je praktický pomocník do rybářské výbavy.', t: 'Kvalitní kleště, nůžky a peány patří do výbavy každého rybáře – usnadní vyproštění háčku, stříhání šňůr i stavbu montáží.' },
 { m: /^BIŽUTERIE A BOXY > Koncové montáže/, c: [KP + ' > Obratlíky a klipy'], z: 'Koncové montáže', s: 'Montážní doplněk', st: /^/, u: 'je doplněk pro stavbu kaprových montáží.', t: 'Kvalitní komponenty montáže zajistí, že se ryba při utržení snadno zbaví zátěže a montáž funguje bez zamotání.' },
 { m: /^BIŽUTERIE A BOXY > Lanka/, c: [P + ' > Háčky, lanka a drobnosti > Lanka, trubičky, kroužky, chrastítka > Hotové návazce'], z: 'Lanka', s: 'Lanko', st: /^Lanko\s*/i, u: 'je hotové lanko pro lov dravých ryb.', t: 'Lanko chrání montáž před ostrými zuby štiky a dalších dravců. Je opatřené obratlíkem a karabinkou pro rychlou výměnu nástrahy.', p: { 'Cílová ryba': ['Štika', 'Candát'] } },
 { m: /LightSticky/, c: [F + ' > Příslušenství > Chemická světla'], z: 'Chemická světla', s: 'Chemické světlo', st: /^Chemické (S|s)větlo\s*/, u: 'je chemické světlo pro noční lov.', t: 'Světlo se aktivuje ohnutím a několik hodin svítí, takže i v noci uvidíte každý záběr na špičce prutu nebo splávku.', p: { 'Druh lovu': ['Plavaná a feeder', 'Kaprařina', 'Sumcařina'] } },
 { m: /Back leady/, c: [KP + ' > Olova'], z: 'Olova', s: 'Back lead', st: /^Back Lead\s*/i, u: 'je zátěž back lead pro přitížení vlasce ke dnu.', t: 'Back lead stáhne vlasec ke dnu, takže ryby do něj nenarážejí a montáž je méně nápadná. Zároveň zlepší přenos záběru na hlásič.', zatez: true },
 { m: /Broky, Torpily/, c: [F + ' > Krmítka a zátěže'], z: 'Zátěže', s: 'Zátěž', st: /^(Broky|Torpila|Sada Torpil)\s*/i, u: 'je zátěž pro vyvážení montáže na plavanou.', t: 'Broky a torpily slouží k přesnému vyvážení splávku a umístění nástrahy v požadované hloubce.', zatez: true },
 { m: /Olova (průběžná|s obratlíkem)/, n: /Catfish/i, c: [S + ' > Zátěže'], z: 'Olova', s: 'Sumcové olovo', st: /^olovo sumcové\s*/i, u: 'je sumcové olovo pro lov velkých ryb.', t: 'Těžká zátěž udrží nástrahu na místě i v silném proudu.', zatez: true },
 { m: /Olova (průběžná|s obratlíkem)/, n: /Kulička/i, c: [F + ' > Krmítka a zátěže'], z: 'Olova', s: 'Olověné kuličky', st: /^Olovo Kulička\s*/i, u: 'jsou průběžné olověné kuličky pro jednoduché montáže.', t: 'Průběžná kulička je univerzální zátěž pro položenou i plavanou.', zatez: true },
 { m: /Olova (průběžná|s obratlíkem)/, c: [KP + ' > Olova'], z: 'Olova', s: 'Kaprové olovo', st: /^(Olovo|Zátěž)\s*/i, u: 'je kaprová zátěž pro lov na položenou.', t: 'Tvar olova ovlivňuje dálku hodu i to, jak drží na dně. Kvalitní povrchová úprava olovo maskuje a chrání před korozí.', zatez: true },
 { m: /Ostatní doplňky/, n: /Brousek/i, c: [P + ' > Příslušenství > Doplňky, metry a brousky > Brousky na háčky'], z: 'Doplňky', s: 'Brousek na háčky', st: /^Brousek\s*/i, u: 'je brousek pro naostření háčků přímo u vody.', t: 'Ostrý háček je základ úspěchu. Brousek vrátí hrotu ostrost během pár tahů.' },
 { m: /Ostatní doplňky/, n: /Klip na/i, c: [F + ' > Feederové doplňky'], z: 'Feederové doplňky', s: 'Klip na červy', st: /^Klip na Červy\s*/i, u: 'je klip pro nasazení červů a larev.', t: 'Klip udrží svazek červů nebo larev pohromadě a nástraha je na háčku déle živá.' },
 { m: /Ostatní doplňky/, c: [KP + ' > Nástroje a jehly'], z: 'Doplňky', s: 'Rybářský doplněk', st: /^/, u: 'je praktický doplněk do rybářské výbavy.', t: 'Drobné pomůcky ušetří čas u vody a usnadní manipulaci s rybou i montáží.' },
 { m: /PVA Materiál/, c: [KP + ' > PVA materiály'], z: 'PVA materiály', s: 'PVA', st: /^PVA\s*/i, u: 'je rozpustný PVA materiál pro přesné zakrmení u nástrahy.', t: 'PVA se ve vodě během chvíle rozpustí a zanechá krmení přímo u háčku. Je ideální pro lov na krátkou i dlouhou vzdálenost.', p: { 'Druh lovu': ['Kaprařina'] } },
 { m: /PVC a Silikon převleky|Rovnátka, Smršťovačky/, c: [KP + ' > Převleky a hadičky'], z: 'Koncové montáže', s: 'Převlek', st: /^(Převleky|Sada Převleků|Rovnátko|Rovnátka|Smršťovací hadička|Smršťovací Hadička|Bužírka|Silikon bužírky|Anti Tangle)\s*/i, u: 'je komponent pro stavbu kaprových montáží.', t: 'Převleky, rovnátka a hadičky zlepšují funkci návazce, chrání vlasec a snižují počet zamotání.' },
 { m: /Pouzdra a Zásobníky na návazce/, c: [K + ' > Tašky a obaly'], z: 'Tašky a obaly', s: 'Zásobník na návazce', st: /^(Box na návazce|Zásobník na Návazce)\s*/i, u: 'je zásobník pro uložení hotových návazců.', t: 'Návazce v zásobníku zůstávají rovné, nepomačkané a připravené k okamžitému použití.' },
 { m: /Trny, Kroužky/, c: [KP + ' > Zarážky a doplňky na nástrahy'], z: 'Koncové montáže', s: 'Doplněk na nástrahy', st: /^/, u: 'je doplněk pro uchycení nástrahy na vlasu.', t: 'Trny, kroužky a vrtáčky umožňují nasadit nástrahu bez propichování a rychle ji vyměnit.' },
 { m: /Zarážky a Stoppery/, c: [KP + ' > Zarážky a doplňky na nástrahy'], z: 'Koncové montáže', s: 'Zarážky', st: /^(Zarážky|Zarážka|Nekonečná Zarážka|Prodloužené Zarážky|Nástrahový Kroužek|Silikon Zarážky|Silikon Vlas)\s*/i, u: 'jsou zarážky pro zajištění nástrahy na vlasu.', t: 'Zarážka drží boilies nebo pelet pevně na vlasu i při dalekém nahození.' },
 { m: /Závaží na návazce/, c: [KP + ' > Olova'], z: 'Olova', s: 'Tungstenová zátěž', st: /^(Tungstenové Zátěže|Korálky|Plastické Olovo|Zátěže)\s*/i, u: 'je tungstenová zátěž pro přitížení návazce.', t: 'Těžký tungsten drží návazec u dna, takže je méně nápadný a ryba se na něm snáze zasekne.' },
 { m: /Závěsky/, c: [KP + ' > Obratlíky a klipy'], z: 'Koncové montáže', s: 'Závěska', st: /^(Závěska|Převlek na Závěsku)\s*/i, u: 'je bezpečná závěska na olovo.', t: 'Závěska umožní, aby se ryba při utržení zbavila olova, a montáž je tak bezpečná pro rybu.' },
 { m: /Splávky > FilFishing/, n: /FPK 4[23]|Catfish/i, c: [S + ' > Splávky'], z: 'Splávky', s: 'Sumcový splávek', st: /^Splávek\s*(Catfish Float\s*)?(model\s*)?/i, u: 'je sumcový splávek pro lov na živou nebo mrtvou rybku.', t: 'Velká nosnost splávku udrží i větší nástrahu a záběr sumce je dobře vidět.', p: { 'Cílová ryba': ['Sumec'] } },
 { m: /Splávky > FilFishing/, c: [F + ' > Splávky'], z: 'Splávky', s: 'Splávek', st: /^(Splávek\s*(model|Model)?|Kulové Plovátko|Oválné Plovátko)\s*/i, u: 'je splávek pro lov na plavanou.', t: 'Citlivý splávek ukáže i ten nejjemnější záběr a díky dobré viditelnosti ho sledujete bez námahy.' },
 { m: /Příslušenství na plavanou/, c: [F + ' > Příslušenství > Doplňky'], z: 'Doplňky', s: 'Doplněk na plavanou', st: /^/, u: 'je doplněk pro montáž na plavanou.', t: 'Drobné doplňky usnadní stavbu montáže a výměnu splávku bez převazování.' },
 { m: /Kufry, Krabičky a Boxy/, n: /Miska/i, c: [ZV + ' > Kbelíky'], z: 'Krabičky a boxy', s: 'Miska na nástrahy', st: /^Miska na nástrahy\s*/i, u: 'je miska na nástrahy a krmení.', t: 'Miska udrží nástrahy po ruce, je lehká a dobře se čistí.' },
 { m: /Kufry, Krabičky a Boxy/, c: [F + ' > Příslušenství > Krabičky a boxy', K + ' > Tašky a obaly'], z: 'Krabičky a boxy', s: 'Krabička', st: /^(Krabička|Organizér|Magnetický Box|Box)\s*/i, u: 'je krabička pro přehledné uložení drobností.', t: 'Přihrádky udrží háčky, obratlíky a zarážky přehledně oddělené, takže potřebnou drobnost najdete hned.' },
 { m: /Nepromokavé Boxy a Tašky/, n: /Míchačka|MÍCHAČKA/i, c: [F + ' > Příslušenství > Míchačky krmení'], z: 'Tašky a obaly', s: 'Míchačka krmení', st: /^(Míchačka Krmení|MÍCHAČKA KRMENÍ)\s*/i, u: 'je nádoba pro přípravu krmné směsi.', t: 'Skládací míchačka se snadno převáží a po použití se rychle umyje.' },
 { m: /Nepromokavé Boxy a Tašky|Penály a ostatní obaly|Tašky, Batohy, Kufry/, c: [K + ' > Tašky a obaly'], z: 'Tašky a obaly', s: 'Taška', st: /^(Nepromokavá Taška|Taška|Box|Organizér|Pouzdro|Obal|Batoh|Termo Taška|Z-Core Penál)\s*/i, u: 'je praktické zavazadlo pro rybářskou výbavu.', t: 'Odolný materiál ochrání výbavu před vlhkostí i nečistotami a promyšlené uspořádání usnadní orientaci.' },
 { m: /Počítadla vlasce/, c: [K + ' > Vlasce a šňůry'], z: 'Vlasce a šňůry', s: 'Počítadlo vlasce', st: /^Počítadlo Vlasce\s*/i, u: 'je počítadlo pro přesné změření vzdálenosti nahození.', t: 'Počítadlo pomůže navinout stejné množství vlasce a lovit opakovaně na přesně stejném místě.' },
 { m: /Feeder a Match vlasce/, c: [F + ' > Vlasce a šňůry'], z: 'Vlasce a šňůry', s: 'Vlasec', st: /^(vlasec|Šňůrka)\s*/i, u: 'je vlasec pro lov na feeder a plavanou.', t: 'Vlasec má nízkou paměť, dobře se navíjí a přenáší záběr na špičku prutu.', vlasec: true },
 { m: /Fluorocarbon/, c: [K + ' > Vlasce a šňůry > Návazcové materiály', F + ' > Vlasce a šňůry'], z: 'Vlasce a šňůry', s: 'Fluorocarbon', st: /^(Fluoro Carbon|Fluorostar Fluorocarbon)\s*/i, u: 'je fluorocarbon na návazce.', t: 'Fluorocarbon je ve vodě téměř neviditelný a odolný proti oděru, proto je ideální na návazce.', vlasec: true },
 { m: /Kaprové vlasce/, n: /šok|Shock/i, c: [K + ' > Vlasce a šňůry > Šokové vlasce'], z: 'Vlasce a šňůry', s: 'Šokový vlasec', st: /^(Ujímaný šokový vlasec|Šokový Vlasec)\s*/i, u: 'je šokový vlasec pro daleké nahazování těžkých zátěží.', t: 'Šokový vlasec pohltí náraz při náhozu a ochrání hlavní vlasec před přetržením.', vlasec: true },
 { m: /Kaprové vlasce|Vlasce a Šňůry$/, n: /Asso/i, c: [P + ' > Šňůry, vlasce a fluorocarbony > Vlasce', F + ' > Vlasce a šňůry'], z: 'Vlasce a šňůry', s: 'Vlasec', st: /^(Vlasec\s*)?(Asso\s*)?/i, u: 'je univerzální vlasec pro přívlač, feeder i plavanou.', t: 'Vlasec má vysokou pevnost v uzlu, dobře se navíjí a je odolný proti oděru.', vlasec: true },
 { m: /Kaprové vlasce/, c: [K + ' > Vlasce a šňůry > Hlavní vlasce'], z: 'Vlasce a šňůry', s: 'Kaprový vlasec', st: /^(Vlasec\s*)?(Extra Carp\s*-?\s*)?/i, u: 'je kaprový vlasec pro lov na položenou.', t: 'Kaprový vlasec musí vydržet oděr o překážky i dlouhé zdolávání. Nízká paměť zajišťuje daleké a přesné nahození.', vlasec: true },
 { m: /Přívlačové vlasce/, c: [P + ' > Šňůry, vlasce a fluorocarbony > Vlasce'], z: 'Vlasce a šňůry', s: 'Vlasec', st: /^(Vlasec\s*)?(Asso\s*)?/i, u: 'je vlasec s nízkou průtažností pro přívlač.', t: 'Nízká průtažnost zajistí rychlý přenos záběru a jistější záseky.', vlasec: true },
 { m: /Kaprové návazcové šňůry/, n: /Leadcore|Olověná/i, c: [K + ' > Vlasce a šňůry > Olověnky'], z: 'Vlasce a šňůry', s: 'Olověnka', st: /^Olověná Šňůra\s*/i, u: 'je olověná šňůra pro bezpečnou montáž.', t: 'Olověnka drží montáž u dna a chrání hlavní vlasec v posledních metrech před nástrahou.' },
 { m: /Kaprové návazcové šňůry/, c: [K + ' > Vlasce a šňůry > Návazcové materiály'], z: 'Vlasce a šňůry', s: 'Návazcová šňůrka', st: /^(Šňůrka|Bait Floss)\s*/i, u: 'je návazcová šňůrka pro stavbu kaprových návazců.', t: 'Šňůrka je měkká a pevná, dobře se váže a nástraha na ní působí přirozeně.' },
 { m: /Přívlačové šňůry/, c: [P + ' > Šňůry, vlasce a fluorocarbony > Pletené šňůry'], z: 'Vlasce a šňůry', s: 'Pletená šňůra', st: /^Šňůra\s*/i, u: 'je pletená šňůra pro přívlač.', t: 'Osminásobně splétaná šňůra je kulatá, hladká a dobře se nahazuje. Nulová průtažnost zajišťuje přímý kontakt s nástrahou.', snura: true },
 { m: /Sumcové šňůry/, c: [S + ' > Šňůry'], z: 'Vlasce a šňůry', s: 'Sumcová šňůra', st: /^(Šnůra|Sumcová Šňůrka)\s*/i, u: 'je silná šňůra na sumcové návazce.', t: 'Sumcová šňůra vydrží extrémní zatížení i oděr o překážky.', p: { 'Cílová ryba': ['Sumec'] } },
 // --- kempink
 { m: /Bivaky a přístřešky/, c: [BK + ' > Bivaky'], z: 'Bivaky a kempink', s: 'Bivak', st: /^(Bivak|Přístřešek)\s*/i, u: 'je přístřešek pro pohodlné vícedenní lovení.', t: 'Kvalitní bivak ochrání před deštěm i větrem a poskytne zázemí na dlouhé výpravy k vodě.' },
 { m: /Deštníky/, c: [BK + ' > Deštníky'], z: 'Bivaky a kempink', s: 'Deštník', st: /^Deštník\s*/i, u: 'je rybářský deštník pro ochranu před deštěm i sluncem.', t: 'Velký deštník rychle postavíte a ochrání vás i výbavu.' },
 { m: /Bivaky, Deštníky a Přístřešky > Ostatní/, c: [BK + ' > Příslušenství k bivakům'], z: 'Bivaky a kempink', s: 'Doplněk k bivaku', st: /^/, u: 'je doplněk pro pohodlí na rybářském místě.', t: 'Drobné doplňky usnadní stavbu bivaku i pobyt u vody.' },
 { m: /Jídelní sady/, n: /Filet|Škrabka/i, c: [P + ' > Příslušenství > Nože a brousky > Filetovací pomůcky'], z: 'Nože', s: 'Filetovací pomůcka', st: /^(Filetovací Rukavice|Škrabka na Šupiny)\s*/i, u: 'je pomůcka pro čištění a filetování ryb.', t: 'Usnadní a zrychlí zpracování úlovku a chrání ruce před pořezáním.' },
 { m: /Jídelní sady|Plynové Vařiče/, c: [BK + ' > Vaření'], z: 'Bivaky a kempink', s: 'Vybavení na vaření', st: /^/, u: 'je kempingové vybavení pro vaření u vody.', t: 'Odolné nádobí a vařiče zajistí teplé jídlo i kávu během dlouhých výprav.' },
 { m: /Kanystry a Pumpy/, c: [BK + ' > Kanystry na vodu'], z: 'Bivaky a kempink', s: 'Kanystr', st: /^(Kanystr|Automatická Pumpa|Set)\s*/i, u: 'je vybavení pro zásobu vody na rybářském místě.', t: 'Zásoba čisté vody se hodí na vaření, mytí i ošetření ryb.' },
 { m: /Kbelíky/, c: [ZV + ' > Kbelíky'], z: 'Kbelíky', s: 'Kbelík', st: /^(Kbelík|Stojan na Kbelík|Vložka do Kbelíku)\s*/i, u: 'je kbelík na krmení a nástrahy.', t: 'Pevný kbelík s víkem udrží krmení čerstvé a dobře se přenáší.' },
 { m: /Křesla/, c: [BK + ' > Křesla'], z: 'Bivaky a kempink', s: 'Křeslo', st: /^(Křeslo|Stolička|Přehoz na Křeslo|Aquacore Taška na Křeslo)\s*/i, u: 'je rybářské křeslo pro pohodlné sezení u vody.', t: 'Stavitelné nohy s blátivými patkami umožní postavit křeslo rovně i ve svahu.', p: { 'Druh sezení': ['Křeslo'] } },
 { m: /Lehátka/, c: [BK + ' > Lehátka'], z: 'Bivaky a kempink', s: 'Lehátko', st: /^(Lehátko|Přídavné nohy k Lehátku|Aquacore Taška na Lehátko|Camo Set)\s*/i, u: 'je rybářské lehátko pro odpočinek při vícedenním lovu.', t: 'Pohodlné lehátko se stavitelnými nohami zajistí kvalitní spánek i na nerovném terénu.' },
 { m: /CAMPING A OUTDOOR > Nože/, c: [P + ' > Příslušenství > Nože a brousky > Nože'], z: 'Nože', s: 'Filetovací nůž', st: /^(Filetovací Nůž|Filetovací Sada)\s*/i, u: 'je nůž pro filetování a zpracování ryb.', t: 'Ostrá a pružná čepel umožní přesné filetování a protiskluzová rukojeť bezpečný úchop i mokrou rukou.' },
 { m: /CAMPING A OUTDOOR > Ostatní/, n: /Ručník/i, c: [P + ' > Příslušenství > Doplňky, metry a brousky > Ručníky'], z: 'Doplňky', s: 'Ručník', st: /^Ručník\s*/i, u: 'je rybářský ručník do výbavy.', t: 'Savý ručník se hodí na otření rukou při manipulaci s rybou i nástrahami.' },
 { m: /CAMPING A OUTDOOR > Ostatní|Rybářská elektronika|Světla do bivaku/, c: [BK + ' > Světla a elektronika'], z: 'Bivaky a kempink', s: 'Vybavení do bivaku', st: /^/, u: 'je praktický doplněk pro pohodlí v bivaku.', t: 'Vybavení zpříjemní pobyt u vody a usnadní vícedenní výpravy.' },
 { m: /Spací pytle/, c: [BK + ' > Spací pytle'], z: 'Bivaky a kempink', s: 'Spací pytel', st: /^Spací Pytel\s*/i, u: 'je spací pytel pro celoroční lov.', t: 'Kvalitní spací pytel zahřeje i v chladných nocích a díky voděodolnému povrchu odolá rosě.' },
 { m: /Stolky/, c: [BK + ' > Stolky'], z: 'Bivaky a kempink', s: 'Stolek do bivaku', st: /^Stolek\s*/i, u: 'je skládací stolek do bivaku.', t: 'Stolek udrží výbavu v suchu a po ruce.' },
 { m: /Vozíky/, c: [BK + ' > Vozíky'], z: 'Bivaky a kempink', s: 'Vozík', st: /^Vozík\s*/i, u: 'je vozík pro snadný převoz výbavy k vodě.', t: 'Vozík usnadní přesun i velkého množství výbavy na lovné místo.' },
 { m: /Čelovky a Svítilny/, c: [BK + ' > Čelovky a svítilny'], z: 'Bivaky a kempink', s: 'Čelovka', st: /^(Čelovka|Multifunkční Fotolampa|Adaptér na Fotolampu)\s*/i, u: 'je svítilna pro noční lov.', t: 'Čelovka uvolní ruce při nasazování nástrah i zdolávání ryby v noci.' },
 // --- krmení
 { m: /Boilies & Pelety/, c: [K + ' > Návnady a krmení > Pelety', F + ' > Krmení a návnady'], z: 'Návnady a krmení', s: 'Pelety', st: /^(Chytací Pelety|Mikro Pelety)\s*/i, u: 'jsou pelety pro lov a vnadění kaprovitých ryb.', t: 'Pelety se postupně rozpouštějí a uvolňují atraktivní látky, které stáhnou ryby na lovné místo.', p: { 'Druh návnady': ['Pelety'] }, prichut: true },
 { m: /Boostery & Dipy/, c: [K + ' > Návnady a krmení > Dipy a boostery'], z: 'Návnady a krmení', s: 'Dip', st: /^Dip\s*/i, u: 'je dip pro zvýšení atraktivity nástrah.', t: 'Namočením nástrahy do dipu zvýšíte její vůni a výraznost ve vodě.', p: { 'Druh návnady': ['Booster'] }, prichut: true },
 { m: /RELAX - Gumové nástrahy/, n: /Kopyto/, c: [P + ' > Gumové nástrahy > Relax > Kopyto'], z: 'Gumové nástrahy', s: 'Gumová nástraha', st: /^(Ripper\s*)?/i, u: 'je klasická gumová nástraha pro přívlač.', t: 'Kopyto Relax patří k nejúspěšnějším gumovým nástrahám vůbec – výrazně pracuje i při pomalém vedení.', relax: 'Kopyto', p: { 'Cílová ryba': ['Okoun', 'Candát', 'Štika'], 'Tvar nástrahy': ['Shadový ocásek'] } },
 { m: /RELAX - Gumové nástrahy/, c: [P + ' > Gumové nástrahy > Relax > Twister'], z: 'Gumové nástrahy', s: 'Gumová nástraha', st: /^/, u: 'je klasická gumová nástraha pro přívlač.', t: 'Twister láká dravce vlněním ocásku i při pomalém vedení.', relax: 'Twister', p: { 'Cílová ryba': ['Okoun', 'Candát', 'Štika'], 'Tvar nástrahy': ['Twistrový ocásek'] } },
 { m: /ZFISH - Gumové nástrahy/, c: [P + ' > Gumové nástrahy'], z: 'Gumové nástrahy', s: 'Gumová nástraha', st: /^/, u: 'je gumová nástraha pro lov dravých ryb přívlačí.', t: 'Měkká gumová směs a výrazná akce ocásku lákají dravce při rovnoměrném vedení i jigování.', p: { 'Cílová ryba': ['Okoun', 'Candát', 'Štika'], 'Tvar nástrahy': ['Shadový ocásek'] } },
 { m: /ZFISH - Jigové hlavičky/, c: [P + ' > Jigové hlavičky a zátěže > Jigové hlavičky'], z: 'Jigové hlavičky', s: 'Jigová hlavička', st: /^Jig Head\s*/i, u: 'je jigová hlavička pro gumové nástrahy.', t: 'Kulatá hlava a ostrý háček zajistí přirozený pohyb nástrahy a jistý zásek.', jig: true, p: { 'Materiál Jigové hlavičky': ['Olověná'] } },
 { m: /Krmítkové Směsi/, c: [F + ' > Krmení a návnady', K + ' > Návnady a krmení > Krmítkové směsi'], z: 'Návnady a krmení', s: 'Zakrmovací brikety', st: /^Zakrmovací Brikety\s*/i, u: 'jsou zakrmovací brikety pro rychlé vnadění.', t: 'Lisované brikety se ve vodě pomalu rozpadají a vytvoří dlouhotrvající stopu.', p: { 'Druh návnady': ['Krmítková směs'] }, prichut: true },
 { m: /Pop-Up, Dumbells, Wafters/, c: [K + ' > Návnady a krmení > Pop-upy a vyvážené nástrahy'], z: 'Návnady a krmení', s: 'Nástraha', st: /^(Plovoucí Boilies|Vyvážené Boilies|Plovoucí kukuřice|Plovoucí silikonová kulička|Pěnová Nástraha)\s*/i, u: 'je plovoucí nebo vyvážená nástraha na kapry.', t: 'Plovoucí a vyvážené nástrahy se vznášejí nad dnem a kapr je nasaje snáz než těžkou nástrahu.', p: { 'Druh návnady': ['Pop-up'] }, prichut: true },
 { m: /Rotačky a Plandavky > Plandavky/, c: [P + ' > Třpytky, plandavky, spinnery > Plandavky'], z: 'Plandavky', s: 'Plandavka', st: /^(Filex\s*)?(Plandavka\s*)?(Filex\s*)?/i, u: 'je plandavka pro lov dravých ryb.', t: 'Plandavka se při vedení kolébá a blýská jako zraněná rybka.', p: { 'Cílová ryba': ['Štika', 'Bolen', 'Okoun'] } },
 { m: /Bojky/, c: [ZV + ' > Bojky'], z: 'Zavážení a vnadění', s: 'Bojka', st: /^H-Bojka\s*/i, u: 'je bojka pro označení lovného místa.', t: 'Bojka označí místo zakrmení a usnadní přesné nahození.' },
 { m: /Drtičky nástrah/, c: [ZV + ' > Drtičky nástrah'], z: 'Zavážení a vnadění', s: 'Drtička boilies', st: /^(Drtička|Kráječ|Boilie Mlýnek)\s*/i, u: 'je drtička pro přípravu krmení z boilies.', t: 'Nadrcené boilies uvolní více atraktivních látek a ryby přilákají rychleji.' },
 { m: /Míchačky krmení/, c: [F + ' > Příslušenství > Síta'], z: 'Zavážení a vnadění', s: 'Síto', st: /^Síto\s*/i, u: 'je síto pro přípravu krmné směsi.', t: 'Síto rozbije hrudky a krmení je jemné a nadýchané.' },
 { m: /Praky, gumy/, c: [ZV + ' > Praky'], z: 'Zavážení a vnadění', s: 'Prak', st: /^(Prak|Náhradní guma|Náhradní Košík)\s*/i, u: 'je prak pro přesné zakrmení.', t: 'Prak dopraví krmení i na větší vzdálenost s vysokou přesností.' },
 { m: /Vrhací tyče/, c: [ZV + ' > Vrhací tyče'], z: 'Zavážení a vnadění', s: 'Vrhací tyč', st: /^(Kobra|Vrhací Tyč)\s*/i, u: 'je vrhací tyč na boilies.', t: 'Kobra umožní dohodit boilies daleko a přesně na lovné místo.' },
 { m: /Zakrmovací lopatky/, c: [ZV + ' > Zakrmovací lopatky'], z: 'Zavážení a vnadění', s: 'Zakrmovací lopatka', st: /^(Lopatka|Tyč k Lopatce|Zakrmovací Lopatka)\s*/i, u: 'je lopatka pro zakrmení blízkého místa.', t: 'Lopatka položí krmení přesně tam, kde chcete lovit.' },
 { m: /Zakrmovací rakety/, c: [ZV + ' > Spomby'], z: 'Zavážení a vnadění', s: 'Zakrmovací raketa', st: /^Zakrmovací Raketa\s*/i, u: 'je raketa pro zakrmení na velkou vzdálenost.', t: 'Raketa dopraví krmení daleko a vysype ho přesně na hladině lovného místa.' },
 { m: /LIMITOVANÁ AKCE > Camping/, c: [BK + ' > Kanystry na vodu'], z: 'Bivaky a kempink', s: 'Kanystr', st: /^Kanystr\s*/i, u: 'je kanystr pro zásobu vody na rybářském místě.', t: 'Zásoba čisté vody se hodí na vaření, mytí i ošetření ryb.' },
 { m: /Háčky Venturieri/, c: [F + ' > Háčky a návazce'], z: 'Háčky', s: 'Háčky', st: /^Háčky\s*/i, u: 'jsou háčky pro lov na feeder a plavanou.', t: 'Ostré háčky z kvalitní oceli spolehlivě zasekávají i opatrné ryby.', p: { 'Druh háčku': ['Jednoháček s protihrotem'] }, hacek: 'velikost-jednohacku' },
 // --- navijáky
 { m: /Náhradní cívky/, c: [K + ' > Navijáky > Náhradní cívky'], z: 'Navijáky', s: 'Náhradní cívka', st: /^Náhradní Cívka\s*(Naviják\s*)?/i, u: 'je náhradní cívka k navijáku.', t: 'Náhradní cívka umožní mít připravený jiný vlasec a rychle ho vyměnit podle podmínek.' },
 { m: /Přední brzda/, n: /Sumcový/i, c: [S + ' > Navijáky'], z: 'Navijáky', s: 'Sumcový naviják', st: /^Sumcový Naviják\s*/i, u: 'je robustní naviják pro lov sumců.', t: 'Silná brzda a odolná konstrukce zvládnou zdolávání i velkých ryb.', navijak: true },
 { m: /Přední brzda/, c: [K + ' > Navijáky > Navijáky Big Pit'], z: 'Navijáky', s: 'Kaprový naviják', st: /^Naviják\s*/i, u: 'je kaprový naviják s velkou cívkou pro daleké nahazování.', t: 'Velká cívka a plynulá brzda zajistí daleké hody i bezpečné zdolání kapra.', navijak: true },
 { m: /Přívlačové navijáky/, c: [P + ' > Navijáky > Smekací navijáky'], z: 'Navijáky', s: 'Naviják', st: /^Naviják\s*/i, u: 'je smekací naviják pro přívlač.', t: 'Lehký naviják s plynulou brzdou je vhodný pro lov okounů, candátů i štik.', navijak: true },
 { m: /Volnoběžná brzda/, c: [K + ' > Navijáky > Navijáky s volnoběžkou'], z: 'Navijáky', s: 'Naviják s volnoběžkou', st: /^Naviják\s*/i, u: 'je kaprový naviják s volnoběžnou brzdou.', t: 'Volnoběžka umožní rybě odebírat vlasec bez odporu a po otočení kličkou se zapne hlavní brzda.', navijak: true },
 { m: /COMBO 1\+1/, n: /Skynet/, c: [P + ' > Pruty > Pruty Přívlač'], z: 'Pruty', s: 'Set prut a naviják', st: /^Combo\s*/i, u: 'je set přívlačového prutu a navijáku.', t: 'Sladěná sestava je připravená k okamžitému lovu.' },
 { m: /COMBO 1\+1/, n: /Catfish|Kodiak/, c: [S + ' > Pruty'], z: 'Pruty', s: 'Set prut a naviják', st: /^Combo\s*/i, u: 'je sumcový set prutu a navijáku.', t: 'Sladěná sestava je připravená k okamžitému lovu sumců.' },
 { m: /COMBO 1\+1/, c: [K + ' > Pruty > Stalkingové pruty'], z: 'Pruty', s: 'Set prut a naviják', st: /^Combo\s*/i, u: 'je set kaprového prutu a navijáku.', t: 'Sladěná sestava je připravená k okamžitému lovu.' },
 { m: /CAMPING & OSTATNÍ 1\+1/, c: [BK + ' > Lehátka'], z: 'Bivaky a kempink', s: 'Set lehátko a spací pytel', st: /^Camo Set\s*/i, u: 'je výhodný set lehátka a spacího pytle.', t: 'Sada zajistí pohodlný spánek na vícedenních výpravách.' },
 // --- oblečení
 { m: /Holínky a obuv/, c: [P + ' > Oblečení > Holinky'], vse: true, z: 'Oblečení', s: 'Holínky', st: /^Holínky\s*/i, u: 'jsou rybářské holínky do mokra a bláta.', t: 'Holínky jsou nepromokavé a mají protiskluzovou podrážku.', obl: 'holínky', vel: 'Velikost boty' },
 { m: /Kalhoty, Tepláky/, c: [P + ' > Oblečení > Kalhoty'], vse: true, z: 'Oblečení', s: 'Tepláky', st: /^Tepláky\s*/i, u: 'jsou pohodlné tepláky pro rybáře.', t: 'Pohodlný střih a příjemný materiál se hodí k vodě i na volný čas.', obl: 'kalhoty', vel: 'Velikost kalhot' },
 { m: /Mikiny a Svetry/, c: [P + ' > Oblečení > Mikiny'], vse: true, z: 'Oblečení', s: 'Mikina', st: /^Mikina\s*/i, u: 'je pohodlná mikina pro rybáře.', t: 'Mikina s kapucí hřeje v chladnějších dnech u vody.', obl: 'mikina', vel: 'Velikost mikiny' },
 { m: /Polarizační brýle/, c: [P + ' > Příslušenství > Sluneční brýle > Polarizační brýle'], z: 'Polarizační brýle', s: 'Polarizační brýle', st: /^(Polarizační Brýle|Plovoucí popruh k brýlím)\s*/i, u: 'jsou polarizační brýle pro rybáře.', t: 'Polarizační skla odstraní odlesky z hladiny, takže uvidíte ryby i překážky pod vodou. Chrání zároveň oči před UV zářením.' },
 { m: /Termoprádlo/, c: [P + ' > Oblečení > Termoprádlo'], vse: true, z: 'Oblečení', s: 'Termoprádlo', st: /^TERMOPRÁDLO\s*/i, u: 'je funkční termoprádlo pro chladné dny u vody.', t: 'Termoprádlo odvádí pot a udržuje tělo v teple i při celodenním lovu.', obl: 'termotriko', vel: 'Velikost trika' },
 { m: /Čepice, Rukavice/, n: /Rukavice|Gloves/i, c: [P + ' > Oblečení > Rukavice'], vse: true, z: 'Oblečení', s: 'Rukavice', st: /^Neoprén Rukavice\s*/i, u: 'jsou neoprenové rukavice pro rybáře.', t: 'Neopren hřeje i za mokra a rukavice chrání ruce při manipulaci s rybou.' },
 { m: /Čepice, Rukavice/, c: [P + ' > Oblečení > Čepice'], vse: true, z: 'Oblečení', s: 'Čepice', st: /^(Čepice|Kšiltovka)\s*/i, u: 'je čepice pro rybáře.', t: 'Pohodlná čepice se hodí k vodě i na každý den.', obl: 'čepice' },
 // --- pruty
 { m: /Feederové pruty/, c: [F + ' > Pruty > Feederové pruty'], z: 'Pruty', s: 'Feederový prut', st: /^Prut\s*/i, u: 'je feederový prut pro lov na krmítko.', t: 'Feederový prut se citlivou špičkou ukáže i jemný záběr. Součástí jsou výměnné špičky různé tuhosti.', prut: true },
 { m: /Kaprové děličky/, n: /Spod/i, c: [K + ' > Pruty > Spodové a markrové pruty'], z: 'Pruty', s: 'Spodový prut', st: /^Prut\s*/i, u: 'je spodový prut pro zavážení krmení raketou.', t: 'Silný blank dohodí i plnou raketu na velkou vzdálenost.', prut: true },
 { m: /Kaprové děličky/, n: /Stalker/i, c: [K + ' > Pruty > Stalkingové pruty'], z: 'Pruty', s: 'Kaprový prut', st: /^Prut\s*/i, u: 'je krátký kaprový prut pro stalking.', t: 'Krátký prut je ideální na menší vody a lov u břehu mezi překážkami.', prut: true },
 { m: /Kaprové děličky|Kaprové teleskopické/, c: [K + ' > Pruty > Kaprové pruty'], z: 'Pruty', s: 'Kaprový prut', st: /^(Combo 2x\s*)?Prut\s*/i, u: 'je kaprový prut pro lov na položenou.', t: 'Kaprový prut zvládne daleké nahození těžkých zátěží i zdolání velkého kapra.', prut: true },
 { m: /Pouzdra na pruty/, c: [K + ' > Tašky a obaly'], z: 'Tašky a obaly', s: 'Pouzdro na pruty', st: /^Pouzdro na (2 )?(Prut|Pruty)\s*/i, u: 'je pouzdro na pruty.', t: 'Pouzdro chrání pruty s navijáky při převozu a usnadní jejich přenášení.' },
 { m: /Pruty na přívlač/, c: [P + ' > Pruty > Pruty Přívlač'], z: 'Pruty', s: 'Přívlačový prut', st: /^Prut\s*/i, u: 'je přívlačový prut.', t: 'Lehký a citlivý prut přenese každý záběr a umožní přesné vedení nástrahy.', prut: true },
 { m: /Pásky a koncovky/, c: [P + ' > Příslušenství > Doplňky, metry a brousky > Pásky na pruty'], z: 'Doplňky', s: 'Chránič prutu', st: /^(Chránič (P|p)rutu|Neoprenové Pásky|Držák Nástrahy)\s*/i, u: 'je doplněk pro ochranu prutů.', t: 'Chrániče a pásky drží díly prutu pohromadě a chrání je při převozu.' },
 { m: /Sumcové pruty/, c: [S + ' > Pruty'], z: 'Pruty', s: 'Sumcový prut', st: /^Prut\s*/i, u: 'je silný sumcový prut.', t: 'Robustní blank zvládne zdolávání sumců i na těžkých montážích.', prut: true },
 // --- péče o úlovek
 { m: /Desinfekce/, c: [K + ' > Péče o úlovek > Dezinfekce'], z: 'Péče o úlovek', s: 'Dezinfekce na ryby', st: /^Desinfekce\s*/i, u: 'je dezinfekce pro ošetření ran ryb.', t: 'Ošetření místa po háčku pomůže rychlému zhojení ryby po pouštění.' },
 { m: /Přívlačové podběráky/, c: [P + ' > Příslušenství > Podběráky a vylovovací kleště > Podběráky'], z: 'Podběráky', s: 'Podběrák', st: /^Podběrák\s*/i, u: 'je přívlačový podběrák.', t: 'Lehký podběrák se hodí na přívlač ze břehu i z lodi.' },
 { m: /Podběrákové Hlavy/, c: [K + ' > Péče o úlovek > Podběráky'], z: 'Podběráky', s: 'Podběráková hlava', st: /^(POGUMOVANÁ PODBĚRÁKOVÁ HLAVA|Podběráková Hlava)\s*/i, u: 'je podběráková hlava.', t: 'Šetrná síťka chrání slizovou vrstvu ryby a háčky se v ní tolik nezamotávají.', p: { 'Druh podběráku': ['Podběráková hlava'] } },
 { m: /Podběrákové Tyče/, c: [K + ' > Péče o úlovek > Podběráky'], z: 'Podběráky', s: 'Podběráková tyč', st: /^Podběráková (T|t)yč\s*/i, u: 'je podběráková tyč.', t: 'Pevná a lehká tyč umožní bezpečně podebrat rybu i z vyššího břehu.', p: { 'Druh podběráku': ['Podběráková tyč'] } },
 { m: /Doplňky k Podběrákům/, c: [K + ' > Péče o úlovek > Podběráky'], z: 'Podběráky', s: 'Doplněk k podběráku', st: /^/, u: 'je doplněk k podběráku.', t: 'Doplněk prodlouží životnost podběráku a usnadní manipulaci s ním.' },
 { m: /Skládací podběráky/, c: [K + ' > Péče o úlovek > Podběráky', F + ' > Příslušenství > Podběráky'], z: 'Podběráky', s: 'Podběrák', st: /^(Skládací Podběrák|Podběrák)\s*/i, u: 'je podběrák pro bezpečné vylovení ryby.', t: 'Podběrák pevně drží tvar a šetrná síťka chrání rybu.' },
 { m: /Podložky/, c: [K + ' > Péče o úlovek > Podložky'], z: 'Péče o úlovek', s: 'Podložka pod ryby', st: /^Podložka\s*/i, u: 'je podložka pro šetrné vyháčkování ryby.', t: 'Měkká podložka chrání rybu před poraněním o zem.' },
 { m: /Saky, Vezírky & Čeřeny/, n: /Vezírek|Čeřen/i, c: [F + ' > Příslušenství > Vezírky'], z: 'Péče o úlovek', s: 'Vezírek', st: /^(Vezírek|Čeřen)\s*/i, u: 'je vezírek pro šetrné uchování úlovku.', t: 'Pogumovaná nebo jemná síťka chrání ryby před poškozením šupin.' },
 { m: /Saky, Vezírky|Vážící saky/, c: [K + ' > Péče o úlovek > Saky'], z: 'Péče o úlovek', s: 'Sak', st: /^(Sak na Kapra|Vážící Sak)\s*/i, u: 'je sak pro šetrnou manipulaci s rybou.', t: 'Sak umožní rybu bezpečně zvážit nebo krátce uchovat ve vodě.' },
 { m: /Váhy & Metry/, c: [K + ' > Péče o úlovek > Váhy', P + ' > Příslušenství > Doplňky, metry a brousky > Váhy'], z: 'Péče o úlovek', s: 'Váha', st: /^(Váha|Metr|Měřící Podložka|Vážící Trojnožka)\s*/i, u: 'je pomůcka pro zvážení a změření úlovku.', t: 'Přesné zvážení a změření ryby je důležité pro záznam úlovku.' },
 // --- stojany
 { m: /Držáky na pruty/, c: [P + ' > Příslušenství > Stojany na pruty'], z: 'Stojany a hlásiče', s: 'Držák prutu', st: /^Držák Prutu\s*/i, u: 'je držák prutu do lodi.', t: 'Držák bezpečně udrží prut při lovu z lodi.' },
 { m: /Feeder Hrazdy/, c: [F + ' > Příslušenství > Stojany a opěrky'], z: 'Stojany a hlásiče', s: 'Feederová hrazda', st: /^(Feeder Hrazda|Rohatinka)\s*/i, u: 'je opěrka pro feederový prut.', t: 'Opěrka drží prut ve stabilní poloze a špička tak spolehlivě ukazuje záběry.', p: { 'Druh stojanu': ['Opěrka'] } },
 { m: /Doplňky k hlásičům/, c: [HS + ' > Doplňky k hlásičům'], z: 'Stojany a hlásiče', s: 'Doplněk k hlásiči', st: /^/, u: 'je doplněk k hlásičům a stojanům.', t: 'Rychlospojky a klipy usnadní stavbu a skládání stojanu.' },
 { m: /Hlásiče elektronické/, c: [HS + ' > Hlásiče záběru'], z: 'Stojany a hlásiče', s: 'Hlásič záběru', st: /^(\dx\s*)?(Hlásič|Sada Hlásičů)\s*(Bite Alarm\s*)?/i, u: 'je elektronický hlásič záběru.', t: 'Hlásič zvukově i světelně upozorní na každý pohyb vlasce, takže záběr nepropásnete ani v noci.' },
 { m: /Indikátory/, c: [HS + ' > Swingery'], z: 'Stojany a hlásiče', s: 'Indikátor záběru', st: /^(Indikátor Záběru|Indikátor|Indicator|Náhradní Závaží|Řetízkový Indikátor)\s*/i, u: 'je indikátor záběru.', t: 'Indikátor vizuálně ukáže záběr a napne vlasec pro hlásič.', barvaSw: true },
 { m: /STOJANY A SIGNALIZÁTORY > Hrazdy|Vidličky/, c: [HS + ' > Vidličky a hrazdy'], z: 'Stojany a hlásiče', s: 'Vidlička', st: /^(Hrazda|Vidlička|Nerezová Vidlička|Zavrtávací vidlička|Stabilizátor Vidličky)\s*/i, u: 'je stojanový díl pro uložení prutů.', t: 'Pevná konstrukce udrží pruty stabilně i v tvrdé zemi.', p: { 'Druh stojanu': ['Vidlička'] } },
 { m: /Rohatinky/, c: [HS + ' > Rohatinky'], z: 'Stojany a hlásiče', s: 'Rohatinka', st: /^(Magnetická Rohatinka|Rohatinka|Pojistka Prutu)\s*/i, u: 'je rohatinka pro uložení prutu.', t: 'Rohatinka bezpečně drží prut a nedovolí, aby ho ryba při záběru stáhla.', p: { 'Druh stojanu': ['Opěrka'] } },
 { m: /STOJANY A SIGNALIZÁTORY > Stojany/, c: [K + ' > Hlásiče a stojany > Stojany na pruty'], z: 'Stojany a hlásiče', s: 'Stojan na pruty', st: /^(Stojan|Rodmaster)\s*/i, u: 'je stojan na kaprové pruty.', t: 'Stojan udrží pruty stabilně i na betonu či kamenech a nastavitelné nohy se přizpůsobí terénu.' },
];

const ZN_UP = b => b.toUpperCase();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cd = s => '<![CDATA[' + String(s).replace(/]]>/g, ']]]]><![CDATA[>') + ']]>';
const cz = n => String(n).replace('.', ',');

function znacka(p) {
  let v = p.vyrobce || '';
  const n = p.zaklad;
  if (!v) { if (/^(ZFISH|Zfish)/.test(n)) v = 'ZFISH'; else if (/^Fil/i.test(n)) v = 'Filfishing'; else if (/^(EXC|Extra Carp)/i.test(n)) v = 'Extra Carp'; else if (/^Relax/.test(n)) v = 'Relax'; else if (/^NGT/.test(n)) v = 'NGT'; }
  if (/Relax/.test(n)) v = 'Relax';
  if (/^AP /.test(n)) v = 'Angling Pursuits';
  return ZNACKY[v.toUpperCase()] || v || 'Zfish';
}
function cistyModel(p, r) {
  let n = p.zaklad.replace(/\s+-\s+(TOTÁLNÍ VÝPRODEJ|AKCE 1\+1 ZDARMA!)/i, '').replace(/\s*1\+1 ZDARMA!?/i, '').replace(/\s*-\s*AKCE.*$/i, '')
    .replace(/\s*\+\s*([^+]*?)\s+Zdarma!*/gi, ' + $1').replace(/\s+Zdarma!+/gi, '').trim();
  n = n.replace(/^Vlasec\s+/, '').replace(PREFIX, '').replace(PREFIX, '');
  n = n.replace(/^(Asso|Extra Carp\s*-?)\s+/i, '');
  if (r.st) n = n.replace(r.st, '');
  n = n.replace(/^(FilFishing|Filfishing|Filex)\s+(?=Filex)/i, '');
  n = n.replace(/\s{2,}/g, ' ').trim();
  if (n && /^[a-zá-ž]/.test(n)) n = n[0].toUpperCase() + n.slice(1);
  return n;
}
function variantaText(p) {
  const v = p.vhodnota; if (!v) return '';
  const k = p.vparam;
  if (/Velikost Háčku|^Velikost$/.test(k) && /^\d+(\/0)?$/.test(v)) return 'vel. ' + v;
  if (k === 'Varianta') return 'barva ' + v;
  return v;
}
function cislo(s) { const m = String(s).match(/(\d+(?:[.,]\d+)?)/); return m ? m[1].replace('.', ',') : ''; }

// --- zpracování
const skup = {};
D.forEach(p => (skup[p.rodic] = skup[p.rodic] || []).push(p));
const out = [], prehled = [], novaKat = new Set(), nepravidlo = [];
for (const p of D) {
  const main = (p.kategorie || [])[0] || '';
  const r = R.find(x => (!x.m || x.m.test(main)) && (!x.n || x.n.test(p.zaklad)));
  if (!r) { nepravidlo.push(main + ' | ' + p.nazev); continue; }
  if (r.skryt) { prehled.push({ kod: p.kod, nazev: p.nazev, skryt: true }); continue; }
  const zn = znacka(p);
  const model = cistyModel(p, r);
  const varT = variantaText(p);
  const sourozenci = skup[p.rodic].length;
  const jeObl = !!r.vse;
  let nazev = (r.s + ' ' + zn + ' ' + model).replace(/\s+/g, ' ').trim();
  if (varT && !p.zaklad.toLowerCase().includes(p.vhodnota.toLowerCase())) nazev += ' ' + varT;
  // kategorie
  let typy = r.c.slice();
  if (r.vse) { const typ = r.c[0].split(' > ').slice(1).join(' > '); typy = [P, K, F, S].map(t => t + ' > ' + typ); }
  const kat = [];
  let hlavni = '';
  typy.forEach((t, i) => {
    let base;
    if (r.relax) base = t; else base = t + ' > ' + zn;
    let k = base;
    if (!r.relax && sourozenci >= 2 && !jeObl) k = base + ' > ' + model;
    const casti = k.split(' > ');
    for (let j = 1; j <= casti.length; j++) kat.push(casti.slice(0, j).join(' > '));
    if (i === 0) hlavni = k;
  });
  const znk = 'ZNAČKY > ' + ZN_UP(zn) + ' > ' + r.z;
  kat.push('ZNAČKY', 'ZNAČKY > ' + ZN_UP(zn), znk);
  const kategorie = [...new Set(kat)];
  kategorie.forEach(k => novaKat.add(k));
  // parametry
  const tech = [...new Set(typy.map(t => t.split(' > ')[0]))];
  const par = {};
  par['Druh lovu'] = (r.p && r.p['Druh lovu']) || tech.map(t => TECH[t]);
  par['Cílová ryba'] = (r.p && r.p['Cílová ryba']) || [...new Set(tech.flatMap(t => RYBY[t]))];
  if (r.p) for (const k in r.p) if (!par[k] || (k !== 'Druh lovu' && k !== 'Cílová ryba')) par[k] = r.p[k];
  const g = p.vparam === 'Gramáž' ? cislo(p.vhodnota) : (p.nazev.match(/(\d+(?:,\d+)?)\s?g\b/) || [])[1];
  if (r.zatez || (r.p && r.p['Druh krmítka'])) { if (g) par['Hmotnost zátěže v g'] = [g]; }
  if (r.jig) { const m = p.vhodnota.match(/^([\d,]+)\s*g\s*-\s*Háček\s*(\S+)/); if (m) { par['Hmotnost jigové hlavičky v g'] = [m[1]]; par['Velikost jigové hlavičky'] = ['#' + m[2]]; } }
  if (r.hacek && /^\d+(\/0)?$/.test(p.vhodnota)) par[r.hacek === 'velikost-jednohacku' ? 'Velikost jednoháčku' : 'Velikost trojháčku'] = ['#' + p.vhodnota];
  if (r.hacek && /bez protihrotu|BL\b/i.test(p.nazev)) par['Druh háčku'] = ['Jednoháček bez protihrotu'];
  const mm = p.nazev.match(/(\d+)\s?m\b(?!m)/); if ((r.vlasec || r.snura) && mm) par['Metráž v m'] = [mm[1]];
  if (r.vlasec && p.vparam === 'Průměr') { const d = p.vhodnota.match(/0[.,]\d+/); if (d) par['Průměr vlasce'] = [d[0].replace('.', ',') + ' mm']; }
  if (r.snura && p.vparam === 'Průměr') { const d = p.vhodnota.match(/0[.,]\d+/); if (d) par['Průměr šňůry'] = [d[0].replace('.', ',') + ' mm']; }
  if (r.navijak) { const v = p.nazev.match(/\b(\d{4,5})\b/); if (v) par['Velikost navijáku'] = [v[1].replace(/ /g, '')]; }
  if (r.prut) {
    const dm = p.nazev.match(/(\d+[.,]\d+)\s?m\b/); const ft = p.nazev.match(/(\d+)\s?ft/);
    const cm = dm ? Math.round(parseFloat(dm[1].replace(',', '.')) * 100) : ft ? Math.round(parseInt(ft[1]) * 30.48) : 0;
    if (cm) par['Délka prutu v cm'] = [String(cm)];
    const vz = p.nazev.match(/(\d+)\s?-\s?(\d+)\s?g/); if (vz) par['Vrhací zátěž [ g ]'] = [vz[1] + '-' + vz[2]];
    const lb = p.nazev.match(/(\d+(?:[.,]\d+)?)\s?lbs?\b/i); if (lb) par['Testovací křivka'] = [cz(lb[1]).replace(/,0+$/, '') + ' lb'];
  }
  if (r.prichut && p.vparam === 'Příchuť') par['Příchuť'] = [p.vhodnota];
  if (r.barvaSw && p.vparam === 'Barva') par['Barva swingeru'] = [p.vhodnota];
  if (r.obl) par['Druh oblečení'] = [/Kšiltovka/.test(p.zaklad) ? 'kšiltovka' : /SPODKY/.test(p.zaklad) ? 'termokalhoty' : r.obl];
  if (r.vel && p.vparam === 'Velikost') par[r.vel] = [p.vhodnota];
  // popisky
  const ks = (p.nazev.match(/(\d+)\s?(ks|pcs)\b/i) || [])[1];
  const radky = [['značka', zn], ['model', model]];
  if (p.vparam && p.vhodnota) radky.push([p.vparam.toLowerCase(), p.vhodnota]);
  if (ks) radky.push(['počet kusů v balení', ks]);
  radky.push(['určení', par['Druh lovu'].join(', ').toLowerCase()]);
  const tab = radky.map(([a, b]) => `<tr><td><strong>${esc(a)}:</strong></td><td>${esc(b)}</td></tr>`).join('');
  const uvod = `${zn} ${model} ${r.u}`;
  const kratky = `<p>${esc(uvod)}</p><table border="2" cellspacing="2" cellpadding="2"><tbody>${tab}</tbody></table>`;
  let pd = (p.popis || '').replace(/<table[\s\S]*?<\/table>/gi, '').replace(/<img[^>]*>/gi, '').replace(/<\/?(div|span|font|a)[^>]*>/gi, '')
    .replace(/<h\d[^>]*>/gi, '<p><strong>').replace(/<\/h\d>/gi, '</strong></p>').replace(/<br\s*\/?>\s*(<br\s*\/?>\s*)*/gi, '</p><p>')
    .replace(/(Prezentační|Video)[^<]*video[^<]*/gi, '').replace(/<p>\s*(&nbsp;|\s)*<\/p>/gi, '').replace(/\s+/g, ' ').trim();
  if (pd && !/^<(p|ul|ol)/.test(pd)) pd = '<p>' + pd + '</p>';
  const txt = h => h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').length;
  let dlouhy = pd + `<p>${esc(r.t)}</p>`;
  const cilD = Math.max(300, 2 * txt(kratky) + 20);
  if (txt(dlouhy) < cilD) dlouhy += `<p>${esc(`Produkt ${zn} ${model} se uplatní při lovu technikou ${par['Druh lovu'].join(', ').toLowerCase()}. Na prodejně Moje přívlač v Písku vám rádi poradíme s výběrem i sestavením montáže.`)}</p>`;
  if (txt(dlouhy) < cilD && sourozenci > 1) dlouhy += `<p>${esc(`Model ${model} nabízíme ve více provedeních (${skup[p.rodic].map(x => x.vhodnota).filter(Boolean).join(', ')}), vyberte si podle podmínek a cílové ryby.`)}</p>`;
  if (txt(dlouhy) < cilD) dlouhy += `<p>${esc(`Značka ${zn} vyvíjí vybavení ve spolupráci se zkušenými rybáři a klade důraz na spolehlivost a dobrý poměr ceny a kvality. Všechny produkty máme skladem a odesíláme obratem.`)}</p>`;
  const vid = p.sklad > 0 && p.fotky > 0;
  prehled.push({ kod: p.kod, nazev, hlavni, vid, kratky: txt(kratky), dlouhy: txt(dlouhy) });
  const ip = Object.entries(par).filter(([k, v]) => v && v.length).map(([k, v]) => `<INFORMATION_PARAMETER><NAME>${cd(k)}</NAME>${v.map(x => `<VALUE>${cd(x)}</VALUE>`).join('')}</INFORMATION_PARAMETER>`).join('');
  const seoT = `${nazev} | Moje přívlač`, meta = `${nazev}. Originál ${zn}, nákup online i na prodejně v Písku.`.slice(0, 160);
  out.push(`<SHOPITEM><CODE>${esc(p.kod)}</CODE><NAME>${cd(nazev)}</NAME><SHORT_DESCRIPTION>${cd(kratky)}</SHORT_DESCRIPTION><DESCRIPTION>${cd(dlouhy)}</DESCRIPTION><MANUFACTURER>${esc(ZN_UP(zn) === 'ZFISH' ? 'ZFISH' : zn)}</MANUFACTURER><CATEGORIES>${kategorie.map(k => `<CATEGORY>${cd(k)}</CATEGORY>`).join('')}<DEFAULT_CATEGORY>${cd(hlavni)}</DEFAULT_CATEGORY></CATEGORIES><INFORMATION_PARAMETERS>${ip}</INFORMATION_PARAMETERS><FLAGS><FLAG><CODE>new</CODE><VALID_UNTIL>${NOVINKA}</VALID_UNTIL></FLAG></FLAGS><VISIBILITY>${vid ? 'visible' : 'hidden'}</VISIBILITY><SEO_TITLE>${cd(seoT)}</SEO_TITLE><META_DESCRIPTION>${cd(meta)}</META_DESCRIPTION></SHOPITEM>`);
}
return { xml: '<?xml version="1.0" encoding="utf-8"?>\n<SHOP>\n' + out.join('\n') + '\n</SHOP>\n', prehled, kategorie: [...novaKat].sort(), nepravidlo };
}
