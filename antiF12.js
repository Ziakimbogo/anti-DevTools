// Protection avancée contre l'inspection et les outils de développement
(function() {
    // Configuration initiale
    const config = {
        debuggerEnabled: false,
        consoleOverrideEnabled: true,
        keyboardShortcutsBlocked: true,
        contextMenuBlocked: true,
        devtoolsDetectionEnabled: true,
        cssProtectionEnabled: true
    };
    
    // 1. Bloquer les raccourcis clavier standards
    if (config.keyboardShortcutsBlocked) {
        document.addEventListener("keydown", function(e) {
            // Combinaisons d'outils de développement courantes
            if (
                // F12
                e.keyCode === 123 || 
                // Ctrl+Shift+I/J/C
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
                // Ctrl+U (voir source)
                (e.ctrlKey && e.keyCode === 85) ||
                // Ctrl+S (sauvegarder)
                (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) ||
                // Alt+Command+I (Mac)
                (e.altKey && e.metaKey && e.keyCode === 73)
            ) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
    }
    
    // 2. Bloquer le menu contextuel (clic droit)
    if (config.contextMenuBlocked) {
        document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            return false;
        }, true);
    }
    
    // 3. Détection de DevTools via les dimensions de la fenêtre
    if (config.devtoolsDetectionEnabled) {
        let devtoolsOpen = false;
        
        // Méthode 1: Vérification des dimensions de la fenêtre
        const checkDevTools = function() {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    // Action lorsque DevTools est détecté ouvert
                    document.body.innerHTML = "Inspection non autorisée";
                }
            } else {
                devtoolsOpen = false;
            }
        };
        
        // Vérification régulière
        setInterval(checkDevTools, 1000);
        window.addEventListener("resize", checkDevTools);
        
        // Méthode 2: Détection via console.clear timing
        let lastConsoleTime = 0;
        const consoleLogger = function() {
            const now = performance.now();
            const diff = now - lastConsoleTime;
            lastConsoleTime = now;
            
            if (diff > 100) {
                devtoolsOpen = true;
                document.body.innerHTML = "Inspection non autorisée";
            }
            
            console.clear();
        };
        
        if (config.debuggerEnabled) {
            setInterval(consoleLogger, 20);
        }
    }
    
    // 4. Redéfinition des objets de console
    if (config.consoleOverrideEnabled) {
        const noop = function() { return undefined; };
        const methods = ['log', 'debug', 'info', 'warn', 'error', 'dir', 'dirxml', 'trace', 'group', 
                        'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 
                        'count', 'assert', 'timeStamp'];
        
        // Sauvegarder les méthodes originales
        const originalConsole = {};
        methods.forEach(method => {
            originalConsole[method] = console[method];
            console[method] = noop;
        });
    }
    
    // 5. Protection CSS pour masquer le contenu lors de l'inspection
    if (config.cssProtectionEnabled) {
        const style = document.createElement('style');
        style.textContent = `
            /* Masque le contenu lorsqu'une sélection d'inspection est active */
            *:hover, *:active, *:focus {
                outline: none !important;
            }
            
            /* Active la protection uniquement lorsque la page est inspectée */
            *, *::before, *::after {
                animation-duration: 0.001s !important;
                animation-name: nodeInserted !important;
                animation-timing-function: linear !important;
                animation-fill-mode: forwards !important;
            }
            
            @keyframes nodeInserted {
                from { opacity: 0.99; }
                to { opacity: 1; }
            }
            
            /* Masquer le texte sélectionné pour empêcher la copie facile */
            ::selection {
                background-color: transparent;
                color: inherit;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 6. Protection contre le débogage via debugger
    if (config.debuggerEnabled) {
        setInterval(function() {
            debugger;
        }, 100);
    }
    
    // 7. Empêcher l'enregistrement d'images
    document.addEventListener("dragstart", function(e) {
        e.preventDefault();
        return false;
    });
    
    // 8. Surveiller les modifications DOM qui pourraient indiquer des outils d'injection
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1 && (
                        node.id === 'firebug-script' || 
                        node.classList.contains('xdebug-var-dump') ||
                        node.classList.contains('websql-profiler')
                    )) {
                        node.remove();
                    }
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // 9. Vérifier si le débogueur est attaché
    function checkDebugger() {
        const startTime = performance.now();
        function debuggerTrap() { debugger; }
        debuggerTrap();
        const endTime = performance.now();
        
        if (endTime - startTime > 100) {
            // Débogueur probablement attaché
            document.body.innerHTML = "Débogage non autorisé";
        }
    }
    
    if (config.debuggerEnabled) {
        setInterval(checkDebugger, 1000);
    }
    
    // 10. Supprimer la fonctionnalité de copier-coller
    document.oncopy = function(e) {
        e.preventDefault();
        return false;
    };
    
    document.oncut = function(e) {
        e.preventDefault();
        return false;
    };
    
    document.onpaste = function(e) {
        e.preventDefault();
        return false;
    };
    
    // Message d'initialisation masqué
    console.log("%c ", "font-size:0;");
})();
