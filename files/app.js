/**
 * app.js
 * Main application file for the Agenda 2030 AI Explorer
 * Handles core functionality including AI interactions, translations, and UI management
 */

import CONFIG from './config.js';
import TranslationService from './translations.js';
import { GoalsManager } from './goals.js';

/**
 * Default LLM configuration parameters used for all prompts
 * @type {Object}
 */
const DEFAULT_LLM_CONFIG = {
    temperature: 0.3,
    top_k: 10,
    top_p: 0.7,
    repetition_penalty: 1.2,
    length_penalty: 2.0,
    max_tokens: 50
};

/**
 * AIService Class
 * Handles communication with the AI service for generating responses to SDG-related prompts
 */
class AIService {
    /**
     * Generates an AI response for a given prompt in the specified language
     * @param {string} prompt - The query prompt to send to the AI
     * @param {string} language - The target language code
     * @returns {Promise<string>} The AI-generated response
     * @throws {Error} If the API request fails
     */
    async generateResponse(prompt, language) {
        try {
            // Log the prompt being sent to the LLM
            console.log('Sending prompt to LLM:', {
                timestamp: new Date().toISOString(),
                prompt: prompt,
                language: language
            });

            const response = await fetch(CONFIG.getApiUrl('GENERATE') + '?key=' + CONFIG.API.GEMINI.API_KEY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: prompt
                        }]
                    }],
                    safetySettings: [{
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE"
                    }],
                    generationConfig: {
                        maxOutputTokens: 800, // Set maximum length of response
                        temperature: 0.7,     // Controls randomness (0.0 to 1.0)
                        topK: 40,            // Number of highest probability tokens to consider
                        topP: 0.95           // Total probability mass of tokens to consider
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error Details:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error(`API error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.candidates || data.candidates.length === 0) {
                console.error('Invalid API response:', data);
                throw new Error('No response generated');
            }

            return data.candidates[0]?.content?.parts?.[0]?.text || 'No response generated';
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate AI response. Please try again later.');
        }
    }
}

/**
 * App Class
 * Handles core application functionality including UI management, translations, and AI interactions
 */
class App {
    constructor() {
        this.translationService = new TranslationService();
        this.aiService = new AIService();
        this.goalsManager = new GoalsManager();
        this.currentLanguage = CONFIG.TRANSLATION.DEFAULT_LANGUAGE;
        
        // Bind methods to preserve this context
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handlePromptClick = this.handlePromptClick.bind(this);
        this.handleAIPrompt = this.handleAIPrompt.bind(this);
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    /**
     * Initializes the application UI and event listeners
     * @private
     */
    async initialize() {
        console.log('Initializing app...');
        try {
            await this.loadLanguages();
            // Initialize goals manager with translation service
            this.goalsManager.setTranslationService(this.translationService);
            await this.goalsManager.loadGoals(); // Let GoalsManager handle rendering
            this.setupEventListeners();
            this.handleInitialLanguage();
            
            // Add listener for AI prompts
            document.addEventListener('ai-prompt', this.handleAIPrompt);
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Loads and populates the language selector from languages.json
     * @private
     */
    async loadLanguages() {
        try {
            const response = await fetch('files/languages.json');
            if (!response.ok) {
                throw new Error('Failed to load languages');
            }
            const data = await response.json();
            
            const languageSelect = document.getElementById('languageSelect');
            languageSelect.innerHTML = ''; // Clear existing options
            
            data.languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                if (lang.code === CONFIG.TRANSLATION.DEFAULT_LANGUAGE) {
                    option.selected = true;
                }
                languageSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading languages:', error);
            this.showError('Failed to load language options');
        }
    }

    /**
     * Sets up event listeners for UI interactions
     * @private
     */
    setupEventListeners() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => this.handleLanguageChange(e.target.value));
        }
    }

    /**
     * Handles initial language setup from URL parameters
     * @private
     */
    handleInitialLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam) {
            this.handleLanguageChange(langParam);
        }
    }

    /**
     * Handles language change events
     * @param {string} language - The new language code
     */
    async handleLanguageChange(language) {
        if (!language) return;
        
        const loadingIndicator = this.showLoadingIndicator();
        try {
            this.currentLanguage = language;
            await this.translationService.updatePageTranslations(language);
            await this.goalsManager.updateLanguage(language);
        } catch (error) {
            console.error('Translation error:', error);
            this.showError('Failed to translate page content');
        } finally {
            loadingIndicator.remove();
        }
    }

    /**
     * Handles prompt button clicks
     * @param {HTMLElement} button - The clicked prompt button
     */
    async handlePromptClick(button) {
        const prompt = button.getAttribute('data-prompt');
        const responseArea = document.getElementById('aiResponse');
        
        button.disabled = true;
        responseArea.classList.add('loading');
        
        try {
            const response = await this.aiService.generateResponse(prompt, this.currentLanguage);
            responseArea.innerHTML = `<div class="ai-response-content">${response}</div>`;
        } catch (error) {
            console.error('AI response error:', error);
            this.showError('Failed to generate AI response');
        } finally {
            button.disabled = false;
            responseArea.classList.remove('loading');
        }
    }

    /**
     * Handles AI prompt events
     * @param {CustomEvent} event - The AI prompt event
     * @private
     */
    async handleAIPrompt(event) {
        const responseArea = document.getElementById('aiResponse');
        if (!responseArea) return;

        try {
            const { prompt, language } = event.detail;
            const response = await this.aiService.generateResponse(prompt, language);
            
            // Set the response text and mark it for translation
            responseArea.textContent = response;
            responseArea.setAttribute('data-goal-text', '');
            responseArea.setAttribute('data-original-text', response);
            
            // Trigger translation if not in default language
            if (language !== CONFIG.TRANSLATION.DEFAULT_LANGUAGE) {
                await this.translationService.translate(response, language);
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            responseArea.textContent = 'Failed to get AI response. Please try again.';
            responseArea.setAttribute('data-goal-text', '');
            responseArea.setAttribute('data-original-text', 'Failed to get AI response. Please try again.');
        }
    }

    /**
     * Shows a loading indicator
     * @private
     * @returns {HTMLElement} The loading indicator element
     */
    showLoadingIndicator() {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'translation-loading';
        loadingIndicator.setAttribute('data-translate', '');
        loadingIndicator.textContent = 'Loading...';
        document.body.appendChild(loadingIndicator);
        return loadingIndicator;
    }

    /**
     * Shows an error message to the user
     * @private
     * @param {string} message - The error message to display
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.container').prepend(errorDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the application
new App();
