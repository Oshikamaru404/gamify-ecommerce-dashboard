# Stratégie SEO International — EN / FR / AR (BWIVOX IPTV)

## Objectif
Optimiser le référencement multilingue pour 3 marchés : Anglais (global), Français (France/Belgique/Maghreb francophone), Arabe (MENA, RTL).

## Diagnostic actuel
- `index.html` : title/description génériques, OG pointe vers lovable.dev, pas de canonical, pas de hreflang
- Pas de `sitemap.xml`, `robots.txt` minimal
- SPA React → contenu rendu côté client uniquement
- `LanguageContext` existe déjà (multilingue géré côté UI), mais aucune URL distincte par langue → Google ne peut pas indexer chaque version séparément
- Aucune donnée structurée JSON-LD
- Pas de support RTL pour l'arabe

## Architecture URL recommandée

Passer d'un sélecteur de langue côté client à des **URLs préfixées par langue** :

```text
https://bwivox.com/en/         → version anglaise (canonique x-default)
https://bwivox.com/fr/         → version française
https://bwivox.com/ar/         → version arabe (RTL)
```

Avantages : chaque langue indexée comme page distincte, hreflang propre, partage social par langue.

## Plan d'exécution en 5 phases

### Phase 1 — Fondations techniques internationales

1. **Réécrire `index.html`** :
   - Title/description par défaut en anglais (langue pivot)
   - Open Graph + Twitter avec image hébergée sur bwivox.com
   - Suppression `Cache-Control: no-cache`
   - Corriger `author` + `twitter:site`
   - JSON-LD `Organization` + `WebSite` avec `inLanguage: ["en","fr","ar"]`

2. **Routing multilingue** dans `src/App.tsx` :
   - Ajouter prefix `/:lang(en|fr|ar)` à toutes les routes publiques
   - Redirect `/` → `/en/` (ou détection navigator.language → /fr/, /ar/)
   - Synchroniser `LanguageContext` avec le segment d'URL
   - Préserver routes admin `/diza/*` sans préfixe

3. **`public/sitemap.xml`** avec balises `xhtml:link rel="alternate" hreflang"` pour chaque URL × 3 langues + `x-default`

4. **`public/robots.txt`** : ajouter `Sitemap:`, bloquer `/diza`, `/checkout`, `/iptv-panel`, `/player-panel`, `/payment-return`

### Phase 2 — Composant SEO multilingue

1. Installer `react-helmet-async`, wrapper dans `main.tsx`
2. Créer `src/components/SEO.tsx` :
   - Props : `titleKey`, `descriptionKey`, `path`
   - Génère automatiquement les 3 balises `<link rel="alternate" hreflang="en|fr|ar">` + `x-default`
   - `<link rel="canonical">` pointant vers la version courante
   - `<html lang="...">` + `dir="rtl"` si arabe (via useEffect)
   - OG `og:locale` et `og:locale:alternate`
3. Créer `src/lib/seoTranslations.ts` : titres/descriptions/keywords par page × 3 langues
4. Créer `src/lib/seoSchemas.ts` : builders JSON-LD (`Product`, `Offer`, `Review`, `BreadcrumbList`, `FAQPage`, `Article`) avec `inLanguage`

### Phase 3 — Support RTL pour l'arabe

1. Ajouter `dir="rtl"` automatique sur `<html>` quand `lang === 'ar'`
2. Tailwind : activer le plugin RTL ou utiliser les utilitaires logiques (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`)
3. Auditer et corriger les composants clés : `StoreHeader`, `StoreFooter`, cartes produits, checkout, formulaires
4. Police arabe : ajouter Google Font `Noto Sans Arabic` ou `Cairo` chargée conditionnellement
5. Vérifier les icônes directionnelles (flèches `ArrowRight` → miroir en RTL)

### Phase 4 — Contenu localisé & mots-clés

Mots-clés cibles à valider par langue :

| Langue | Principaux | Longue traîne |
|--------|-----------|----------------|
| EN | best iptv subscription, iptv 4k premium, iptv free trial | iptv with money back guarantee, iptv reseller panel |
| FR | abonnement iptv, meilleur iptv 2026, iptv 4k premium | abonnement iptv avec garantie, iptv essai gratuit 24h |
| AR | اشتراك IPTV, أفضل IPTV, IPTV 4K | اشتراك IPTV مع ضمان, تجربة IPTV مجانية |

Actions :
- Étoffer le contenu Home (300+ mots par langue, hiérarchie h1/h2/h3 propre)
- Section FAQ par langue (déclenche rich snippets)
- Plan éditorial blog : 1 article/semaine par langue prioritaire (EN d'abord, puis FR, puis AR)
- Traductions humaines pour AR (pas Google Translate)

### Phase 5 — Performance & Off-page

1. Images WebP/AVIF, `loading="lazy"`, `width`/`height` explicites
2. `preconnect` Supabase, preload fonts (latin + arabic)
3. Vérifier `public/_headers` cache statique
4. **Externe (manuel)** :
   - Soumettre 3 sitemaps à Google Search Console + Bing Webmaster Tools
   - Cibler géographiquement chaque sous-dossier dans GSC (FR→France, AR→Arabie/EAU/Maroc, EN→international)
   - Backlinks par langue : annuaires/forums IPTV anglo, francophones, arabophones
   - Profils sociaux dédiés par langue

## Fichiers impactés

```text
├── index.html                              (réécriture meta + JSON-LD global)
├── public/robots.txt                       (sitemap + blocages)
├── public/sitemap.xml                      (nouveau, hreflang complet)
├── public/_headers                         (cache assets)
├── package.json                            (+ react-helmet-async, + plugin RTL Tailwind)
├── tailwind.config.ts                      (plugin RTL)
├── src/main.tsx                            (HelmetProvider)
├── src/App.tsx                             (routing /:lang/*)
├── src/contexts/LanguageContext.tsx        (sync URL ↔ langue, dir RTL)
├── src/components/SEO.tsx                  (nouveau)
├── src/lib/seoTranslations.ts              (nouveau)
├── src/lib/seoSchemas.ts                   (nouveau)
├── src/index.css                           (ajustements RTL globaux)
└── src/pages/*.tsx                         (intégration <SEO/>)
```

## Note SSR
Lovable = React SPA (cf. contraintes plateforme). Googlebot exécute le JS, mais pour AR (Bing/Yandex moins courants en MENA) on pourra envisager **prerender.io** plus tard si l'indexation est lente.

## Priorisation suggérée

| Itération | Contenu | Effort |
|-----------|---------|--------|
| 1 | Phase 1 (index.html + sitemap + robots + routing /:lang) | Moyen |
| 2 | Phase 2 (composant SEO + traductions meta) | Moyen |
| 3 | Phase 3 (support RTL arabe) | Élevé |
| 4 | Phase 4 (contenu enrichi + FAQ) | Continu |
| 5 | Phase 5 (perf + off-page) | Faible côté code |

## Questions à valider avant de coder

1. Domaine canonique = `https://bwivox.com` (sans www) ?
2. Langue par défaut sur `/` = anglais (international) ou détection auto navigateur ?
3. Démarrer par Itérations 1+2 puis enchaîner RTL ?
4. As-tu déjà des traductions arabes professionnelles, ou faut-il prévoir un placeholder à faire traduire ensuite ?