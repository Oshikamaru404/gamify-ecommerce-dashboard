
CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  guest_name text,
  guest_email text NOT NULL,
  guest_token uuid NOT NULL DEFAULT gen_random_uuid(),
  display_name text,
  category text NOT NULL,
  subcategory text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  tags text[] NOT NULL DEFAULT '{}',
  admin_notes text,
  unread_admin integer NOT NULL DEFAULT 0,
  unread_user integer NOT NULL DEFAULT 0,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_conv_status ON public.chat_conversations(status, last_message_at DESC);
CREATE INDEX idx_chat_conv_user ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_conv_token ON public.chat_conversations(guest_token);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL,
  sender_name text,
  content text NOT NULL,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_msg_conv ON public.chat_messages(conversation_id, created_at);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Conversations: public can create + read + update (token-based access via app); admin full control
CREATE POLICY "Public create conversations" ON public.chat_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read conversations" ON public.chat_conversations FOR SELECT USING (true);
CREATE POLICY "Public update conversations" ON public.chat_conversations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Admin delete conversations" ON public.chat_conversations FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Messages
CREATE POLICY "Public create messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Admin delete messages" ON public.chat_messages FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- Trigger: update conv last_message_at and unread counters
CREATE OR REPLACE FUNCTION public.handle_chat_message_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.chat_conversations
  SET last_message_at = NEW.created_at,
      updated_at = now(),
      unread_admin = CASE WHEN NEW.sender_type = 'user' THEN unread_admin + 1 ELSE unread_admin END,
      unread_user = CASE WHEN NEW.sender_type = 'admin' THEN unread_user + 1 ELSE unread_user END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER chat_messages_after_insert
AFTER INSERT ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION public.handle_chat_message_insert();

-- Updated_at trigger on conversations
CREATE TRIGGER chat_conv_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER TABLE public.chat_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
