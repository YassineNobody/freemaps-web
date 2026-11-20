# Freemaps — Frontend

Interface web de **Freemaps**, une application de cartographie et de recherche d'adresses développée avec Angular et MapLibre GL JS.

> Projet en cours de développement. Ce dépôt contient uniquement le frontend ; le backend Spring Boot est développé séparément.

## Technologies

- **Angular 22** et **TypeScript** (mode strict)
- **SCSS** pour les styles, avec un reset global inspiré du Preflight de Tailwind CSS
- **Angular Router** pour la navigation
- **MapLibre GL JS 6.19** pour l'affichage cartographique
- **OpenFreeMap (Liberty)** pour le fond de carte
- **Angular HttpClient** et **RxJS** pour les requêtes HTTP
- **API de géocodage de la Géoplateforme** (`data.geopf.fr`) pour rechercher des adresses françaises

## Fonctionnalités actuelles

- Affichage interactif d'une carte MapLibre avec le style OpenFreeMap Liberty
- Recherche d'adresses en France via une API appelée directement depuis le navigateur
- Affichage des résultats de recherche
- Organisation du code par fonctionnalités Angular

## Installation

**Prérequis :** Node.js et npm compatibles avec Angular 22.

```bash
npm install
npm start
```

Ouvrir ensuite [http://localhost:4200](http://localhost:4200).

## Configuration du Web Worker MapLibre

MapLibre utilise un Web Worker pour le traitement cartographique. Dans ce projet, son fichier est exposé comme ressource statique via la configuration `assets` d'Angular (`angular.json`), puis déclaré avec `setWorkerUrl()`.

Exemple d'entrée dans les `assets` :

```json
{
  "glob": "maplibre-gl-worker.mjs",
  "input": "node_modules/maplibre-gl/dist",
  "output": "/"
}
```

Dans le code TypeScript :

```ts
import { setWorkerUrl } from 'maplibre-gl';

setWorkerUrl('/maplibre-gl-worker.mjs');
```

Le style cartographique utilisé est :

```text
https://tiles.openfreemap.org/styles/liberty
```

## Organisation du code

```text
src/
├── styles.scss
├── styles/                  # Reset et styles globaux partagés
└── app/
    ├── app.ts
    ├── app.html
    ├── app.config.ts
    ├── app.routes.ts
    └── features/
        └── map/
            ├── map.ts
            ├── map.html
            ├── map.scss
            ├── components/
            │   ├── map-view/       # Affichage de MapLibre
            │   └── address-search/ # Recherche d'adresses
            ├── services/
            │   ├── map.service.ts  # Gestion de l'instance MapLibre
            │   └── address.ts      # Requêtes de géocodage
            └── models/
                └── address.model.ts
```

*L'arborescence est indicative ; les noms exacts des fichiers peuvent évoluer avec le projet.*

## Architecture

- **`MapService`** initialise et détruit l'instance MapLibre.
- **`MapView`** héberge le conteneur HTML de la carte et gère son cycle de vie.
- **`AddressService`** interroge l'API de géocodage avec `HttpClient`.
- **`AddressSearch`** gère la saisie, le déclenchement de la recherche et l'affichage des résultats.
- **`Map`** est la page principale qui assemble les composants.

Le géocodage est réalisé directement depuis le frontend. Le backend **Spring Boot**, séparé, sera utilisé pour les fonctionnalités nécessitant une logique serveur.

## Prochaines étapes

- Recherche automatique avec temporisation (`debounceTime`) et annulation des requêtes obsolètes (`switchMap`)
- Sélection d'une adresse, marqueur et recentrage de la carte (`flyTo`)
- Calcul et affichage d'itinéraires
- Interface utilisateur et mise en page
- Connexion aux fonctionnalités du backend Spring Boot

## Services et licences

Ce projet utilise des bibliothèques et services tiers, notamment MapLibre GL JS, OpenFreeMap et l'API de géocodage de la Géoplateforme. Vérifier leurs conditions d'utilisation et d'attribution avant une mise en production.

Si des règles du Preflight de Tailwind CSS sont copiées dans le projet, conserver la notice de licence MIT correspondante.
