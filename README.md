# 8WEB101_MESSAGERIE# Fil-Rouge — Application de messagerie Web

## 1. Présentation du projet

Le projet de messagerie filrouge est une application Web de messagerie développée dans le cadre du cours 8WEB101 de l'Université du Québec à Chicoutimi (UQAC).

L'application permet aux utilisateurs de créer un compte, de communiquer dans des salons publics et d'échanger des messages privés avec les autres membres inscrits.

Le projet vise à mettre en pratique les concepts de développement Web, la programmation JavaScript asynchrone ainsi que l'intégration d'une base de données et d'un système d'authentification.

# 2. Fonctionnalités

- Inscription, connexion à la messagerie (courriel et mot de passe) et déconnexion.
- Consultation et création de salon de discussion publique entre tout les membres inscrits à la messagerie fil-rouge. Les salons affichent les 50 derniers message du salon. 
- Consultation des contacts (tous les membres inscrits à la messagerie) et discussions privé avec chacun des contacts. L'affichage affiche la totalité des messages d'une conversation. 


## 3. Technologies utilisées


| Utilisation | Technologie |
|---|---|
| Interface | Javascript, HTML, CSS |
| Authentification et base de données | Supabase (Postgre SQL) |
| Bibliothèque côté client  | supabase-js |


## 4. Architecture de l'application

8WEB101_MESSAGERIE/
│
├── index.html          Page de connexion et d'inscription
├── conversation.html   Salons de discussion publics
├── contact.html        Liste de contact et messagerie privée
├── parametre.html      Paramètres du compte et action possible pour le compte
├── style.css           Mise en page de l'application
│
├── spclient.js          Initialisation du client Supabase
├── auth.js              Authentification des utilisateurs
├── data.js              Accès à la base de données
├── conversation.js      Gestion des salons publics
├── contact.js           Gestion des conversations privées
├── parametre.js         Gestion des paramètres utilisateur
│
└── README.md            Documentation du projet

## 5. Base de données

La base de données PostgreSQL comprend cinq tables principales.

| Table | Description |
|---|---|
| `channels` | Salons de discussion publics |
| `messages` | Messages des salons publics |
| `conversation_privee` | Conversations privée entre deux utilisateurs |
| `messages_prives` | Messages des conversations privées |
| `profiles` | Profils publics des utilisateurs associés aux comptes Supabase Auth |

Les tables sont reliées par des clés étrangères.

Les conversations privées ne peuvent être consultées que par leurs participants.

La supression d'un compte supprime tout les messages de ce contact. 

## 6. Fonctionnement général

Lors de l'inscription, Supabase Auth crée un compte utilisateur. Un déclencheur PostgreSQL permet également la création de son profil.

Après connexion, l'utilisateur peut accéder aux salons publics ou à la messagerie privée.

Dans les salons publics, les messages sont enregistrés dans PostgreSQL et les nouveaux messages peuvent être reçus en temps réel (le realtime doit être implanté).

Dans la messagerie privée, l'application recherche une conversation existante entre les deux utilisateurs. Si aucune conversation n'existe, elle est créée lors du premier envoi. Les messages sont ensuite enregistrés dans la base de données et peuvent être récupérés lors de l'ouverture de la discussion.

## 7. Installation et utilisation

1. Récupérer le dépôt GitHub.
2. Ouvrir le projet dans Visual Studio Code ou un autre éditeur.
3. Configurer le client Supabase dans `spclient.js` avec l'URL du projet et sa clé publique.
4. Préparer les tables, politiques RLS et déclencheurs PostgreSQL nécessaires.
5. Servir l'application avec un serveur de développement local.
6. Ouvrir `index.html` et créer un compte ou se connecter.

**Important :** aucune clé secrète Supabase ni clé `service_role` ne doit être exposée dans le code JavaScript exécuté par le navigateur.

### Liens du projet

- [Dépôt GitHub](https://github.com/CedCharron/8WEB101_MESSAGERIE)
- [Application Web](https://cedcharron.github.io/8WEB101_MESSAGERIE/)

## 8. Fonctionnalités à améliorer

Les développements envisagés comprennent :

- Intégration de Supabase Realtime à la messagerie privée;
- Intégration de la fonction de suppression de compte par l'utilisateur, Veuillez contacter le dépositaire de ce projet pour supression d'un compte. 
- Intégration de la fonction 'mot de passe oublié';
- Amélioration de l'interface utilisateur et de sa programmation CSS pour la page index et inscription.

