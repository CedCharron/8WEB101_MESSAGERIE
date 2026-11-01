//S'assurer d'avoir une session connecte pour avoir acces 
async function verifierConnexion() {
    const { user, error } = await Auth.getUser();

    if (error || user === null) {
        window.location.href = "index.html";
        return;
    }

    console.log("Utilisateur connecté :", user.id);
}

verifierConnexion();


const titre= document.querySelector("#titre-discussion");
const nomNouveauSalon = document.querySelector("#nouveau-salon-input") //Valeur d'entree dans boite creation de salon
const boutonCreerSalon=document.querySelector("#creer-salon") //Bouton pour creation nouveau salon 
const listeSalons = document.querySelector("#liste-salons");
const discussion = document.querySelector("#discussion");
const messageInput = document.querySelector("#message-input");
const envoyerMessageButton = document.querySelector("#envoyer-message");
const boutonDeconnexion =document.querySelector("#bouton-deconnexion");

async function chargerSalons() {
    const { data, error } = await Data.fetchChannels();

    if (error) {
        console.error("Erreur de chargement :", error.message);
        return;
    }

    // Création des boutons pour chaque salon
    for (let i = 0; i < data.length; i++) {
        const nouvelElement = document.createElement("li"); // Création d'un élément de liste
        const nouveauBouton = document.createElement("button"); // Création d'un bouton
        nouveauBouton.classList.add("bouton-salon"); // Ajout de la classe CSS au bouton
        nouveauBouton.dataset.id=data[i].id; // Attribution de l'ID d'un salon au bouton  
        nouveauBouton.textContent = data[i].name; //Attribution du nom du salon au bouton
        nouvelElement.appendChild(nouveauBouton); // Ajout du bouton à l'élément de liste
        listeSalons.appendChild(nouvelElement); // Ajout de l'élément de liste à la liste des salons
    }

    console.log("Salons récupérés :", data);
}

chargerSalons();


//Attribution à zéro de la mémoire du salon 
let salonSelectionneID = null;

//Se desabonner de l'ecoute du salon 
let seDesabonnerMessages = null;

//Envoyer message en cliquant ENTER
messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        envoyerMessageButton.click();
    }
});

//Fonction pour envoyer message 
envoyerMessageButton.addEventListener("click", async function() {
    const texteMessage = messageInput.value.trim(); //Ajuster le texte des message 
    const nouvelleBulleMessage=document.createElement("p"); //Creation d'une nouvelle bulle 
    nouvelleBulleMessage.classList.add("bulle-message-envoye");
    if(texteMessage === ""||salonSelectionneID === null) {
        return;
    }

    // Récupérer l'utilisateur connecté
    const { user, error: authError } = await Auth.getUser();

    if (authError || user === null) {
        console.error("Utilisateur non connecté");
        return;
    }

    // Récupérer son pseudonyme
    const username = user.user_metadata.username;

    // Envoyer le message vers Supabase
    const { error } = await Data.sendMessage(
        salonSelectionneID,
        texteMessage,
        username
    );

    if (error) {
        console.error("Erreur d'envoi :", error.message);
        return;
    }


    console.log("Message envoyé : " + texteMessage + " (Contact ID : " + salonSelectionneID + ")");

    messageInput.value=""; //Effacer les caractères après création du salon 
});

//Creer salon en cliquant ENTER
nomNouveauSalon.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        boutonCreerSalon.click();
    }
});

//Action de click sur un salon 
listeSalons.addEventListener("click", async function(event) {
    const boutonClique = event.target.closest(".bouton-salon");

    if (boutonClique === null) {
        return;
    }
    
    //Affichage en en-tête du salon de discussion 
    titre.textContent = "Discussion avec " + boutonClique.textContent;
    salonSelectionneID = boutonClique.dataset.id;
    
    const { data, error } = await Data.fetchMessages(salonSelectionneID);
    const { user } = await Auth.getUser(); //Recuperer l'ID de l'utilisateur

    if (error) {
        console.error("Erreur de récupération des messages :", error.message);
        return;
    }   

    if (user === null) {
    console.error("Utilisateur non connecté");
    window.location.href = "index.html";
    return;
    }

    console.log("Message récupérés : ", data);


    discussion.textContent="";
        
    const messages = data.reverse();

    for (let i = 0; i < messages.length; i++) {
        const bulleMessageHistorique = document.createElement("p");
        bulleMessageHistorique.textContent=messages[i].content;
        if(messages[i].user_id === user.id){            
            bulleMessageHistorique.classList.add("bulle-message-envoye");
            discussion.appendChild(bulleMessageHistorique);
        }
        
        else {
            bulleMessageHistorique.classList.add("bulle-message-recu");
            discussion.appendChild(bulleMessageHistorique);
            }
    }

        // Arrêter l'écoute de l'ancien salon
    if (seDesabonnerMessages !== null) {
        seDesabonnerMessages();
    }

    // Écouter les nouveaux messages du salon sélectionné
    seDesabonnerMessages = Data.subscribeToMessages(
        salonSelectionneID,
    function(nouveauMessage) {
        console.log("ÉVÉNEMENT REALTIME REÇU :", nouveauMessage);

        const nouvelleBulle = document.createElement("p");

        nouvelleBulle.textContent = nouveauMessage.content;

            if (nouveauMessage.user_id === user.id) {
                nouvelleBulle.classList.add("bulle-message-envoye");
            } else {
                nouvelleBulle.classList.add("bulle-message-recu");
            }

            discussion.appendChild(nouvelleBulle);
            discussion.scrollTop = discussion.scrollHeight;
        }
    );
});

//Création d'un nouveau salon 
boutonCreerSalon.addEventListener("click",async function(){
    const nomSalon=nomNouveauSalon.value.trim(); //Ajustement du nom pour creation nouveau salon 
    
    //Fonction pour eviter d'avoir un nom de groupe vide 
    if(nomSalon===""){
        alert("Veuillez entrer un nom de salon ! ");
        return;
    }

    const { data, error } = await Data.createChannel(nomSalon);

    //Detection d'erreur de creation de salon 
    if (error) {
        console.error("Erreur de création du salon :", error.message);
        return;
    }
        
    console.log("Nouveau salon : "+ nomSalon);
    nomNouveauSalon.value=""; //Effacer les caractères après création du salon 

    //Creation du bouton pour le salon 
    const nouvelElement = document.createElement("li");
    const nouveauBouton = document.createElement("button");
    nouveauBouton.classList.add("bouton-salon"); // Ajout de la classe CSS au bouton
    nouveauBouton.dataset.id=data.id; // Attribution de l'ID d'un salon au bouton  
    nouveauBouton.textContent = data.name; //Attribution du nom du salon au bouton
    nouvelElement.appendChild(nouveauBouton); // Ajout du bouton à l'élément de liste
    listeSalons.appendChild(nouvelElement); // Ajout de l'élément de liste à la liste des salons

})

//Deconnexion 
boutonDeconnexion.addEventListener("click", async function(event){
    event.preventDefault();

    const {error} = await Auth.signOut();

    if(error){
        console.error("Erreur de deconnexion : ", error.message);
        return;
    }

    window.location.href="index.html";
});