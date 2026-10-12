export interface SkillNode {
	id: string;
	name: string;
	level: 'Core' | 'Advanced' | 'Specialized';
	tools: string[];
	context: string;
}

export interface SkillBranch {
	id: string;
	title: string;
	color: string; // Neon hex code
	glowColor: string;
	description: string;
	skills: SkillNode[];
}

export interface TreeRoot {
	id: string;
	name: string;
	category: string;
}

export const treeRootsData: TreeRoot[] = [
	{ id: 'python', name: 'Python', category: 'Language Core' },
	{ id: 'ts', name: 'TypeScript / JS', category: 'Language Core' },
	{ id: 'java', name: 'Java & OOP', category: 'Language Core' },
	{ id: 'cpp', name: 'C++ Firmware', category: 'Low-Level Systems' },
	{ id: 'dsa', name: 'Algorithms & Data Structures', category: 'Foundations' },
	{ id: 'db', name: 'SQL & Relational DBs', category: 'Data Modeling' },
	{ id: 'math', name: 'Linear Algebra & Statistics', category: 'Foundations' }
];

export const skillTreeData: SkillBranch[] = [
	{
		id: 'ai-intelligence',
		title: 'AI & Agentic Systems',
		color: '#FFB800', // Solar Amber Gold (matching tree crown node)
		glowColor: 'rgba(255, 184, 0, 0.45)',
		description: 'Multi-agent autonomous systems, Explainable AI, and neural architectures.',
		skills: [
			{
				id: 'agents',
				name: 'Agentic AI & Orchestration',
				level: 'Specialized',
				tools: ['LangGraph', 'CrewAI', 'LangChain', 'n8n'],
				context: 'Autonomous collaborative multi-agent decision systems engineered for client workflows and workflow synthesis.'
			},
			{
				id: 'dl-xai',
				name: 'Deep Learning & XAI',
				level: 'Advanced',
				tools: ['PyTorch', 'TensorFlow', 'Bi-LSTM', 'LIME'],
				context: 'Explainable NLP & real-time token attribution (NewsShield 96% accuracy with token-level heatmap verification).'
			},
			{
				id: 'rag-llm',
				name: 'LLMs, RAG & Vector Stores',
				level: 'Advanced',
				tools: ['ChromaDB', 'FAISS', 'Transformers', 'LoRA', 'Fine-Tuning'],
				context: 'Healthcare GenAI (MediPulse) & production semantic search with localized hybrid vector retrieval.'
			}
		]
	},
	{
		id: 'sports-analytics',
		title: 'Sports Intelligence & Predictive Analytics',
		color: '#00F0FF', // Electric Cyan
		glowColor: 'rgba(0, 240, 255, 0.45)',
		description: 'Live sports data telemetry, predictive match simulation, and statistical modeling.',
		skills: [
			{
				id: 'sports-sim',
				name: 'Predictive Sports Simulations',
				level: 'Specialized',
				tools: ['Python', 'PyTorch', 'Scikit-learn', 'Streamlit'],
				context: 'LPL 2026 match-state win probability calculation and real-time player impact analytics.'
			},
			{
				id: 'time-series',
				name: 'Time-Series & Forecasting',
				level: 'Advanced',
				tools: ['Pandas', 'NumPy', 'Regression', 'Anomaly Detection'],
				context: 'Live sports feed anomaly detection & real-time streaming telemetry processed at Inplay Matrix.'
			},
			{
				id: 'data-infra',
				name: 'High-Volume Data Pipelines',
				level: 'Core',
				tools: ['SQL', 'PostgreSQL', 'InfluxDB (Time-series)'],
				context: 'Complex query optimization for real-time betting & tournament analytics with sub-second latency.'
			}
		]
	},
	{
		id: 'fullstack-systems',
		title: 'Full-Stack & Distributed Systems',
		color: '#3B82F6', // Royal Electric Blue
		glowColor: 'rgba(59, 130, 246, 0.45)',
		description: 'High-throughput frontend craft, robust microservices, and financial systems.',
		skills: [
			{
				id: 'frontend',
				name: 'Modern Frontend Craft',
				level: 'Core',
				tools: ['Svelte 5', 'React', 'Next.js', 'Angular', 'Tailwind CSS'],
				context: 'Performant, accessible, experience-first UI architectures with state-driven reactive design.'
			},
			{
				id: 'backend',
				name: 'Enterprise Microservices',
				level: 'Core',
				tools: ['Spring Boot', 'FastAPI', 'Node.js (Express)', 'REST APIs'],
				context: 'Financial banking solutions (Bank of Ceylon) & resilient, secure API layers built for scale.'
			},
			{
				id: 'mobile',
				name: 'Cross-Platform Mobile',
				level: 'Advanced',
				tools: ['React Native', 'Flutter'],
				context: 'Internal banking mobility and client-facing enterprise mobile applications.'
			}
		]
	},
	{
		id: 'cloud-devops-iot',
		title: 'Cloud, Edge IoT & Telemetry',
		color: '#10B981', // Emerald Glow
		glowColor: 'rgba(16, 185, 129, 0.45)',
		description: 'Edge firmware sensors, low-latency parallel computing, and resilient cloud CI/CD.',
		skills: [
			{
				id: 'iot-edge',
				name: 'Edge IoT & Sensor Fusion',
				level: 'Specialized',
				tools: ['C++ Firmware', 'Parallel Computing', 'Hardware Telemetry'],
				context: 'Automated shelf-life and real-time gas/humidity monitor with embedded MQ-3/MQ-4 sensor calibration.'
			},
			{
				id: 'cloud-ci',
				name: 'Containerization & CI/CD',
				level: 'Advanced',
				tools: ['Docker', 'Docker Compose', 'AWS (EC2, S3)', 'GitHub Actions'],
				context: 'Automated test suites (Jest/JUnit) and zero-downtime deployment pipelines.'
			},
			{
				id: 'observability',
				name: 'System Observability & Workflows',
				level: 'Core',
				tools: ['Apache Airflow', 'Grafana', 'Postman'],
				context: 'Data orchestration, pipeline health monitoring, and system SLA compliance.'
			}
		]
	}
];
