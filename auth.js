//-----------auth.HTML----------------


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
    }
    
};

