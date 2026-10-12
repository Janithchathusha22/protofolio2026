<script lang="ts">
	// AI Customer Assistant: n8n workflow nodes, Supabase vector query, LLM memory buffer
	const nodes = [
		{ name: 'Webhook', type: 'Trigger', col: '#24D7FF', x: 40, y: 110 },
		{ name: 'Auth & Sanitize', type: 'Security', col: '#8A95A5', x: 170, y: 110 },
		{ name: 'Supabase Query', type: 'PostgreSQL DB', col: '#1687FF', x: 300, y: 70 },
		{ name: 'Memory Buffer', type: 'Session Cache', col: '#1687FF', x: 300, y: 150 },
		{ name: 'LLM Orchestrator', type: 'Reasoning Engine', col: '#EAB66A', x: 430, y: 110 }
	];

	const logs = [
		{ t: '12:04:18', msg: 'Incoming user query: "Order #8421 tracking & refund policy"', col: '#fff' },
		{ t: '12:04:18', msg: 'Supabase: SQL query returned 1 matching order row (12ms)', col: '#24D7FF' },
		{ t: '12:04:19', msg: 'Memory: Retrieved 4 prior conversational turns from session', col: '#8A95A5' },
		{ t: '12:04:19', msg: 'LLM Response generated with grounded policy citations (240ms)', col: '#EAB66A' }
	];
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="AI Customer Assistant n8n workflow and database integration pipeline">
	<rect width="800" height="500" fill="#06080a" />
	<!-- Top status bar -->
	<rect width="800" height="38" fill="#0b0e12" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.08" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<circle cx="22" cy="19" r="3.5" fill="#1687FF"><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" /></circle>
		<text x="34" y="22.5" fill="#8A95A5" letter-spacing="1.5">N8N ORCHESTRATION PIPELINE · SUPABASE POSTGRESQL · ACTIVE</text>
		<text x="776" y="22.5" text-anchor="end" fill="#24D7FF">AVG LATENCY: 280ms</text>
	</g>

	<!-- Workflow Node Canvas -->
	<g transform="translate(20 50)">
		<text font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">
			AUTOMATION WORKFLOW DAG (N8N)
		</text>

		<!-- Nodes & Connectors -->
		<g transform="translate(0 20)">
			<rect width="520" height="200" rx="10" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />

			<!-- Connector lines -->
			<path d="M 120 125 L 170 125" stroke="#24D7FF" stroke-width="1.5" stroke-dasharray="4 4" />
			<path d="M 250 125 C 275 125, 275 85, 300 85" fill="none" stroke="#1687FF" stroke-width="1.5" />
			<path d="M 250 125 C 275 125, 275 165, 300 165" fill="none" stroke="#1687FF" stroke-width="1.5" />
			<path d="M 380 85 C 405 85, 405 125, 430 125" fill="none" stroke="#EAB66A" stroke-width="1.5" />
			<path d="M 380 165 C 405 165, 405 125, 430 125" fill="none" stroke="#EAB66A" stroke-width="1.5" />

			{#each nodes as n (n.name)}
				<g transform="translate({n.x} {n.y})" font-family="JetBrains Mono, monospace">
					<rect width="80" height="34" rx="6" fill="#0d131a" stroke={n.col} stroke-opacity="0.7" />
					<circle cx="8" cy="17" r="2.5" fill={n.col} />
					<text x="16" y="15" font-size="8" fill="#fff" font-weight="500">{n.name}</text>
					<text x="16" y="26" font-size="6.5" fill="#8A95A5">{n.type}</text>
				</g>
			{/each}
		</g>
	</g>

	<!-- Live Execution Log Stream -->
	<g transform="translate(20 290)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">EXECUTION TELEMETRY &amp; MEMORY LOG</text>
		<g transform="translate(0 16)">
			<rect width="520" height="150" rx="10" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />

			{#each logs as l, i (l.t + i)}
				<g transform="translate(16 {28 + i * 30})">
					<text font-size="8.5" fill="#4B5563">{l.t}</text>
					<text x="70" font-size="8.5" fill={l.col}>{l.msg}</text>
				</g>
			{/each}
		</g>
	</g>

	<!-- Right: Performance & Accuracy Metrics -->
	<line x1="560" y1="38" x2="560" y2="500" stroke="#fff" stroke-opacity="0.08" />
	<g transform="translate(584 60)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">PIPELINE METRICS</text>

		<g transform="translate(0 28)">
			<text font-size="9" fill="#8A95A5">Grounding Precision</text>
			<text y="24" font-family="Inter, sans-serif" font-size="24" font-weight="500" fill="#24D7FF">99.2%</text>
			<text y="38" font-size="7.5" fill="#4B5563">Zero hallucination on DB schema</text>
		</g>

		<g transform="translate(0 92)">
			<text font-size="9" fill="#8A95A5">Median Query Latency</text>
			<text y="24" font-family="Inter, sans-serif" font-size="24" font-weight="500" fill="#EAB66A">280ms</text>
			<text y="38" font-size="7.5" fill="#4B5563">Sub-second customer response time</text>
		</g>

		<text y="160" font-size="9" letter-spacing="2" fill="#4B5563">STACK ARCHITECTURE</text>
		<g transform="translate(0 174)" font-size="8.5" fill="#8A95A5">
			<rect width="190" height="180" rx="8" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />
			<text x="12" y="24" fill="#fff">● n8n Node Workflow</text>
			<text x="12" y="46">● Supabase (PostgreSQL)</text>
			<text x="12" y="68">● Conversational Memory</text>
			<text x="12" y="90">● Dynamic Prompt Retrieval</text>
			<text x="12" y="112">● Webhook Event Emitters</text>
			<text x="12" y="134">● Error Fallback Queue</text>
			<text x="12" y="156" fill="#1687FF">● REST API Endpoints</text>
		</g>
	</g>
</svg>
