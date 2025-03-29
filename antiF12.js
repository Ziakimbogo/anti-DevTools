// Protection anti-DevTools
(function() {
    let originalContent = document.body.innerHTML;
    let devToolsDetected = false;
    
    // Configuration (tout activé par défaut)
    const config = {
        keyboardShortcutsBlocked: true,   // Bloquer raccourcis clavier
        contextMenuBlocked: true,          // Bloquer le clic droit
        devtoolsDetectionEnabled: true,    // Détecter l'ouverture des DevTools
        consoleProtectionEnabled: true,    // Protéger la console
        debuggerProtectionEnabled: true,   // Protection via debugger
        contentProtectionEnabled: true     // Cacher le contenu si DevTools ouverts
    };

    function hideContent() {
        if (!devToolsDetected && config.contentProtectionEnabled) {
            devToolsDetected = true;
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;width:100vw;position:fixed;top:0;left:0;background:#fff;z-index:9999;"><h1>Inspection non autorisée</h1></div>';
        }
    }

    function restoreContent() {
        if (devToolsDetected && config.contentProtectionEnabled) {
            devToolsDetected = false;
            document.body.innerHTML = originalContent;
            attachEvents();
        }
    }
    
    // 1. Bloquer les raccourcis clavier standards pour DevTools
    function blockKeyboardShortcuts() {
        document.addEventListener("keydown", function(e) {
            const restricted = [
                e.keyCode === 123,                                       // F12
                e.ctrlKey && e.shiftKey && e.keyCode === 73,             // Ctrl+Shift+I
                e.ctrlKey && e.shiftKey && e.keyCode === 74,             // Ctrl+Shift+J
                e.ctrlKey && e.shiftKey && e.keyCode === 67,             // Ctrl+Shift+C
                e.ctrlKey && e.keyCode === 85,                           // Ctrl+U (voir source)
                e.ctrlKey && (e.keyCode === 83 || e.keyCode === 80),     // Ctrl+S, Ctrl+P
                e.altKey && e.metaKey && e.keyCode === 73,               // Alt+Cmd+I (Mac)
                e.metaKey && e.altKey && e.keyCode === 67                // Cmd+Alt+C (Mac)
            ].some(Boolean);
            
            if (restricted) {
                e.preventDefault();
                e.stopPropagation();
                hideContent();
                return false;
            }
        }, true);
    }
    
    // 2. Bloquer le menu contextuel (clic droit)
    function blockContextMenu() {
        document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            return false;
        }, true);
    }
    
    // 3. Détection avancée des DevTools (combinaison de plusieurs méthodes)
    function detectDevTools() {
        // Méthode 1: Détection par taille de fenêtre
        const sizeDetection = function() {
            const threshold = 160;
            const widthDiff = Math.abs(window.outerWidth - window.innerWidth) > threshold;
            const heightDiff = Math.abs(window.outerHeight - window.innerHeight) > threshold;
            
            if (widthDiff || heightDiff) {
                hideContent();
            }
        };
        
        // Méthode 2: Détection via console.debug timing
        const consoleDetection = function() {
            let isDebugOpen = false;
            const div = document.createElement('div');
            let loop = 0;
            
            Object.defineProperty(div, "id", {
                get() {
                    loop++;
                    if (loop > 1) {
                        isDebugOpen = true;
                        hideContent();
                    }
                    return "";
                }
            });
            
            console.log(div);
            console.clear();
        };
        
        // Méthode 3: Détection par temps d'exécution du debugger
        const debuggerDetection = function() {
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) {
                hideContent();
            }
        };
        
        // Méthode 4: Détection par RegExp
        const regexpDetection = function() {
            const regexp = /./;
            regexp.toString = function() {
                hideContent();
                return 'devtools-check';
            };
            console.log(regexp);
        };
        
        sizeDetection();
        if (config.consoleProtectionEnabled) {
            try {
                consoleDetection();
                regexpDetection();
            } catch (e) { /* Ignorer les erreurs */ }
        }
        if (config.debuggerProtectionEnabled) {
            debuggerDetection();
        }
        setInterval(sizeDetection, 1000);
        window.addEventListener("resize", sizeDetection);
        
        if (config.debuggerProtectionEnabled) {
            setInterval(debuggerDetection, 2000);
        }
    }
    
    // 4. Protection de la console
    function protectConsole() {
        const noop = function() { return undefined; };
        const methods = ['log', 'debug', 'info', 'warn', 'error', 'dir', 'dirxml', 'trace', 'group', 
                         'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 
                         'count', 'assert', 'timeStamp', 'clear', 'table'];
        
        const originalConsole = {};
        
        try {
            methods.forEach(method => {
                if (console[method]) {
                    originalConsole[method] = console[method];
                    console[method] = noop;
                }
            });
            
            Object.freeze(console);
        } catch (e) { /* Ignorer les erreurs */ }
        
        setInterval(function() {
            try {
                console.profile();
                console.profileEnd();
                if (console.clear) console.clear();
            } catch (e) { /* Ignorer les erreurs */ }
        }, 1000);
    }
    
    // 5. Protection contre le débogage via debugger
    function protectWithDebugger() {
        setInterval(function() {
            try {
                debugger;
            } catch (e) { /* Ignorer les erreurs */ }
        }, 100);
    }
    
    // 6. Surveillance des modifications DOM qui pourraient indiquer des outils d'injection
    function monitorDOMChanges() {
        try {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                            const node = mutation.addedNodes[i];
                            if (node.nodeType === 1 && (
                                node.id === 'firebug-script' || 
                                node.id?.includes('react-dev') ||
                                node.id?.includes('devtools') ||
                                node.classList?.contains('xdebug-var-dump') ||
                                node.classList?.contains('websql-profiler')
                            )) {
                                node.remove();
                                hideContent();
                            }
                        }
                    }
                });
            });
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        } catch (e) { /* Ignorer les erreurs */ }
    }
    
    function attachEvents() {
        if (config.keyboardShortcutsBlocked) {
            blockKeyboardShortcuts();
        }
        
        if (config.contextMenuBlocked) {
            blockContextMenu();
        }
    }
    
    function init() {
        originalContent = document.body.innerHTML;
        
        attachEvents();
        
        // Activer les protections
        if (config.devtoolsDetectionEnabled) {
            detectDevTools();
        }
        
        if (config.consoleProtectionEnabled) {
            protectConsole();
        }
        
        if (config.debuggerProtectionEnabled) {
            protectWithDebugger();
        }
        
        // Ajouter la surveillance DOM
        monitorDOMChanges();
    }
    
    setTimeout(init, 50);
})();
