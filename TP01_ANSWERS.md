# TP01 - Landing page Novis — Réalisations et réponses

Ce fichier récapitule les modifications appliquées au projet, la couverture des consignes du TP et répond aux questions techniques demandées.

## 1) Checklist des modifications appliquées
- Structure de fichiers organisée (CSS importé depuis `css/main.css`)
  - `css/main.css` centralise les imports : `layout/header.css`, `layout/footer.css`, `components/buttons.css`, `components/cards.css`, `components/tables.css`.
- HTML sémantique et accessible
  - `header`, `main`, `section`, `article`, `aside`, `footer` utilisés.
  - Navigation avec `role="navigation"` et `aria-label`.
  - Attributs `aria-label` et `aria-labelledby` présents pour des sections/clés (dashboard, tableau, graphique).
- Hero
  - `#Title` (hero) occupe ~80vh (`min-h-[80vh]`) et utilise une typographie fluide via `clamp()` (`.hero-title`).
- Section `details`
  - Carte translucide (glass) avec bord arrondi, titre centré et trois cartes alignées et responsives.
- Dashboard preview
  - Grille CSS avec `grid-template-areas` : solde total, graphique, transactions.
  - Graphique en pur CSS (placeholder `conic-gradient`) et mini bar-chart CSS.
  - Tableau HTML structuré (`thead`, `tbody`, `tfoot`) avec couleurs pour variations (positif/negatif).
- Styles
  - Palette sobre/indigo, variables CSS dans `:root` (charte), support `prefers-color-scheme: light`.
  - Composants (buttons, cards, tables) séparés dans `css/components`.
- Performance / SEO / accessibilité
  - Images importantes reçoivent `width`/`height` et `loading` (`eager` pour logo, `lazy` pour illustration) pour limiter le CLS.
  - `link rel="stylesheet"` unique sur `css/main.css`.

## 2) Fichiers ajoutés / modifiés
- Modifiés :
  - `index.html` — structure sémantique, hero, details, dashboard, attributs ARIA, images avec width/height.
  - `css/main.css` — imports et règles globales (variables, clamp, grid areas, theme light).
- Ajoutés :
  - `css/layout/header.css`, `css/layout/footer.css`
  - `css/components/buttons.css`, `css/components/cards.css`, `css/components/tables.css`
  - `css/input.css` (si tu veux builder Tailwind localement)
  - `TP01_ANSWERS.md` (ce fichier)

## 3) Réponses techniques demandées
### Q: Expliquez ce qu’est le Layout Shift.
Le Layout Shift (Cumulative Layout Shift, CLS) mesure les déplacements inattendus de contenu à l'écran pendant le chargement d'une page. Par exemple, si une image sans dimension pousse du texte vers le bas lorsqu'elle charge, l'utilisateur subit un « shift ». Pour l'éviter, il faut réserver l'espace des éléments (définir `width`/`height` ou utiliser des placeholders), charger les polices correctement (font-display), et minimiser les injections DOM tardives.

### Q: À quoi sert `aria-label` ?
`aria-label` fournit une étiquette lisible par les technologies d'assistance (lecteurs d'écran) pour des éléments qui n'ont pas de texte visible ou quand le texte visible n'est pas descriptif. Cela améliore l'accessibilité en expliquant la fonction d'un bouton, lien ou région à un utilisateur non-voyant.

### Q: Expliquez l’utilité de `loading="lazy"`.
`loading="lazy"` indique au navigateur de différer le chargement de l'image jusqu'à ce qu'elle entre dans le viewport. Ceci améliore le temps de chargement initial et réduit le data transfer pour l'utilisateur, bénéfique sur mobile. Pour les images critiques (logo dans header), on peut laisser `loading="eager"`.

## 4) Comment builder / tester localement (optionnel : build Tailwind)
Actuellement le site utilise le CDN Tailwind pour les utilitaires. Pour builder localement et produire un `css/main.css` optimisé (purge, autoprefixer) :

1) Installer dépendances (cmd.exe sous Windows) :

```cmd
npm install --save-dev tailwindcss postcss postcss-cli postcss-import autoprefixer
```

2) Builder une fois :

```cmd
npm run build:css
```

(Des scripts `dev:css` et `build:css` ont été ajoutés précédemment dans `package.json` par les modifications faites.)

## 5) Suggestions / prochaines étapes
- Convertir les images en WebP pour réduire le poids (surtout les illustrations et logos compressés).
- Intégrer Tailwind via Webpack/PostCSS pour purger les classes inutilisées en production.
- Ajouter `robots.txt` et `sitemap.xml` si tu prévois de déployer (je peux les générer si tu veux).
- Ajouter tests rapides d'accessibilité (axe) et audit Lighthouse.

## 6) Vérification rapide réalisée
J'ai vérifié que `index.html` et les fichiers CSS ajoutés ne déclenchent pas d'erreurs de parsing dans l'environnement (contrôles statiques mis à disposition). Les chemins d'images référencent `asset/img/*` : vérifie que les fichiers existent et sont optimisés.

---
Si tu veux que je :
- génère `robots.txt` et `sitemap.xml` maintenant ;
- remplace le CDN Tailwind par un build local (configuration Webpack + PostCSS) et génère `css/main.css` optimisé ;
- convertisse automatiquement les images en WebP et remplace les balises ;
fais-moi signe et j'exécute la suite.

Bonne continuation — dis-moi quelle action tu veux en priorité (build local / robots/sitemap / optimisation images / autres retouches UI).
