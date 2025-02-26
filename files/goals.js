const GOALS = [
    {
        id: 1,
        title: "No Poverty",
        description: "End poverty in all its forms everywhere",
        prompts: [
            "What are innovative solutions to eliminate extreme poverty?",
            "How can technology help reduce poverty in rural areas?",
            "Explain the connection between education and poverty reduction",
            "What are successful poverty reduction programs worldwide?",
            "How can sustainable development help end poverty?"
        ]
    },
    {
        id: 2,
        title: "Zero Hunger",
        description: "End hunger, achieve food security and improved nutrition",
        prompts: [
            "What are sustainable solutions to end world hunger?",
            "How can we reduce food waste globally?",
            "Explain the impact of climate change on food security",
            "What are innovative farming techniques for sustainable agriculture?",
            "How can technology improve food distribution systems?"
        ]
    },
    {
        id: 3,
        title: "Good Health and Well-being",
        description: "Ensure healthy lives and promote well-being for all at all ages",
        prompts: [
            "How can we improve global healthcare access?",
            "What are effective strategies for disease prevention?",
            "How can mental health services be made more accessible?",
            "What role does technology play in modern healthcare?",
            "How can we prepare for future health crises?"
        ]
    },
    {
        id: 4,
        title: "Quality Education",
        description: "Ensure inclusive and equitable quality education for all",
        prompts: [
            "How can we make education more accessible globally?",
            "What role does technology play in modern education?",
            "How can we improve educational quality in developing regions?",
            "What are innovative teaching methods for the digital age?",
            "How can we ensure lifelong learning opportunities?"
        ]
    },
    {
        id: 5,
        title: "Gender Equality",
        description: "Achieve gender equality and empower all women and girls",
        prompts: [
            "How can we promote gender equality in the workplace?",
            "What strategies help eliminate gender-based discrimination?",
            "How can technology empower women and girls?",
            "What are successful gender equality initiatives worldwide?",
            "How can we ensure equal opportunities in education?"
        ]
    },
    {
        id: 6,
        title: "Clean Water and Sanitation",
        description: "Ensure availability and sustainable management of water and sanitation for all",
        prompts: [
            "What are innovative solutions for clean water access?",
            "How can we improve global sanitation systems?",
            "What technologies help water conservation?",
            "How can we protect water resources?",
            "What are sustainable water management practices?"
        ]
    },
    {
        id: 7,
        title: "Affordable and Clean Energy",
        description: "Ensure access to affordable, reliable, sustainable and modern energy",
        prompts: [
            "How can we transition to renewable energy sources?",
            "What are innovative clean energy solutions?",
            "How can we make clean energy more affordable?",
            "What role does energy efficiency play?",
            "How can developing nations access clean energy?"
        ]
    },
    {
        id: 8,
        title: "Decent Work and Economic Growth",
        description: "Promote sustained, inclusive and sustainable economic growth",
        prompts: [
            "How can we create more sustainable jobs?",
            "What strategies promote inclusive economic growth?",
            "How can technology improve working conditions?",
            "What are effective ways to reduce unemployment?",
            "How can we ensure fair labor practices?"
        ]
    },
    {
        id: 9,
        title: "Industry, Innovation and Infrastructure",
        description: "Build resilient infrastructure and promote sustainable industrialization",
        prompts: [
            "How can we build more sustainable infrastructure?",
            "What role does innovation play in development?",
            "How can technology improve industrial efficiency?",
            "What are sustainable manufacturing practices?",
            "How can we promote technological innovation?"
        ]
    },
    {
        id: 10,
        title: "Reduced Inequalities",
        description: "Reduce inequality within and among countries",
        prompts: [
            "How can we reduce economic inequality?",
            "What policies promote social inclusion?",
            "How can technology help reduce inequalities?",
            "What are successful inequality reduction programs?",
            "How can we ensure equal opportunities for all?"
        ]
    },
    {
        id: 11,
        title: "Sustainable Cities and Communities",
        description: "Make cities inclusive, safe, resilient and sustainable",
        prompts: [
            "How can we create more sustainable cities?",
            "What makes a city smart and inclusive?",
            "How can urban planning improve quality of life?",
            "What are innovative solutions for urban challenges?",
            "How can we reduce urban environmental impact?"
        ]
    },
    {
        id: 12,
        title: "Responsible Consumption and Production",
        description: "Ensure sustainable consumption and production patterns",
        prompts: [
            "How can we promote sustainable consumption?",
            "What are effective recycling strategies?",
            "How can we reduce waste in production?",
            "What are circular economy best practices?",
            "How can technology support sustainable production?"
        ]
    },
    {
        id: 13,
        title: "Climate Action",
        description: "Take urgent action to combat climate change and its impacts",
        prompts: [
            "What are effective climate change solutions?",
            "How can we reduce carbon emissions?",
            "What role can individuals play in climate action?",
            "How can technology help fight climate change?",
            "What are successful climate adaptation strategies?"
        ]
    },
    {
        id: 14,
        title: "Life Below Water",
        description: "Conserve and sustainably use the oceans, seas and marine resources",
        prompts: [
            "How can we protect marine ecosystems?",
            "What solutions exist for ocean pollution?",
            "How can we promote sustainable fishing?",
            "What are ways to preserve coral reefs?",
            "How can we reduce plastic in oceans?"
        ]
    },
    {
        id: 15,
        title: "Life on Land",
        description: "Protect, restore and promote sustainable use of terrestrial ecosystems",
        prompts: [
            "How can we protect biodiversity?",
            "What are effective forest conservation methods?",
            "How can we combat desertification?",
            "What are sustainable land use practices?",
            "How can we preserve endangered species?"
        ]
    },
    {
        id: 16,
        title: "Peace, Justice and Strong Institutions",
        description: "Promote peaceful and inclusive societies for sustainable development",
        prompts: [
            "How can we strengthen democratic institutions?",
            "What promotes peace and justice globally?",
            "How can we reduce corruption?",
            "What makes institutions more effective?",
            "How can technology improve governance?"
        ]
    },
    {
        id: 17,
        title: "Partnerships for the Goals",
        description: "Strengthen the means of implementation and revitalize global partnership",
        prompts: [
            "How can we improve international cooperation?",
            "What makes partnerships more effective?",
            "How can technology support global partnerships?",
            "What are successful partnership models?",
            "How can we strengthen global collaboration?"
        ]
    }
];

class GoalsManager {
    constructor() {
        this.goals = GOALS;
    }

    createGoalNavItem(goal) {
        const navItem = document.createElement('button');
        navItem.className = `list-group-item list-group-item-action ${goal.id === 1 ? 'active' : ''}`;
        navItem.setAttribute('data-bs-toggle', 'list');
        navItem.setAttribute('data-bs-target', `#goal-${goal.id}`);
        navItem.setAttribute('role', 'tab');
        
        const title = goal.title;
        navItem.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="goal-number me-3">${goal.id}</div>
                <div>
                    <h6 class="mb-0" data-translate data-original-text="${title}">${title}</h6>
                </div>
            </div>
        `;
        return navItem;
    }

    createGoalPanel(goal) {
        const panel = document.createElement('div');
        panel.className = `tab-pane fade ${goal.id === 1 ? 'show active' : ''}`;
        panel.id = `goal-${goal.id}`;
        panel.setAttribute('role', 'tabpanel');

        const title = goal.title;
        const description = goal.description;
        
        panel.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title" data-translate data-original-text="${title}">${title}</h4>
                    <p class="card-text" data-translate data-original-text="${description}">${description}</p>
                    <div class="prompts-container">
                        ${goal.prompts.map((prompt, index) => `
                            <button class="btn btn-outline-primary prompt-button mb-2" 
                                    data-translate
                                    data-original-text="${prompt}">
                                ${prompt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        return panel;
    }

    renderGoals() {
        const goalsNav = document.getElementById('goals-nav');
        const goalsContent = document.getElementById('goals-content');

        this.goals.forEach(goal => {
            goalsNav.appendChild(this.createGoalNavItem(goal));
            goalsContent.appendChild(this.createGoalPanel(goal));
        });
    }
}
