# Accordéon V2 — prototype à tester

Cette version conserve les fichiers d'origine et ajoute jusqu'à trois niveaux de regroupement.

## Installation

Héberger **ensemble** `widget_groupes.html` et `groupes.logic.js` sur une URL HTTPS publique (GitHub Pages, par exemple). Le fichier HTML utilise un import JavaScript relatif : une URL vers un fichier local ou un simple téléchargement ZIP ne suffit pas.

Dans Grist : Ajouter un widget personnalisé, renseigner l'URL du fichier HTML hébergé, autoriser **Lecture de la table**. Dans le panneau de configuration du widget, ouvrir **Options du widget / Modifier les options** pour accéder au dialogue de configuration (si cette commande est proposée par la version Grist utilisée).

Choisir les colonnes de niveaux 1, 2 et 3, les tris correspondants, puis Enregistrer. Les niveaux 2 et 3 sont facultatifs. L'interface de consultation n'affiche plus les commandes de configuration.

## État des validations

Les 11 tests de la logique d'origine passent. **Le dialogue onEditOptions, le rendu multiniveau et les ACL n'ont pas été validés en conditions réelles dans Grist.** Cette livraison est un prototype de test, pas une version de production.

## Limites à traiter avant production

- Réglages historiques de couleurs, hauteur et booléens : l'ancienne interface est masquée et leur édition doit être déplacée dans le dialogue de configuration.
- Les références multiples et la sélection d'enregistrements par clic doivent être testées avec les données réelles.
- Les permissions de consultation restent celles de Grist ; le widget ne remplace aucune ACL.
- Le dépliage global est masqué avec la barre d'outils ; un contrôle de consultation peut être réintroduit si souhaité.
