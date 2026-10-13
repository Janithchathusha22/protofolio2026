<script lang="ts">
	// Sri Lanka T20 Performance Analytics (2006–2025)
	// Six-tab Power BI Telemetry Visual: Star Schema (Matches, Batters, Venues, Wickets), KPIs, Phase Analysis
	const tabs = [
		{ name: 'Team Results', active: false },
		{ name: 'Phase Batting', active: true },
		{ name: 'Over Trends', active: false },
		{ name: 'Player Compare', active: false },
		{ name: 'Venue Analytics', active: false },
		{ name: 'Wickets Matrix', active: false }
	];

	const kpis = [
		{ label: 'WIN %', value: '47.1%', note: '2006–2025 SL T20I', col: '#24D7FF' },
		{ label: 'BATTING AVG', value: '24.8', note: 'Team Aggregate', col: '#ffffff' },
		{ label: 'STRIKE RATE', value: '127.4', note: 'All Phases', col: '#1687FF' },
		{ label: 'BOUNDARY %', value: '14.8%', note: '4s & 6s Ratio', col: '#EAB66A' },
		{ label: 'DOT-BALL %', value: '38.2%', note: 'Innings Control', col: '#EF4444' }
	];

	const phases = [
		{ name: 'Powerplay (Overs 1–6)', sr: '121.2', bnd: '16.4%', dot: '44.8%', w: 280, col: '#1687FF' },
		{ name: 'Middle (Overs 7–15)', sr: '119.5', bnd: '11.8%', dot: '38.6%', w: 250, col: '#24D7FF' },
		{ name: 'Death (Overs 16–20)', sr: '154.6', bnd: '21.5%', dot: '29.1%', w: 340, col: '#EAB66A' }
	];

	const starSchemaTables = ['Matches (Fact)', 'Batters (Dim)', 'Venues (Dim)', 'Wickets (Fact)'];
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="Sri Lanka T20 Performance Analytics Power BI interactive dashboard wireframe">
	<rect width="800" height="500" fill="#06090e" />
	
	<!-- Top Bar -->
	<rect width="800" height="38" fill="#0a0f18" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.08" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<circle cx="22" cy="19" r="3.5" fill="#24D7FF">
			<animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
		</circle>
		<text x="34" y="22.5" fill="#8A95A5" letter-spacing="1.5">POWER BI ENGINE · STAR SCHEMA · BALL-BY-BALL 2006–2025</text>
		<text x="776" y="22.5" text-anchor="end" fill="#EAB66A">DAX CALCULATED METRICS</text>
	</g>

	<!-- Power BI Tab Ribbon -->
	<g transform="translate(30 48)">
		<rect width="740" height="28" rx="6" fill="#090d16" stroke="#fff" stroke-opacity="0.06" />
		{#each tabs as t, i (t.name)}
			<g transform="translate({i * 123 + 4} 3)">
				<rect width="117" height="22" rx="4" fill={t.active ? '#1687FF' : 'transparent'} fill-opacity={t.active ? 0.25 : 0} stroke={t.active ? '#1687FF' : 'transparent'} stroke-opacity={0.6} />
				<text x="58.5" y="15" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" fill={t.active ? '#fff' : '#6B7280'}>
					{t.name}
				</text>
			</g>
		{/each}
	</g>

	<!-- KPI Cards Row -->
	<g transform="translate(30 88)">
		{#each kpis as k, i (k.label)}
			<g transform="translate({i * 150} 0)">
				<rect width="140" height="66" rx="8" fill="#0a0e17" stroke="#fff" stroke-opacity="0.08" />
				<text x="12" y="20" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#8A95A5" letter-spacing="1">{k.label}</text>
				<text x="12" y="44" font-family="JetBrains Mono, monospace" font-size="19" font-weight="600" fill={k.col}>{k.value}</text>
				<text x="12" y="58" font-family="Inter, sans-serif" font-size="8.5" fill="#4B5563">{k.note}</text>
			</g>
		{/each}
	</g>

	<!-- Phase-wise Batting Chart & Star Schema Telemetry Panel -->
	<g transform="translate(30 166)" font-family="JetBrains Mono, monospace">
		<!-- Left Main Chart: Phase Batting Strike Rate & Boundary Dynamics -->
		<g>
			<rect width="470" height="290" rx="10" fill="#070b12" stroke="#fff" stroke-opacity="0.08" />
			<text x="20" y="28" font-size="9" letter-spacing="2" fill="#4B5563">PHASE-WISE BATTING TELEMETRY (SR &amp; BOUNDARY %)</text>

			{#each phases as ph, idx (ph.name)}
				<g transform="translate(20 {54 + idx * 72})">
					<text x="0" y="0" font-size="10.5" fill="#fff" font-family="Inter, sans-serif" font-weight="500">{ph.name}</text>
					<text x="430" y="0" text-anchor="end" font-size="10" fill={ph.col}>SR: {ph.sr}</text>

					<!-- Progress track -->
					<rect x="0" y="10" width="430" height="14" rx="4" fill="#0c121e" />
					<rect x="0" y="10" width={ph.w} height="14" rx="4" fill={ph.col} fill-opacity="0.8" />

					<!-- Metrics row -->
					<text x="0" y="40" font-size="8.5" fill="#8A95A5">Boundary: <tspan fill="#fff">{ph.bnd}</tspan> · Dot-Ball: <tspan fill="#fff">{ph.dot}</tspan></text>
				</g>
			{/each}

			<line x1="20" y1="250" x2="450" y2="250" stroke="#fff" stroke-opacity="0.06" />
			<text x="20" y="272" font-size="8" fill="#6B7280">Calculated across 2006–2025 match records using DAX Star-Schema relationships</text>
		</g>

		<!-- Right Panel: Star Schema Entity Relational Architecture -->
		<g transform="translate(485 0)">
			<rect width="255" height="290" rx="10" fill="#070b12" stroke="#fff" stroke-opacity="0.08" />
			<text x="18" y="28" font-size="9" letter-spacing="2" fill="#4B5563">STAR SCHEMA ARCHITECTURE</text>

			{#each starSchemaTables as tbl, tIdx (tbl)}
				<g transform="translate(18 {48 + tIdx * 56})">
					<rect width="219" height="44" rx="6" fill="#0a0f1a" stroke={tIdx % 2 === 0 ? '#1687FF' : '#24D7FF'} stroke-opacity="0.3" />
					<rect x="10" y="12" width="6" height="6" rx="2" fill={tIdx % 2 === 0 ? '#1687FF' : '#24D7FF'} />
					<text x="24" y="19" font-size="9.5" fill="#fff" font-weight="600">{tbl}</text>
					<text x="24" y="33" font-size="8" fill="#6B7280">
						{tIdx === 0 ? 'Match ID, Venue ID, Result, Margin' : tIdx === 1 ? 'Batter ID, Runs, Balls, Phase SR' : tIdx === 2 ? 'Venue ID, City, Pitch Win Ratio' : 'Wicket ID, Dismissal Kind, Over'}
					</text>
				</g>
			{/each}

			<text x="18" y="276" font-size="8" fill="#EAB66A">● ETL: Python · Pandas · Power Query</text>
		</g>
	</g>
</svg>
