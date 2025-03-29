# Script de Protection Anti-DevTools Optimisé

## Description
Ce script JavaScript fournit une protection avancée et optimisée contre l'utilisation des outils de développement (DevTools). Il combine les méthodes les plus efficaces de détection et de prévention pour bloquer l'inspection, la modification et l'analyse du contenu de votre page web.

## Fonctionnalités

### 1. Protection du Contenu
- Sauvegarde et substitution dynamique du contenu de la page
- Affiche un message d'avertissement lorsqu'une tentative d'inspection est détectée
- Peut restaurer le contenu si nécessaire (configuration optionnelle)

### 2. Détection Multi-méthodes des DevTools
- **Analyse dimensionnelle** : Surveille les différences entre dimensions internes et externes de la fenêtre
- **Manipulation d'objets** : Détecte l'inspection via des getters de propriété
- **Analyse temporelle** : Mesure le temps d'exécution des instructions debugger
- **Modification de RegExp** : Utilise un piège via toString pour détecter l'inspection
- **Surveillance en temps réel** avec vérifications périodiques

### 3. Blocage des Raccourcis Clavier
- Intercepte tous les raccourcis standards des DevTools :
  - F12
  - Ctrl+Shift+I (Inspecteur)
  - Ctrl+Shift+J (Console JavaScript)
  - Ctrl+Shift+C (Sélecteur d'éléments)
  - Ctrl+U (Code source)
  - Ctrl+S / Ctrl+P (Sauvegarde/Impression)
  - Alt+Cmd+I et Cmd+Alt+C (Mac)

### 4. Désactivation du Menu Contextuel
- Bloque le clic droit pour empêcher l'accès aux options d'inspection

### 5. Protection de la Console
- Neutralise toutes les méthodes de console (log, debug, info, etc.)
- Gèle l'objet console pour empêcher sa restauration
- Utilise profile/profileEnd pour détecter l'ouverture de la console

### 6. Protection Anti-Débogage
- Utilise des instructions `debugger` stratégiques pour interrompre les tentatives de débogage
- Mesure le temps d'exécution du debugger pour détecter les pauses

### 7. Surveillance des Modifications DOM
- Détecte et supprime les éléments injectés par les outils de développement
- Reconnaît les outils connus comme Firebug, React DevTools et autres
- Répond immédiatement à toute modification suspecte

## Installation

Intégrez le script dans votre page HTML juste avant la fermeture du tag `</body>`:

```html
<script src="anti-devtools.js"></script>
```

Ou directement dans le HTML:

```html
<script>
  // Collez ici le contenu complet du script
</script>
```

## Configuration

Le script est entièrement configurable via l'objet `config`:

```javascript
const config = {
    keyboardShortcutsBlocked: true,    // Bloquer raccourcis clavier
    contextMenuBlocked: true,           // Bloquer le clic droit
    devtoolsDetectionEnabled: true,     // Détecter l'ouverture des DevTools
    consoleProtectionEnabled: true,     // Protéger la console
    debuggerProtectionEnabled: true,    // Protection via debugger
    contentProtectionEnabled: true      // Cacher le contenu si DevTools ouverts
};
```

Vous pouvez désactiver certaines fonctionnalités selon vos besoins en modifiant ces valeurs.

## Avantages de cette Version Optimisée

1. **Architecture modulaire** - Facilite la maintenance et la personnalisation
2. **Détection multi-couches** - Combine plusieurs méthodes pour une efficacité maximale
3. **Gestion robuste des erreurs** - Évite les plantages grâce aux blocs try/catch
4. **Impact minimal sur les performances** - Optimisé pour réduire l'impact sur les performances
5. **Protection dynamique du contenu** - Cache le contenu uniquement lorsque nécessaire
6. **Compatibilité étendue** - Fonctionne sur tous les navigateurs modernes

## Considérations Importantes

- **Mesure dissuasive** : Ce script constitue une barrière efficace mais pas infranchissable
- **Utilisateurs légitimes** : Certaines protections peuvent affecter l'expérience des utilisateurs légitimes
- **Contournements possibles** : Un développeur expérimenté pourrait toujours contourner certaines protections
- **Sécurité complémentaire** : À utiliser en complément de mesures de sécurité côté serveur

## Compatibilité

Testé et compatible avec les navigateurs modernes:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Limites Connues

- Désactiver JavaScript dans le navigateur neutralise toutes les protections
- Les extensions spécialisées peuvent contourner certaines détections
- L'examen du code source téléchargé reste possible via des méthodes externes

## Licence

Ce code est fourni "tel quel", sans garantie d'aucune sorte. Utilisez-le à vos propres risques.

---

**Note importante**: La véritable sécurité doit toujours être implémentée côté serveur. Ce script fournit une couche de protection côté client qui, bien qu'efficace contre la majorité des utilisateurs, peut être contournée par un développeur suffisamment déterminé et compétent.
