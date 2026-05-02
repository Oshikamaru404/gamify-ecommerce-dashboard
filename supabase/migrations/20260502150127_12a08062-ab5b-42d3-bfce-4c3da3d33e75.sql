
ALTER TABLE public.blog_topics_queue
  ADD COLUMN IF NOT EXISTS angle text NOT NULL DEFAULT 'indirect'
    CHECK (angle IN ('indirect', 'direct'));

INSERT INTO public.blog_topics_queue (topic_en, topic_fr, topic_ar, target_keywords, category, angle, sort_order) VALUES
-- INDIRECT (80%) — broad audience, no "IPTV" in title
('How to watch international channels without cable in 2026',
 'Comment regarder des chaînes internationales sans câble en 2026',
 'كيف تشاهد القنوات الدولية بدون كابل في 2026',
 ARRAY['streaming international', 'cord cutting', 'watch tv abroad'], 'iptv', 'indirect', 10),

('The best alternatives to cable TV in 2026',
 'Les meilleures alternatives au câble en 2026',
 'أفضل البدائل للتلفزيون الكابلي في 2026',
 ARRAY['cable tv alternatives', 'cord cutting', 'streaming services'], 'iptv', 'indirect', 20),

('Why people are leaving traditional TV subscriptions',
 'Pourquoi les gens quittent les abonnements TV classiques',
 'لماذا يتخلى الناس عن اشتراكات التلفزيون التقليدية',
 ARRAY['cord cutting', 'streaming trends', 'tv subscription'], 'iptv', 'indirect', 30),

('How to cut your TV bill by 70% in 2026',
 'Comment réduire sa facture TV de 70% en 2026',
 'كيف تخفض فاتورة التلفزيون بنسبة 70٪ في 2026',
 ARRAY['save on tv bill', 'cheap streaming', 'cord cutting'], 'iptv', 'indirect', 40),

('Complete guide to home streaming in 2026',
 'Guide complet du streaming à domicile en 2026',
 'الدليل الكامل للبث المنزلي في 2026',
 ARRAY['home streaming guide', 'streaming setup', 'smart tv'], 'iptv', 'indirect', 50),

('How to watch live football from anywhere in the world',
 'Comment regarder le football en direct depuis n''importe où dans le monde',
 'كيف تشاهد كرة القدم مباشرة من أي مكان في العالم',
 ARRAY['watch football live', 'sports streaming', 'live sports'], 'iptv', 'indirect', 60),

('Best devices to turn any TV into a smart TV',
 'Les meilleurs appareils pour transformer n''importe quelle TV en smart TV',
 'أفضل الأجهزة لتحويل أي تلفزيون إلى تلفزيون ذكي',
 ARRAY['smart tv box', 'firestick alternatives', 'android tv box'], 'iptv', 'indirect', 70),

('How families watch TV in 2026: a complete shift',
 'Comment les familles regardent la TV en 2026 : un vrai changement',
 'كيف تشاهد العائلات التلفزيون في 2026: تحول كامل',
 ARRAY['family streaming', 'tv habits 2026', 'multi-device tv'], 'iptv', 'indirect', 80),

('Watching foreign-language channels: the easy way',
 'Regarder des chaînes en langue étrangère : la méthode simple',
 'مشاهدة القنوات بلغات أجنبية: الطريقة السهلة',
 ARRAY['foreign tv channels', 'multilingual tv', 'arabic channels abroad'], 'iptv', 'indirect', 90),

('How expats stay connected to home TV abroad',
 'Comment les expatriés restent connectés à la TV de leur pays',
 'كيف يبقى المغتربون متصلين بتلفزيون بلدهم',
 ARRAY['expat tv', 'watch home tv abroad', 'streaming for expats'], 'iptv', 'indirect', 100),

('Smart TV vs streaming box: what really matters in 2026',
 'Smart TV ou box de streaming : ce qui compte vraiment en 2026',
 'التلفزيون الذكي أو صندوق البث: ما يهم حقاً في 2026',
 ARRAY['smart tv vs streaming box', 'firestick vs android box'], 'iptv', 'indirect', 110),

('The hidden cost of streaming subscriptions (and how to fix it)',
 'Le coût caché des abonnements de streaming (et comment le réduire)',
 'التكلفة الخفية لاشتراكات البث (وكيف تخفضها)',
 ARRAY['streaming costs', 'too many subscriptions', 'save money streaming'], 'iptv', 'indirect', 120),

('How to set up a complete home entertainment system on a budget',
 'Comment monter un système de divertissement à domicile pas cher',
 'كيف تركب نظام ترفيه منزلي كامل بميزانية محدودة',
 ARRAY['home entertainment setup', 'cheap home theater', 'budget streaming'], 'iptv', 'indirect', 130),

('Watch live news from around the world: the modern way',
 'Regarder les infos en direct du monde entier : la méthode moderne',
 'مشاهدة الأخبار مباشرة من جميع أنحاء العالم: الطريقة الحديثة',
 ARRAY['live news streaming', 'international news', 'world news live'], 'iptv', 'indirect', 140),

('Stream 4K content without buffering: a real-world guide',
 'Streamer en 4K sans buffering : le guide concret',
 'بث محتوى 4K بدون تقطيع: دليل عملي',
 ARRAY['4k streaming', 'no buffering streaming', 'high quality streaming'], 'iptv', 'indirect', 150),

('What to do when Netflix and cable are not enough',
 'Que faire quand Netflix et le câble ne suffisent plus',
 'ماذا تفعل عندما لا يكفي نتفليكس والكابل',
 ARRAY['netflix alternatives', 'beyond netflix', 'more channels'], 'iptv', 'indirect', 160),

-- DIRECT (20%) — explicit IPTV in title, intentional search
('IPTV: complete beginner''s guide for 2026',
 'IPTV : guide complet pour débutants en 2026',
 'IPTV: الدليل الكامل للمبتدئين 2026',
 ARRAY['iptv guide', 'iptv beginner', 'what is iptv'], 'iptv', 'direct', 170),

('How to choose the best IPTV subscription in 2026',
 'Comment choisir le meilleur abonnement IPTV en 2026',
 'كيف تختار أفضل اشتراك IPTV في 2026',
 ARRAY['best iptv subscription', 'choose iptv', 'iptv buying guide'], 'iptv', 'direct', 180),

('Legal or illegal IPTV: what you really need to know',
 'IPTV légal ou illégal : ce qu''il faut vraiment savoir',
 'IPTV قانوني أم غير قانوني: ما يجب أن تعرفه',
 ARRAY['legal iptv', 'iptv legality', 'is iptv legal'], 'iptv', 'direct', 190),

('IPTV vs Netflix: which one should you choose in 2026',
 'IPTV vs Netflix : lequel choisir en 2026',
 'IPTV مقابل نتفليكس: أيهما تختار في 2026',
 ARRAY['iptv vs netflix', 'iptv comparison', 'streaming comparison'], 'iptv', 'direct', 200);
