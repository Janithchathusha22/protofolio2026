<script lang="ts">
	// News Aggregation & Editorial Platform: Ingestion -> Groq AI Draft -> Editor Review -> Verified Publish
	const stages = [
		{ name: '1. SOURCE INGESTION', desc: 'RSS & Web Scrapers', status: 'RAW STORE', color: '#1687FF' },
		{ name: '2. AI DRAFT GEN', desc: 'Groq Guarded Rewrite', status: 'DRAFT QUEUE', color: '#EAB66A' },
		{ name: '3. EDITORIAL REVIEW', desc: 'Human Verification', status: 'VERIFIED', color: '#24D7FF' },
		{ name: '4. PUBLIC DISPATCH', desc: 'Immutable Release', status: 'LIVE SSR', color: '#10B981' }
	];

	const queueItems = [
		{ id: 'ART-904', title: 'Monetary Policy Easing & Market Liquidity', status: 'Approved for Publish', reviewer: 'Editor Sign-off', col: '#10B981' },
		{ id: 'ART-905', title: 'Export Sector Telemetry & Harbor Shipments', status: 'Under Human Review', reviewer: 'Editorial Desk', col: '#24D7FF' },
		{ id: 'ART-906', title: 'Renewable Energy Grid Integration Proposal', status: 'AI Draft Generated', reviewer: 'Pending Check', col: '#EAB66A' }
	];
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="News Aggregation and Editorial Platform workflow and review pipeline">
	<rect width="800" height="500" fill="#06080b" />
	<!-- Top Bar -->
	<rect width="800" height="38" fill="#0b0e14" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.08" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<circle cx="22" cy="19" r="3.5" fill="#1687FF">
			<animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
		</circle>
		<text x="34" y="22.5" fill="#8A95A5" letter-spacing="1.5">EDITORIAL WORKFLOW · HUMAN-IN-THE-LOOP · SUPABASE STORE</text>
		<text x="776" y="22.5" text-anchor="end" fill="#24D7FF">DESK STATUS: ACTIVE</text>
	</g>

	<!-- Architectural Pipeline Stages -->
	<g transform="translate(30 58)">
		<text font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">REVIEW-FIRST PIPELINE ARCHITECTURE</text>
		<g transform="translate(0 14)">
			{#each stages as st, i (st.name)}
				<g transform="translate({i * 188} 0)">
					<rect width="176" height="58" rx="8" fill="#090d14" stroke={st.color} stroke-opacity="0.35" stroke-width="1" />
					<rect x="12" y="10" width="6" height="6" rx="3" fill={st.color} />
					<text x="24" y="16" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="600" fill="#fff" letter-spacing="0.5">{st.name}</text>
					<text x="12" y="34" font-family="Inter, sans-serif" font-size="11" fill="#8A95A5">{st.desc}</text>
					<text x="12" y="49" font-family="JetBrains Mono, monospace" font-size="8" fill={st.color}>{st.status}</text>
				</g>
				{#if i < stages.length - 1}
					<line x1="{i * 188 + 176}" y1="43" x2="{i * 188 + 188}" y2="43" stroke="#fff" stroke-opacity="0.25" stroke-dasharray="2 2" />
				{/if}
			{/each}
		</g>
	</g>

	<!-- Editorial Review Workspace Terminal Wireframe -->
	<g transform="translate(30 160)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">EDITORIAL REVIEW &amp; APPROVAL DESK</text>
		<g transform="translate(0 14)">
			<!-- Main Console Box -->
			<rect width="740" height="295" rx="10" fill="#070a0f" stroke="#fff" stroke-opacity="0.08" />
			
			<!-- Table Header -->
			<rect width="740" height="32" rx="10 10 0 0" fill="#0d1118" />
			<text x="24" y="20" font-size="8.5" fill="#6B7280" letter-spacing="1">ID</text>
			<text x="110" y="20" font-size="8.5" fill="#6B7280" letter-spacing="1">ARTICLE SPECIFICATION</text>
			<text x="490" y="20" font-size="8.5" fill="#6B7280" letter-spacing="1">EDITORIAL ACTION</text>
			<text x="640" y="20" font-size="8.5" fill="#6B7280" letter-spacing="1">STATUS</text>
			<line x1="0" y1="32" x2="740" y2="32" stroke="#fff" stroke-opacity="0.08" />

			<!-- Rows -->
			{#each queueItems as item, idx (item.id)}
				<g transform="translate(0 {32 + idx * 56})">
					<rect width="740" height="56" fill={idx % 2 === 1 ? '#0a0d14' : 'transparent'} />
					<text x="24" y="32" font-size="10.5" fill="#fff" font-weight="600">{item.id}</text>
					
					<text x="110" y="27" font-size="11" fill="#fff" font-family="Inter, sans-serif">{item.title}</text>
					<text x="110" y="44" font-size="8.5" fill="#6B7280">Source: Verified Financial Feeds · Word count: 680 · Strict Verification</text>

					<!-- Action Badge -->
					<g transform="translate(490 16)">
						<rect width="130" height="24" rx="12" fill="#fff" fill-opacity="0.03" stroke="#fff" stroke-opacity="0.12" />
						<text x="65" y="16" text-anchor="middle" font-size="9" fill="#8A95A5">{item.reviewer}</text>
					</g>

					<!-- Status Pill -->
					<g transform="translate(640 16)">
						<rect width="84" height="24" rx="12" fill={item.col} fill-opacity="0.1" stroke={item.col} stroke-opacity="0.3" />
						<circle cx="12" cy="12" r="2.5" fill={item.col} />
						<text x="48" y="16" text-anchor="middle" font-size="8.5" fill={item.col}>{idx === 0 ? 'PUBLISHED' : idx === 1 ? 'REVIEW' : 'DRAFT'}</text>
					</g>
					<line x1="0" y1="56" x2="740" y2="56" stroke="#fff" stroke-opacity="0.04" />
				</g>
			{/each}

			<!-- Guardrail notice at bottom of panel -->
			<g transform="translate(24 235)">
				<rect width="692" height="42" rx="6" fill="#1687FF" fill-opacity="0.06" stroke="#1687FF" stroke-opacity="0.2" />
				<text x="16" y="25" font-size="9.5" fill="#24D7FF">
					GUARANTEED HUMAN SIGN-OFF: AI generates drafts from immutable raw records; publication strictly requires editor authorization.
				</text>
			</g>
		</g>
	</g>
</svg>
