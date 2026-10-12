<script lang="ts">
	// MatchMind football prediction telemetry: team comparison, win/draw/loss distribution, xG projections
	const outcomes = [
		{ label: 'HOME WIN', pct: 48.2, col: '#24D7FF' },
		{ label: 'DRAW', pct: 27.6, col: '#8A95A5' },
		{ label: 'AWAY WIN', pct: 24.2, col: '#EAB66A' }
	];

	const scores = [
		{ s: '2 - 1', p: '14.8%' },
		{ s: '1 - 1', p: '13.2%' },
		{ s: '1 - 0', p: '11.5%' },
		{ s: '2 - 0', p: '9.4%' }
	];

	const tree = [
		{ match: 'R16: ESP vs SUI', score: '3 - 1', winner: 'ESP', x: 20, y: 310 },
		{ match: 'R16: GER vs DEN', score: '2 - 0', winner: 'GER', x: 20, y: 375 },
		{ match: 'QF: ESP vs GER', score: '2 - 1', winner: 'ESP', x: 190, y: 342 },
		{ match: 'SF: ESP vs FRA', score: 'P: 58%', winner: 'ESP proj.', x: 340, y: 342 }
	];
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="MatchMind football prediction and tournament bracket telemetry">
	<rect width="800" height="500" fill="#06080a" />
	<!-- Top status bar -->
	<rect width="800" height="38" fill="#0b0e12" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.08" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<circle cx="22" cy="19" r="3.5" fill="#24D7FF"><animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" /></circle>
		<text x="34" y="22.5" fill="#8A95A5" letter-spacing="1.5">MATCHMIND · ELO + POISSON MODEL · WORLD CUP SIMULATION</text>
		<text x="776" y="22.5" text-anchor="end" fill="#4B5563">10,000 ITERATIONS</text>
	</g>

	<!-- Head to head matchup box -->
	<g transform="translate(30 60)">
		<rect width="470" height="190" rx="10" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />

		<!-- Team A vs Team B -->
		<g transform="translate(24 35)">
			<text font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#fff">SPAIN</text>
			<text y="20" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#8A95A5">ELO: 2042 · FORM: W-W-D-W</text>
			<text y="44" font-family="JetBrains Mono, monospace" font-size="12" fill="#24D7FF">xG 2.14</text>
		</g>

		<g transform="translate(235 48)" text-anchor="middle">
			<circle cx="0" cy="-6" r="14" fill="#000" stroke="#fff" stroke-opacity="0.12" />
			<text font-family="JetBrains Mono, monospace" font-size="10" fill="#EAB66A">VS</text>
		</g>

		<g transform="translate(446 35)" text-anchor="end">
			<text font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#fff">GERMANY</text>
			<text y="20" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#8A95A5">ELO: 1988 · FORM: W-D-W-L</text>
			<text y="44" font-family="JetBrains Mono, monospace" font-size="12" fill="#EAB66A">xG 1.48</text>
		</g>

		<!-- Outcome distribution bar -->
		<g transform="translate(24 116)" font-family="JetBrains Mono, monospace">
			<text font-size="8.5" letter-spacing="1.5" fill="#4B5563">OUTCOME PROBABILITY DISTRIBUTION</text>
			<g transform="translate(0 14)">
				<!-- Spain win -->
				<rect width={422 * 0.482} height="18" rx="3" fill="#24D7FF" fill-opacity="0.85" />
				<!-- Draw -->
				<rect x={422 * 0.482 + 2} width={422 * 0.276 - 4} height="18" rx="3" fill="#8A95A5" fill-opacity="0.4" />
				<!-- Germany win -->
				<rect x={422 * 0.758} width={422 * 0.242} height="18" rx="3" fill="#EAB66A" fill-opacity="0.85" />

				<text x="8" y="13" font-size="9" fill="#000" font-weight="600">48.2%</text>
				<text x={422 * 0.482 + 10} y="13" font-size="9" fill="#fff">27.6% DRAW</text>
				<text x={422 - 8} y="13" text-anchor="end" font-size="9" fill="#000" font-weight="600">24.2%</text>
			</g>
		</g>

		<g transform="translate(24 172)" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#8A95A5">
			<text>● PREDICTED WINNER: <tspan fill="#24D7FF">SPAIN (+0.66 xG DELTA)</tspan></text>
		</g>
	</g>

	<!-- Tournament progression bracket wireframe -->
	<g transform="translate(30 270)">
		<text font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">KNOCKOUT BRACKET SIMULATION</text>
		<rect y="16" width="470" height="175" rx="10" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />

		<!-- Bracket nodes -->
		<g transform="translate(20 36)" font-family="JetBrains Mono, monospace">
			<!-- R16 Match 1 -->
			<rect width="120" height="36" rx="6" fill="#0c1016" stroke="#fff" stroke-opacity="0.08" />
			<text x="8" y="16" font-size="9" fill="#fff">ESP vs SUI</text>
			<text x="8" y="28" font-size="8" fill="#24D7FF">ESP (3 - 1)</text>

			<!-- R16 Match 2 -->
			<g transform="translate(0 68)">
				<rect width="120" height="36" rx="6" fill="#0c1016" stroke="#fff" stroke-opacity="0.08" />
				<text x="8" y="16" font-size="9" fill="#fff">GER vs DEN</text>
				<text x="8" y="28" font-size="8" fill="#EAB66A">GER (2 - 0)</text>
			</g>

			<!-- Connecting lines -->
			<path d="M 120 18 L 155 18 L 155 52 L 175 52" fill="none" stroke="#24D7FF" stroke-opacity="0.4" stroke-width="1.2" />
			<path d="M 120 86 L 155 86 L 155 52" fill="none" stroke="#EAB66A" stroke-opacity="0.4" stroke-width="1.2" />

			<!-- QF Match -->
			<g transform="translate(175 34)">
				<rect width="120" height="36" rx="6" fill="#0c1016" stroke="#24D7FF" stroke-opacity="0.5" />
				<text x="8" y="16" font-size="9" fill="#fff">ESP vs GER</text>
				<text x="8" y="28" font-size="8" fill="#24D7FF">ESP (2 - 1)</text>
			</g>

			<!-- Line to SF -->
			<path d="M 295 52 L 325 52" fill="none" stroke="#24D7FF" stroke-opacity="0.6" stroke-width="1.2" />

			<!-- SF Match -->
			<g transform="translate(325 34)">
				<rect width="90" height="36" rx="6" fill="#0c1016" stroke="#fff" stroke-opacity="0.1" />
				<text x="8" y="16" font-size="8.5" fill="#8A95A5">SEMIFINAL</text>
				<text x="8" y="28" font-size="8" fill="#24D7FF">ESP proj.</text>
			</g>
		</g>
	</g>

	<!-- Right: Likely Scorelines & Methodology -->
	<line x1="530" y1="38" x2="530" y2="500" stroke="#fff" stroke-opacity="0.08" />
	<g transform="translate(554 60)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">MOST LIKELY SCORELINES</text>

		{#each scores as sc, i (sc.s)}
			<g transform="translate(0 {28 + i * 42})">
				<text font-size="12" font-weight="500" fill="#fff">{sc.s}</text>
				<text x="216" text-anchor="end" font-size="11" fill="#24D7FF">{sc.p}</text>
				<rect y="10" width="216" height="3" rx="1.5" fill="#fff" fill-opacity="0.06" />
				<rect y="10" width={180 - i * 36} height="3" rx="1.5" fill="#24D7FF" />
			</g>
		{/each}

		<text y="210" font-size="9" letter-spacing="2" fill="#4B5563">MODEL METHODOLOGY</text>
		<g transform="translate(0 224)" font-size="8.5" fill="#8A95A5">
			<rect width="216" height="120" rx="8" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />
			<text x="12" y="22" fill="#fff">● Elo Rating Differential</text>
			<text x="12" y="44">● Poisson Goal Distribution</text>
			<text x="12" y="66">● Expected Goals (xG) Momentum</text>
			<text x="12" y="88">● Historical H2H Weighting</text>
			<text x="12" y="106" fill="#4B5563">50,000 Monte Carlo sims</text>
		</g>
	</g>
</svg>
