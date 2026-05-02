import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Play, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const LANGS = ['en', 'fr', 'ar'] as const;

const BlogAutoPublishingPanel = () => {
  const queryClient = useQueryClient();
  const [isRunning, setIsRunning] = useState(false);
  const [newTopic, setNewTopic] = useState({
    topic_en: '',
    topic_fr: '',
    topic_ar: '',
    target_keywords: '',
    category: 'iptv',
  });

  // Config
  const { data: config } = useQuery({
    queryKey: ['blog-automation-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_automation_config')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Topics
  const { data: topics } = useQuery({
    queryKey: ['blog-topics-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_topics_queue')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Logs
  const { data: logs } = useQuery({
    queryKey: ['blog-generation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_generation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  // Mutations
  const updateConfig = useMutation({
    mutationFn: async (patch: Partial<{ is_active: boolean; languages: string[]; auto_publish: boolean; articles_per_run: number; ai_model: string }>) => {
      if (!config?.id) return;
      const { error } = await supabase
        .from('blog_automation_config')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', config.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-automation-config'] });
      toast.success('Configuration updated');
    },
    onError: (err: any) => toast.error(`Update failed: ${err.message}`),
  });

  const updateSchedule = useMutation({
    mutationFn: async (newSchedule: string) => {
      const { error } = await supabase.rpc('update_blog_cron_schedule', { new_schedule: newSchedule });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-automation-config'] });
      toast.success('Publishing schedule updated');
    },
    onError: (err: any) => toast.error(`Schedule update failed: ${err.message}`),
  });

  const [customCron, setCustomCron] = useState('');
  React.useEffect(() => {
    if (config?.cron_schedule) setCustomCron(config.cron_schedule);
  }, [config?.cron_schedule]);

  const SCHEDULE_PRESETS = [
    { label: 'Daily at 09:00 UTC', value: '0 9 * * *' },
    { label: 'Mon/Wed/Fri at 09:00 UTC', value: '0 9 * * 1,3,5' },
    { label: 'Twice daily (09:00 & 21:00)', value: '0 9,21 * * *' },
    { label: 'Weekly (Monday 09:00 UTC)', value: '0 9 * * 1' },
    { label: 'Every 6 hours', value: '0 */6 * * *' },
  ];

  const addTopic = useMutation({
    mutationFn: async () => {
      const keywords = newTopic.target_keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      const { error } = await supabase.from('blog_topics_queue').insert({
        topic_en: newTopic.topic_en || null,
        topic_fr: newTopic.topic_fr || null,
        topic_ar: newTopic.topic_ar || null,
        target_keywords: keywords,
        category: newTopic.category,
        sort_order: 1000,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-topics-queue'] });
      setNewTopic({ topic_en: '', topic_fr: '', topic_ar: '', target_keywords: '', category: 'iptv' });
      toast.success('Topic added');
    },
    onError: (err: any) => toast.error(`Add failed: ${err.message}`),
  });

  const deleteTopic = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_topics_queue').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-topics-queue'] });
      toast.success('Topic deleted');
    },
  });

  const resetTopic = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_topics_queue')
        .update({ status: 'pending', published_languages: [] })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-topics-queue'] });
      toast.success('Topic reset to pending');
    },
  });

  const runNow = async (topicId?: string) => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-article', {
        body: topicId ? { topic_id: topicId } : { trigger: 'manual' },
      });
      if (error) throw error;
      if (data?.ok) {
        toast.success('Article(s) generated successfully');
        queryClient.invalidateQueries({ queryKey: ['blog-topics-queue'] });
        queryClient.invalidateQueries({ queryKey: ['blog-generation-logs'] });
        queryClient.invalidateQueries({ queryKey: ['blog-articles'] });
      } else {
        toast.error(data?.message || data?.error || 'Generation failed');
      }
    } catch (err: any) {
      toast.error(`Generation error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleLang = (lang: string) => {
    if (!config) return;
    const current: string[] = config.languages || [];
    const next = current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang];
    if (next.length === 0) {
      toast.error('At least one language must remain active');
      return;
    }
    updateConfig.mutate({ languages: next });
  };

  // Stats
  const stats = React.useMemo(() => {
    if (!logs) return { total: 0, success: 0, failed: 0, byLang: {} as Record<string, number> };
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = logs.filter((l) => new Date(l.created_at).getTime() > monthAgo);
    const success = recent.filter((l) => l.status === 'success').length;
    const failed = recent.filter((l) => l.status === 'failed').length;
    const byLang: Record<string, number> = {};
    for (const l of recent.filter((x) => x.status === 'success')) {
      byLang[l.language] = (byLang[l.language] || 0) + 1;
    }
    return { total: recent.length, success, failed, byLang };
  }, [logs]);

  const pendingTopics = topics?.filter((t) => t.status === 'pending').length || 0;
  const publishedTopics = topics?.filter((t) => t.status === 'published').length || 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Articles (30j)</CardDescription>
            <CardTitle className="text-3xl">{stats.success}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failed (30j)</CardDescription>
            <CardTitle className="text-3xl text-destructive">{stats.failed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Topics pending</CardDescription>
            <CardTitle className="text-3xl">{pendingTopics}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Topics published</CardDescription>
            <CardTitle className="text-3xl">{publishedTopics}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Config */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Auto-publishing IA — runs Mon/Wed/Fri at 09:00 UTC (cron)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Automation active</Label>
              <p className="text-sm text-muted-foreground">
                Enable scheduled article generation
              </p>
            </div>
            <Switch
              checked={!!config?.is_active}
              onCheckedChange={(v) => updateConfig.mutate({ is_active: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Auto-publish</Label>
              <p className="text-sm text-muted-foreground">
                Publish articles immediately (vs. draft)
              </p>
            </div>
            <Switch
              checked={!!config?.auto_publish}
              onCheckedChange={(v) => updateConfig.mutate({ auto_publish: v })}
            />
          </div>

          <div>
            <Label className="text-base mb-3 block">Active languages</Label>
            <div className="flex gap-2">
              {LANGS.map((lang) => {
                const active = config?.languages?.includes(lang);
                return (
                  <Button
                    key={lang}
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleLang(lang)}
                  >
                    {lang.toUpperCase()}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() => runNow()} disabled={isRunning} size="lg">
              {isRunning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Run now (test generation)
            </Button>
            {config?.last_run_at && (
              <p className="text-sm text-muted-foreground mt-2">
                Last run: {new Date(config.last_run_at).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="topics">
        <TabsList>
          <TabsTrigger value="topics">Topics queue ({topics?.length || 0})</TabsTrigger>
          <TabsTrigger value="logs">Generation logs</TabsTrigger>
        </TabsList>

        {/* Topics */}
        <TabsContent value="topics" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add new topic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Topic EN</Label>
                  <Input
                    value={newTopic.topic_en}
                    onChange={(e) => setNewTopic({ ...newTopic, topic_en: e.target.value })}
                    placeholder="e.g. Best IPTV for…"
                  />
                </div>
                <div>
                  <Label>Topic FR</Label>
                  <Input
                    value={newTopic.topic_fr}
                    onChange={(e) => setNewTopic({ ...newTopic, topic_fr: e.target.value })}
                    placeholder="ex. Meilleur IPTV pour…"
                  />
                </div>
                <div>
                  <Label>Topic AR</Label>
                  <Input
                    value={newTopic.topic_ar}
                    onChange={(e) => setNewTopic({ ...newTopic, topic_ar: e.target.value })}
                    placeholder="مثال…"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Target keywords (comma separated)</Label>
                  <Textarea
                    value={newTopic.target_keywords}
                    onChange={(e) => setNewTopic({ ...newTopic, target_keywords: e.target.value })}
                    placeholder="iptv 2026, best iptv, premium iptv"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newTopic.category}
                    onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                  >
                    <option value="iptv">IPTV</option>
                    <option value="player">Player</option>
                  </select>
                </div>
              </div>
              <Button
                onClick={() => addTopic.mutate()}
                disabled={!newTopic.topic_en && !newTopic.topic_fr && !newTopic.topic_ar}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add topic
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics?.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="max-w-md">
                        <div className="font-medium truncate">
                          {t.topic_en || t.topic_fr || t.topic_ar}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {(t.target_keywords || []).join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{t.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            t.status === 'published'
                              ? 'default'
                              : t.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {(t.published_languages || []).map((l: string) => (
                            <Badge key={l} variant="outline" className="text-xs">
                              {l}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runNow(t.id)}
                            disabled={isRunning}
                            title="Generate now"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          {t.status === 'published' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resetTopic.mutate(t.id)}
                              title="Reset to pending"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTopic.mutate(t.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs */}
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardContent className="pt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Lang</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs?.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-xs">
                        {new Date(l.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{l.language}</Badge>
                      </TableCell>
                      <TableCell>
                        {l.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" /> success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-destructive">
                            <AlertCircle className="h-4 w-4" /> failed
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {l.duration_ms ? `${(l.duration_ms / 1000).toFixed(1)}s` : '—'}
                      </TableCell>
                      <TableCell className="max-w-md text-xs text-muted-foreground truncate">
                        {l.error_message || (l.article_id ? `Article: ${l.article_id.slice(0, 8)}…` : '—')}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!logs || logs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No generation logs yet. Click "Run now" to test.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogAutoPublishingPanel;
