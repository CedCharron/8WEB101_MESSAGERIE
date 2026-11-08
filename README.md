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
| HTML5 | Structure des pages Web |
| CSS3 | Présentation et mise en page |
| JavaScript | Interactions et logique de l'application |
| Supabase Auth | Gestion des comptes et des sessions |
| PostgreSQL / Supabase | Stockage des données |
| Supabase Realtime | Actualisation des salons publics |
| Git et GitHub | Gestion du code source |
| GitHub Pages | Hébergement de l'interface Web |

## 4. Architecture de l'application

L'application repose sur une séparation des responsabilités entre plusieurs fichiers JavaScript.

| Fichier | Responsabilité |
|---|---|
| `spclient.js` | Initialisation du client Supabase |
| `auth.js` | Inscription, connexion et déconnexion |
| `data.js` | Communication avec la base de données |
| `conversation.js` | Gestion des salons publics |
| `contact.js` | Gestion des conversations privées |
| `parametre.js` | Affichage des paramètres utilisateurs |

Les pages HTML utilisent ces fichiers pour gérer les interactions et actualiser leur contenu.

## 5. Base de données

La base de données PostgreSQL comprend cinq tables principales.

| Table | Description |
|---|---|
| `channels` | Salons de discussion publics |
| `messages` | Messages des salons publics |
| `conversation_privee` | Conversations entre deux utilisateurs |
| `messages_prives` | Messages échangés dans les conversations privées |
| `profiles` | Profils publics associés aux comptes Supabase Auth |

Les tables sont reliées par des clés étrangères.

Des politiques de sécurité **Row Level Security (RLS)** limitent l'accès aux données selon l'authentification et les droits des utilisateurs.

Les conversations privées ne peuvent être consultées que par leurs participants.

## 6. Fonctionnement général

Lors de l'inscription, Supabase Auth crée un compte utilisateur. Un déclencheur PostgreSQL permet également la création de son profil.

Après connexion, l'utilisateur peut accéder aux salons publics ou à la messagerie privée.

Dans les salons publics, les messages sont enregistrés dans PostgreSQL et les nouveaux messages peuvent être reçus en temps réel.

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

- Intégration de Supabase Realtime à la messagerie privée.
- Gestion des envois simultanés et des changements rapides de conversation.
- Amélioration de l'interface utilisateur.
- Gestion plus complète de la suppression des comptes.
- Ajout et développement de la section Défis.

## 9. Références techniques

- [MDN — Documentation Web](https://developer.mozilla.org/fr/)
- [Supabase — Documentation officielle](https://supabase.com/docs)
- [Supabase — Authentification](https://supabase.com/docs/guides/auth)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## 10. Contexte académique

Projet réalisé dans le cadre du cours **8WEB101 — Développement Web**, à l'Université du Québec à Chicoutimi.

**Statut :** projet universitaire en développement.