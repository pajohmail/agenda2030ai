class AIService {
    async generateResponse(prompt, language) {
        try {
            const response = await fetch(CONFIG.GEMINI_API_URL + '?key=' + CONFIG.GEMINI_API_KEY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    }
}

class App {
    constructor() {
        this.translationService = new TranslationService();
        this.goalsManager = new GoalsManager();
        this.aiService = new AIService();
        this.currentLanguage = 'en';
        
        this.initialize();
    }

    initialize() {
        // Render goals
        this.goalsManager.renderGoals();

        // Set up language selector
        const languageSelect = document.getElementById('languageSelect');
        languageSelect.addEventListener('change', (e) => {
            this.handleLanguageChange(e.target.value);
        });

        // Set up prompt buttons
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('prompt-button')) {
                await this.handlePromptClick(e.target);
            }
        });

        // Set initial language if specified in URL
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang');
        if (lang) {
            languageSelect.value = lang;
            this.handleLanguageChange(lang);
        }
    }

    async handleLanguageChange(language) {
        this.currentLanguage = language;
        
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'translation-loading';
        loadingIndicator.setAttribute('data-translate', '');
        loadingIndicator.textContent = 'Translating page...';
        document.body.appendChild(loadingIndicator);

        try {
            // Translate all elements with data-translate attribute
            await this.translationService.translatePage(language);

            // Also translate any existing AI response
            const aiResponse = document.getElementById('aiResponse');
            if (aiResponse && aiResponse.textContent.trim() !== '' && 
                !aiResponse.textContent.includes('Select a prompt')) {
                const originalResponse = aiResponse.getAttribute('data-original-text') || aiResponse.textContent;
                aiResponse.setAttribute('data-original-text', originalResponse);
                const translatedResponse = await this.translationService.translate(originalResponse, language);
                aiResponse.innerHTML = `<div class="ai-response-content">${translatedResponse.replace(/\n/g, '<br>')}</div>`;
            }
        } catch (error) {
            console.error('Translation error:', error);
        } finally {
            loadingIndicator.remove();
        }
    }

    async handlePromptClick(button) {
        const prompt = button.getAttribute('data-original-text') || button.textContent;
        const responseContainer = document.getElementById('aiResponse');
        const responseTitle = document.getElementById('responseTitle');

        // Show loading state
        responseContainer.classList.add('loading');
        const loadingText = await this.translationService.translate('Generating response...', this.currentLanguage);
        responseContainer.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden" data-translate>Loading...</span>
            </div> 
            <span data-translate>${loadingText}</span>
        `;

        try {
            // Get AI response
            const response = await this.aiService.generateResponse(prompt);
            
            // Store original response and translate
            responseContainer.setAttribute('data-original-text', response);
            let translatedResponse = response;
            
            if (this.currentLanguage !== 'en') {
                const translatingText = await this.translationService.translate('Translating response...', this.currentLanguage);
                responseContainer.innerHTML = `
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden" data-translate>Loading...</span>
                    </div> 
                    <span data-translate>${translatingText}</span>
                `;
                translatedResponse = await this.translationService.translate(response, this.currentLanguage);
            }

            // Update the response container
            responseContainer.innerHTML = `<div class="ai-response-content">${translatedResponse.replace(/\n/g, '<br>')}</div>`;
            
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = await this.translationService.translate('Error generating response. Please try again.', this.currentLanguage);
            responseContainer.innerHTML = `<div class="alert alert-danger" data-translate>${errorMessage}</div>`;
        } finally {
            responseContainer.classList.remove('loading');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
