/**
 * translations.js
 * Handles translation functionality with caching and rate limiting
 */

class TranslationService {
    constructor() {
        this.currentLanguage = CONFIG.TRANSLATION.DEFAULT_LANGUAGE;
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.retryDelay = CONFIG.TRANSLATION.RETRY_DELAY;
        this.maxRetries = CONFIG.TRANSLATION.MAX_RETRIES;
        
        // Load cached translations from localStorage if available
        this.loadCacheFromStorage();
        
        // Periodically save cache to localStorage
        setInterval(() => this.saveCacheToStorage(), 5 * 60 * 1000); // Every 5 minutes
    }

    /**
     * Loads cached translations from localStorage
     * @private
     */
    loadCacheFromStorage() {
        try {
            const cached = localStorage.getItem('translationCache');
            if (cached) {
                const { translations, timestamp } = JSON.parse(cached);
                
                // Only load cache if it's not expired
                if (Date.now() - timestamp < CONFIG.TRANSLATION.CACHE_DURATION) {
                    Object.entries(translations).forEach(([key, value]) => {
                        this.cache.set(key, value);
                    });
                    console.log('Loaded translations from cache');
                }
            }
        } catch (error) {
            console.warn('Failed to load translation cache:', error);
        }
    }

    /**
     * Saves current cache to localStorage
     * @private
     */
    saveCacheToStorage() {
        try {
            const cacheData = {
                translations: Object.fromEntries(this.cache),
                timestamp: Date.now()
            };
            localStorage.setItem('translationCache', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to save translation cache:', error);
        }
    }

    /**
     * Utility function to pause execution
     * @private
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Queues a translation request
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code
     * @returns {Promise<string>} Translated text
     */
    async queueTranslation(text, targetLang) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ 
                text, 
                targetLang, 
                resolve, 
                reject,
                timestamp: Date.now()
            });
            
            if (!this.isProcessingQueue) {
                this.processQueue();
            }
        });
    }

    /**
     * Processes the translation request queue
     * @private
     */
    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            const request = this.requestQueue[0];
            
            // Remove stale requests (older than 5 minutes)
            if (Date.now() - request.timestamp > 5 * 60 * 1000) {
                this.requestQueue.shift();
                request.reject(new Error('Translation request timeout'));
                continue;
            }
            
            try {
                const result = await this.translateWithRetry(request.text, request.targetLang);
                request.resolve(result);
            } catch (error) {
                request.reject(error);
            }

            this.requestQueue.shift();
            await this.sleep(1000); // Rate limiting
        }

        this.isProcessingQueue = false;
    }

    /**
     * Performs translation with retry logic
     * @private
     */
    async translateWithRetry(text, targetLang, retryCount = 0) {
        try {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
            const response = await fetch(url);

            if (response.status === 429 && retryCount < this.maxRetries) {
                console.log(`Rate limited, retrying in ${this.retryDelay}ms...`);
                await this.sleep(this.retryDelay);
                this.retryDelay *= 2; // Exponential backoff
                return this.translateWithRetry(text, targetLang, retryCount + 1);
            }

            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }

            const data = await response.json();
            this.retryDelay = CONFIG.TRANSLATION.RETRY_DELAY; // Reset delay after success
            
            if (!data.responseData?.translatedText) {
                throw new Error('No translation returned from API');
            }

            return data.responseData.translatedText;
        } catch (error) {
            if (retryCount < this.maxRetries) {
                console.log(`Error occurred, retrying in ${this.retryDelay}ms...`);
                await this.sleep(this.retryDelay);
                this.retryDelay *= 2;
                return this.translateWithRetry(text, targetLang, retryCount + 1);
            }
            throw error;
        }
    }

    /**
     * Main translation method
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code
     * @returns {Promise<string>} Translated text
     */
    async translate(text, targetLang) {
        if (targetLang === CONFIG.TRANSLATION.DEFAULT_LANGUAGE) return text;
        if (!text || text.trim() === '') return text;

        const cacheKey = `${text}:${targetLang}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            console.log(`Translating to ${targetLang}:`, text);
            const translatedText = await this.queueTranslation(text, targetLang);
            this.cache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text
        }
    }

    /**
     * Updates all translatable elements on the page
     * @param {string} targetLang - Target language code
     * @returns {Promise<void>}
     */
    async updatePageTranslations(targetLang) {
        const elements = document.querySelectorAll('[data-translate]');
        const translations = await Promise.all(
            Array.from(elements).map(async (element) => {
                const originalText = element.getAttribute('data-original-text') || element.textContent;
                element.setAttribute('data-original-text', originalText);
                return this.translate(originalText, targetLang);
            })
        );
        
        elements.forEach((element, index) => {
            element.textContent = translations[index];
        });
    }
}

export default TranslationService;
