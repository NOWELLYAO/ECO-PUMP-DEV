# Devis & Factures — ECO PUMP AFRIK

Application web qui génère des **devis** et **factures** avec l'en-tête officiel
**ECO PUMP AFRIK**, prête à déployer sur **Vercel** depuis **GitHub**.

## Fonctionnalités

- 🧾 Bascule **Devis / Facture** en un clic
- 🏢 En-tête officiel : logo, coordonnées, et pied de page légal (RCCM, N°CC, ECOBANK…)
- ➕ Articles illimités avec **Item / Référence / Désignation / Code / Délai / Qté / PU**
- 🧮 Calcul **automatique** du Sous-total, de la **TVA (18 %)** et du **Total TTC**
- 🔤 **Montant en lettres** généré automatiquement (français, règles CFA)
- 🖨️ Bouton **Imprimer / PDF** → format **A4** propre (via « Enregistrer au format PDF » de votre navigateur)
- 💾 Sauvegarde automatique du brouillon dans le navigateur
- 🌙 Interface claire/sombre (le document reste toujours une feuille blanche)

---

## 🚀 Déploiement sur Vercel (le plus simple)

### Étape 1 — Mettre le code sur GitHub

1. Créez un dépôt vide sur https://github.com/new (ex. `ecopump-devis`).
2. Dans ce dossier, lancez :

   ```bash
   git init
   git add .
   git commit -m "Application devis & factures ECO PUMP AFRIK"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/ecopump-devis.git
   git push -u origin main
   ```

### Étape 2 — Déployer sur Vercel

1. Allez sur https://vercel.com et connectez-vous avec votre compte GitHub.
2. Cliquez **Add New… → Project**.
3. Sélectionnez le dépôt `ecopump-devis` → **Import**.
4. Vercel détecte **Next.js** tout seul : ne touchez à rien, cliquez **Deploy**.
5. Après ~1 minute, votre application est en ligne à une adresse du type
   `https://ecopump-devis.vercel.app` ✅

> À chaque `git push` sur `main`, Vercel redéploie automatiquement la nouvelle version.

---

## 💻 Lancer en local (pour tester ou modifier)

Prérequis : [Node.js 18+](https://nodejs.org).

```bash
npm install     # installe les dépendances
npm run dev     # démarre sur http://localhost:3000
```

Pour une version de production :

```bash
npm run build
npm run start
```

---

## 🖨️ Générer un PDF

1. Remplissez le devis / la facture.
2. Cliquez **Imprimer / PDF** en haut à droite.
3. Dans la boîte d'impression, choisissez **« Enregistrer au format PDF »**
   (laissez les marges sur *Aucune* pour un rendu A4 parfait).

---

## ✏️ Personnaliser l'en-tête

Toutes les informations de la société sont dans **`app/page.js`**, en haut,
dans l'objet `COMPANY` :

```js
const COMPANY = {
  name:  "Eco Pump AFRIK",
  phone: "+225 0707806359",
  mail:  "ouanlo.ouattara@ecopumpafrik.com",
  addr:  "Cocody - Angré 7e Tranche",
  web:   "www.ecopumpafrik.com",
  legal: "SARL U au Capital de 1 000 000 F CFA - …",
};
```

- **Logo** : remplacez `public/logo.png` par votre fichier (gardez le même nom).
- **TVA** : valeur par défaut `18`, modifiable pour chaque document.
- **Numérotation** : le préfixe `DV-JJMMAA-001` se génère tout seul ; éditable.

---

## 🗂️ Structure du projet

```
ecopump-devis/
├─ app/
│  ├─ layout.js      → page HTML + polices Google
│  ├─ page.js        → toute l'application (saisie + document + calculs)
│  └─ globals.css    → styles du document A4 + règles d'impression
├─ public/
│  ├─ logo.png       → logo ECO PUMP AFRIK
│  ├─ icon-phone.png
│  └─ icon-mail.png
├─ package.json
└─ next.config.mjs
```

---

Construit avec [Next.js](https://nextjs.org) 14. Aucune base de données requise :
tout tourne côté navigateur.
