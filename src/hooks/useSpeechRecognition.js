import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for using the Web Speech API (webkitSpeechRecognition)
 */
export function useSpeechRecognition({ onResult, onError }) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            setIsSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            const recognition = recognitionRef.current;

            recognition.continuous = false; // Stop after a single phrase
            recognition.interimResults = true; // Still get interim to show user it's working
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                if (onError) onError(event.error);
            };

            recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (onResult) {
                    onResult({
                        isFinal: finalTranscript.length > 0,
                        text: finalTranscript || interimTranscript
                    });
                }
            };
        } else {
            setIsSupported(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onResult, onError]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Could not start speech recognition", e);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return {
        isSupported,
        isListening,
        startListening,
        stopListening
    };
}
