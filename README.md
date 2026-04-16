# Cinema Manager

Application Web pour gérer un cinéma, avec deux types d’utilisateurs : **Admin** et **User**.

## Nouvelle Separation Frontend / Backend

- Frontend: pages d'administration dans le dossier `Admin/`
- Backend: API REST dans `backend/server.js`
- Donnees backend: `backend/data/films.json`
- Donnees reservations: `backend/data/reservations.json`
- Base login admin: `backend/data/cinema.sqlite`

### Lancer l'application

1. Installer Node.js (si pas deja installe)
2. Depuis la racine du projet, lancer:

```bash
npm.cmd start
```

3. Ouvrir ensuite:

```text
http://localhost:3000/Admin/html/main.html
```

### API disponible

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/films`
- `POST /api/films`
- `GET /api/films/:id`
- `PUT /api/films/:id`
- `DELETE /api/films/:id`
- `GET /api/reservations`
- `POST /api/reservations`
- `GET /api/reservations/:id`
- `DELETE /api/reservations/:id`

Note:
- Les horaires (seances) se gerent uniquement dans la page `Seances`.
- La page `Ajouter Film` ne contient plus la saisie des horaires.

Champs reservations:
- `ticketSeats`: numero de place de chaque ticket (de 1 a 120)
- `tickets`: numeros de ticket generes automatiquement par le backend
- `reservedAtClient`: date/heure de reservation selon l'horloge du PC client
- Si toutes les places sont vendues pour une seance, elle est marquee `Complet`

### Connexion Admin

- Compte par defaut cree au premier demarrage:
	- Username: `admin`
	- Password: `admin`

---

## 1️ Présentation du Projet

**Titre :** Cinema Manager  
**Objectif :** Permettre aux utilisateurs de réserver des tickets et aux administrateurs de gérer les films et les séances.  

---

## 2️ Architecture Générale

##  Utilisateur ( Client )
- Consulter les films disponibles
- Voir les séances disponibles (date et heure)
- Réserver des tickets
- Recevoir confirmation de réservation

###  Administrateur (Admin)
- Ajouter, modifier et supprimer des films
- Gérer les séances
- Voir le nombre de tickets vendus
- Consulter les réservations

---

## 3️ Structure des Pages

## Côté User
- `index.php` : Liste des films avec image, titre, description, bouton "Voir Séances"
- `seances.php` : Liste des séances d’un film
- `reservation.php` : Formulaire de réservation
- `confirmation.php` : Confirmation de la réservation

## Côté Admin
- `admin/login.php` : Connexion administrateur
- `admin/dashboard.php` : Tableau de bord avec statistiques
- `admin/films.php` : Liste des films avec actions Ajouter/Modifier/Supprimer
- `admin/add_film.php` : Formulaire pour ajouter un film
- `admin/seances.php` : Gestion des séances
- `admin/reservations.php` : Liste des réservations et tickets vendus

---



## 4 Fonctionnement Logique

1. L’utilisateur choisit un film
2. Choisit une séance
3. Indique le nombre de tickets
4. Le système vérifie la disponibilité
5. La réservation est enregistrée et le nombre de places disponible est mis à jour







