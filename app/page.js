"use client";

import { useEffect, useState } from "react";

/* ====== Société ECO PUMP AFRIK (en-tête officiel) ====== */
const COMPANY = {
  name: "Eco Pump AFRIK",
  phone: "+225 0707806359",
  mail: "ouanlo.ouattara@ecopumpafrik.com",
  addr: "Cocody - Angré 7e Tranche",
  web: "www.ecopumpafrik.com",
  legal:
    "SARL U au Capital de 1 000 000 F CFA -  Siège Social : Cocody Angré 7e Tranche - Tel/FAX : 0707806359   N° RCCM : CI-ABJ-03-2025-B13-01148   N°CC : 2502156E - ECOBANK N° CI059 01010 122345076001 80 - E-mail : ouanlo.ouattara@ecopumpafrik.com - Site WEB : www.ecopumpafrik.com",
};

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
const fmt = (n) => (Math.round(n) || 0).toLocaleString("fr-FR").replace(/ /g, " ");
const today = () => new Date().toISOString().slice(0, 10);
const stamp = () => {
  const d = new Date();
  return ("0" + d.getDate()).slice(-2) + ("0" + (d.getMonth() + 1)).slice(-2) + String(d.getFullYear()).slice(-2);
};
const frDate = (iso) => { if (!iso) return ""; const [y, m, d] = iso.split("-"); return d + "/" + m + "/" + y; };
const newItem = () => ({ code: "", ref: "", desig: "", dcode: "", delai: "", qte: 1, pu: 0 });

const blank = () => ({
  type: "DEVIS",
  number: "DV-" + stamp() + "-001",
  date: today(),
  currency: "F CFA",
  regime: "TEE", // "TEE" = Taxe d'État de l'Entreprenant (sans TVA) · "TVA" = assujetti (18%)
  tva: 18,
  client: { name: "", contact: "", phone: "" },
  items: [newItem()],
  modal: { delai: "Voir différents items", paiement: "60% Acompte - Solde à la Livraison" },
  note: "Nos commandes se veulent fermes et irrévocables",
});

const SAMPLE = {
  type: "DEVIS",
  number: "DV-300625-001",
  date: "2025-06-30",
  currency: "F CFA",
  regime: "TVA",
  tva: 18,
  client: { name: "BA-HYDRO", contact: "M. COULIBALY", phone: "+226 55203454" },
  modal: { delai: "Voir différents items", paiement: "60% Acompte - Solde à la Livraison" },
  note: "Nos commandes se veulent fermes et irrévocables",
  items: [
    { code: "A1", ref: "DWK", desig: "Pompe GRUNDFOS DWK.E.10.150.220.5.1D.R", dcode: "96922748", delai: "6-7 Mois", qte: 1, pu: 13885000 },
    { code: "A2", ref: "KIT_GM", desig: "Kit Garniture mécanique DWK", dcode: "96884177", delai: "3-4 Mois", qte: 1, pu: 485000 },
    { code: "A3", ref: "Kit_Pal", desig: "Kit Palier DWK", dcode: "96884331", delai: "", qte: 1, pu: 380000 },
    { code: "B2", ref: "DMX", desig: "Pompe Doseuse GRUNDFOS DMX 190-10 B-PVC/V/C-X-E1U3U3XEMAG", dcode: "99773483", delai: "3-4 Mois", qte: 2, pu: 2625000 },
  ],
};

export default function Page() {
  const [S, setS] = useState(blank());
  const [ready, setReady] = useState(false);

  // charge le brouillon sauvegardé (par navigateur)
  useEffect(() => {
    try {
      const r = localStorage.getItem("ecopump_doc");
      if (r) setS(JSON.parse(r));
    } catch (e) {}
    setReady(true);
  }, []);

  // sauvegarde auto
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("ecopump_doc", JSON.stringify(S)); } catch (e) {}
  }, [S, ready]);

  const up = (patch) => setS((s) => ({ ...s, ...patch }));
  const upClient = (k, v) => setS((s) => ({ ...s, client: { ...s.client, [k]: v } }));
  const upModal = (k, v) => setS((s) => ({ ...s, modal: { ...s.modal, [k]: v } }));
  const setItem = (i, k, v) =>
    setS((s) => {
      const items = s.items.map((it, j) =>
        j === i ? { ...it, [k]: k === "qte" || k === "pu" ? parseFloat(v) || 0 : v } : it
      );
      return { ...s, items };
    });
  const addItem = () => setS((s) => ({ ...s, items: [...s.items, newItem()] }));
  const delItem = (i) =>
    setS((s) => {
      const items = s.items.filter((_, j) => j !== i);
      return { ...s, items: items.length ? items : [newItem()] };
    });

  const isTEE = S.regime === "TEE";
  const sub = S.items.reduce((a, it) => a + it.qte * it.pu, 0);
  const tva = isTEE ? 0 : sub * (S.tva / 100);
  const ttc = sub + tva;
  const cur = S.currency || "F CFA";
  const lettres =
    titre(enLettres(ttc)) + " " + (cur.replace("F CFA", "Francs CFA").replace("FCFA", "Francs CFA") || "Francs CFA");

  return (
    <>
      <header className="appbar no-print">
        <div className="brand">ECO PUMP AFRIK<span>Devis & Factures</span></div>
        <div className="sp" />
        <button onClick={() => setS(JSON.parse(JSON.stringify(SAMPLE)))}>Exemple</button>
        <button onClick={() => setS(blank())}>Nouveau</button>
        <button className="primary" onClick={() => window.print()}>Imprimer / PDF</button>
      </header>

      <div className="wrap">
        {/* ========== Éditeur ========== */}
        <section className="panel no-print" aria-label="Éditeur">
          <h2>Document</h2>
          <div className="seg" role="group" aria-label="Type de document">
            <button aria-pressed={S.type === "DEVIS"} onClick={() => up({ type: "DEVIS" })}>Devis</button>
            <button aria-pressed={S.type === "FACTURE"} onClick={() => up({ type: "FACTURE" })}>Facture</button>
          </div>
          <div className="row2">
            <div className="fld"><label htmlFor="num">Numéro</label>
              <input id="num" value={S.number} onChange={(e) => up({ number: e.target.value })} /></div>
            <div className="fld"><label htmlFor="date">Date</label>
              <input id="date" type="date" value={S.date} onChange={(e) => up({ date: e.target.value })} /></div>
          </div>

          <h2 style={{ marginTop: 6 }}>Client — Facturer à</h2>
          <div className="fld"><label htmlFor="cnm">Nom / Société</label>
            <input id="cnm" value={S.client.name} onChange={(e) => upClient("name", e.target.value)} /></div>
          <div className="row2">
            <div className="fld"><label htmlFor="cct">Contact</label>
              <input id="cct" value={S.client.contact} onChange={(e) => upClient("contact", e.target.value)} /></div>
            <div className="fld"><label htmlFor="cph">Téléphone</label>
              <input id="cph" value={S.client.phone} onChange={(e) => upClient("phone", e.target.value)} /></div>
          </div>

          <h2 style={{ marginTop: 6 }}>Articles</h2>
          <div className="items">
            {S.items.map((it, i) => (
              <div className="item" key={i}>
                <div className="top">
                  <input value={it.code} placeholder="Item" aria-label="Item" onChange={(e) => setItem(i, "code", e.target.value)} />
                  <input value={it.ref} placeholder="Référence" aria-label="Réf" onChange={(e) => setItem(i, "ref", e.target.value)} />
                  <button className="del" title="Supprimer" onClick={() => delItem(i)}>×</button>
                </div>
                <div className="fld" style={{ margin: "0 0 8px" }}>
                  <span className="lbl">Désignation</span>
                  <input value={it.desig} placeholder="Désignation de l'article" onChange={(e) => setItem(i, "desig", e.target.value)} />
                </div>
                <div className="grid3" style={{ marginBottom: 8 }}>
                  <div><span className="lbl">Code</span>
                    <input value={it.dcode} onChange={(e) => setItem(i, "dcode", e.target.value)} /></div>
                  <div><span className="lbl">Qté</span>
                    <input type="number" value={it.qte} onChange={(e) => setItem(i, "qte", e.target.value)} /></div>
                  <div><span className="lbl">Délai</span>
                    <input value={it.delai} onChange={(e) => setItem(i, "delai", e.target.value)} /></div>
                </div>
                <div><span className="lbl">Prix unitaire HT</span>
                  <input type="number" value={it.pu} onChange={(e) => setItem(i, "pu", e.target.value)} /></div>
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
          <div className="row2">
            {!isTEE ? (
              <div className="fld"><label htmlFor="tva">TVA (%)</label>
                <input id="tva" type="number" step="0.1" value={S.tva} onChange={(e) => up({ tva: parseFloat(e.target.value) || 0 })} /></div>
            ) : null}
            <div className="fld"><label htmlFor="dev">Devise</label>
              <input id="dev" value={S.currency} onChange={(e) => up({ currency: e.target.value })} /></div>
          </div>
          <div className="fld"><label htmlFor="deliv">Délai de livraison</label>
            <input id="deliv" value={S.modal.delai} onChange={(e) => upModal("delai", e.target.value)} /></div>
          <div className="fld"><label htmlFor="pay">Mode de paiement</label>
            <input id="pay" value={S.modal.paiement} onChange={(e) => upModal("paiement", e.target.value)} /></div>
          <div className="fld"><label htmlFor="note">Note</label>
            <input id="note" value={S.note} onChange={(e) => up({ note: e.target.value })} /></div>
        </section>

        {/* ========== Document A4 ========== */}
        <section className="stage" aria-label="Aperçu du document">
          <article className="paper">
            <div className="phead">
              <div>
                <div className="logo"><img src="/logo.png" alt="ECO PUMP AFRIK" /></div>
                <div className="contact">
                  <div className="cn">{COMPANY.name}</div>
                  <div className="ci"><img src="/icon-phone.png" alt="" />{COMPANY.phone}</div>
                  <div className="ci"><img src="/icon-mail.png" alt="" />{COMPANY.mail}</div>
                  <div className="ci"><span className="dot">⬤</span>{COMPANY.addr}</div>
                  <div className="ci"><span className="dot">🌐</span>{COMPANY.web}</div>
                </div>
              </div>
              <div className="titlebox">
                <div className="dt">{S.type}</div>
                <div className="meta">
                  <div><b>N°</b><span>{S.number}</span></div>
                  <div><b>Date</b><span>{frDate(S.date)}</span></div>
                </div>
              </div>
            </div>

            <div className="billbar">
              <div />
              <div className="billto">
                <div className="h">{S.type === "FACTURE" ? "Facturer à :" : "Devis pour :"}</div>
                <div className="b">
                  <div className="nm">{S.client.name || "—"}</div>
                  {S.client.contact ? <div>{S.client.contact}</div> : null}
                  {S.client.phone ? <div>{S.client.phone}</div> : null}
                </div>
              </div>
            </div>

            <table className="lines">
              <thead>
                <tr>
                  <th className="c" style={{ width: "7%" }}>Item</th>
                  <th style={{ width: "13%" }}>REF</th>
                  <th>Désignation</th>
                  <th className="c" style={{ width: "7%" }}>Qté</th>
                  <th className="num" style={{ width: "16%" }}>PU (HT)</th>
                  <th className="num" style={{ width: "16%" }}>TOTAL (HT)</th>
                </tr>
              </thead>
              <tbody>
                {S.items.map((it, i) => {
                  const mini = [it.dcode ? "Code : " + it.dcode : "", it.delai ? "Délai : " + it.delai : ""].filter(Boolean).join("   ·   ");
                  return (
                    <tr key={i}>
                      <td className="c"><span className="itcode">{it.code}</span></td>
                      <td>{it.ref}</td>
                      <td className="desig"><div className="nm">{it.desig}</div>{mini ? <div className="mini">{mini}</div> : null}</td>
                      <td className="c">{it.qte}</td>
                      <td className="num">{fmt(it.pu)}</td>
                      <td className="num">{fmt(it.qte * it.pu)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="totwrap">
              <div className="totals">
                {isTEE ? (
                  <div className="r ttc"><b>TOTAL À PAYER :</b><span>{fmt(ttc)} {cur}</span></div>
                ) : (
                  <>
                    <div className="r sub"><b>SOUS-TOTAL :</b><span>{fmt(sub)} {cur}</span></div>
                    <div className="r tva"><b>TVA ({S.tva}%) :</b><span>{fmt(tva)} {cur}</span></div>
                    <div className="r ttc"><b>TOTAL TTC :</b><span>{fmt(ttc)} {cur}</span></div>
                  </>
                )}
              </div>
            </div>
            <div className="enlettres"><b>Arrêté à la somme de :</b> {lettres}.</div>
            {isTEE ? (
              <div className="tee">Montant non assujetti à la TVA — régime de la Taxe d'État de l'Entreprenant (TEE).</div>
            ) : null}

            <div className="modal">
              <div className="mh">Modalités</div>
              <div className="mr"><b>Délai de livraison :</b><span>{S.modal.delai}</span></div>
              <div className="mr"><b>Mode de paiement :</b><span>{S.modal.paiement}</span></div>
            </div>
            {S.note ? <div className="note">{S.note}</div> : null}

            <div className="spacer" />
            <div className="pfoot">{COMPANY.legal}</div>
          </article>
        </section>
      </div>
    </>
  );
}
