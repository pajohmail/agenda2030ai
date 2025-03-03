# Agenda 2030 AI Explorer

An interactive web application that leverages AI to explore and analyze the United Nations Sustainable Development Goals (SDGs). The platform provides in-depth analysis and insights about each of the 17 SDGs through AI-powered discussions in multiple languages.

## Features

- **Comprehensive SDG Coverage**: In-depth analysis of all 17 UN Sustainable Development Goals
- **Advanced AI Integration**: Powered by Google's Gemini AI for detailed analytical responses
- **Multilingual Support**: 
  - Support for 50+ languages
  - Real-time translation of UI elements and AI responses
  - Persistent translation caching for improved performance
- **Modern Web Technologies**:
  - Responsive design for all devices
  - Progressive loading and caching
  - Accessibility compliance (WCAG 2.1)
- **User Experience**:
  - Intuitive navigation through SDG goals
  - Interactive prompt selection
  - Real-time language switching
  - Loading indicators and error handling

## Technical Architecture

### Core Components

- **Frontend Structure**:
  - `index.html`: Semantic HTML5 structure with accessibility features
  - `files/style.css`: Modern CSS with variables and responsive design
  - `files/app.js`: Core application logic using ES modules
  
- **Services**:
  - `files/translations.js`: Translation service with caching and rate limiting
  - `files/goals.js`: SDG data and prompt management
  - `files/config.js`: Centralized configuration management

### Dependencies

- **Frontend Framework**:
  - Bootstrap 5.3.0: UI components and responsive grid
  
- **External APIs**:
  - Gemini AI API: Advanced language model for analysis
  - MyMemory Translation API: Multi-language support

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/agenda2030ai.git
   cd agenda2030ai
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your-api-key
   ```

3. Configure the application:
   Update `files/config.js` with your settings:
   ```javascript
   const CONFIG = {
     API: {
       GEMINI: {
         API_KEY: process.env.GEMINI_API_KEY,
         BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
         MODEL: 'gemini-2.0-flash'
       }
     },
     // ... other configuration options
   };
   ```

4. Deploy:
   - For development: Use a local server (e.g., `python -m http.server`)
   - For production: Deploy to your preferred hosting service

## Usage

1. **Language Selection**:
   - Choose from 50+ languages in the top navigation
   - UI and responses automatically translate to selected language

2. **Exploring SDGs**:
   - Navigate through goals using the left sidebar
   - Each goal shows its title, description, and analysis prompts

3. **Getting AI Analysis**:
   - Click any prompt button under a goal
   - View AI-generated response in your chosen language
   - Responses include evidence-based insights and practical strategies

## Development

### Code Organization

```
agenda2030ai/
├── index.html          # Main application entry
├── files/
│   ├── app.js         # Core application logic
│   ├── config.js      # Configuration settings
│   ├── goals.js       # SDG data and prompts
│   ├── translations.js # Translation service
│   └── style.css      # Styling and themes
└── README.md          # Documentation
```

### Key Features Implementation

1. **Translation System**:
   - Queue-based request handling
   - Local storage caching
   - Rate limiting and retry logic
   - Batch translation processing

2. **AI Integration**:
   - Structured prompt templates
   - Error handling and fallbacks
   - Response formatting
   - Language-specific adjustments

3. **UI/UX Features**:
   - Progressive loading
   - Responsive layouts
   - Accessibility features
   - Error messaging

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution

- Additional language support
- New analytical prompts for SDGs
- UI/UX improvements
- Accessibility enhancements
- Performance optimizations
- Documentation improvements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- United Nations Sustainable Development Goals
- Google Cloud Platform and Gemini AI team
- MyMemory Translation Service
- Bootstrap team
- Open source community

## Support

For support, please:
1. Check existing GitHub issues
2. Review the documentation
3. Create a new issue with detailed information

---

Built with ❤️ for a sustainable future
