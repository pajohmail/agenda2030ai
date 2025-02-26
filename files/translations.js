class TranslationService {
    constructor() {
        this.currentLanguage = 'en';
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.retryDelay = 1000; // Start with 1 second delay
        this.maxRetries = 3;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async queueTranslation(text, targetLang) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ text, targetLang, resolve, reject });
            if (!this.isProcessingQueue) {
                this.processQueue();
            }
        });
    }

    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            const { text, targetLang, resolve, reject } = this.requestQueue[0];
            
            try {
                const result = await this.translateWithRetry(text, targetLang);
                resolve(result);
            } catch (error) {
                reject(error);
            }

            this.requestQueue.shift();
            await this.sleep(1000); // Wait 1 second between requests
        }

        this.isProcessingQueue = false;
    }

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
            this.retryDelay = 1000; // Reset delay after successful request
            
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

    async translate(text, targetLang) {
        if (targetLang === 'en') return text;
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
            return text;
        }
    }

    async translateElement(element, targetLang) {
        if (!element) return;
        
        try {
            const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
            if (!originalText) return;

            element.setAttribute('data-original-text', originalText);
            
            if (targetLang === 'en') {
                element.textContent = originalText;
                return;
            }

            console.log('Translating element:', originalText);
            const translatedText = await this.translate(originalText, targetLang);
            element.textContent = translatedText;
        } catch (error) {
            console.error('Error translating element:', error);
        }
    }

    async translatePage(targetLang) {
        console.log('Starting page translation to:', targetLang);
        this.currentLanguage = targetLang;

        try {
            const elements = document.querySelectorAll('[data-translate]');
            console.log('Found elements to translate:', elements.length);

            // Translate elements in smaller batches
            const batchSize = 3;
            for (let i = 0; i < elements.length; i += batchSize) {
                const batch = Array.from(elements).slice(i, i + batchSize);
                await Promise.all(batch.map(element => this.translateElement(element, targetLang)));
            }
        } catch (error) {
            console.error('Page translation error:', error);
        }
    }

    async getAvailableLanguages() {
        try {
            const response = await fetch('https://api.mymemory.translated.net/get?q=hello&langpair=en|en');
            if (!response.ok) {
                throw new Error(`Failed to fetch languages: ${response.status}`);
            }
            const data = await response.json();
            const languages = data.responseData?.supportedLanguages || [];
            return languages;
        } catch (error) {
            console.error('Error fetching languages:', error);
            return [];
        }
    }
}
