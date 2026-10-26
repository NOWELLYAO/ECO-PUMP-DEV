"use client";

import { useEffect, useState } from "react";

/* ====== Société ECO PUMP AFRIK (en-tête officiel) ====== */
const COMPANY = {
  name: "Eco Pump AFRIK",
  phone: "+225 0707806359",
  mail: "ecopumpafrik2@gmail.com",
  addr: "Cocody - Angré 7e Tranche",
  web: "www.ecopumpafrik.com",
  legal:
    "SARL U au Capital de 1 000 000 F CFA -  Siège Social : Cocody Angré 7e Tranche - Tel/FAX : 0707806359   N° RCCM : CI-ABJ-03-2025-B13-01148   N°CC : 2502156E - ECOBANK N° CI059 01010 122345076001 80 - E-mail : ecopumpafrik2@gmail.com - Site WEB : www.ecopumpafrik.com",
};

/* ====== Propositions des listes déroulantes ====== */
const DELAIS = [
  "Disponible en stock",
  "1 Mois date Commande",
  "2-3 Mois date Commande",
  "3-4 Mois date Commande",
  "6-7 Mois date Commande",
  "Voir différents items",
  "Sur commande",
];
const PAIEMENTS = [
  "60% Acompte - Solde à la Livraison",
  "50% Acompte - Solde à la Livraison",
  "100% à la commande",
  "Paiement à la livraison",
  "30 jours fin de mois",
  "Virement bancaire",
  "Chèque",
  "Espèces",
];
const DEVISES = ["F CFA", "EUR", "USD"];

/* Menu déroulant avec option « Autre… » pour saisir une valeur libre */
function Combo({ label, id, options, value, onChange }) {
  const inList = options.includes(value);
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={inList ? value : "__autre__"}
        onChange={(e) => onChange(e.target.value === "__autre__" ? "" : e.target.value)}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
        <option value="__autre__">Autre (préciser)…</option>
      </select>
      {!inList ? (
        <input style={{ marginTop: 6 }} placeholder="Saisir votre texte…" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : null}
    </div>
  );
}

/* ====== Montant en lettres (français) ====== */
const U = ["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
function deux(n, plural) {
  if (n < 20) return U[n];
  const d = Math.floor(n / 10), u = n % 10;
  if (d === 7) return u === 1 ? "soixante et onze" : "soixante-" + U[10 + u];
  if (d === 9) return "quatre-vingt-" + U[10 + u];
  const t = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante", 8: "quatre-vingt" }[d];
  if (n === 80) return plural ? "quatre-vingts" : "quatre-vingt";
  if (u === 0) return t;
  if (u === 1 && d !== 8) return t + " et un";
  return t + "-" + U[u];
}
function trois(n, plural) {
  const c = Math.floor(n / 100), r = n % 100;
  if (c === 0) return deux(r, plural);
  const cent = c === 1 ? "cent" : U[c] + " cent";
  if (r === 0) return c > 1 && plural ? cent + "s" : cent;
  return cent + " " + deux(r, plural);
}
function enLettres(n) {
  n = Math.round(n);
  if (n === 0) return "zéro";
  const g = [];
  let x = n;
  while (x > 0) { g.push(x % 1000); x = Math.floor(x / 1000); }
  const parts = [];
  if (g[3]) parts.push((g[3] === 1 ? "un" : trois(g[3], true)) + (g[3] > 1 ? " milliards" : " milliard"));
  if (g[2]) parts.push((g[2] === 1 ? "un" : trois(g[2], true)) + (g[2] > 1 ? " millions" : " million"));
  if (g[1]) parts.push(g[1] === 1 ? "mille" : trois(g[1], false) + " mille");
  if (g[0]) parts.push(trois(g[0], true));
  return parts.join(" ").trim();
}
function titre(s) {
  return s.replace(/([a-zàâäéèêëïîôöùûüç])([a-zàâäéèêëïîôöùûüç']*)/gi, (m, a, b) => a.toUpperCase() + b);
}

/* ====== utilitaires ====== */
const money = (n) => (Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0, 10);
const frDate = (iso) => { if (!iso) return ""; const [y, m, d] = iso.split("-"); return d + "/" + m + "/" + y; };
const ddmmyy = (iso) => { if (!iso) return ""; const [y, m, d] = iso.split("-"); return d + m + y.slice(-2); };
const suffixFromName = (name) =>
  (name || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase();
const newItem = () => ({ ref: "", desig: "", qte: 1, pu: "", remise: "" });
const num = (v) => Number(v) || 0;

const blank = () => ({
  type: "DEVIS",
  date: today(),
  seq: 1,
  currency: "F CFA",
  regime: "TEE", // "TEE" = Taxe d'État de l'Entreprenant (sans TVA) · "TVA" = assujetti
  tva: 18,
  client: { name: "", contact: "", phone: "", cc: "", email: "" },
  items: [newItem()],
  modal: { delai: "2-3 Mois date Commande", paiement: "60% Acompte - Solde à la Livraison" },
  note: "Nos commandes se veulent fermes et irrévocables",
});

const SAMPLE = {
  type: "DEVIS",
  date: "2025-06-22",
  seq: 5,
  currency: "F CFA",
  regime: "TVA",
  tva: 18,
  client: { name: "RICD", contact: "DIARASSOUBA ALI", phone: "0708073434", cc: "", email: "" },
  modal: { delai: "2-3 Mois date Commande", paiement: "60% Acompte - Solde à la Livraison" },
  note: "Nos commandes se veulent fermes et irrévocables",
  items: [
    { ref: "98624258", desig: "Pompe SL1.50.65.30.2.50D.C", qte: 2, pu: 2100000, remise: 0 },
    { ref: "99369650", desig: "Coffret LC 231 2x 1-9 DOL 3x460 PI CE", qte: 1, pu: 630000, remise: 0 },
    { ref: "96090992", desig: "Pied d'assise Auto coupling set DN65 Cl.", qte: 2, pu: 327600, remise: 0 },
    { ref: "98989672", desig: "Chaine de levage Lift. chain 320kg 10m SS cert. cpl.", qte: 2, pu: 151200, remise: 0 },
    { ref: "62500014", desig: "Floteur Float switch set MS1 3pcs 10m + wallh", qte: 1, pu: 226800, remise: 0 },
    { ref: "91048889", desig: "Surpr Hydro Multi-E 2 CRE 15-4", qte: 1, pu: 10150000, remise: 0 },
    { ref: "92889532", desig: "Pompe ciculation simple CM3-5 A-R-I-E-AQQE C1-A-A-N", qte: 2, pu: 403200, remise: 0 },
    { ref: "92889531", desig: "Pompe ciculation simple CM3-5 A-R-I-E-AQQE C1-A-A-N", qte: 2, pu: 403200, remise: 0 },
  ],
};

export default function Page() {
  const [S, setS] = useState(blank());
  const [ready, setReady] = useState(false);
  const [stampTime, setStampTime] = useState("");
  const [library, setLibrary] = useState([]);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    try {
      const r = localStorage.getItem("ecopump_doc_v2");
      if (r) setS({ ...blank(), ...JSON.parse(r) });
      const lib = localStorage.getItem("ecopump_library_v1");
      if (lib) setLibrary(JSON.parse(lib));
    } catch (e) {}
    const d = new Date();
    setStampTime(("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("ecopump_doc_v2", JSON.stringify(S)); } catch (e) {}
  }, [S, ready]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("ecopump_library_v1", JSON.stringify(library)); } catch (e) {}
  }, [library, ready]);

  const up = (patch) => setS((s) => ({ ...s, ...patch }));
  const upClient = (k, v) => setS((s) => ({ ...s, client: { ...s.client, [k]: v } }));
  const upModal = (k, v) => setS((s) => ({ ...s, modal: { ...s.modal, [k]: v } }));
  // on stocke la saisie telle quelle (string) ; la conversion en nombre se fait au calcul,
  // ce qui permet de vider complètement un champ sans qu'un 0 ne revienne.
  const setItem = (i, k, v) =>
    setS((s) => {
      const items = s.items.map((it, j) => (j === i ? { ...it, [k]: v } : it));
      return { ...s, items };
    });
  const addItem = () => setS((s) => ({ ...s, items: [...s.items, newItem()] }));
  const delItem = (i) =>
    setS((s) => {
      const items = s.items.filter((_, j) => j !== i);
      return { ...s, items: items.length ? items : [newItem()] };
    });

  const isTEE = S.regime === "TEE";
  const lineTotal = (it) => num(it.qte) * num(it.pu) * (1 - num(it.remise) / 100);
  const sub = S.items.reduce((a, it) => a + lineTotal(it), 0);
  const tva = isTEE ? 0 : sub * (num(S.tva) / 100);
  const ttc = sub + tva;
  const cur = S.currency || "F CFA";
  const suffix = suffixFromName(S.client.name);
  const number =
    (S.type === "FACTURE" ? "FACT" : "DEV") + "-" + ddmmyy(S.date) + "-" + String(S.seq).padStart(2, "0") + (suffix ? "-" + suffix : "");

  // Le nom de fichier proposé à l'impression = titre de l'onglet. On met le n° du
  // document juste avant d'imprimer, puis on rétablit le titre normal ensuite.
  useEffect(() => {
    const base = "Devis & Factures — ECO PUMP AFRIK";
    const onBefore = () => { document.title = number; };
    const onAfter = () => { document.title = base; };
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);
    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
    };
  }, [number]);
  const lettres =
    titre(enLettres(ttc)) + " " + (cur.replace("F CFA", "Francs CFA").replace("FCFA", "Francs CFA") || "Francs CFA");

  // ----- Bibliothèque de documents (enregistrés dans ce navigateur) -----
  const flashMsg = (m) => { setFlash(m); setTimeout(() => setFlash(""), 1800); };
  const saveToLibrary = () => {
    const entry = { id: Date.now(), number, type: S.type, date: S.date, client: S.client.name, total: ttc, doc: S };
    setLibrary((lib) => {
      const i = lib.findIndex((e) => e.number === number);
      if (i >= 0) { const c = [...lib]; c[i] = { ...entry, id: lib[i].id }; return c; }
      return [entry, ...lib];
    });
    flashMsg("Enregistré ✓");
  };
  const openEntry = (e) => { setS({ ...blank(), ...e.doc }); flashMsg("Document ouvert"); };
  const delEntry = (id) => setLibrary((lib) => lib.filter((e) => e.id !== id));
  const exportLib = () => {
    try {
      const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "ecopump_sauvegarde.json"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {}
  };
  const importLib = (file) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (Array.isArray(data)) {
          setLibrary((prev) => {
            const map = new Map(prev.map((e) => [e.number, e]));
            data.forEach((e) => map.set(e.number, e));
            return [...map.values()];
          });
          flashMsg("Sauvegarde importée ✓");
        }
      } catch (e) { flashMsg("Fichier invalide"); }
    };
    r.readAsText(file);
  };

  return (
    <>
      <header className="appbar no-print">
        <div className="brand">ECO PUMP AFRIK<span>Devis & Factures</span></div>
        <div className="sp" />
        {flash ? <span className="flash">{flash}</span> : null}
        <button onClick={() => setS(blank())}>Nouveau</button>
        <button onClick={saveToLibrary}>💾 Enregistrer</button>
        <button className="primary" onClick={() => { document.title = number; window.print(); }}>Imprimer / PDF</button>
      </header>

      <div className="wrap">
        {/* ========== Éditeur ========== */}
        <section className="panel no-print" aria-label="Éditeur">
          <h2>Documents enregistrés <em>({library.length})</em></h2>
          {library.length === 0 ? (
            <p className="sub">Aucun document enregistré. Cliquez « 💾 Enregistrer » en haut pour garder le document en cours et le rouvrir plus tard.</p>
          ) : (
            <div className="lib">
              {library.map((e) => (
                <div className="librow" key={e.id}>
                  <button className="libopen" onClick={() => openEntry(e)} title="Ouvrir ce document">
                    <b>{e.number}</b><span>{(e.client || "—")} · {frDate(e.date)}</span>
                  </button>
                  <button className="libdel" onClick={() => delEntry(e.id)} title="Supprimer">×</button>
                </div>
              ))}
            </div>
          )}
          <div className="tools">
            <button onClick={exportLib}>Exporter la sauvegarde</button>
            <label className="imp">Importer
              <input type="file" accept="application/json" hidden onChange={(e) => e.target.files[0] && importLib(e.target.files[0])} />
            </label>
          </div>

          <h2 style={{ marginTop: 18 }}>Document</h2>
          <div className="seg" role="group" aria-label="Type de document">
            <button aria-pressed={S.type === "DEVIS"} onClick={() => up({ type: "DEVIS" })}>Devis</button>
            <button aria-pressed={S.type === "FACTURE"} onClick={() => up({ type: "FACTURE" })}>Facture</button>
          </div>
          <div className="fld">
            <label htmlFor="num">Numéro (généré automatiquement)</label>
            <input id="num" value={number} readOnly className="ro" />
          </div>
          <div className="row2">
            <div className="fld"><label htmlFor="date">Date</label>
              <input id="date" type="date" value={S.date} onChange={(e) => up({ date: e.target.value })} /></div>
            <div className="fld"><label htmlFor="seq">N° séquence</label>
              <input id="seq" type="number" min="1" value={S.seq} onChange={(e) => up({ seq: e.target.value })} /></div>
          </div>

          <h2 style={{ marginTop: 6 }}>Client — Facturer à</h2>
          <div className="fld"><label htmlFor="cnm">Nom / Société <em>(→ suffixe {suffix || "…"})</em></label>
            <input id="cnm" value={S.client.name} onChange={(e) => upClient("name", e.target.value)} /></div>
          <div className="row2">
            <div className="fld"><label htmlFor="cct">Contact</label>
              <input id="cct" value={S.client.contact} onChange={(e) => upClient("contact", e.target.value)} /></div>
            <div className="fld"><label htmlFor="cph">Téléphone</label>
              <input id="cph" value={S.client.phone} onChange={(e) => upClient("phone", e.target.value)} /></div>
          </div>
          <div className="row2">
            <div className="fld"><label htmlFor="ccc">Numéro CC</label>
              <input id="ccc" value={S.client.cc} onChange={(e) => upClient("cc", e.target.value)} /></div>
            <div className="fld"><label htmlFor="cem">E-mail</label>
              <input id="cem" value={S.client.email} onChange={(e) => upClient("email", e.target.value)} /></div>
          </div>

          <h2 style={{ marginTop: 6 }}>Articles <em>(n° Item auto : 10, 20, 30…)</em></h2>
          <div className="items">
            {S.items.map((it, i) => (
              <div className="item" key={i}>
                <div className="top">
                  <span className="ix">{(i + 1) * 10}</span>
                  <input value={it.ref} placeholder="Référence" aria-label="Réf" onChange={(e) => setItem(i, "ref", e.target.value)} />
                  <button className="del" title="Supprimer" onClick={() => delItem(i)}>×</button>
                </div>
                <div className="fld" style={{ margin: "0 0 8px" }}>
                  <span className="lbl">Désignation</span>
                  <input value={it.desig} placeholder="Désignation de l'article" onChange={(e) => setItem(i, "desig", e.target.value)} />
                </div>
                <div className="grid3">
                  <div><span className="lbl">Qté</span>
                    <input type="number" step="0.01" value={it.qte} onChange={(e) => setItem(i, "qte", e.target.value)} /></div>
                  <div><span className="lbl">Prix unitaire HT</span>
                    <input type="number" value={it.pu} onChange={(e) => setItem(i, "pu", e.target.value)} /></div>
                  <div><span className="lbl">Remise %</span>
                    <input type="number" step="0.1" value={it.remise} onChange={(e) => setItem(i, "remise", e.target.value)} /></div>
                </div>
              </div>
            ))}
          </div>
          <button className="addbtn" onClick={addItem}>+ Ajouter un article</button>

          <h2 style={{ marginTop: 16 }}>Totaux & modalités</h2>
          <div className="fld"><label htmlFor="reg">Régime fiscal</label>
            <select id="reg" value={S.regime} onChange={(e) => up({ regime: e.target.value })}>
              <option value="TEE">Taxe d'État de l'Entreprenant (sans TVA)</option>
              <option value="TVA">Assujetti à la TVA</option>
            </select></div>
          {!isTEE ? (
            <div className="fld"><label htmlFor="tva">TVA (%)</label>
              <input id="tva" type="number" step="0.1" value={S.tva} onChange={(e) => up({ tva: e.target.value })} /></div>
          ) : null}
          <Combo label="Devise" id="dev" options={DEVISES} value={S.currency} onChange={(v) => up({ currency: v })} />
          <Combo label="Délai de livraison" id="deliv" options={DELAIS} value={S.modal.delai} onChange={(v) => upModal("delai", v)} />
          <Combo label="Mode de paiement" id="pay" options={PAIEMENTS} value={S.modal.paiement} onChange={(v) => upModal("paiement", v)} />
          <div className="fld"><label htmlFor="note">Note</label>
            <input id="note" value={S.note} onChange={(e) => up({ note: e.target.value })} /></div>
        </section>

        {/* ========== Document A4 ========== */}
        <section className="stage" aria-label="Aperçu du document">
          <article className="paper">
            <div className="topdate">{frDate(S.date)} {stampTime}</div>

            <div className="phead">
              <div className="pleft">
                <div className="logo"><img src="/logo.png" alt="ECO PUMP AFRIK" /></div>
                <div className="cname">{COMPANY.name}</div>
                <div className="contacts">
                  <div className="ci"><img src="/icon-phone.png" alt="" />{COMPANY.phone}</div>
                  <div className="ci"><img src="/icon-mail.png" alt="" />{COMPANY.mail}</div>
                  <div className="ci"><span className="badge">◉</span>{COMPANY.addr}</div>
                  <div className="ci"><span className="badge">@</span><span className="link">{COMPANY.web}</span></div>
                </div>
              </div>

              <div className="pright">
                <div className="dt">{S.type}</div>
                <div className="dnum">{number}</div>
                <div className="billto">
                  <div className="h">{S.type === "FACTURE" ? "Facturer À :" : "Devis pour :"}</div>
                  <div className="nm">{S.client.name || "—"}</div>
                  {S.client.phone ? <div className="link">{S.client.phone}</div> : null}
                  {S.client.cc ? <div>N°CC : {S.client.cc}</div> : null}
                  {S.client.contact ? <div>{S.client.contact}</div> : null}
                  {S.client.email ? <div>{S.client.email}</div> : null}
                </div>
              </div>
            </div>

            <table className="lines">
              <thead>
                <tr>
                  <th className="c" style={{ width: "6%" }}>Item</th>
                  <th style={{ width: "13%" }}>REF</th>
                  <th>Désignation</th>
                  <th className="num" style={{ width: "8%" }}>Qté</th>
                  <th className="num" style={{ width: "15%" }}>PU (HT)</th>
                  <th className="c" style={{ width: "6%" }}>R</th>
                  <th className="num" style={{ width: "16%" }}>TOTAL (HT)</th>
                </tr>
              </thead>
              <tbody>
                {S.items.map((it, i) => (
                  <tr key={i}>
                    <td className="c">{(i + 1) * 10}</td>
                    <td>{it.ref}</td>
                    <td>{it.desig}</td>
                    <td className="num">{money(it.qte)}</td>
                    <td className="num">{money(it.pu)}</td>
                    <td className="c">{it.remise ? it.remise + "%" : ""}</td>
                    <td className="num">{money(lineTotal(it))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="midrow">
              <div className="modalites">
                <div className="mh">Modalités</div>
                <div className="mr"><b>Délai de livraison :</b> <i>{S.modal.delai}</i></div>
                <div className="mr"><b>Mode de payement :</b> <i>{S.modal.paiement}</i></div>
                {S.note ? <div className="note">{S.note}</div> : null}
              </div>

              <div className="totals">
                {isTEE ? (
                  <div className="r ttc"><b>TOTAL À PAYER :</b><span>{money(ttc)}</span></div>
                ) : (
                  <>
                    <div className="r"><b>SOUS-TOTAL :</b><span>{money(sub)}</span></div>
                    <div className="r"><b>TVA ({S.tva}%) :</b><span>{money(tva)}</span></div>
                    <div className="r ttc"><b>TOTAL TTC :</b><span>{money(ttc)}</span></div>
                  </>
                )}
              </div>
            </div>

            <div className="lettres">{lettres}</div>
            {isTEE ? (
              <div className="tee">Montant non assujetti à la TVA — régime de la Taxe d'État de l'Entreprenant (TEE).</div>
            ) : null}

            <div className="spacer" />
            <div className="footlogo"><img src="/logo.png" alt="" /></div>
            <div className="pfoot">{COMPANY.legal}</div>
          </article>
        </section>
      </div>
    </>
  );
}
