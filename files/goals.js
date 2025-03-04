/**
 * goals.js
 * This file contains the core data structure and management for the UN Sustainable Development Goals (SDGs).
 * It defines all 17 goals, their descriptions, and associated AI prompts for analysis and discussion.
 */

import CONFIG from './config.js';

/**
 * GoalsManager Class
 * Manages the rendering and interaction with the SDG goals in the UI
 */
class GoalsManager {
    constructor() {
        this.goals = [];
        this.translationService = null;
        this.currentLanguage = CONFIG.TRANSLATION.DEFAULT_LANGUAGE;
        this.loadGoals();
    }

    /**
     * Gets the current goals data
     * @returns {Promise<Array>} Array of goal objects
     */
    async getGoals() {
        if (this.goals.length === 0) {
            await this.loadGoals();
        }
        return this.goals;
    }

    /**
     * Loads goals data from the external JSON file
     * @private
     */
    async loadGoals() {
        try {
            const response = await fetch('files/goals-data.json');
            if (!response.ok) {
                throw new Error(`Failed to load goals data: ${response.status}`);
            }
            const data = await response.json();
            this.goals = data.goals;
            this.renderGoals();
        } catch (error) {
            console.error('Error loading goals:', error);
            this.showError('Failed to load goals data. Please refresh the page.');
        }
    }

    /**
     * Sets the translation service for internationalization
     * @param {TranslationService} service - The translation service instance
     */
    setTranslationService(service) {
        this.translationService = service;
    }

    /**
     * Updates the language for all goal content
     * @param {string} language - The language code
     */
    async updateLanguage(language) {
        if (!this.translationService) {
            console.warn('Translation service not set');
            return;
        }
        
        this.currentLanguage = language;
        await this.updateGoalTranslations();
    }

    /**
     * Updates translations for all goal content
     * @private
     */
    async updateGoalTranslations() {
        if (!this.translationService) return;

        const elements = document.querySelectorAll('[data-goal-text]');
        for (const element of elements) {
            try {
                const originalText = element.getAttribute('data-original-text') || element.textContent;
                if (!element.getAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', originalText);
                }
                
                const translatedText = await this.translationService.translate(originalText, this.currentLanguage);
                element.textContent = translatedText;
            } catch (error) {
                console.error('Error translating goal content:', error);
            }
        }
    }

    /**
     * Creates a navigation item for a goal
     * @param {Object} goal - The goal object
     * @returns {HTMLElement} The created navigation item
     */
    createGoalNavItem(goal) {
        const item = document.createElement('a');
        item.href = `#goal${goal.id}`;
        item.className = 'list-group-item list-group-item-action';
        item.setAttribute('data-bs-toggle', 'list');
        item.setAttribute('role', 'tab');
        item.setAttribute('aria-controls', `goal${goal.id}`);
        
        const goalText = document.createElement('div');
        goalText.className = 'mb-1';
        goalText.textContent = `${goal.id}. ${goal.title}`;
        goalText.setAttribute('data-goal-text', '');
        
        item.appendChild(goalText);
        
        return item;
    }

    /**
     * Creates a content panel for a goal
     * @param {Object} goal - The goal object
     * @returns {HTMLElement} The created panel
     */
    createGoalPanel(goal) {
        const panel = document.createElement('div');
        panel.className = 'tab-pane fade';
        panel.id = `goal${goal.id}`;
        panel.setAttribute('role', 'tabpanel');
        
        const title = document.createElement('h2');
        title.className = 'mb-4';
        title.textContent = goal.title;
        title.setAttribute('data-goal-text', '');
        
        const description = document.createElement('p');
        description.className = 'lead mb-4';
        description.textContent = goal.description;
        description.setAttribute('data-goal-text', '');
        
        const promptsList = document.createElement('div');
        promptsList.className = 'list-group mb-4';
        
        goal.prompts.forEach((prompt, index) => {
            const promptItem = document.createElement('button');
            promptItem.className = 'list-group-item list-group-item-action';
            promptItem.textContent = prompt;
            // Add data-goal-text attribute for translation
            promptItem.setAttribute('data-goal-text', '');
            promptItem.setAttribute('data-original-text', prompt);
            promptItem.onclick = () => this.handlePromptClick(prompt);
            promptsList.appendChild(promptItem);
        });
        
        panel.appendChild(title);
        panel.appendChild(description);
        panel.appendChild(promptsList);
        
        return panel;
    }

    /**
     * Handles click events on prompt items
     * @param {string} prompt - The selected prompt
     * @private
     */
    async handlePromptClick(prompt) {
        const responseArea = document.getElementById('aiResponse');
        if (responseArea) {
            try {
                responseArea.textContent = 'Processing your request...';
                responseArea.setAttribute('data-goal-text', '');

                // Always translate the prompt to the current language for the LLM
                let translatedPrompt = prompt;
                if (this.translationService) {
                    translatedPrompt = await this.translationService.translate(prompt, this.currentLanguage);
                }

                // Get the AI response through the app's event system
                const event = new CustomEvent('ai-prompt', { 
                    detail: { 
                        prompt: translatedPrompt,
                        originalPrompt: prompt,
                        language: this.currentLanguage
                    }
                });
                document.dispatchEvent(event);
            } catch (error) {
                console.error('Error processing prompt:', error);
                responseArea.textContent = 'Error processing your request. Please try again.';
                responseArea.setAttribute('data-goal-text', '');
            }
        }
    }

    /**
     * Renders all goals in the UI
     */
    renderGoals() {
        const nav = document.getElementById('goals-nav');
        const content = document.getElementById('goals-content');
        
        if (!nav || !content) {
            console.error('Required DOM elements not found');
            return;
        }
        
        nav.innerHTML = '';
        content.innerHTML = '';
        
        this.goals.forEach(goal => {
            nav.appendChild(this.createGoalNavItem(goal));
            content.appendChild(this.createGoalPanel(goal));
        });
    }

    /**
     * Shows an error message to the user
     * @param {string} message - The error message to display
     * @private
     */
    showError(message) {
        const container = document.getElementById('errorContainer');
        if (container) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger alert-dismissible fade show';
            alert.role = 'alert';
            alert.textContent = message;
            
            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'btn-close';
            closeButton.setAttribute('data-bs-dismiss', 'alert');
            closeButton.setAttribute('aria-label', 'Close');
            
            alert.appendChild(closeButton);
            container.appendChild(alert);
            
            setTimeout(() => alert.remove(), 5000);
        }
    }
}

// Export the class for use in other modules
export { GoalsManager };
