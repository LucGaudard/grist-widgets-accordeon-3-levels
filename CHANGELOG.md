# Journal des modifications

Les versions suivent la numérotation sémantique (MAJEUR.MINEUR.CORRECTIF).

## [1.1.0] — 2026-09-29

### Modifié
- La logique sans accès au DOM ni à l'API Grist (échappement, validation des couleurs, groupement, tri) est déplacée dans le module `groupes.logic.js`, importé par le widget. Comportement inchangé.
- Les couleurs par défaut sont désormais attribuées après le tri des groupes, et non avant.

### Ajouté
- 11 tests unitaires exécutables par `npm test` (`node --test`), sans dépendance.
- `package.json` et fichier `LICENSE` (MIT).

## [1.0.0] — 2026-09-22

Première version numérotée. Base commune avec le fork gristgouv (`gristgouv/main`, commit 1bd27cc).

### Sécurité
- Suppression du chargement de Google Fonts : le widget n'utilise plus que des polices système et n'émet plus aucune requête vers un service externe.
- Validation des couleurs de groupe avant injection dans la page (`safeColor`).
- Séparation des libellés bruts et échappés pour l'insertion en HTML.

### Corrigé
- Le groupe « (vide) » s'affiche de nouveau et conserve sa couleur après rechargement.

### Ajouté
- Numéro de version affiché en bas du panneau de réglages.
- Ce journal des modifications.
- Améliorations d'accessibilité.
