//-----------Contact.HTML----------------

const titre= document.querySelector("#titre-discussion");
const utilisateurs=[{"id": 101, "nom": "Camille Mousseau"}, {"id": 102, "nom": "Maxime Hebert-Levesque"}, {"id": 103, "nom": "William Begin"}, {"id": 104, "nom": "Alexandre Lavoie"}];
const listeContacts = document.querySelector("#liste-contacts");

utilisateurs.sort(function(a, b) {
    return a.nom.localeCompare(b.nom, 'fr');
});


// Création des boutons pour chaque utilisateur
for (let i = 0; i < utilisateurs.length; i++) {
    const nouvelElement = document.createElement("li"); // Création d'un élément de liste
    const nouveauBouton = document.createElement("button"); // Création d'un bouton
    nouveauBouton.classList.add("bouton-contact"); // Ajout de la classe CSS au bouton
    nouveauBouton.dataset.id=utilisateurs[i].id; // Attribution de l'ID d'un utilisateur au bouton  
    nouveauBouton.textContent = utilisateurs[i].nom; //Attribution du nom de l'utilisateur au bouton
    nouvelElement.appendChild(nouveauBouton); // Ajout du bouton à l'élément de liste
    listeContacts.appendChild(nouvelElement); // Ajout de l'élément de liste à la liste des contacts
}
const contacts = document.querySelectorAll(".bouton-contact"); // Sélection de tous les boutons de contact


let contactSelectionneID = null; // Variable pour stocker le contact sélectionné

// Action à faire lorsqu'un contact est sélectionné
contacts.forEach(function(contact) {
    contact.addEventListener("click", function() {
        titre.textContent = "Discussion avec " + this.textContent;
        contactSelectionneID = this.dataset.id; // Affectation avec l'ID du contact selectionné
        console.log("Contact sélectionné : " + this.textContent + " (ID : " + contactSelectionneID + ")");
    });
});

const messageInput = document.querySelector("#message-input");
const envoyerMessageButton = document.querySelector("#envoyer-message");
envoyerMessageButton.addEventListener("click", function() {
    const texteMessage = messageInput.value.trim();
    console.log("Message envoyé : " + texteMessage + " (Contact ID : " + contactSelectionneID + ")");
})



