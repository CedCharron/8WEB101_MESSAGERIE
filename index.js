
//-----------INDEX----------------
const courrielConnexion = document.querySelector("#email");
const motDePasseConnexion=document.querySelector("#motPasse")
const boutonConnexion=document.querySelector("#bouton-connexion")

//Connexion a la messagerie
boutonConnexion.addEventListener("click",async function(){
    const email = courrielConnexion.value.trim();
    const password = motDePasseConnexion.value;
    
    //Validation des champs vide
    if (email==="" || password===""){
        alert("Veuillez remplir tout les champs.")
        return;
    }

    //Verification dans supabase
    const { data, error } = await Auth.signIn(email, password);

    if(error){
        console.error("Erreur de connexion : ", error.message);
        alert("Connexion impossible, veuillez verifier vos identifiants.")
        return;
    }

    // Connexion réussie
    console.log("Connexion réussie !");
    window.location.href = "conversation.html";
});

