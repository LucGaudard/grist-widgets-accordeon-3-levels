# Widget Grist Accordéon à trois niveaux — V2.1 (consultation)

**Statut : version de consultation validée fonctionnellement le 25 octobre 2026.**

## Installation

1. À la racine du dépôt `LucGaudard/grist-widgets-accordeon-3-levels`, remplacer **uniquement** `grist-widgets-accordeon-3-levels.html` par le fichier fourni.
2. **Conserver** `groupes.logic.js`, utilisé par le widget V2.1, ainsi que `widget_groupes.html` et les tests du widget générique V2.
3. Conserver l'URL GitHub Pages `https://lucgaudard.github.io/grist-widgets-accordeon-3-levels/grist-widgets-accordeon-3-levels.html` dans Grist.
4. Source Grist : table `Diffusions`, accès `read table`. Les ACL sont appliquées par Grist en amont ; le widget ne valide pas les droits par lui-même.
5. Tester après publication en rechargeant la page.

## Comportement validé

- Niveaux permanents Catégorie > Cours ; troisième niveau facultatif Aucun, Type ou Séance, défaut Séance.
- Couleur de la catégorie sur les titres des trois niveaux ; rendu mobile compact.
- Compteurs = nombre de lignes Diffusions reçues, sans déduplication.
- URL présentée par « Ouvrir la ressource » ; dates formatées en heure de Paris ; commentaire Markdown assaini ; champs vides concernés masqués ; grille `auto-fit`.
- Navigation au clavier : focus conservé après ouverture/fermeture des groupes.
- Classement, groupes ouverts et défilement mémorisés dans `sessionStorage` **pour l'onglet courant**, sans délai d'expiration applicatif.
