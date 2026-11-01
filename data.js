//-------DATA-------------

//Objet reliees au stockage
const Data={

    //Recuperer les salons 
    async fetchChannels() {
        return await supabaseClient
            .from("channels")
            .select("*")
            .order("name");
    },

    async createChannel(name){
        return await supabaseClient
        .from("channels")
        .insert({name})
        .select()
        .single();
    },

    // Récupérer les 50 derniers messages d'un salon
    async fetchMessages(channelId) {
        return await supabaseClient
        .from("messages")
        .select("id, content, created_at, user_id, username")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: false })
        .limit(50);
    },
    
    // Enregistrer un message dans Supabase
    async sendMessage(channelId, content, username) {
        return await supabaseClient
            .from("messages")
            .insert({
                channel_id: channelId,
                content,
                username
            });
    },

    // Écouter les nouveaux messages d'un salon
    subscribeToMessages(channelId, onNewMessage) {
        const subscription = supabaseClient
            .channel("messages-" + channelId)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: "channel_id=eq." + channelId
                },
                (payload) => onNewMessage(payload.new)
            )
            .subscribe((status) => {
                console.log("État Realtime :", status); 
            });

        return () => supabaseClient.removeChannel(subscription);
    },

    async fetchProfiles() {
    return await supabaseClient
        .from("profiles")
        .select("id, username")
        .order("username");
    },

    async fetchPrivateConversation(userA, userB) {
        return await supabaseClient
            .from("conversation_privee")
            .select("id")
            .or(
                `and(user_a.eq.${userA},user_b.eq.${userB}),` +
                `and(user_a.eq.${userB},user_b.eq.${userA})`
            )
            .maybeSingle();
    },

    async createPrivateConversation(userA, userB) {
    return await supabaseClient
        .from("conversation_privee")
        .insert({
            user_a: userA,
            user_b: userB
        })
        .select("id")
        .single();
    },

    async sendPrivateMessage(conversationId, content) {
    return await supabaseClient
        .from("messages_prives")
        .insert({
            conversation_id: conversationId,
            content: content
        });
    },

    async fetchPrivateMessages(conversationId) {
    return await supabaseClient
        .from("messages_prives")
        .select("id, content, expediteur_id, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
},
};

