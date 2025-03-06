/**
 * config.js
 * Application configuration and environment settings
 */

// API Configuration - Update these values as needed
const API_KEY = 'AIzaSyAnjhYr2odt5J9hq_-3ZS353spZgpyFvUI';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

const CONFIG = {
    API: {
        GEMINI: {
            API_KEY: API_KEY,
            BASE_URL: BASE_URL,
            MODEL: 'gemini-2.0-flash',
            ENDPOINTS: {
                GENERATE: '/generateContent'
            },
            GENERATION_CONFIG: {
                maxOutputTokens: 500,    // Set maximum length of response
                temperature: 0.3,        // Controls randomness (0.0 to 1.0)
                topK: 10,               // Number of highest probability tokens to consider
                topP: 0.7               // Total probability mass of tokens to consider
            }
        }
    },
    
    // Translation Configuration
    TRANSLATION: {
        DEFAULT_LANGUAGE: 'en',
        RETRY_DELAY: 1000,
        MAX_RETRIES: 3,
        CACHE_DURATION: 24 * 60 * 60 * 1000
    },

    // UI Configuration
    UI: {
        ANIMATION_DURATION: 200,
        MIN_RESPONSE_HEIGHT: 200,
        SCROLL_OFFSET: 20
    },

    getApiUrl(endpoint) {
        if (endpoint === 'GENERATE') {
            return 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        }
        return `${this.API.GEMINI.BASE_URL}/models/${this.API.GEMINI.MODEL}${this.API.GEMINI.ENDPOINTS[endpoint]}`;
    }
};

// Freeze the configuration object to prevent modifications
Object.freeze(CONFIG);

export { CONFIG as default };
