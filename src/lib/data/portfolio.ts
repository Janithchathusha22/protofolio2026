// Single source of truth for Janith Chathusha's portfolio
// Pure pitch black (#000000) · Glassmorphic cards · Engineering & Practical AI

export const SITE_URL = 'https://janithchathusha.com';

export type Accent = 'blue' | 'cyan' | 'gold';

export const profile = {
	name: 'Janith Chathusha',
	role: 'Software Engineer',
	thesis: 'I build full-stack products and practical AI systems.',
	statement:
		'Focused on engineering craft — scalable backend architecture, explainable machine learning pipelines, and intelligent automation that earns its place in production.',
	email: 'chathushadayawansha1346@gmail.com',
	resumeUrl: '/Janith_Chathusha_CV.pdf',
	portrait: '/portrait.webp',
	heroJpg: '/janith-hero.jpg',
	gradPortrait: '/janith-grad-portrait.webp',
	aboutPortrait: '/janith-about.webp',
	linkedin: 'https://www.linkedin.com/in/janith-chathusha/',
	github: 'https://github.com/JanithChathusha22',
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
		href: 'https://github.com/JanithChathusha22',
		handle: '@JanithChathusha22',
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

export type ProjectVisual =
	| 'newsshield'
	| 'newssite'
	| 'lpl'
	| 'srilanka-t20'
	| 'biomechanics'
	| 'matchmind'
	| 'aiassistant'
	| 'foodchecker';

export interface Project {
	id: string;
	index: string;
	title: string;
	subtitle: string;
	category: string;
	context: string;
	keyFeatures: [string, string];
	stack: string[];
	deliverable: string;
	visual: ProjectVisual;
	accent: Accent;
	caption: string;
	githubUrl?: string;
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
			'Built a web application evaluating news content using a BiLSTM model, rule-based heuristics, and explainable AI. Rather than an opaque classification verdict, NewsShield highlights the exact words that influenced the prediction so users can inspect model reasoning.',
		keyFeatures: [
			'Token attribution heatmap via LIME (Local Interpretable Model-agnostic Explanations)',
			'Continuous prediction confidence scoring paired with heuristic source checks'
		],
		stack: ['React', 'FastAPI', 'TensorFlow', 'Keras', 'LIME', 'BiLSTM'],
		deliverable: 'Explainable inference layer showing salient token attribution heatmap and classification confidence.',
		visual: 'newsshield',
		accent: 'gold',
		caption: 'Token attribution heatmap · LIME explainability',
		githubUrl: 'https://github.com/Janithchathusha22/NEWSSHIELD',
		linkedinUrl:
			'https://www.linkedin.com/posts/janith-chathusha_newsshield-an-ai-powered-fake-news-detection-activity-7456758714243620864-8lFI'
	},
	{
		id: 'newssite',
		index: '02',
		title: 'News Aggregation & Editorial Platform',
		subtitle: 'Automated Ingestion & Review-First Publishing',
		category: 'Full-Stack · AI Editorial Pipeline',
		context:
			'Engineered an end-to-end editorial platform combining automated multi-source news collection, AI-assisted draft generation, and a human-in-the-loop review workflow. Source text is stored as an immutable record, while editors review and approve drafts before publication.',
		keyFeatures: [
			'Automated collectors store immutable source articles and queue guarded Groq drafts',
			'Editorial review dashboard ensuring human verification and sign-off prior to publication'
		],
		stack: ['React', 'Express.js', 'Python', 'Supabase', 'PostgreSQL', 'Groq LLM'],
		deliverable: 'Review-first news platform with automated ingestion, editor approval desk, and public reader frontend.',
		visual: 'newssite',
		accent: 'blue',
		caption: 'Editorial review pipeline · Automated collection with human sign-off',
		githubUrl: 'https://github.com/JanithChathusha22/newssite'
	},
	{
		id: 'lpl',
		index: '03',
		title: 'LPL 2026 Intelligence',
		subtitle: 'Explainable Cricket Analytics Platform',
		category: 'Machine Learning · Sports Analytics',
		context:
			'Developed an interactive cricket analytics platform combining live match outcome forecasting, player matchup metrics, and tournament simulations. Connects machine learning models with an explainability layer so coaches and analysts can explore both predictions and their underlying factors.',
		keyFeatures: [
			'Real-time win-probability telemetry & projected scores with Gradient × Input explainability',
			'5,000 Monte Carlo match simulations with phase-wise player performance indexing'
		],
		stack: ['Python', 'PyTorch', 'scikit-learn', 'FastAPI', 'Streamlit', 'Pandas'],
		deliverable: 'Real-time telemetry pipeline with match-state win probability and feature contribution decomposition.',
		visual: 'lpl',
		accent: 'blue',
		caption: 'Win-probability telemetry · Gradient × Input attribution',
		githubUrl: 'https://github.com/Janithchathusha22/Lpl2026',
		linkedinUrl:
			'https://www.linkedin.com/pulse/lpl-2026-prediction-system-building-explainable-ai-xai-chathusha-0bzxc'
	},
	{
		id: 'srilanka-t20',
		index: '04',
		title: 'Sri Lanka T20 Performance Analytics',
		subtitle: '2006–2025 Historical Telemetry Dashboard',
		category: 'Data Analytics · Business Intelligence',
		context:
			'An interactive six-tab Power BI dashboard exploring Sri Lanka’s T20 international performance from 2006 to 2025. Analyzes team match results, phase-wise batting dynamics, over-by-over momentum trends, player head-to-head comparisons, and venue conditions.',
		keyFeatures: [
			'Star-schema data model transforming ball-by-ball records into Matches, Batters, Venues, and Wickets',
			'Deep KPI telemetry tracking Win %, Batting Average, Strike Rate, Boundary %, and Dot-Ball %'
		],
		stack: ['Python', 'Pandas', 'Power BI', 'Power Query', 'DAX'],
		deliverable: 'Interactive six-tab Power BI dashboard with DAX calculations and star-schema relationships.',
		visual: 'srilanka-t20',
		accent: 'cyan',
		caption: '6-tab Power BI dashboard · Ball-by-ball star schema 2006–2025',
		githubUrl: 'https://github.com/Janithchathusha22/Sri-Lanka-T20-Cricket-Performance-Analytics'
	},
	{
		id: 'biomechanics',
		index: '05',
		title: 'Cricket Biomechanics',
		subtitle: 'Bowling Action Kinematics Analyzer',
		category: 'Computer Vision · Video Analytics',
		context:
			'Created a computer vision research prototype that analyzes cricket bowling video footage using markerless pose estimation. Tracks anatomical landmarks and joint kinematics, identifies ball release frames, and produces annotated video alongside graphical reports.',
		keyFeatures: [
			'Markerless pose estimation with 33-landmark tracking and real-time joint-angle overlays',
			'Automated bowling action phase detection, release-frame identification, and kinematic charts'
		],
		stack: ['Python', 'OpenCV', 'MediaPipe Pose', 'NumPy', 'Matplotlib'],
		deliverable: 'Pose estimation pipeline with 33-landmark tracking and joint-angle kinematic charts.',
		visual: 'biomechanics',
		accent: 'cyan',
		caption: 'Markerless pose tracking · Joint kinematics overlay',
		statusBadge: 'Experimental Prototype'
	},
	{
		id: 'matchmind',
		index: '06',
		title: 'MatchMind',
		subtitle: 'Football Prediction & Tournament Explorer',
		category: 'Predictive Modeling · Web Application',
		context:
			'Built a football match prediction platform that transforms 49,000+ historical international match records, Elo ratings, recent form, and head-to-head dynamics into probabilistic match forecasts and tournament progression projections.',
		keyFeatures: [
			'Head-to-head team comparisons with win/draw/loss outcome distributions and Poisson xG',
			'Interactive tournament knockout bracket simulator with transparent rating weights'
		],
		stack: ['Python', 'scikit-learn', 'Pandas', 'FastAPI', 'React', 'HTML5/CSS3'],
		deliverable: 'Predictive simulation engine with outcome probability distributions and tournament bracket graphs.',
		visual: 'matchmind',
		accent: 'cyan',
		caption: 'Match forecast engine · Tournament bracket progression',
		githubUrl: 'https://github.com/Janithchathusha22/Matchmin',
		linkedinUrl:
			'https://www.linkedin.com/posts/janith-chathusha_fifaworldcup2026-fifaprediction-2026fifaprediction-activity-7481436182271184896-KYxL'
	},
	{
		id: 'aiassistant',
		index: '07',
		title: 'AI Customer Assistant',
		subtitle: 'Enterprise Workflow Automation',
		category: 'AI Automation · Database Integration',
		context:
			'Contributed to production AI customer-assistant workflows connecting natural-language conversational interfaces with relational business data, vector search, and automated back-office execution tools.',
		keyFeatures: [
			'Autonomous chat workflows wired to PostgreSQL databases via Supabase and n8n',
			'Dynamic prompt templates, conversation memory buffers, webhooks, and exception queues'
		],
		stack: ['n8n', 'Supabase', 'PostgreSQL', 'LLM APIs', 'Webhooks', 'REST APIs'],
		deliverable: 'Multi-node asynchronous agent workflow with conversational memory and database querying.',
		visual: 'aiassistant',
		accent: 'blue',
		caption: 'n8n workflow orchestration · Database integration pipeline',
		statusBadge: 'External Work'
	},
	{
		id: 'foodchecker',
		index: '08',
		title: 'Food Quality Checker',
		subtitle: 'Sensor-Based Freshness Monitoring',
		category: 'IoT · Embedded Systems · Research',
		context:
			'Contributed to an academic food-quality monitoring prototype that uses gas sensors and environmental telemetry to detect volatile organic compounds and monitor fruit freshness degradation curves over time.',
		keyFeatures: [
			'Multi-channel gas telemetry measuring VOCs via MQ-3 (alcohol) and MQ-4 (methane)',
			'Microcontroller firmware with button mode selection, 16x2 LCD readout, and DHT11 telemetry'
		],
		stack: ['Embedded C/C++', 'MQ-3', 'MQ-4', 'DHT11', 'Microcontroller', 'Hardware Interfacing'],
		deliverable: 'Embedded sensor firmware and physical telemetry unit logging spoilage gas concentrations.',
		visual: 'foodchecker',
		accent: 'gold',
		caption: 'Hardware sensor telemetry · VOC concentration curves',
		statusBadge: 'Academic Research Prototype',
		githubUrl: 'https://github.com/Janithchathusha22/research_code'
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
