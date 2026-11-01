//-----------Contact----------------

const titre = document.querySelector("#titre-discussion");
const listeContacts = document.querySelector("#liste-contacts");
const discussion = document.querySelector("#discussion");

//Affichage des message par utilisateur 
let contactSelectionneID = null; // Variable pour stocker le contact sélectionné

async function chargerContacts() {
    const { user, error: authError } = await Auth.getUser();

    if (authError || !user) {
        window.location.href = "index.html";
        return;
    }

    const { data: profils, error } = await Data.fetchProfiles();

console.log("Profils récupérés :", profils);
console.log("Erreur Supabase :", error);

if (error) {
        console.error("Erreur de chargement des contacts :", error);
        return;
    }

    listeContacts.replaceChildren();

    for (const profil of profils) {
        // Ne pas s'afficher soi-même dans ses contacts
        if (profil.id === user.id) continue;

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.classList.add("bouton-contact");
        bouton.textContent = profil.username;
        bouton.dataset.id = profil.id;

        bouton.addEventListener("click", () => {
            contactSelectionneID = profil.id;

            titre.textContent = "Discussion avec " + profil.username;

            discussion.replaceChildren();

            console.log(
                "Contact sélectionné :",
                profil.username,
                profil.id
            );
        });

        listeContacts.appendChild(bouton);
    }

    if (listeContacts.children.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Aucun contact disponible";
    listeContacts.appendChild(message);
}
}

chargerContacts();

const messageInput = document.querySelector("#message-input");
const envoyerMessageButton = document.querySelector("#envoyer-message");

//Envoyer message en cliquant ENTER
messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        envoyerMessageButton.click();
    }
});

envoyerMessageButton.addEventListener("click", async function() {
    const texteMessage = messageInput.value.trim();

    if (texteMessage === "" || contactSelectionneID === null) {
        return;
    }

    // Récupérer l'utilisateur connecté
    const { user, error: authError } = await Auth.getUser();

    if (authError || !user) {
        console.error("Utilisateur non connecté");
        return;
    }

    // Rechercher une conversation existante
    const { data: conversation, error: rechercheErreur } =
        await Data.fetchPrivateConversation(user.id, contactSelectionneID);

    if (rechercheErreur) {
        console.error("Erreur de recherche :", rechercheErreur);
        return;
    }

    let conversationId = conversation?.id;

    // Créer la conversation uniquement si elle n'existe pas
    if (!conversationId) {
        const { data: nouvelleConversation, error: creationErreur } =
            await Data.createPrivateConversation(user.id, contactSelectionneID);

        if (creationErreur) {
            // Un autre utilisateur a peut-être créé la conversation
            // au même moment : la rechercher de nouveau.
            if (creationErreur.code === "23505") {
                const { data: existante, error: nouvelleRechercheErreur } =
                    await Data.fetchPrivateConversation(user.id, contactSelectionneID);

                if (nouvelleRechercheErreur || !existante) {
                    console.error("Conversation introuvable :", nouvelleRechercheErreur);
                    return;
                }

                conversationId = existante.id;
            } else {
                console.error("Erreur de création :", creationErreur);
                return;
            }
        } else {
            conversationId = nouvelleConversation.id;
        }
    }

    // Enregistrer le message dans Supabase
    const { error: envoiErreur } =
        await Data.sendPrivateMessage(conversationId, texteMessage);

    if (envoiErreur) {
        console.error("Erreur d'envoi :", envoiErreur);
        return;
    }

    // Afficher la bulle seulement après un envoi réussi
    const nouvelleBulleMessage = document.createElement("p");
    nouvelleBulleMessage.classList.add("bulle-message-envoye");
    nouvelleBulleMessage.textContent = texteMessage;

    discussion.appendChild(nouvelleBulleMessage);
    discussion.scrollTop = discussion.scrollHeight;

    messageInput.value = "";

    console.log("Message privé enregistré dans Supabase !");
});


