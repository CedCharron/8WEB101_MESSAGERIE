// ---------- PARAMÈTRES ----------

const nomUtilisateur = document.querySelector("#nom-utilisateur");
const courrielUtilisateur = document.querySelector("#courriel-utilisateur");
const boutonDeconnexion = document.querySelector("#bouton-deconnexion");
const boutonSupressionCompte=document.querySelector("#bouton-suppression-compte")

// Afficher les informations du compte connecté
async function chargerParametres() {
    const { user, error } = await Auth.getUser();

    if (error || !user) {
        window.location.href = "index.html";
        return;
    }

    nomUtilisateur.textContent =
        user.user_metadata.username || "Non défini";

    courrielUtilisateur.textContent =
        user.email || "Non disponible";
}

// Déconnecter l'utilisateur
boutonDeconnexion.addEventListener("click", async () => {
    const { error } = await Auth.signOut();

    if (error) {
        console.error("Erreur de déconnexion :", error);
        return;
    }

    window.location.href = "index.html";
});

//Suppression du compte 
boutonSupressionCompte.addEventListener("click", function(){
    alert("Envoyez un message a l'administrateur du site pour faire supprimer votre compte.");
})

chargerParametres();