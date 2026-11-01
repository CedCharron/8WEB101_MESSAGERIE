-- ============================================================
-- FIL-ROUGE (8WEB101) - SCHEMA SQL DE REFERENCE
-- ============================================================
-- IMPORTANT : DOCUMENTATION DE L'INSTALLATION INITIALE.
-- NE PAS REEXECUTER SUR UNE BASE DEJA INITIALISEE.
-- Ce fichier ne contient PAS d'importation des anciens profils.
-- Ne pas utiliser la cle service_role dans le navigateur.
-- ============================================================

-- ============================================================
-- 1. SALONS PUBLICS
-- ============================================================

-- 1.1 Tables
CREATE TABLE public.channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
        CHECK (char_length(trim(name)) BETWEEN 1 AND 50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id)
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL
        REFERENCES public.channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id),
    username TEXT NOT NULL,
    content TEXT NOT NULL
        CHECK (char_length(trim(content)) BETWEEN 1 AND 2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 Securite RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "channels: lecture pour les personnes authentifiées"
ON public.channels FOR SELECT TO authenticated
USING (true);

CREATE POLICY "messages: lecture pour les personnes authentifiées"
ON public.messages FOR SELECT TO authenticated
USING (true);

CREATE POLICY "channels: création en son propre nom"
ON public.channels FOR INSERT TO authenticated
WITH CHECK (created_by = (SELECT auth.uid()));

CREATE POLICY "messages: création en son propre nom"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Aucune politique UPDATE/DELETE pour les clients authentifies.
-- Les privileges de ces deux tables doivent autoriser SELECT/INSERT.
-- Ils ont ete configures separement dans le projet existant.

-- 1.3 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================================
-- 2. MESSAGERIE PRIVEE
-- ============================================================

-- 2.1 Tables
CREATE TABLE public.conversation_privee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_b UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT utilisateurs_distincts CHECK (user_a <> user_b)
);

CREATE UNIQUE INDEX conversation_duo_unique
ON public.conversation_privee (
    LEAST(user_a, user_b),
    GREATEST(user_a, user_b)
);

CREATE TABLE public.messages_prives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Supprimer une conversation supprime ses messages.
    conversation_id UUID NOT NULL
        REFERENCES public.conversation_privee(id) ON DELETE CASCADE,
    expediteur_id UUID NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id),
    content TEXT NOT NULL
        CHECK (char_length(trim(content)) BETWEEN 1 AND 2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX messages_prives_conversation_date
ON public.messages_prives (conversation_id, created_at DESC);