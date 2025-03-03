/**
 * goals.js
 * This file contains the core data structure and management for the UN Sustainable Development Goals (SDGs).
 * It defines all 17 goals, their descriptions, and associated AI prompts for analysis and discussion.
 */

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
 * GOALS Array - Contains detailed information about each of the 17 UN Sustainable Development Goals
 * @type {Array<{
 *   id: number,
 *   title: string,
 *   description: string,
 *   prompts: string[]
 * }>}
 */
const GOALS = [
    {
        id: 1,
        title: "No Poverty",
        description: "End poverty in all its forms everywhere",
        prompts: [
            "Analyze 3-5 innovative tech-based solutions that have successfully reduced extreme poverty in different regions, including their implementation challenges and measurable outcomes",
            "Compare the effectiveness of digital financial inclusion tools in reducing poverty across rural communities in developing countries, with specific examples and metrics",
            "Provide a detailed analysis of how specific educational interventions have broken intergenerational poverty cycles, supported by case studies and quantitative evidence",
            "Evaluate the most cost-effective poverty reduction programs from the past decade, their scalability factors, and the key elements that contributed to their success",
            "Elaborate on how circular economy principles can create sustainable livelihood opportunities while addressing poverty in resource-constrained communities"
        ]
    },
    {
        id: 2,
        title: "Zero Hunger",
        description: "End hunger, achieve food security and improved nutrition",
        prompts: [
            "Compare vertical farming, precision agriculture, and regenerative farming approaches for food security in different geographic and economic contexts, with implementation costs and yield data",
            "Analyze successful food waste reduction strategies across the supply chain, from production to consumption, with quantifiable impact metrics",
            "Evaluate the effectiveness of different nutrition education and food security programs in improving community health outcomes"
        ]
    },
    {
        id: 3,
        title: "Good Health and Well-being",
        description: "Ensure healthy lives and promote well-being for all at all ages",
        prompts: [
            "Design a comprehensive healthcare access framework for remote communities that integrates telemedicine, community health workers, and mobile clinics with specific implementation protocols",
            "Develop a multi-layer disease prevention strategy that addresses environmental factors, behavioral interventions, and healthcare system readiness for both communicable and non-communicable diseases",
            "Create a detailed implementation plan for integrating mental health services into primary care settings in resource-limited areas, including training protocols, screening tools, and evaluation metrics",
            "Analyze how AI diagnostic tools, wearable health monitors, and telehealth platforms can be integrated into traditional healthcare systems with evidence of improved outcomes and cost efficiencies",
            "Outline a detailed pandemic preparedness framework that addresses surveillance systems, supply chain resilience, healthcare workforce capacity, and global coordination mechanisms based on lessons from recent health crises"
        ]
    },
    {
        id: 4,
        title: "Quality Education",
        description: "Ensure inclusive and equitable quality education for all",
        prompts: [
            "Design a comprehensive education access strategy that combines low-tech and high-tech solutions for different resource settings, with implementation costs and expected outcomes for each component",
            "Analyze the effectiveness of blended learning, AI tutors, and adaptive learning platforms for different subjects and age groups, including deployment requirements and success metrics",
            "Compare successful teacher training and retention programs in developing regions that have demonstrably improved educational outcomes, with cost-benefit analyses and implementation frameworks",
            "Develop a framework for implementing project-based, experiential learning methods in resource-constrained classrooms, with subject-specific examples and assessment strategies",
            "Create a detailed roadmap for establishing community learning centers that support continuous education across different life stages, including funding models and community engagement strategies"
        ]
    },
    {
        id: 5,
        title: "Gender Equality",
        description: "Achieve gender equality and empower all women and girls",
        prompts: [
            "Design a comprehensive workplace gender equality program that addresses hiring practices, promotion pathways, compensation structures, and organizational culture, with implementation benchmarks and measurement tools",
            "Analyze the effectiveness of legal frameworks, educational initiatives, and community engagement strategies in reducing gender-based discrimination across different cultural contexts",
            "Evaluate how specific digital platforms, financial technology services, and skills development programs have measurably improved economic opportunities for women in emerging economies",
            "Compare 3-5 gender equality initiatives that have achieved significant impact, analyzing their strategies, resource requirements, scalability factors, and quantifiable outcomes",
            "Create an implementation framework for gender-responsive education systems addressing curriculum design, teacher training, school facilities, and family engagement strategies"
        ]
    },
    {
        id: 6,
        title: "Clean Water and Sanitation",
        description: "Ensure availability and sustainable management of water and sanitation for all",
        prompts: [
            "Compare the cost-effectiveness, maintenance requirements, and community acceptance of different water purification technologies (membrane filtration, solar distillation, chemical treatment) in low-resource settings",
            "Design a comprehensive sanitation system for informal urban settlements that addresses waste collection, treatment, cultural factors, and economic sustainability through circular economy principles",
            "Analyze the implementation requirements and water conservation outcomes of smart irrigation systems, greywater recycling, and rainwater harvesting in different agricultural and urban contexts",
            "Develop a multi-stakeholder watershed protection strategy that balances industrial use, agricultural needs, and ecosystem requirements while addressing climate change impacts",
            "Outline a detailed framework for community-based water management systems that includes governance structures, monitoring protocols, maintenance systems, and financing mechanisms"
        ]
    },
    {
        id: 7,
        title: "Affordable and Clean Energy",
        description: "Ensure access to affordable, reliable, sustainable and modern energy",
        prompts: [
            "Compare the implementation costs, maintenance requirements, and long-term economics of different renewable energy transition pathways for countries with varying resource profiles and existing infrastructure",
            "Analyze recent breakthroughs in energy storage, small-scale nuclear, and enhanced geothermal systems, including their technical readiness, cost trajectories, and optimal deployment contexts",
            "Design a pricing and subsidy framework that makes clean energy accessible to lower-income populations while maintaining economic viability for providers, with implementation roadmaps",
            "Evaluate specific energy efficiency technologies and policies across industrial, commercial, and residential sectors, ranking them by implementation cost and energy savings potential",
            "Create a detailed implementation plan for establishing distributed renewable energy systems in rural areas with limited infrastructure, including technical specifications, training requirements, and financing models"
        ]
    },
    {
        id: 8,
        title: "Decent Work and Economic Growth",
        description: "Promote sustained, inclusive and sustainable economic growth",
        prompts: [
            "Design a comprehensive strategy for creating sustainable jobs in green economy sectors, including skills training pipelines, policy incentives, and investment mechanisms with quantifiable outcomes",
            "Analyze how different economic policies can promote growth while reducing inequality, supported by case studies where inclusive growth has been achieved across different economic systems",
            "Evaluate specific digital platforms, automation safety standards, and worker representation models that have demonstrably improved working conditions in different industries and regions",
            "Compare the effectiveness of different unemployment reduction approaches (skills development, entrepreneurship support, public works programs) across different economic contexts and demographic groups",
            "Develop a framework for implementing and enforcing fair labor practices in global supply chains, including monitoring mechanisms, incentive structures, and consumer engagement strategies"
        ]
    },
    {
        id: 9,
        title: "Industry, Innovation and Infrastructure",
        description: "Build resilient infrastructure and promote sustainable industrialization",
        prompts: [
            "Design infrastructure development plans that incorporate climate resilience, modular expansion capability, and multi-functionality for resource-constrained environments with specific technical and financing considerations",
            "Analyze how innovation ecosystems can be established in developing economies, with specific components addressing research capacity, funding mechanisms, regulatory environments, and knowledge transfer",
            "Compare the resource efficiency gains, implementation requirements, and ROI of different industrial optimization technologies across manufacturing sectors with varying levels of technological readiness",
            "Develop detailed guidelines for implementing circular manufacturing processes that minimize waste, energy use, and resource extraction while maintaining production efficiency and product quality",
            "Create an actionable framework for fostering technological innovation in underserved regions that addresses education pipeline, infrastructure requirements, funding mechanisms, and market access"
        ]
    },
    {
        id: 10,
        title: "Reduced Inequalities",
        description: "Reduce inequality within and among countries",
        prompts: [
            "Analyze the effectiveness of progressive taxation, universal basic services, and wealth redistribution mechanisms in reducing economic inequality, with case studies and outcome metrics from different economic systems",
            "Design a comprehensive policy framework that promotes social inclusion across dimensions of race, ethnicity, disability, age, and socioeconomic status, with specific implementation strategies",
            "Evaluate how specific digital inclusion programs, fintech solutions, and skills development platforms have measurably reduced opportunity gaps in different regional and demographic contexts",
            "Compare the implementation approaches and outcomes of inequality reduction programs in Nordic countries, East Asian economies, and Latin American nations, identifying transferable elements",
            "Develop a detailed strategy for creating equality of opportunity in education, employment, and entrepreneurship that addresses structural barriers, implicit biases, and resource disparities"
        ]
    },
    {
        id: 11,
        title: "Sustainable Cities and Communities",
        description: "Make cities inclusive, safe, resilient and sustainable",
        prompts: [
            "Design a comprehensive urban sustainability transformation plan that addresses energy systems, transportation networks, building standards, and green spaces with implementation phases and financing mechanisms",
            "Compare the effectiveness of different smart city implementations, analyzing their technology infrastructure, governance systems, privacy protections, and measurable quality of life improvements",
            "Create a detailed urban planning framework that optimizes for walkability, mixed-use development, affordable housing integration, and climate resilience with zoning recommendations and design guidelines",
            "Analyze innovative solutions for urban waste management, water conservation, urban food production, and renewable energy integration that work as interconnected systems rather than isolated interventions",
            "Develop a detailed strategy for retrofitting existing urban areas to reduce environmental impact while improving livability, with cost-benefit analyses and implementation prioritization frameworks"
        ]
    },
    {
        id: 12,
        title: "Responsible Consumption and Production",
        description: "Ensure sustainable consumption and production patterns",
        prompts: [
            "Design a comprehensive consumer education and incentive system that effectively shifts purchasing patterns toward sustainable products, with behavioral insights and implementation strategies",
            "Compare the environmental impact, economic viability, and implementation requirements of different recycling systems across various material types and regional contexts",
            "Analyze the most effective strategies for reducing resource intensity in manufacturing across different sectors, with case studies demonstrating successful circular economy implementations",
            "Develop a detailed implementation framework for circular economy business models in different industries, including required policy support, investment needs, and transition pathways",
            "Create a comprehensive strategy for implementing digital tracking systems, sustainable certification standards, and transparency tools that enable responsible production across global supply chains"
        ]
    },
    {
        id: 13,
        title: "Climate Action",
        description: "Take urgent action to combat climate change and its impacts",
        prompts: [
            "Compare the carbon reduction potential, implementation requirements, and economic impacts of different climate solutions across energy, transportation, agriculture, and industrial sectors",
            "Design a comprehensive carbon pricing and regulatory framework that effectively reduces emissions while addressing equity concerns and economic transitions, with implementation pathways",
            "Develop a detailed action plan for individual climate impact reduction that quantifies the effects of different lifestyle changes across housing, transportation, diet, and consumption patterns",
            "Analyze how specific AI applications, clean energy technologies, and carbon capture approaches can be deployed in combination to maximize climate impact, with implementation timelines and requirements",
            "Create a comprehensive climate adaptation strategy for a coastal city that addresses sea level rise, extreme weather events, infrastructure vulnerability, and community resilience with phased implementation plans"
        ]
    },
    {
        id: 14,
        title: "Life Below Water",
        description: "Conserve and sustainably use the oceans, seas and marine resources",
        prompts: [
            "Design a comprehensive marine protected area network that optimizes for biodiversity conservation, sustainable fisheries, and climate resilience, with monitoring systems and enforcement mechanisms",
            "Compare the effectiveness, implementation requirements, and economic impacts of different ocean pollution mitigation strategies addressing plastic waste, agricultural runoff, and industrial discharge",
            "Develop detailed guidelines for implementing sustainable fishing practices across different scales of operation, from artisanal to industrial, with technology requirements and transition strategies",
            "Create an actionable framework for coral reef preservation that combines climate adaptation, pollution control, restoration techniques, and community stewardship with specific protocols for each component",
            "Analyze the most promising technological and policy solutions for reducing ocean plastic pollution at different points in the lifecycle, from production restrictions to recovery systems, with implementation pathways"
        ]
    },
    {
        id: 15,
        title: "Life on Land",
        description: "Protect, restore and promote sustainable use of terrestrial ecosystems",
        prompts: [
            "Design a biodiversity conservation strategy that integrates protected areas, sustainable use zones, and restoration corridors, with implementation guidelines for different ecosystem types",
            "Compare the effectiveness, implementation requirements, and socioeconomic impacts of different forest conservation approaches including community forestry, payment for ecosystem services, and protected areas",
            "Analyze the most effective strategies for combating desertification across different climate zones, including technical interventions, policy frameworks, and community engagement approaches",
            "Develop a comprehensive framework for sustainable land management that balances agricultural productivity, ecosystem services, and climate resilience across different landscape types",
            "Create a detailed action plan for endangered species conservation that integrates habitat protection, anti-poaching measures, captive breeding programs, and community incentives with implementation protocols"
        ]
    },
    {
        id: 16,
        title: "Peace, Justice and Strong Institutions",
        description: "Promote peaceful and inclusive societies for sustainable development",
        prompts: [
            "Design a comprehensive framework for strengthening democratic institutions that addresses electoral systems, civic education, media independence, and public participation with implementation strategies",
            "Analyze successful peace-building and conflict resolution initiatives across different conflict types, identifying critical success factors, resource requirements, and transferable approaches",
            "Develop a detailed anti-corruption strategy that combines transparency mechanisms, accountability systems, whistleblower protections, and enforcement capabilities with implementation pathways",
            "Create an evidence-based framework for improving institutional effectiveness that addresses organizational design, human resource management, process optimization, and technology integration",
            "Evaluate how specific digital governance tools, civic tech platforms, and e-participation systems have measurably improved government accountability and service delivery in different contexts"
        ]
    },
    {
        id: 17,
        title: "Partnerships for the Goals",
        description: "Strengthen the means of implementation and revitalize global partnership",
        prompts: [
            "Design a framework for improving international cooperation on sustainable development that addresses governance structures, funding mechanisms, knowledge sharing systems, and accountability measures",
            "Analyze the key factors that determine partnership effectiveness across public-private collaborations, multi-stakeholder initiatives, and international agreements, with specific success metrics",
            "Evaluate how specific digital platforms, data sharing protocols, and communication technologies can strengthen global partnerships, with implementation requirements and case studies",
            "Compare different partnership models (bilateral aid, public-private partnerships, south-south cooperation) across dimensions of effectiveness, equity, sustainability, and scalability",
            "Develop a comprehensive strategy for strengthening global scientific and technological collaboration on sustainable development challenges, addressing intellectual property, funding mechanisms, and capacity building"
        ]
    }
];

// Export the constants for use in other modules
export { GOALS, DEFAULT_LLM_CONFIG };

/**
 * GoalsManager Class
 * Manages the rendering and interaction with the SDG goals in the UI
 */
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
