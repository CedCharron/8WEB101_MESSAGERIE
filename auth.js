const Auth = {
    async signUp(email, password) {
        return await supabaseClient.auth.signUp({
            email,
            password
        });
    }
};