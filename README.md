# Script de Protection Anti-Inspection

## Description
Ce script JavaScript fournit une solution multicouche pour protéger le contenu d'une page web contre l'inspection, le copier-coller et l'utilisation des outils de développement. Il combine plusieurs techniques pour créer une barrière robuste contre les tentatives d'accès non autorisées au code source et aux ressources de la page.

## Fonctionnalités

### 1. Blocage des Raccourcis Clavier
- Désactive les raccourcis couramment utilisés pour accéder aux outils de développement:
  - F12
  - Ctrl+Shift+I (Inspecteur)
  - Ctrl+Shift+J (Console JavaScript)
  - Ctrl+Shift+C (Sélecteur d'éléments)
  - Ctrl+U (Affichage du code source)
  - Ctrl+S (Sauvegarde de la page)
  - Alt+Cmd+I (Mac)

### 2. Désactivation du Menu Contextuel
- Bloque le clic droit pour empêcher l'accès aux options de menu contextuel comme "Inspecter l'élément" ou "Afficher le code source"

### 3. Détection d'Ouverture des DevTools
- Utilise deux méthodes distinctes pour détecter l'ouverture des outils de développement:
  - Analyse des dimensions de la fenêtre
  - Mesure du temps d'exécution de `console.clear()`

### 4. Neutralisation de la Console
- Remplace toutes les méthodes de la console par des fonctions vides
- Empêche la journalisation et le débogage via la console JavaScript

### 5. Protection CSS
- Applique des styles CSS qui compliquent l'inspection des éléments
- Utilise des animations pour détecter les tentatives d'inspection
- Masque le texte sélectionné pour rendre la copie plus difficile

### 6. Protection Anti-Débogage
- Introduit des instructions `debugger` qui ralentissent considérablement les tentatives de débogage
- Vérifie régulièrement si un débogueur est attaché

### 7. Prévention du Drag-and-Drop
- Empêche le glisser-déposer d'images et d'autres contenus

### 8. Surveillance des Modifications DOM
- Détecte et supprime les tentatives d'injection d'outils de débogage tiers
- Surveille en permanence les modifications suspectes au DOM

### 9. Blocage du Copier-Coller
- Désactive les fonctions de copie, couper et coller

## Installation

1. Intégrez le script à votre page HTML avant la fermeture du tag `</body>`:

```html
<script src="path/to/anti-inspection.js"></script>
```

Ou directement dans le HTML:

```html
<script>
  // Collez ici le contenu complet du script
</script>
```

## Configuration

Le script dispose d'options configurables qui peuvent être ajustées selon vos besoins:

```javascript
const config = {
    debuggerEnabled: false,        // Active/désactive les instructions debugger
    consoleOverrideEnabled: true,  // Neutralise les fonctions de console
    keyboardShortcutsBlocked: true, // Bloque les raccourcis clavier
    contextMenuBlocked: true,      // Désactive le menu contextuel
    devtoolsDetectionEnabled: true, // Détecte l'ouverture des DevTools
    cssProtectionEnabled: true     // Applique les protections CSS
};
```

## Avertissements

- **Impact sur l'expérience utilisateur**: Certaines protections peuvent interférer avec l'expérience utilisateur légitime
- **Accessibilité**: Ce script peut créer des problèmes d'accessibilité pour certains utilisateurs
- **Performances**: L'utilisation intensive de `debugger` et d'autres techniques peut affecter les performances
- **Efficacité limitée**: Un développeur expérimenté pourra toujours contourner ces protections
- **Mesure d'obscurcissement**: Ce script doit être considéré comme une mesure d'obscurcissement et non comme une véritable sécurité

## Utilisation recommandée

Ce script est idéal pour:
- Protéger le contenu contre les utilisateurs occasionnels
- Décourager le vol facile de code ou de contenu
- Ajouter une couche supplémentaire de protection

Pour une sécurité complète, combinez ce script avec des mesures de sécurité côté serveur.

## Compatibilité

Testé et compatible avec les navigateurs modernes:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Licence

Ce code est fourni "tel quel", sans garantie d'aucune sorte. Utilisez-le à vos propres risques.

---

**Note**: La véritable sécurité doit toujours être implémentée côté serveur. Ce script fournit une couche de protection côté client qui peut être contournée par des utilisateurs expérimentés.
