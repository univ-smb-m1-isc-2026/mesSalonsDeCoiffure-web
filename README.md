# ✂️ Application Front-End : Mes Salons de Coiffure

Ceci est l'application Front-End (côté client) du projet **Mes Salons de Coiffure**. Elle offre une interface moderne et réactive permettant aux clients de réserver des créneaux, et aux gérants d'administrer leurs salons et leurs employés.

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) et communique avec une API REST sécurisée par JWT (développée en Spring Boot).

---

## 🛠️ Technologies Utilisées

* **Framework :** Angular
* **Langage :** TypeScript, HTML5, SCSS/CSS
* **Authentification :** JWT (JSON Web Tokens)
* **Requêtes HTTP :** `HttpClient` & Interceptors (pour attacher le token aux requêtes)
* **Déploiement :** Docker & Nginx (Prêt pour la production)

---

## 🚀 Démarrage Rapide (Environnement de Développement)

Pour exécuter ce projet localement sur votre machine, assurez-vous d'avoir [Node.js](https://nodejs.org/) installé.

**1. Cloner le projet et installer les dépendances :**
```bash
git clone https://github.com/univ-smb-m1-isc-2026/mesSalonsDeCoiffure-web.git
cd mesSalonsDeCoiffure-web
npm install
```

**2. Lancer le serveur de développement :**

```bash
ng serve
```

Ouvrez votre navigateur et accédez à 👉 http://localhost:4200/. L'application se rechargera automatiquement si vous modifiez un fichier source.

  - ⚠️ Important : Pour que l'application fonctionne correctement, l'API Backend (Spring Boot) doit être en cours d'exécution sur http://localhost:8080.


## 📂 Architecture du Projet

Le code source est organisé pour être évolutif et facile à maintenir :

```
src/app/
 ├── core/components/    # Composants réutilisables (ex: Navbar, Footer, Boutons)
 ├── pages/         # Vues principales de l'application (ex: Home, Login, AdminDashboard)
 ├── core/services/      # Logique métier et appels à l'API (ex: AuthService, ReservationService)
 └── core/interceptors/  # Intercepteurs HTTP (ex: JwtInterceptor pour ajouter le token Bearer)
```

## 🔗 Connexion à l'API (Environnements)

L'application est configurée pour pointer vers différentes URL d'API selon l'environnement. Ces variables se trouvent dans le dossier src/environments/ :

- environment.development.ts (Développement local) : Pointe vers http://localhost:8080/api
- environment.ts (Production) : Pointe vers https://api.manage-your-scissors.oups.net/api

## 📦 Génération du Code (CLI)

Angular CLI inclut des outils puissants pour générer du code rapidement :

- Composant : ng generate component nom-du-composant
- Service : ng generate service services/nom-du-service
- Interface (Modèle) : ng generate interface models/nom-du-modele

Pour voir toutes les commandes : ng generate --help

## 🏗️ Build pour la Production

Pour compiler l'application en vue d'un déploiement en production, exécutez :

```
ng build
```

Les fichiers compilés et optimisés seront placés dans le dossier dist/. Ces fichiers sont de simples fichiers statiques (HTML, JS, CSS) qui peuvent être hébergés sur n'importe quel serveur web (Nginx, Apache, Firebase Hosting, etc.).

## Docker 

Je vous conseille d'aller la partie api : [API de mesSalons](https://github.com/univ-smb-m1-isc-2026/mesSalonsDeCoiffure-api)
