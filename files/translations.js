/**
 * translations.js
 * Handles internationalization and translation functionality
 */

import CONFIG from './config.js';

class TranslationService {
    constructor() {
        this.translations = new Map();
        this.currentLanguage = CONFIG.TRANSLATION.DEFAULT_LANGUAGE;
        this.translationQueue = [];
        this.isProcessing = false;
        this.retryDelay = 2000;     // Increased to 2 seconds
        this.maxRetries = 3;
        this.requestDelay = 1000;   // Delay between individual requests
        this.batchSize = 2;         // Reduced batch size to avoid rate limits
        
        // Load cached translations from localStorage if available
        this.loadCacheFromStorage();
        
        // Periodically save cache to localStorage
        setInterval(() => this.saveCacheToStorage(), 5 * 60 * 1000);

        // Initialize language selector
        this.initializeLanguageSelector();
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
                        this.translations.set(key, value);
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
                translations: Object.fromEntries(this.translations),
                timestamp: Date.now()
            };
            localStorage.setItem('translationCache', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to save translation cache:', error);
        }
    }

    /**
     * Delay between API requests to avoid rate limiting
     * @private
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Initializes the language selector with available languages
     * @private
     */
    async initializeLanguageSelector() {
        try {
            const response = await fetch('files/languages.json');
            const data = await response.json();
            const languageSelect = document.getElementById('languageSelect');
            
            if (languageSelect && data.languages) {
                // Clear existing options
                languageSelect.innerHTML = '';
                
                // Add language options
                data.languages.forEach(lang => {
                    const option = document.createElement('option');
                    option.value = lang.code;
                    option.textContent = lang.name;
                    if (lang.code === this.currentLanguage) {
                        option.selected = true;
                    }
                    languageSelect.appendChild(option);
                });

                // Add event listener for language changes
                languageSelect.addEventListener('change', (event) => {
                    this.currentLanguage = event.target.value;
                    this.updatePageTranslations(this.currentLanguage);
                });
            }
        } catch (error) {
            console.error('Failed to initialize language selector:', error);
        }
    }

    /**
     * Translates text to the target language with rate limit handling
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code
     * @returns {Promise<string>} Translated text
     */
    async translate(text, targetLang) {
        if (!text || !targetLang || targetLang === CONFIG.TRANSLATION.DEFAULT_LANGUAGE) {
            return text;
        }

        const cacheKey = `${text}_${targetLang}`;
        if (this.translations.has(cacheKey)) {
            return this.translations.get(cacheKey);
        }

        let retries = 0;
        while (retries < this.maxRetries) {
            try {
                if (retries > 0) {
                    const delay = this.retryDelay * Math.pow(2, retries - 1);
                    console.log(`Waiting ${delay}ms before retry ${retries + 1}`);
                    await this.delay(delay);
                }

                const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
                
                if (response.status === 429) {
                    const quotaMessage = 'Daily translation quota reached. Please try again tomorrow.';
                    console.warn(quotaMessage);
                    this.showQuotaError(quotaMessage);
                    return text;
                }
                
                if (!response.ok) {
                    throw new Error(`Translation API error: ${response.status}`);
                }

                const data = await response.json();
                
                // Check for quota limit in the API response
                if (data.responseStatus === 403 || (data.responseData && data.responseData.translatedText.includes("QUOTA"))) {
                    const quotaMessage = 'Daily translation quota reached. Please try again tomorrow.';
                    console.warn(quotaMessage);
                    this.showQuotaError(quotaMessage);
                    return text;
                }

                if (data.responseStatus === 200 && data.responseData?.translatedText) {
                    const translatedText = data.responseData.translatedText;
                    this.translations.set(cacheKey, translatedText);
                    return translatedText;
                } else {
                    throw new Error('Translation API returned invalid response');
                }
            } catch (error) {
                console.error('Translation attempt failed:', error);
                if (retries === this.maxRetries - 1) {
                    return text;
                }
                retries++;
            }
        }
        return text;
    }

    /**
     * Shows a user-friendly error message when quota is reached
     * @private
     */
    showQuotaError(message) {
        // Check if error message already exists
        let errorDiv = document.getElementById('translation-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'translation-error';
            errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.2);';
            document.body.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Updates translations for all elements with data-translate or data-goal-text attribute
     * @param {string} language - Target language code
     */
    async updatePageTranslations(language) {
        if (!language) {
            console.warn('No language specified for translation update');
            return;
        }

        console.log('Updating page translations to:', language);
        const elements = document.querySelectorAll('[data-translate], [data-goal-text]');
        
        // Process elements in small batches with delays
        for (let i = 0; i < elements.length; i += this.batchSize) {
            const batch = Array.from(elements).slice(i, i + this.batchSize);
            
            // Process each batch
            await Promise.all(batch.map(async element => {
                try {
                    const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
                    if (!element.getAttribute('data-original-text')) {
                        element.setAttribute('data-original-text', originalText);
                    }
                    
                    if (language === CONFIG.TRANSLATION.DEFAULT_LANGUAGE) {
                        element.textContent = originalText;
                    } else {
                        const translatedText = await this.translate(originalText, language);
                        element.textContent = translatedText || originalText;
                    }
                } catch (error) {
                    console.error('Error translating element:', error);
                    element.textContent = element.getAttribute('data-original-text') || element.textContent;
                }
            }));
            
            // Add delay between batches
            if (i + this.batchSize < elements.length) {
                await this.delay(this.requestDelay);
            }
        }
    }
}

export default TranslationService;
