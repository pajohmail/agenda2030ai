/**
 * config.js
 * Application configuration and environment settings
 */

const CONFIG = {
    // API Configuration
    API: {
        GEMINI: {
            API_KEY: process.env.GEMINI_API_KEY || 'Secret_Key', // Should be set via environment variable
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
        RETRY_DELAY: 1000, // Initial retry delay in ms
        MAX_RETRIES: 3,
        CACHE_DURATION: 24 * 60 * 60 * 1000 // 24 hours in ms
    },

    // UI Configuration
    UI: {
        ANIMATION_DURATION: 200, // ms
        MIN_RESPONSE_HEIGHT: 200, // px
        SCROLL_OFFSET: 20 // px
    },

    /**
     * Gets the full API URL for a given endpoint
     * @param {string} endpoint - The API endpoint
     * @returns {string} The complete API URL
     */
    getApiUrl(endpoint) {
        return `${this.API.GEMINI.BASE_URL}/models/${this.API.GEMINI.MODEL}${this.API.GEMINI.ENDPOINTS[endpoint]}`;
    }
};

// Freeze the configuration object to prevent modifications
Object.freeze(CONFIG);

export default CONFIG;
