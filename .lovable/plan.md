# Itération A + B — Liens internes & Auto-Blog IA multilingue

## Choix validés
- Mode : **Auto-publish direct** avec prompt engineering avancé
- Fréquence : **2 articles/semaine/langue** (EN + FR + AR = 6 articles/semaine total)
- Ordre : **Itération A** (liens internes) puis **Itération B** (auto-blog)
- Banque de sujets : **50 sujets optimisés** fournis au démarrage (25 EN + 15 FR + 10 AR)

---

## ITÉRATION A — Liens internes & Breadcrumbs

### Nouveaux composants
- `src/components/Breadcrumbs.tsx` — fil d'Ariane multilingue + JSON-LD `BreadcrumbList` automatique
- `src/components/InternalLinksSection.tsx` — bloc "Découvrir aussi" (4 cartes : Subscription, Activation, Reseller, Blog, Reviews, Support) avec exclusion de la page courante. Multilingue EN/FR/AR.
- `src/components/RelatedArticles.tsx` — 3 articles du même type en bas de chaque article de blog

### Pages mises à jour
- **Subscription, Activation, Reseller, Products, FullReviews, Support, HowToBuy, Blog** : ajout de `<Breadcrumbs/>` en haut + `<InternalLinksSection exclude={[currentPage]} />` en bas
- **BlogArticleDetail** : ajout `<Breadcrumbs/>` + `<RelatedArticles/>` en bas
- **Home** : ajout `<InternalLinksSection/>` (déjà bien linkée, mais on renforce)

---

## ITÉRATION B — Auto-Blog IA multilingue

### Architecture

```text
┌──────────────────────────────────────────────────────────┐
│ Cron pg_cron : 3× par semaine (lundi, mercredi, vendredi│
│ à 09:00 UTC) → POST /functions/generate-blog-article    │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Edge Function generate-blog-article :                    │
│ 1. Lit blog_automation_config (active ? langues ?)       │
│ 2. Pioche 1 sujet "pending" dans blog_topics_queue       │
│    (priorité par sort_order, round-robin par langue)     │
│ 3. Pour CHAQUE langue active (EN/FR/AR) :                │
│    a. Appel Lovable AI (gemini-3-flash-preview)          │
│       avec prompt SEO-engineered (voir ci-dessous)       │
│    b. Tool calling → JSON structuré                      │
│       { title, slug, meta_description, excerpt,          │
│         content_html, tags, faq[], internal_links[] }    │
│    c. Génère 1 image cover via Nano Banana               │
│       (gemini-2.5-flash-image) avec prompt visuel        │
│       dérivé du sujet                                    │
│    d. Upload image → bucket "blog-images" → URL publique │
│    e. INSERT blog_articles (published=true,              │
│       featured_image_url, language_code)                 │
│ 4. Marque le sujet comme "published" dans la queue       │
│ 5. Log dans blog_generation_logs                         │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ Edge Function regenerate-sitemap (déclenché en fin) :    │
│ régénère sitemap.xml avec tous les articles publiés      │
│ → upload vers bucket public "site-meta"                  │
│ → endpoint /sitemap.xml proxy via Edge Function          │
└──────────────────────────────────────────────────────────┘
```

### Schéma DB (migrations)

**Modification `blog_articles`** :
- Ajouter colonne `language_code TEXT NOT NULL DEFAULT 'en'`
- Ajouter colonne `meta_description TEXT`
- Ajouter colonne `tags TEXT[] DEFAULT '{}'`
- Ajouter colonne `faq JSONB DEFAULT '[]'`
- Ajouter colonne `auto_generated BOOLEAN DEFAULT false`
- Index sur `(language_code, published, created_at DESC)`
- Index unique sur `(slug, language_code)` (pour permettre même slug en plusieurs langues)

**Nouvelle table `blog_topics_queue`** :
```sql
id uuid PK
topic_en text   -- sujet en anglais (peut servir de seed pour traductions)
topic_fr text
topic_ar text
target_keywords text[]   -- mots-clés SEO cibles
category text            -- 'iptv' | 'player'
status text DEFAULT 'pending'  -- pending | processing | published | failed
sort_order int DEFAULT 0
published_languages text[] DEFAULT '{}'
last_attempted_at timestamptz
created_at timestamptz DEFAULT now()
```
RLS : admin only (read/write).

**Nouvelle table `blog_automation_config`** :
```sql
id uuid PK (singleton, 1 ligne)
is_active boolean DEFAULT true
languages text[] DEFAULT '{en,fr,ar}'
articles_per_run int DEFAULT 1   -- 1 sujet × 3 langues = 3 articles par run
auto_publish boolean DEFAULT true
ai_model text DEFAULT 'google/gemini-3-flash-preview'
image_model text DEFAULT 'google/gemini-2.5-flash-image'
last_run_at timestamptz
updated_at timestamptz
```

**Nouvelle table `blog_generation_logs`** :
```sql
id uuid PK
topic_id uuid FK
language text
status text       -- success | failed
article_id uuid
error_message text
duration_ms int
created_at timestamptz
```

**Bucket Storage `blog-images`** : public read, admin write via service role.

### Banque initiale de 50 sujets optimisés

Sujets choisis pour **volume de recherche élevé + intention transactionnelle** sur le créneau IPTV :

**EN (25)** :
1. Best IPTV Subscription 2026: Top 10 Premium Services Compared
2. How to Install IPTV on Samsung Smart TV (Step-by-Step Guide)
3. How to Install IPTV on LG Smart TV with WebOS
4. Best IPTV Player Apps for Firestick in 2026
5. IPTV vs Netflix: Which is Better for Your TV?
6. How to Set Up IPTV on Amazon Fire TV Stick
7. Top 5 IPTV Apps for Android TV Box
8. IPTV Buffering Issues: Complete Troubleshooting Guide
9. What is IPTV M3U? Complete Beginner's Guide
10. How to Watch Sports Live with IPTV (NFL, NBA, Premier League)
11. Best 4K IPTV Services with EPG Guide
12. How to Use VLC Player as an IPTV Player
13. Smart IPTV vs IPTV Smarters Pro: Which to Choose?
14. IPTV on iPhone & iPad: Best Apps and Setup
15. How to Install IPTV on MAG Box (250, 322, 524)
16. Free IPTV Trial: How to Test Before You Buy
17. Best IPTV for International Channels (Arabic, French, Latin)
18. IPTV Reseller Business: How to Start in 2026
19. How to Avoid IPTV Scams: 7 Red Flags to Watch
20. IPTV on Roku: Best Apps and Workarounds
21. Xtream Codes IPTV: Complete Setup Tutorial
22. How to Record IPTV Channels (DVR Guide)
23. IPTV vs Cable TV: 8 Reasons to Switch in 2026
24. Best IPTV for Football: Premier League, La Liga, Serie A
25. How to Fix IPTV Not Working on Smart TV

**FR (15)** :
1. Meilleur Abonnement IPTV 2026 : Comparatif des 10 Services Premium
2. Comment Installer IPTV sur Smart TV Samsung (Guide Étape par Étape)
3. Comment Installer IPTV sur Smart TV LG avec WebOS
4. Meilleures Applications IPTV pour Firestick en 2026
5. IPTV vs Netflix : Quel est le Meilleur pour Votre TV ?
6. Comment Configurer IPTV sur Amazon Fire TV Stick
7. Top 5 Applications IPTV pour Box Android TV
8. Problèmes de Mise en Mémoire IPTV : Guide de Dépannage
9. Qu'est-ce qu'IPTV M3U ? Guide Complet pour Débutants
10. Comment Regarder le Sport en Direct avec IPTV (Ligue 1, Champions League)
11. Meilleurs Services IPTV 4K avec Guide EPG
12. IPTV sur iPhone & iPad : Meilleures Applications
13. Comment Installer IPTV sur Box MAG (250, 322, 524)
14. Essai IPTV Gratuit : Comment Tester Avant d'Acheter
15. Devenir Revendeur IPTV : Comment Démarrer en 2026

**AR (10)** :
1. أفضل اشتراك IPTV 2026: مقارنة بين أفضل 10 خدمات بريميوم
2. كيفية تثبيت IPTV على تلفزيون Samsung الذكي (دليل خطوة بخطوة)
3. كيفية تثبيت IPTV على Smart TV من LG
4. أفضل تطبيقات IPTV لجهاز Firestick في 2026
5. IPTV مقابل Netflix: أيهما أفضل لتلفزيونك؟
6. كيفية إعداد IPTV على Amazon Fire TV Stick
7. مشاكل التخزين المؤقت في IPTV: دليل استكشاف الأخطاء
8. ما هو IPTV M3U؟ دليل كامل للمبتدئين
9. كيفية مشاهدة الرياضة المباشرة مع IPTV (دوري أبطال أوروبا، الدوري الإنجليزي)
10. أفضل خدمات IPTV 4K بدقة عالية

### Prompt engineering avancé (à intégrer dans l'edge function)

Le prompt utilise **tool calling** pour forcer un JSON valide. Structure :

```text
SYSTEM:
You are an expert SEO content writer specialized in IPTV, streaming and
cord-cutting topics for the BWIVOX brand. Your articles consistently rank
on page 1 of Google. Write in {LANG} only. Audience: tech-aware consumers
looking to subscribe to IPTV services.

WRITING RULES (mandatory):
- 1000-1400 words, NEVER under 900
- Single H1 (the title), then H2/H3 hierarchy (4-6 H2 sections minimum)
- Each H2 has 150-300 words of content + at least 1 H3 subsection where useful
- Natural keyword density 1-2% (keywords: {KEYWORDS})
- First paragraph (intro) MUST hook the reader and include the main keyword
  within the first 100 characters
- Conclusion MUST contain a soft CTA toward /subscription, /activation
  or /reseller (depending on topic relevance)
- Add EXACTLY 4 FAQ items at the end (real questions users ask on Google
  for this topic)
- Include 2-3 contextual internal links toward BWIVOX pages:
  /subscription, /activation, /reseller, /blog, /support, /how-to-buy
- Use bullet lists, comparison tables (HTML <table>), bold key terms
- Avoid AI clichés ("In today's digital world", "It's important to note",
  "Whether you're a beginner or an expert")
- Use concrete numbers, real device names, real channel examples
- Tone: confident, direct, informative — never sales-pushy
- For Arabic: write naturally in Modern Standard Arabic, RTL-friendly
  (no embedded English fragments unless brand/tech terms)

OUTPUT FORMAT (use the provided tool — DO NOT respond in plain text):
- title: ≤ 60 chars, includes main keyword, click-worthy
- slug: kebab-case, English ASCII even for FR/AR articles
  (prefix with "fr-" or "ar-" for non-EN slugs to avoid collisions)
- meta_description: 140-160 chars, includes main keyword + value prop
- excerpt: 1 sentence, 120-180 chars
- content_html: full article body (NO <h1>, NO <html>/<body> wrappers,
  start at <h2>). Valid semantic HTML.
- tags: 4-6 relevant tags
- faq: array of {question, answer} (4 items)
- image_prompt: short visual description for the cover image
  (no text in image, photographic style, modern, brand colors red/black/white)

USER:
Write a complete SEO-optimized article on the following topic: {TOPIC}
Target keywords: {KEYWORDS}
Category: {CATEGORY}
```

Tool schema (forces structured output) :
```json
{
  "name": "publish_article",
  "parameters": {
    "type": "object",
    "required": ["title","slug","meta_description","excerpt",
                 "content_html","tags","faq","image_prompt"],
    "properties": {
      "title": {"type":"string","maxLength":80},
      "slug": {"type":"string","pattern":"^[a-z0-9-]+$"},
      "meta_description": {"type":"string","maxLength":170},
      "excerpt": {"type":"string","maxLength":200},
      "content_html": {"type":"string","minLength":3000},
      "tags": {"type":"array","items":{"type":"string"},"minItems":3,"maxItems":8},
      "faq": {
        "type":"array","minItems":4,"maxItems":4,
        "items":{"type":"object","required":["question","answer"],
                 "properties":{"question":{"type":"string"},"answer":{"type":"string"}}}
      },
      "image_prompt": {"type":"string","maxLength":300}
    }
  }
}
```

### Admin UI — onglet "Auto-Publishing"

Nouvel onglet dans `/diza/blog` :
- **Toggle global ON/OFF** (active/désactive le cron)
- **Langues actives** (multi-select EN/FR/AR)
- **Modèles AI** (text + image, dropdowns avec valeurs par défaut)
- **Banque de sujets** : table CRUD complète (ajouter, éditer, supprimer, marquer pending)
- **Historique des runs** : tableau des 50 dernières générations (date, sujet, langue, statut, erreur, lien article)
- **Bouton "Run now"** : déclenche manuellement une génération de test (sans attendre le cron)
- **Stats** : articles publiés ce mois, par langue, taux de succès

### Cron pg_cron
```sql
SELECT cron.schedule(
  'auto-blog-generation',
  '0 9 * * 1,3,5',  -- lundi, mercredi, vendredi 09:00 UTC
  $$
  SELECT net.http_post(
    url := 'https://jtsnspszgsmkqxuoqywm.supabase.co/functions/v1/generate-blog-article',
    headers := '{"Content-Type":"application/json","apikey":"<ANON_KEY>"}'::jsonb,
    body := '{"trigger":"cron"}'::jsonb
  );
  $$
);
```

### Mise à jour de l'article detail page
- Affichage de la `meta_description` dans `<SEO/>`
- Section FAQ rendue depuis le champ JSONB
- Schema.org `Article` + `FAQPage` JSON-LD
- `<RelatedArticles/>` en bas

---

## Fichiers impactés (récap)

```text
ITÉRATION A:
├── src/components/Breadcrumbs.tsx                          (nouveau)
├── src/components/InternalLinksSection.tsx                 (nouveau)
├── src/components/RelatedArticles.tsx                      (nouveau)
├── src/pages/Subscription.tsx                              (+ breadcrumbs + internal links)
├── src/pages/Activation.tsx                                (idem)
├── src/pages/Reseller.tsx                                  (idem)
├── src/pages/Products.tsx                                  (idem)
├── src/pages/FullReviews.tsx                               (idem)
├── src/pages/Support.tsx                                   (idem)
├── src/pages/HowToBuy.tsx                                  (idem)
├── src/pages/Blog.tsx                                      (idem)
├── src/pages/BlogArticleDetail.tsx                         (+ related)
└── src/pages/Home.tsx                                      (+ internal links)

ITÉRATION B:
├── Migration: ALTER blog_articles + 3 nouvelles tables + bucket
├── Insert: seed 50 sujets dans blog_topics_queue + 1 ligne config
├── supabase/functions/generate-blog-article/index.ts       (nouveau)
├── supabase/functions/regenerate-sitemap/index.ts          (nouveau)
├── src/pages/admin/BlogManagement.tsx                      (+ onglet Auto-Publishing)
├── src/components/admin/BlogAutomationPanel.tsx            (nouveau)
├── src/components/admin/BlogTopicsManager.tsx              (nouveau)
├── src/components/admin/BlogGenerationLogs.tsx             (nouveau)
├── src/hooks/useBlogAutomation.ts                          (nouveau)
├── src/hooks/useBlogTopics.ts                              (nouveau)
├── src/hooks/useBlogGenerationLogs.ts                      (nouveau)
└── src/pages/BlogArticleDetail.tsx                         (+ FAQ + Article JSON-LD)
```

## Sécurité
- Edge function `generate-blog-article` : pas d'auth requise (déclenchée par cron) mais validation d'un secret partagé `BLOG_CRON_SECRET` dans le body pour éviter les abus externes
- `LOVABLE_API_KEY` déjà disponible (vérifié)
- RLS strictes sur `blog_topics_queue`, `blog_automation_config`, `blog_generation_logs` (admin only)

## Risques & garde-fous
- **Quota Lovable AI** : 6 articles/sem × ~5K tokens + 6 images = ~1 €/mois → largement couvert par les crédits gratuits
- **Qualité contenu** : prompt avec règles strictes anti-clichés + tool calling pour structure forcée
- **Doublons** : index unique `(slug, language_code)` + sujets marqués "published" pour éviter de regénérer
- **Rate limit Gemini** : délai 2s entre les 3 langues d'un même run
- **Échec partiel** : si 1 langue échoue, les 2 autres sont quand même publiées + log d'erreur

## Pas de questions restantes — j'attends ton approbation pour exécuter A puis B d'affilée.
