
//-----------INDEX.HTML----------------
const courriel = document.querySelector("#email");
const motDePasse=document.querySelector("#motPasse")
const boutonInscription = document.querySelector("#bouton-inscription")
const boutonConnexion=document.querySelector("#bouton-connexion")

boutonInscription.addEventListener("click", function() {
    const email=courriel.value.trim();
    const password=motDePasse.value;

    console.log("Demande d'inscription : ", email);
});


/*

// Écouteur d'événement pour la validation du courriel
courriel.addEventListener("input", function(event) {
    const valeur = event.target.value;
    const valeurArobase = valeur.split("@"); // Vérifie si le courriel contient un "@"
    const valeurPoint = valeur.split("."); // Vérifie si le courriel contient un "."
    const longueurValide = valeur.length > 5; // Vérifie si le courriel a plus de 5 caractères

    if(valeurArobase, valeurPoint && longueurValide) {
        courriel.style.borderColor = "green";
    } else {
        courriel.style.borderColor = "red";
    }
    console.log("Courriel : ", valeur)
})

// Écouteur d'événement pour la validation du mot de passe
const motDePasse = document.querySelector("#motPasse");
motDePasse.addEventListener("input", function(event) {
   const valeur = event.target.value;
   const longueurValide = valeur.length >= 8; // Vérifie si le mot de passe a au moins 8 caractères
   const contientChiffre = /[0-9]/.test(valeur); // Vérifie si le mot de passe contient au moins un chiffre
   const contientSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(valeur); // Vérifie si le mot de passe contient au moins un caractère spécial

    if(longueurValide && contientChiffre && contientSpecial) {
        motDePasse.style.borderColor = "green";
    } else {
        motDePasse.style.borderColor = "red";
    }
    console.log("Mot de passe : ", valeur)
})*/
