//S'assurer d'avoir une session connectée pour avoir accès 
async function verifierConnexion() {
    const { user, error } = await Auth.getUser();

    if (error || user === null) {
        window.location.href = "index.html";
        return;
    }

    console.log("Utilisateur connecté :", user.id);
}

verifierConnexion(); 

//Déclaration des querySelector pour la messagerie
const titre = document.querySelector("#titre-discussion");
const listeContacts = document.querySelector("#liste-contacts");
const discussion = document.querySelector("#discussion");
const boutonDeconnexion = document.querySelector("#bouton-deconnexion");

//Aucun contact sélectionné au chargement de la page
let contactSelectionneID = null; // Variable pour stocker le contact sélectionné

//Créer une bulle de message privé
function afficherMessagePrive(message, monId) {
    const bulle = document.createElement("p");

    bulle.textContent = message.content;

    if (message.expediteur_id === monId) {
        bulle.classList.add("bulle-message-envoye");
    } else {
        bulle.classList.add("bulle-message-recu");
    }

    discussion.appendChild(bulle);
    discussion.scrollTop = discussion.scrollHeight;
}

// Charger les profils et configuer l'ouverture des conversations
async function chargerContacts() {
    const { user, error: authError } = await Auth.getUser();

    // Vérifier si l'utilisateur est connecté
    if (authError || !user) {
        window.location.href = "index.html";
        return;
    }

    const { data: profils, error } = await Data.fetchProfiles(); // Récupérer tous les profils d'utilisateurs

    console.log("Profils récupérés :", profils);
    console.log("Erreur Supabase :", error);

    if (error) {
        console.error("Erreur de chargement des contacts :", error);
        return;
    }

    //Effacter les contacts précédents pour éviter les doublons
    listeContacts.replaceChildren();

    //Parcourir les profils récupérés
    for (const profil of profils) {
        // Ne pas s'afficher soi-même dans ses contacts
        if (profil.id === user.id) continue;

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.classList.add("bouton-contact");
        bouton.textContent = profil.username;
        bouton.dataset.id = profil.id;


        bouton.addEventListener("click", async () => {
            contactSelectionneID = profil.id;

            titre.textContent = "Discussion avec " + profil.username;
            discussion.replaceChildren();

            // 1. Chercher la conversation existante
            const { data: conversation, error: erreurConversation } =
                await Data.fetchPrivateConversation(user.id, profil.id);

            if (erreurConversation) {
                console.error("Erreur de recherche :", erreurConversation);
                return;
            }

            // Aucune conversation : aucun historique
            if (!conversation) {
                return;
            }

            // 2. Récupérer les messages de la conversation
            const { data: messages, error: erreurMessages } =
                await Data.fetchPrivateMessages(conversation.id);

            if (erreurMessages) {
                console.error("Erreur de chargement :", erreurMessages);
                return;
            }

            // Éviter d'afficher les messages d'un autre contact
            if (contactSelectionneID !== profil.id) {
                return;
            }

            // 3. Afficher chaque message
            discussion.replaceChildren();

            for (const message of messages) {
                afficherMessagePrive(message, user.id);
        }

        console.log("Historique chargé :", messages.length, "messages");
    });

    //Ajouter le bouton dans la liste HTML
    const elementListe = document.createElement("li");
    elementListe.appendChild(bouton);
    listeContacts.appendChild(elementListe);
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

//Envoyer message privé en recherchant ou créant la conversation 
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

//Deconnexion d'un utilisateur et retour à la page de connexion
boutonDeconnexion.addEventListener("click", async function(event){
    event.preventDefault();

    const {error} = await Auth.signOut();

    if(error){
        console.error("Erreur de deconnexion : ", error.message);
        return;
    }

    window.location.href="index.html";
});
