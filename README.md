# Accordéon Diffusions — V2.1 (consultation)

**Statut : version de consultation validée fonctionnellement le 25 octobre 2026.**

## Installation

1. À la racine du dépôt `LucGaudard/grist-widgets-accordeon-3-levels`, remplacer **uniquement** `widget_diffusions_v2_1.html` par le fichier fourni.
2. **Conserver** `groupes.logic.js`, utilisé par le widget V2.1, ainsi que `widget_groupes.html` et les tests du widget générique V2.
3. Conserver l'URL GitHub Pages `https://lucgaudard.github.io/grist-widgets-accordeon-3-levels/widget_diffusions_v2_1.html` dans Grist.
4. Source Grist : table `Diffusions`, accès `read table`. Les ACL sont appliquées par Grist en amont ; le widget ne valide pas les droits par lui-même.
5. Tester après publication en rechargeant la page.

## Comportement validé

- Niveaux permanents Catégorie > Cours ; troisième niveau facultatif Aucun, Type ou Séance, défaut Séance.
- Couleur de la catégorie sur les titres des trois niveaux ; rendu mobile compact.
- Compteurs = nombre de lignes Diffusions reçues, sans déduplication.
- URL présentée par « Ouvrir la ressource » ; dates formatées en heure de Paris ; commentaire Markdown assaini ; champs vides concernés masqués ; grille `auto-fit`.
- Navigation au clavier : focus conservé après ouverture/fermeture des groupes.
- Classement, groupes ouverts et défilement mémorisés dans `sessionStorage` **pour l'onglet courant**, sans délai d'expiration applicatif.

## Recette / limites

- T07-C1 à C6 : **6/6 OK**.
- T14-A à G : **7/7 OK**.
- A15-01 à A15-07 : fonctionnels ; correctif de focus retesté et validé par l'utilisateur.
- Actualisation des données : tests effectués selon l'utilisateur.
- **Non validés** : contrôle approfondi des ACL, compatibilité lecteurs d'écran, tests de charge chiffrés.
- Le widget importe `./groupes.logic.js` : ce fichier doit rester présent à la racine du dépôt.
- Dépendances externes CDN : API Grist, marked, DOMPurify.

## Politique de maintenance

- Noms stables : `widget_diffusions_v2_1.html` et `widget_diffusions_v2_1.zip`.
- Conserver la V2 générique intacte ; créer une variante distincte pour l'édition de `Ressources` (ACC-022).
- Avant suppression d'anciens fichiers du dépôt, vérifier les URLs réellement utilisées par les widgets Grist et les références du README.
