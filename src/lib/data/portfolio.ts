// Single source of truth for Janith Chathusha's portfolio
// Pure pitch black (#000000) · Glassmorphic cards · Engineering & Practical AI

export type Accent = 'blue' | 'cyan' | 'gold';

export const profile = {
	name: 'Janith Chathusha',
	role: 'Software Engineer',
	thesis: 'I build full-stack products and practical AI systems.',
	statement:
		'Focused on engineering craft — scalable backend architecture, explainable machine learning pipelines, and intelligent automation that earns its place in production.',
	email: 'chathushadayawansha1346@gmail.com',
	resumeUrl: '/Janith_Chathusha_CV.pdf',
	portrait: '/portrait.jpg',
	gradPortrait: '/janith-grad-portrait.jpg',
	aboutPortrait: '/janith-about.jpg',
	linkedin: 'https://www.linkedin.com/in/janith-chathusha/',
	github: 'https://github.com/Janithchathusha22',
	behance: 'https://www.behance.net/janithchathusha'
};

export const navLinks = [
	{ label: 'Projects', href: '#projects' },
	{ label: 'Enterprise', href: '#workflows' },
	{ label: 'Systems', href: '#systems' },
	{ label: 'Timeline', href: '#timeline' },
	{ label: 'About', href: '#about' },
	{ label: 'Contact', href: '#contact' }
] as const;

export const socials = [
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/janith-chathusha/',
		handle: 'in/janith-chathusha',
		verified: true
	},
	{
		label: 'GitHub',
		href: 'https://github.com/Janithchathusha22',
		handle: '@Janithchathusha22',
		verified: true
	},
	{
		label: 'Behance',
		href: 'https://www.behance.net/janithchathusha',
		handle: 'behance/janithchathusha',
		verified: true
	},
	{
		label: 'Email',
		href: 'mailto:chathushadayawansha1346@gmail.com',
		handle: 'chathushadayawansha1346@gmail.com',
		verified: true
	}
] as const;

export type ProjectVisual = 'newsshield' | 'lpl' | 'biomechanics' | 'matchmind' | 'foodchecker' | 'aiassistant';

export interface Project {
	id: string;
	index: string;
	title: string;
	subtitle: string;
	category: string;
	context: string;
	keyFeatures: string[];
	stack: string[];
	deliverable: string;
	visual: ProjectVisual;
	accent: Accent;
	caption: string;
	linkedinUrl?: string;
	statusBadge?: string;
}

export const projects: Project[] = [
	{
		id: 'newsshield',
		index: '01',
		title: 'NewsShield',
		subtitle: 'Explainable Fake News Detection',
		category: 'NLP · Full-Stack AI',
		context:
			'Built a web application that evaluates news content using a BiLSTM model, rule-based checks, and explainable AI. Instead of showing only a classification verdict, NewsShield highlights the exact words that influenced the result, helping users inspect and understand the model’s reasoning.',
		keyFeatures: [
			'News classification with continuous prediction confidence scoring',
			'Word-level explainability using LIME (Local Interpretable Model-agnostic Explanations)',
			'Rule-based heuristics for identifying misleading framing and suspicious sourcing'
		],
		stack: ['React', 'Framer Motion', 'FastAPI', 'TensorFlow', 'Keras', 'LIME'],
		deliverable: 'Explainable inference layer showing salient token attribution heatmap and classification confidence.',
		visual: 'newsshield',
		accent: 'gold',
		caption: 'Token attribution heatmap · LIME explainability',
		linkedinUrl: 'https://www.linkedin.com/posts/janith-chathusha_newsshield-an-ai-powered-fake-news-detection-activity-7456758714243620864-8lFI'
	},
	{
		id: 'lpl',
		index: '02',
		title: 'LPL 2026 Intelligence',
		subtitle: 'Explainable Cricket Analytics Platform',
		category: 'Machine Learning · Sports Analytics',
		context:
			'Developed an interactive cricket analytics platform that combines live match predictions, player performance tracking, and tournament simulations. Connects machine learning models with an explainability layer so analysts and coaches can explore both the predictions and the factors behind them.',
		keyFeatures: [
			'Real-time match win-probability forecasting and projected innings scores',
			'Player performance indexing across match phases and head-to-head dynamics',
			'Tournament forecasting powered by 5,000 Monte Carlo match simulations',
			'Feature contributions visualized using Gradient × Input explainability'
		],
		stack: ['Python', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'FastAPI', 'Streamlit', 'Matplotlib'],
		deliverable: 'Real-time telemetry pipeline with match-state win probability and feature contribution decomposition.',
		visual: 'lpl',
		accent: 'blue',
		caption: 'Win-probability telemetry · Gradient × Input attribution',
		linkedinUrl: 'https://www.linkedin.com/pulse/lpl-2026-prediction-system-building-explainable-ai-xai-chathusha-0bzxc'
	},
	{
		id: 'biomechanics',
		index: '03',
		title: 'Cricket Biomechanics',
		subtitle: 'Bowling Action Analyzer',
		category: 'Computer Vision · Video Analytics',
		context:
			'Created a computer vision prototype that analyzes cricket bowling video footage using markerless pose estimation. It tracks body landmarks and joint kinematics, identifies ball release frames, and produces annotated video alongside graphical reports for technique exploration.',
		keyFeatures: [
			'Markerless pose tracking and real-time joint-angle visualization',
			'Automated bowling action phase detection and ball release-frame capture',
			'Kinematic trajectory and release angle metrics for biomechanical review',
			'Annotated video overlays and frame-by-frame joint angle progression charts'
		],
		stack: ['Python', 'OpenCV', 'MediaPipe Pose', 'NumPy', 'Pandas', 'Matplotlib'],
		deliverable: 'Pose estimation pipeline with 33-landmark tracking and joint-angle kinematic charts.',
		visual: 'biomechanics',
		accent: 'cyan',
		caption: 'Markerless pose tracking · Joint kinematics overlay',
		statusBadge: 'Experimental Prototype'
	},
	{
		id: 'matchmind',
		index: '04',
		title: 'MatchMind',
		subtitle: 'Football Prediction & Tournament Explorer',
		category: 'Predictive Modeling · Web Application',
		context:
			'Built a football match prediction platform that transforms team statistics, Elo ratings, recent form, and historical head-to-head performance into interactive match forecasts and tournament progression projections.',
		keyFeatures: [
			'Head-to-head team comparisons with win, draw, and loss outcome distributions',
			'Poisson-based expected goals (xG) projections and most likely scorelines',
			'Interactive knockout bracket simulator and team progression insights',
			'Methodology transparency layer explaining feature weights and ratings'
		],
		stack: ['Python', 'Pandas', 'scikit-learn', 'joblib', 'HTML5', 'CSS3', 'JavaScript'],
		deliverable: 'Predictive simulation engine with outcome probability distributions and tournament bracket graphs.',
		visual: 'matchmind',
		accent: 'cyan',
		caption: 'Match forecast engine · Tournament bracket progression',
		linkedinUrl: 'https://www.linkedin.com/posts/janith-chathusha_fifaworldcup2026-fifaprediction-2026fifaprediction-activity-7481436182271184896-KYxL'
	},
	{
		id: 'foodchecker',
		index: '05',
		title: 'Food Quality Checker',
		subtitle: 'Sensor-Based Freshness Monitoring',
		category: 'IoT · Embedded Systems · Research',
		context:
			'Contributed to an academic food-quality monitoring prototype that uses gas sensors and environmental telemetry to detect chemical markers associated with fruit freshness and spoilage over time.',
		keyFeatures: [
			'Multi-channel gas telemetry measuring volatile organic compounds (MQ-3, MQ-4)',
			'Environmental monitoring capturing ambient temperature and relative humidity (DHT11)',
			'Microcontroller firmware with button-controlled mode selection and 16x2 LCD readout',
			'Experimental time-series data logging for freshness degradation analysis'
		],
		stack: ['Embedded C/C++', 'MQ-3', 'MQ-4', 'DHT11', 'Microcontroller', 'Hardware Interfacing'],
		deliverable: 'Embedded sensor firmware and physical telemetry unit logging spoilage gas concentrations.',
		visual: 'foodchecker',
		accent: 'gold',
		caption: 'Hardware sensor telemetry · VOC concentration curves',
		statusBadge: 'Academic Research Prototype'
	},
	{
		id: 'aiassistant',
		index: '06',
		title: 'AI Customer Assistant',
		subtitle: 'Enterprise Workflow Automation',
		category: 'AI Automation · Database Integration',
		context:
			'Contributed to production-tested AI customer-assistant workflows connecting natural-language conversational interfaces with relational business data, vector search, and automated back-office execution tools.',
		keyFeatures: [
			'Autonomous chat workflows wired to PostgreSQL databases via Supabase',
			'Dynamic prompt templates, conversation memory buffers, and context retrieval',
			'Rigorous evaluation benchmarks on product catalog, pricing, and availability queries',
			'Webhook event listeners and automated exception-handling queues'
		],
		stack: ['n8n', 'Supabase', 'PostgreSQL', 'LLM APIs', 'Webhooks', 'REST APIs'],
		deliverable: 'Multi-node asynchronous agent workflow with conversational memory and database querying.',
		visual: 'aiassistant',
		accent: 'blue',
		caption: 'n8n workflow orchestration · Database integration pipeline',
		statusBadge: 'External Work'
	}
];

export const externalWorkflows = [
	{
		index: '01',
		title: 'Autonomous AI Agent Platform',
		body: 'Architected multi-agent execution queues and autonomous workflow pipelines connecting LLMs with external tools, stateful memory buffers, and asynchronous task telemetry.',
		tags: ['Agent Queues', 'Tool Calling', 'Asynchronous Ops', 'LangGraph'],
		architecture: 'FastAPI · PostgreSQL · Redis Queue · Worker Nodes · WebSocket'
	},
	{
		index: '02',
		title: 'Distributed Commerce & Fulfillment Ecosystem',
		body: 'Engineered high-throughput catalog indexing, real-time inventory synchronization, and resilient checkout pipelines designed for sub-second page loads and zero inventory collision.',
		tags: ['High-Throughput SSR', 'Inventory Sync', 'Distributed Cart', 'Microservices'],
		architecture: 'Next.js · Node.js · InfluxDB / PostgreSQL · Redis · Docker'
	},
	{
		index: '03',
		title: 'Executive Media & Editorial Content Engine',
		body: 'Built ultra-fast SSR content delivery infrastructure with headless CMS integration, structured SEO graph generation, and asset optimization pipelines for national business leadership media.',
		tags: ['Headless CMS', 'Edge SSR', 'Automated SEO', 'Performance'],
		architecture: 'SvelteKit / Next.js · Headless CMS · CDN Edge · AWS S3'
	}
];

export interface SkillGroup {
	id: string;
	label: string;
	accent: Accent;
	summary: string;
	usage: string[];
	items: string[];
}

export const skillGroups: SkillGroup[] = [
	{
		id: 'frontend',
		label: 'Frontend & UI',
		accent: 'cyan',
		summary: 'Interfaces engineered for speed, legibility, and effortless interaction under complex data loads.',
		usage: [
			'Production SPAs and SSR platforms with typed contracts (React, Next.js, SvelteKit)',
			'Design-system tokens, accessible primitives, and micro-animations with Tailwind CSS',
			'Cross-platform mobile applications built with Flutter'
		],
		items: ['React', 'Next.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Flutter', 'SvelteKit', 'Framer Motion']
	},
	{
		id: 'backend',
		label: 'Backend & Services',
		accent: 'blue',
		summary: 'Service architectures built around clean boundaries, explicit schemas, and failure isolation.',
		usage: [
			'Asynchronous model inference and REST endpoints using FastAPI and Python',
			'Enterprise microservices and modular APIs with Node.js, Express, and Spring Boot',
			'WebSocket telemetry streams and asynchronous worker queues'
		],
		items: ['Python', 'FastAPI', 'Node.js', 'Express', 'Java', 'Spring Boot', 'REST APIs', 'Microservices']
	},
	{
		id: 'ai',
		label: 'AI & Machine Learning',
		accent: 'gold',
		summary: 'Practical machine learning systems with interpretability, evaluation rigor, and production serving.',
		usage: [
			'Deep learning classification pipelines with BiLSTM and TensorFlow / Keras',
			'Explainable AI implementations with LIME and Gradient × Input attribution',
			'Autonomous agent workflows with LangChain, LangGraph, CrewAI, and n8n'
		],
		items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'LIME', 'OpenCV', 'MediaPipe', 'LangChain', 'n8n']
	},
	{
		id: 'data',
		label: 'Data & Databases',
		accent: 'blue',
		summary: 'Relational, time-series, and document databases paired with analytical data processing.',
		usage: [
			'Relational schema design and row-level security on PostgreSQL & Supabase',
			'High-speed time-series telemetry ingestion with InfluxDB',
			'Feature engineering, statistical simulations, and analysis with Pandas & NumPy'
		],
		items: ['PostgreSQL', 'Supabase', 'MongoDB', 'MySQL', 'InfluxDB', 'Pandas', 'NumPy', 'Redis']
	},
	{
		id: 'cloud',
		label: 'Cloud & DevOps',
		accent: 'cyan',
		summary: 'Reproducible containerization, automated testing, and predictable deployment pipelines.',
		usage: [
			'Containerized service delivery with Docker and Docker Compose',
			'Automated build, test, and linting pipelines with GitHub Actions CI/CD',
			'Cloud compute provisioning and object storage on AWS EC2 & S3'
		],
		items: ['Docker', 'AWS EC2', 'AWS S3', 'GitHub Actions CI/CD', 'Linux', 'Vercel']
	},
	{
		id: 'quality',
		label: 'Quality & Tooling',
		accent: 'gold',
		summary: 'Systematic testing, telemetry observability, and collaborative software delivery.',
		usage: [
			'API verification and automated test suites with Postman and Jest',
			'Data telemetry dashboards and operational metrics in Power BI and Grafana',
			'Agile sprint delivery, technical documentation, and UI wireframing in Figma'
		],
		items: ['Jest', 'Postman', 'Power BI', 'Grafana', 'Figma', 'Agile / Scrum', 'Git']
	}
];

export const experience = [
	{ period: 'Mar 2026 — Present', role: 'Software Engineer (Full-Stack)', org: 'Absolx', current: true },
	{ period: 'Nov 2025 — Feb 2026', role: 'Associate Software Engineer (Full-Stack)', org: 'Absolx', current: false },
	{ period: 'Apr 2025 — Dec 2025', role: 'Associate Data Analyst', org: 'Inplay Matrix', current: false },
	{ period: 'Feb 2024 — May 2024', role: 'Software Engineer (Contract)', org: 'Nextzela Technologies', current: false },
	{ period: 'Feb 2023 — Aug 2023', role: 'Trainee Software Developer', org: 'Bank of Ceylon', current: false }
];

export const education = {
	degree: 'BSc (Hons) in Information Technology',
	school: 'Sri Lanka Institute of Information Technology (SLIIT)',
	period: '2020 — 2024'
};

export const accentHex: Record<Accent, string> = {
	blue: '#1687FF',
	cyan: '#24D7FF',
	gold: '#EAB66A'
};
