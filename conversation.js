const titre= document.querySelector("#titre-discussion");
const nomNouveauSalon = document.querySelector("#nouveau-salon-input") //Valeur d'entree dans boite creation de salon
const boutonCreerSalon=document.querySelector("#creer-salon") //Bouton pour creation nouveau salon 
const salon=[
    {"id": 101, "nom": "Killer Duck's🦆"}, 
    {"id": 102, "nom": "Robot inc.🤖"}, 
    {"id": 103, "nom": "Tokebak automation🛺"}, 
    {"id": 104, "nom": "Volley-Ball🏐"}
];
const listeSalons = document.querySelector("#liste-salons");
const discussion = document.querySelector("#discussion");
const conversations = {};
const messageInput = document.querySelector("#message-input");
const envoyerMessageButton = document.querySelector("#envoyer-message");


salon.sort((a,b)=>a.nom.localeCompare(b.nom));

// Création des boutons pour chaque salon
for (let i = 0; i < salon.length; i++) {
    const nouvelElement = document.createElement("li"); // Création d'un élément de liste
    const nouveauBouton = document.createElement("button"); // Création d'un bouton
    nouveauBouton.classList.add("bouton-salon"); // Ajout de la classe CSS au bouton
    nouveauBouton.dataset.id=salon[i].id; // Attribution de l'ID d'un salon au bouton  
    nouveauBouton.textContent = salon[i].nom; //Attribution du nom du salon au bouton
    nouvelElement.appendChild(nouveauBouton); // Ajout du bouton à l'élément de liste
    listeSalons.appendChild(nouvelElement); // Ajout de l'élément de liste à la liste des salons
}

//Attribution à zéro de la mémoire du salon 
let salonSelectionneID = null;

//Envoyer message en cliquant ENTER
messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        envoyerMessageButton.click();
    }
});

//Fonction pour envoyer message 
envoyerMessageButton.addEventListener("click", function() {
    const texteMessage = messageInput.value.trim(); //Ajuster le texte des message 
    const nouvelleBulleMessage=document.createElement("p"); //Creation d'une nouvelle bulle 
    nouvelleBulleMessage.classList.add("bulle-message-envoye");
    if(texteMessage === ""||salonSelectionneID === null) {
        return;
    }
    nouvelleBulleMessage.textContent=texteMessage;
    discussion.appendChild(nouvelleBulleMessage);
    discussion.scrollTop=discussion.scrollHeight;
    console.log("Message envoyé : " + texteMessage + " (Contact ID : " + salonSelectionneID + ")");
    if (conversations[salonSelectionneID] === undefined) {
    conversations[salonSelectionneID] = [];
    }
    messageInput.value=""; //Effacer les caractères après création du salon 

    //Conserver les message 
    conversations[salonSelectionneID].push({ 
        texte: texteMessage,
        expediteur: "moi"
    });


});

//Creer salon en cliquant ENTER
nomNouveauSalon.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        boutonCreerSalon.click();
    }
});

listeSalons.addEventListener("click", function(event) {
    const boutonClique = event.target.closest(".bouton-salon");

    if (boutonClique === null) {
        return;
    }
    
    //Affichage en en-tête du salon de discussion 
    titre.textContent = "Discussion avec " + boutonClique.textContent;
    salonSelectionneID = boutonClique.dataset.id;
    
     discussion.textContent="";
        
     const messages = conversations[salonSelectionneID] || [];
        for (let i = 0; i < messages.length; i++) {
            const bulleMessageHistorique = document.createElement("p");
            bulleMessageHistorique.textContent=messages[i].texte;
            if(messages[i].expediteur==="moi"){            
                bulleMessageHistorique.classList.add("bulle-message-envoye");
                discussion.appendChild(bulleMessageHistorique);
            }
            else{
                bulleMessageHistorique.classList.add("bulle-message-recu");
                discussion.appendChild(bulleMessageHistorique);
            }
        }
});


//Création d'un nouveau salon 
boutonCreerSalon.addEventListener("click",function(){
    const nomSalon=nomNouveauSalon.value.trim(); //Ajustement du nom pour creation nouveau salon 
    
    //Fonction pour eviter d'avoir un nom de groupe vide 
    if(nomSalon===""){
        alert("Veuillez entrer un nom de salon ! ");
        return;
    }
    
    const dernierID = Math.max(...salon.map(s => s.id)); // Trouver le dernier ID créé
    const nouvelID = dernierID + 1; //Incrémenter le dernier ID
    
    console.log("Nouveau salon : "+ nomSalon);
    nomNouveauSalon.value=""; //Effacer les caractères après création du salon 

    //Ajouter le salon à la liste : 
     salon.push({ //Ajoute un nouveau salon au tableau
        id: nouvelID,
        nom: nomSalon
    });

    //Creation du bouton pour le salon 
    const nouvelElement = document.createElement("li");
    const nouveauBouton = document.createElement("button");
    nouveauBouton.classList.add("bouton-salon"); // Ajout de la classe CSS au bouton
    nouveauBouton.dataset.id=nouvelID; // Attribution de l'ID d'un salon au bouton  
    nouveauBouton.textContent = nomSalon; //Attribution du nom du salon au bouton
    nouvelElement.appendChild(nouveauBouton); // Ajout du bouton à l'élément de liste
    listeSalons.appendChild(nouvelElement); // Ajout de l'élément de liste à la liste des salons

    console.log(salon);
})