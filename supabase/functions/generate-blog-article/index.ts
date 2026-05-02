// Auto-generates SEO-optimized blog articles in EN/FR/AR using Lovable AI
// Triggered by pg_cron 3x/week or manually from admin panel

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const LANG_NAMES: Record<string, string> = {
  en: "English",
  fr: "French",
  ar: "Modern Standard Arabic",
};

function buildSystemPrompt(lang: string) {
  return `You are an expert SEO content writer specialized in IPTV, streaming and cord-cutting topics for the BWIVOX brand. Your articles consistently rank on page 1 of Google. Write the entire article in ${LANG_NAMES[lang]} only. Audience: tech-aware consumers looking to subscribe to a premium IPTV service.

WRITING RULES (mandatory):
- 1000-1400 words, NEVER under 900
- Single H1 is the title — your content_html must START at <h2> (no <h1>, <html>, <body>, <head>)
- 4-6 H2 sections minimum, each 150-300 words, with H3 subsections where useful
- Natural keyword density 1-2% using the target keywords provided
- Intro paragraph hooks the reader and includes the main keyword in the first 100 characters
- Conclusion contains a soft CTA toward /subscription, /activation or /reseller (pick the most relevant)
- Add EXACTLY 4 FAQ items at the end (real questions users ask Google for this topic)
- Include 2-3 contextual internal links (HTML <a href="/subscription">...</a>) toward: /subscription, /activation, /reseller, /blog, /support, /how-to-buy
- Use bullet lists, comparison tables (HTML <table>), bold key terms with <strong>
- Avoid AI clichés: no "In today's digital world", "It's important to note", "Whether you're a beginner or an expert", "In conclusion", "navigate the world of"
- Use concrete numbers, real device names, real channel/league examples
- Tone: confident, direct, informative — never sales-pushy
- For Arabic: write naturally in MSA, RTL-friendly, no embedded English fragments unless brand/tech terms (BWIVOX, IPTV, M3U, EPG)

You MUST respond ONLY by calling the publish_article tool. Do not output plain text.`;
}

const ARTICLE_TOOL = {
  type: "function",
  function: {
    name: "publish_article",
    description: "Publish an SEO-optimized blog article",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: [
        "title",
        "slug",
        "meta_description",
        "excerpt",
        "content_html",
        "tags",
        "faq",
        "image_prompt",
      ],
      properties: {
        title: { type: "string", maxLength: 80 },
        slug: { type: "string" },
        meta_description: { type: "string", maxLength: 170 },
        excerpt: { type: "string", maxLength: 220 },
        content_html: { type: "string", minLength: 2500 },
        tags: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
          maxItems: 8,
        },
        faq: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            required: ["question", "answer"],
            properties: {
              question: { type: "string" },
              answer: { type: "string" },
            },
          },
        },
        image_prompt: { type: "string", maxLength: 400 },
      },
    },
  },
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function generateArticleContent(
  topic: string,
  keywords: string[],
  category: string,
  lang: string,
  model: string
) {
  const resp = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemPrompt(lang) },
          {
            role: "user",
            content: `Write a complete SEO-optimized article on this topic: "${topic}"
Target keywords: ${keywords.join(", ")}
Category: ${category}
Language: ${LANG_NAMES[lang]}`,
          },
        ],
        tools: [ARTICLE_TOOL],
        tool_choice: { type: "function", function: { name: "publish_article" } },
      }),
    }
  );

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${txt}`);
  }

  const data = await resp.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) {
    throw new Error("No tool_call in AI response");
  }
  return JSON.parse(call.function.arguments);
}

async function generateImage(prompt: string, model: string): Promise<Uint8Array> {
  const resp = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: `${prompt}. Photographic, modern, vibrant colors with red and dark accents matching BWIVOX brand. Cinematic lighting. No text overlay, no watermark.`,
          },
        ],
        modalities: ["image", "text"],
      }),
    }
  );

  if (!resp.ok) throw new Error(`Image gen failed ${resp.status}`);
  const data = await resp.json();
  const url: string | undefined =
    data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url?.startsWith("data:")) throw new Error("No image returned");
  const base64 = url.split(",")[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function uploadImage(
  supabase: ReturnType<typeof createClient>,
  bytes: Uint8Array,
  slug: string,
  lang: string
): Promise<string> {
  const fileName = `${lang}/${Date.now()}-${slug}.png`;
  const { error } = await supabase.storage
    .from("blog-images")
    .upload(fileName, bytes, {
      contentType: "image/png",
      upsert: false,
    });
  if (error) throw error;
  const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
  return data.publicUrl;
}

async function processLanguage(
  supabase: ReturnType<typeof createClient>,
  topic: any,
  lang: string,
  config: any
) {
  const start = Date.now();
  const topicText =
    lang === "fr"
      ? topic.topic_fr || topic.topic_en
      : lang === "ar"
      ? topic.topic_ar || topic.topic_en
      : topic.topic_en || topic.topic_fr || topic.topic_ar;

  if (!topicText) throw new Error(`No topic text for language ${lang}`);

  const article = await generateArticleContent(
    topicText,
    topic.target_keywords || [],
    topic.category || "iptv",
    lang,
    config.ai_model
  );

  // Build language-prefixed slug to avoid collisions
  let slug = slugify(article.slug || article.title);
  if (lang !== "en") slug = `${lang}-${slug}`;

  // Generate cover image
  let imageUrl: string | null = null;
  try {
    const imgBytes = await generateImage(article.image_prompt, config.image_model);
    imageUrl = await uploadImage(supabase, imgBytes, slug, lang);
  } catch (e) {
    console.error("Image gen failed (non-fatal):", e);
  }

  // Insert article
  const { data: inserted, error: insErr } = await supabase
    .from("blog_articles")
    .insert({
      title: article.title,
      slug,
      excerpt: article.excerpt,
      content: article.content_html,
      meta_description: article.meta_description,
      tags: article.tags,
      faq: article.faq,
      featured_image_url: imageUrl,
      language_code: lang,
      category: topic.category || "iptv",
      published: config.auto_publish,
      auto_generated: true,
      author: "BWIVOX Editorial",
    })
    .select()
    .single();

  if (insErr) throw insErr;

  await supabase.from("blog_generation_logs").insert({
    topic_id: topic.id,
    language: lang,
    status: "success",
    article_id: inserted.id,
    duration_ms: Date.now() - start,
  });

  return inserted.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    // Load config
    const { data: configRows } = await supabase
      .from("blog_automation_config")
      .select("*")
      .limit(1);
    const config = configRows?.[0];

    if (!config?.is_active) {
      return new Response(
        JSON.stringify({ ok: false, message: "Automation disabled" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Optional manual override
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}
    const forcedTopicId: string | undefined = body?.topic_id;
    const forcedLanguages: string[] | undefined = body?.languages;

    // Pick topics (respect articles_per_run unless a specific topic_id is forced)
    const limit = forcedTopicId ? 1 : Math.max(1, Math.min(10, config.articles_per_run || 1));
    let topicQuery = supabase
      .from("blog_topics_queue")
      .select("*")
      .eq("status", "pending")
      .order("sort_order", { ascending: true })
      .limit(limit);
    if (forcedTopicId) {
      topicQuery = supabase
        .from("blog_topics_queue")
        .select("*")
        .eq("id", forcedTopicId)
        .limit(1);
    }
    const { data: topicsToProcess } = await topicQuery;

    if (!topicsToProcess || topicsToProcess.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, message: "No pending topic" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const langs: string[] = forcedLanguages || config.languages || ["en"];
    const allResults: any[] = [];

    for (const topic of topicsToProcess) {
      // Mark as processing
      await supabase
        .from("blog_topics_queue")
        .update({ status: "processing", last_attempted_at: new Date().toISOString() })
        .eq("id", topic.id);

      const results: Record<string, any> = {};
      const succeededLangs: string[] = [];

      for (const lang of langs) {
        try {
          const articleId = await processLanguage(supabase, topic, lang, config);
          results[lang] = { success: true, article_id: articleId };
          succeededLangs.push(lang);
        } catch (err: any) {
          console.error(`Failed ${lang}:`, err);
          results[lang] = { success: false, error: String(err?.message || err) };
          await supabase.from("blog_generation_logs").insert({
            topic_id: topic.id,
            language: lang,
            status: "failed",
            error_message: String(err?.message || err),
          });
        }
        await new Promise((r) => setTimeout(r, 2000));
      }

      const allLangs = Array.from(
        new Set([...(topic.published_languages || []), ...succeededLangs])
      );
      const finalStatus =
        succeededLangs.length === langs.length ? "published" : "pending";
      await supabase
        .from("blog_topics_queue")
        .update({ status: finalStatus, published_languages: allLangs })
        .eq("id", topic.id);

      allResults.push({ topic_id: topic.id, results });
    }

    await supabase
      .from("blog_automation_config")
      .update({ last_run_at: new Date().toISOString() })
      .eq("id", config.id);

    return new Response(
      JSON.stringify({ ok: true, processed: allResults.length, results: allResults }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("generate-blog-article error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err?.message || err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
