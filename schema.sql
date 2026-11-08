
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

-- Lecture des salons
CREATE POLICY "channels: lecture pour les personnes authentifiées"
ON public.channels FOR SELECT TO authenticated
USING (true);

-- Lecture des messages publics
CREATE POLICY "messages: lecture pour les personnes authentifiées"
ON public.messages FOR SELECT TO authenticated
USING (true);

-- Creation d'un salon sous son propre identifiant
CREATE POLICY "channels: création en son propre nom"
ON public.channels FOR INSERT TO authenticated
WITH CHECK (created_by = (SELECT auth.uid()));

-- Envoi de messages sous son propre identifiant
CREATE POLICY "messages: création en son propre nom"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Permissions
GRANT SELECT, INSERT ON public.channels TO authenticated;
GRANT SELECT, INSERT ON public.messages TO authenticated;

-- Aucune politique UPDATE/DELETE pour les clients.


-- 1.3 Realtime - Salons publics
ALTER PUBLICATION supabase_realtime
ADD TABLE public.channels;

ALTER PUBLICATION supabase_realtime
ADD TABLE public.messages;


-- ============================================================
-- 2. MESSAGERIE PRIVEE
-- ============================================================

-- 2.1 Tables
CREATE TABLE public.conversation_privee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    user_b UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT utilisateurs_distincts CHECK (user_a <> user_b)
);

-- Empecher les conversations en double
CREATE UNIQUE INDEX conversation_duo_unique
ON public.conversation_privee (
    LEAST(user_a, user_b),
    GREATEST(user_a, user_b)
);

CREATE TABLE public.messages_prives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL
        REFERENCES public.conversation_privee(id) ON DELETE CASCADE,
    expediteur_id UUID NOT NULL DEFAULT auth.uid()
        REFERENCES auth.users(id),
    content TEXT NOT NULL
        CHECK (char_length(trim(content)) BETWEEN 1 AND 2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Accelerer la recherche de l'historique
CREATE INDEX messages_prives_conversation_date
ON public.messages_prives (conversation_id, created_at DESC);

-- Accelerer les recherches par participant
CREATE INDEX conversation_privee_user_a_idx
ON public.conversation_privee (user_a);

CREATE INDEX conversation_privee_user_b_idx
ON public.conversation_privee (user_b);


-- 2.2 Securite RLS - Messagerie privee
ALTER TABLE public.conversation_privee
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.messages_prives
ENABLE ROW LEVEL SECURITY;

-- Lire uniquement les conversations auxquelles on participe
CREATE POLICY "conversations: lecture des participants"
ON public.conversation_privee
FOR SELECT TO authenticated
USING (
    user_a = (SELECT auth.uid())
    OR user_b = (SELECT auth.uid())
);

-- Creer une conversation seulement si on y participe
CREATE POLICY "conversations: création par un participant"
ON public.conversation_privee
FOR INSERT TO authenticated
WITH CHECK (
    user_a = (SELECT auth.uid())
    OR user_b = (SELECT auth.uid())
);

-- Lire uniquement les messages de ses conversations
CREATE POLICY "messages privés: lecture des participants"
ON public.messages_prives
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.conversation_privee AS c
        WHERE c.id = conversation_id
        AND (
            c.user_a = (SELECT auth.uid())
            OR c.user_b = (SELECT auth.uid())
        )
    )
);

-- Envoyer uniquement ses propres messages
-- dans une conversation dont on est participant
CREATE POLICY "messages privés: envoi par un participant"
ON public.messages_prives
FOR INSERT TO authenticated
WITH CHECK (
    expediteur_id = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1
        FROM public.conversation_privee AS c
        WHERE c.id = conversation_id
        AND (
            c.user_a = (SELECT auth.uid())
            OR c.user_b = (SELECT auth.uid())
        )
    )
);

-- Permissions
GRANT SELECT, INSERT
ON public.conversation_privee TO authenticated;

GRANT SELECT, INSERT
ON public.messages_prives TO authenticated;

-- Aucune politique UPDATE/DELETE pour les clients.


-- 2.3 Realtime - Messagerie privee
-- Detecter les nouvelles conversations
ALTER PUBLICATION supabase_realtime
ADD TABLE public.conversation_privee;

-- Recevoir automatiquement les nouveaux messages prives
ALTER PUBLICATION supabase_realtime
ADD TABLE public.messages_prives;


-- ============================================================
-- FIN DU SCHEMA SQL DE REFERENCE
-- ============================================================
