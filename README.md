# Agenda 2030 AI Explorer

An interactive web application that leverages AI to explore and analyze the United Nations Sustainable Development Goals (SDGs). The platform provides in-depth analysis and insights about each of the 17 SDGs through AI-powered discussions in 50 different languages.

## Features

- **17 SDG Goals Coverage**: Comprehensive coverage of all UN Sustainable Development Goals
- **Multilingual Support**: Available in 50 languages including:
  - Major European languages (English, French, German, Spanish, etc.)
  - Asian languages (Chinese, Japanese, Korean, etc.)
  - South Asian languages (Hindi, Bengali, Tamil, etc.)
  - Middle Eastern languages (Arabic, Hebrew, Persian, etc.)
  - African languages (Swahili, Zulu, Amharic, etc.)
- **AI-Powered Analysis**: Deep, analytical responses to complex questions about each SDG
- **Real-time Translation**: Seamless translation of both prompts and responses
- **Responsive Design**: Works on desktop and mobile devices

## Technical Architecture

### Core Components

- `index.html`: Main application interface
- `files/app.js`: Core application logic and AI service integration
- `files/goals.js`: SDG data structure and management
- `files/translations.js`: Translation service implementation
- `files/style.css`: Application styling
- `files/config.js`: Configuration settings

### Dependencies

- Bootstrap 5.3.0: UI framework
- Google Cloud Translation API: Multilingual support
- Gemini AI API: AI response generation

## Setup and Installation

1. Clone the repository
2. Configure API keys in `config.js`:
   ```javascript
   const CONFIG = {
       GEMINI_API_KEY: 'your-api-key',
       GEMINI_API_URL: 'your-api-endpoint'
   };
   ```
3. Deploy to a web server
4. Access through a web browser

## Usage

1. Select your preferred language from the dropdown menu
2. Browse through the 17 SDG goals
3. Click on any of the analytical prompts under each goal
4. Receive detailed AI-generated analysis in your chosen language

## Features of AI Analysis

The AI prompts are designed to provide:
- Detailed comparative analysis
- Evidence-based insights
- Implementation strategies
- Cost-benefit considerations
- Real-world case studies
- Quantifiable metrics and outcomes

## Contributing

Contributions are welcome! Please feel free to submit pull requests with:
- Additional language support
- New analytical prompts
- UI/UX improvements
- Documentation updates

## License

This project is open source and available under the MIT License.

## Acknowledgments

- United Nations Sustainable Development Goals
- Google Cloud Platform
- Gemini AI
- Bootstrap Team
