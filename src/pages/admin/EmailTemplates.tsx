import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Mail, RotateCcw, Save, Send } from 'lucide-react';

interface EditableField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  helpText?: string;
}

interface TemplateMeta {
  templateName: string;
  displayName: string;
  to?: string;
  defaults: Record<string, string>;
  editableFields: EditableField[];
  previewData: Record<string, any>;
}

interface OverrideRow {
  template_name: string;
  overrides: Record<string, string>;
  enabled: boolean;
}

const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [overridesMap, setOverridesMap] = useState<Record<string, OverrideRow>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [enabled, setEnabled] = useState(true);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [rendering, setRendering] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const renderTimer = useRef<ReturnType<typeof setTimeout>>();

  // Load template list + overrides
  useEffect(() => {
    (async () => {
      try {
        const [{ data: list, error: listErr }, { data: rows, error: rowsErr }] = await Promise.all([
          supabase.functions.invoke('admin-email-templates', { body: { action: 'list' } }),
          supabase.from('email_template_overrides').select('*'),
        ]);
        if (listErr) throw listErr;
        if (rowsErr) throw rowsErr;
        const tpls: TemplateMeta[] = (list as any)?.templates || [];
        setTemplates(tpls);
        const map: Record<string, OverrideRow> = {};
        (rows as any[] | null)?.forEach((r) => { map[r.template_name] = r as OverrideRow; });
        setOverridesMap(map);
        if (tpls.length) setActive(tpls[0].templateName);
      } catch (e: any) {
        console.error(e);
        toast.error(`Failed to load templates: ${e?.message || e}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // When active template changes, hydrate draft
  useEffect(() => {
    if (!active) return;
    const meta = templates.find((t) => t.templateName === active);
    if (!meta) return;
    const existing = overridesMap[active];
    setDraft({ ...(existing?.overrides || {}) });
    setEnabled(existing?.enabled ?? true);
  }, [active, templates, overridesMap]);

  const activeMeta = useMemo(
    () => templates.find((t) => t.templateName === active) || null,
    [templates, active]
  );

  // Live preview (debounced)
  useEffect(() => {
    if (!active) return;
    if (renderTimer.current) clearTimeout(renderTimer.current);
    renderTimer.current = setTimeout(async () => {
      setRendering(true);
      try {
        const { data, error } = await supabase.functions.invoke('admin-email-templates', {
          body: {
            action: 'render',
            templateName: active,
            overrides: enabled ? draft : {},
          },
        });
        if (error) throw error;
        setPreviewHtml((data as any)?.html || '');
        setPreviewSubject((data as any)?.subject || '');
      } catch (e: any) {
        toast.error(`Preview failed: ${e?.message || e}`);
      } finally {
        setRendering(false);
      }
    }, 350);
    return () => { if (renderTimer.current) clearTimeout(renderTimer.current); };
  }, [active, draft, enabled]);

  const handleSave = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const payload = {
        template_name: active,
        overrides: draft,
        enabled,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('email_template_overrides')
        .upsert(payload, { onConflict: 'template_name' });
      if (error) throw error;
      setOverridesMap((m) => ({ ...m, [active]: payload as OverrideRow }));
      toast.success('Template saved');
    } catch (e: any) {
      toast.error(`Save failed: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetField = (key: string) => {
    setDraft((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
  };

  const handleResetAll = () => {
    setDraft({});
    toast.message('Reset to defaults — click Save to apply');
  };

  const handleSendTest = async () => {
    if (!active || !testEmail) {
      toast.error('Enter a recipient email');
      return;
    }
    setSendingTest(true);
    try {
      const meta = templates.find((t) => t.templateName === active);
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: active,
          recipientEmail: testEmail,
          templateData: meta?.previewData || {},
        },
      });
      if (error) throw error;
      toast.success(`Test email sent to ${testEmail}`);
    } catch (e: any) {
      toast.error(`Send failed: ${e?.message || e}`);
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Mail className="h-7 w-7" /> Email Templates
        </h1>
        <p className="text-muted-foreground">
          Customize subjects, headings, and body copy for every transactional email.
          Changes apply immediately to all future sends.
        </p>
      </div>

      {!templates.length ? (
        <Card className="p-6">No templates available.</Card>
      ) : (
        <Tabs value={active ?? undefined} onValueChange={setActive} className="w-full">
          <div className="overflow-x-auto -mx-2 px-2">
            <TabsList className="inline-flex gap-1 h-auto min-w-max">
              {templates.map((t) => (
                <TabsTrigger
                  key={t.templateName}
                  value={t.templateName}
                  className="text-xs sm:text-sm px-3 py-2"
                >
                  {t.displayName}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {templates.map((t) => (
            <TabsContent key={t.templateName} value={t.templateName} className="space-y-4">
              {active === t.templateName && activeMeta && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Editor */}
                  <Card className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">{activeMeta.displayName}</h2>
                        <p className="text-xs text-muted-foreground font-mono">{activeMeta.templateName}</p>
                        {activeMeta.to && (
                          <p className="text-xs text-muted-foreground mt-1">→ Sent to: {activeMeta.to}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="enabled" className="text-xs">Apply</Label>
                        <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
                      </div>
                    </div>

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {activeMeta.editableFields.map((f) => {
                        const value = draft[f.key] ?? '';
                        const placeholder = activeMeta.defaults[f.key] ?? '';
                        const isOverridden = draft[f.key] !== undefined && draft[f.key] !== '';
                        return (
                          <div key={f.key} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">{f.label}</Label>
                              {isOverridden && (
                                <button
                                  type="button"
                                  onClick={() => handleResetField(f.key)}
                                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                >
                                  <RotateCcw className="h-3 w-3" /> Reset
                                </button>
                              )}
                            </div>
                            {f.type === 'textarea' ? (
                              <Textarea
                                value={value}
                                placeholder={placeholder}
                                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                                rows={3}
                                maxLength={2000}
                              />
                            ) : (
                              <Input
                                value={value}
                                placeholder={placeholder}
                                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                                maxLength={500}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save changes
                      </Button>
                      <Button variant="outline" onClick={handleResetAll}>
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset all
                      </Button>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-xs">Send a test email</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                        />
                        <Button onClick={handleSendTest} disabled={sendingTest || !testEmail} variant="secondary">
                          {sendingTest ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                          Send test
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Uses sample preview data. Save before sending if you want the latest changes.
                      </p>
                    </div>
                  </Card>

                  {/* Preview */}
                  <Card className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Live preview</h3>
                      {rendering && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                    </div>
                    <div className="text-xs text-muted-foreground border rounded p-2 bg-muted/30">
                      <span className="font-medium">Subject:</span> {previewSubject || '—'}
                    </div>
                    <div className="border rounded overflow-hidden bg-white">
                      <iframe
                        title="Email preview"
                        srcDoc={previewHtml}
                        sandbox=""
                        className="w-full"
                        style={{ height: '70vh', border: 0 }}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default EmailTemplates;
