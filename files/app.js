/**
 * app.js
 * Main application file for the Agenda 2030 AI Explorer
 * Handles core functionality including AI interactions, translations, and UI management
 */

import CONFIG from './config.js';
import TranslationService from './translations.js';
import { GOALS } from './goals.js';

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
            const response = await fetch(CONFIG.getApiUrl(CONFIG.API.GEMINI.ENDPOINTS.GENERATE) + '?key=' + CONFIG.API.GEMINI.API_KEY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`AI API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
                throw new Error('Invalid response format from AI API');
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    }
}

/**
 * App Class
 * Handles core application functionality including UI management, translations, and AI interactions
 */
class App {
    /**
     * Initializes the application
     */
    constructor() {
        this.translationService = new TranslationService();
        this.aiService = new AIService();
        this.currentLanguage = CONFIG.TRANSLATION.DEFAULT_LANGUAGE;
        
        // Bind methods to preserve this context
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handlePromptClick = this.handlePromptClick.bind(this);
        
        this.initialize();
    }

    /**
     * Initializes the application UI and event listeners
     * @private
     */
    initialize() {
        this.renderGoals();
        this.setupEventListeners();
        this.handleInitialLanguage();
    }

    /**
     * Sets up event listeners for the application
     * @private
     */
    setupEventListeners() {
        const languageSelect = document.getElementById('languageSelect');
        languageSelect.addEventListener('change', (e) => this.handleLanguageChange(e.target.value));

        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('prompt-button')) {
                await this.handlePromptClick(e.target);
            }
        });
    }

    /**
     * Handles initial language setup from URL parameters
     * @private
     */
    handleInitialLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang');
        if (lang) {
            const languageSelect = document.getElementById('languageSelect');
            languageSelect.value = lang;
            this.handleLanguageChange(lang);
        }
    }

    /**
     * Renders the SDG goals in the UI
     * @private
     */
    renderGoals() {
        const goalsNav = document.getElementById('goals-nav');
        const goalsContent = document.getElementById('goals-content');

        GOALS.forEach((goal, index) => {
            // Create navigation item
            const navItem = document.createElement('a');
            navItem.href = `#goal-${goal.id}`;
            navItem.className = `list-group-item ${index === 0 ? 'active' : ''}`;
            navItem.setAttribute('data-bs-toggle', 'list');
            
            const goalNumber = document.createElement('span');
            goalNumber.className = 'goal-number';
            goalNumber.textContent = goal.id;
            
            const goalTitle = document.createElement('span');
            goalTitle.setAttribute('data-translate', '');
            goalTitle.textContent = goal.title;
            
            navItem.appendChild(goalNumber);
            navItem.appendChild(goalTitle);
            goalsNav.appendChild(navItem);

            // Create content panel
            const contentPanel = document.createElement('div');
            contentPanel.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
            contentPanel.id = `goal-${goal.id}`;
            
            const title = document.createElement('h2');
            title.setAttribute('data-translate', '');
            title.textContent = goal.title;
            
            const description = document.createElement('p');
            description.setAttribute('data-translate', '');
            description.textContent = goal.description;
            
            const promptsContainer = document.createElement('div');
            promptsContainer.className = 'prompts-container';
            
            goal.prompts.forEach(prompt => {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-primary prompt-button';
                button.setAttribute('data-translate', '');
                button.textContent = prompt;
                promptsContainer.appendChild(button);
            });

            contentPanel.appendChild(title);
            contentPanel.appendChild(description);
            contentPanel.appendChild(promptsContainer);
            goalsContent.appendChild(contentPanel);
        });
    }

    /**
     * Handles language change events
     * @param {string} language - The new language code
     */
    async handleLanguageChange(language) {
        this.currentLanguage = language;
        
        const loadingIndicator = this.showLoadingIndicator();
        
        try {
            await this.translationService.updatePageTranslations(language);
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
        const prompt = button.textContent;
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

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
