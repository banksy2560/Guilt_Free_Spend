import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);

            // Check if we've already dismissed it
            const dismissed = localStorage.getItem('gfs-install-dismissed');
            if (!dismissed) {
                // Delay showing prompt slightly so it isn't aggressive on first load
                setTimeout(() => setShowPrompt(true), 3000);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed/running in standalone
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setShowPrompt(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setShowPrompt(false);
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('gfs-install-dismissed', 'true');
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-gray-900/90 dark:bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 flex items-start gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Download className="text-white" size={24} />
                    </div>

                    <div className="flex-1 text-left">
                        <h4 className="text-white font-bold text-[15px] mb-1">Install Guilt-Free App</h4>
                        <p className="text-gray-400 text-[13px] leading-snug">
                            Add to your home screen for quick access, offline mode, and push notifications.
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleInstall}
                                className="px-4 py-1.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Install
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-3 py-1.5 bg-white/10 text-white font-medium text-sm rounded-lg hover:bg-white/20 transition-colors"
                            >
                                Not now
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="text-gray-500 hover:text-white transition-colors absolute top-3 right-3"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
