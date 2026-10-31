//-----------INSCRIPTION----------------
const courrielInscription = document.querySelector("#email-inscription");
const motDePasseInscription=document.querySelector("#mot-passe-inscription")
const nomUtilisateurInscription=document.querySelector("#nom-utilisateur-inscription")
const boutonInscription=document.querySelector("#bouton-inscription")

//Incription a la messagerie 
boutonInscription.addEventListener("click", async function() {
    const email = courrielInscription.value.trim();
    const password = motDePasseInscription.value;
    const userName=nomUtilisateurInscription.value.trim();

    //Validation des champs vide
    if (email==="" || password==="" || userName===""){
        alert("Veuillez remplir tout les champs.")
        return;
    }
    
    //Creation de compte avec supabase
    const { data, error } = await Auth.signUp(email, password, userName);

    //Si erreur de creation de compte 
    if (error) {
        console.error("Erreur d'inscription :", error.message);
        return;
    }

    console.log("Nouvelle inscription :", data.user);
    alert("Inscription terminée ! Une confirmation a été envoyée par courriel.");
});