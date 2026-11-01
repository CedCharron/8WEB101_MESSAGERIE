//-----------auth.HTML----------------

//Objet reliees a l'authentification 
const Auth = {
    
    //Inscription d'un utilisateur
    async signUp(email, password,userName) {
        return await supabaseClient.auth.signUp({
            email,
            password,
            options:{
                data:{
                    username: userName
                }
            }
        });
    },

     // Connexion d'un utilisateur
    async signIn(email, password) {
        return await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
    },

    //Fonction de controle d'acces 
    async getUser() {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error || !data.session) {
            return {
                user: null,
                error: error ?? new Error("Aucune session")
            };
        }

        return {
            user: data.session.user,
            error: null
        };
    },

    //Fonction de deconnexion 
    async signOut(){
        return await supabaseClient.auth.signOut();
    },
    
};

