/**
 * config.js
 * Application configuration and environment settings
 */

const CONFIG = {
    API: {
        GEMINI: {
            API_KEY: 'AIzaSyAnjhYr2odt5J9hq_-3ZS353spZgpyFvUI',
            BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
            MODEL: 'gemini-2.0-flash',
            ENDPOINTS: {
                GENERATE: '/generateContent'
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
