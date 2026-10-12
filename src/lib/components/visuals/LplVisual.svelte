<script lang="ts">
	// Match telemetry wireframe: win-probability curve + projection + per-over runs.
	const W = 500;
	const H = 200;
	const overs = 20;
	const current = 16;

	// deterministic pseudo-data
	const prob = [50, 52, 49, 55, 58, 54, 47, 44, 49, 53, 57, 61, 59, 64, 68, 66, 71];
	const projection = [71, 73, 76, 79, 81];
	const runs = [6, 9, 4, 12, 8, 7, 3, 5, 10, 8, 11, 9, 6, 13, 10, 7, 14];

	const px = (i: number) => (i / overs) * W;
	const py = (p: number) => H - (p / 100) * H;

	const line = prob.map((p, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(p).toFixed(1)}`).join(' ');
	const area = `${line} L${px(current)} ${H} L0 ${H} Z`;
	const proj = [prob[current], ...projection]
		.map((p, i) => `${i ? 'L' : 'M'}${px(current + i).toFixed(1)} ${py(p).toFixed(1)}`)
		.join(' ');
	const bandUp = [prob[current], ...projection].map((p, i) => `${px(current + i)} ${py(Math.min(100, p + i * 3))}`);
	const bandDn = [prob[current], ...projection].map((p, i) => `${px(current + i)} ${py(p - i * 4)}`).reverse();
	const band = `M${bandUp.join(' L')} L${bandDn.join(' L')} Z`;

	const drivers = [
		{ k: 'Run-rate delta', v: 0.82 },
		{ k: 'Wickets in hand', v: 0.64 },
		{ k: 'Venue par score', v: 0.48 },
		{ k: 'Bowler economy', v: 0.36 }
	];
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="LPL 2026 analytics telemetry with win-probability projection">
	<defs>
		<linearGradient id="lpl-area" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#1687FF" stop-opacity="0.32" />
			<stop offset="100%" stop-color="#1687FF" stop-opacity="0" />
		</linearGradient>
	</defs>
	<rect width="800" height="500" fill="#070707" />
	<rect width="800" height="38" fill="#0b0b0b" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.07" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<circle cx="24" cy="19" r="3.5" fill="#24D7FF"><animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" /></circle>
		<text x="36" y="22.5" fill="#8A95A5" letter-spacing="1.5">LPL 2026 · MATCH 14 · LIVE</text>
		<text x="776" y="22.5" text-anchor="end" fill="#4B5563">model v3.2 · 240ms</text>
	</g>

	<!-- scoreboard -->
	<g transform="translate(32 64)">
		<text font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">BATTING</text>
		<text y="38" font-family="Inter, sans-serif" font-size="30" font-weight="500" fill="#fff">142/4</text>
		<text x="102" y="38" font-family="JetBrains Mono, monospace" font-size="11" fill="#8A95A5">(16.0 ov)</text>
		<text x="250" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">WIN PROBABILITY</text>
		<text x="250" y="38" font-family="Inter, sans-serif" font-size="30" font-weight="500" fill="#1687FF">71%</text>
		<text x="320" y="38" font-family="JetBrains Mono, monospace" font-size="11" fill="#24D7FF">▲ 5.2</text>
	</g>

	<!-- chart -->
	<g transform="translate(32 140)">
		{#each [0, 25, 50, 75, 100] as g (g)}
			<line x1="0" x2={W} y1={py(g)} y2={py(g)} stroke="#fff" stroke-opacity={g === 50 ? 0.14 : 0.05} stroke-dasharray={g === 50 ? '3 4' : ''} />
			<text x={W + 8} y={py(g) + 3} font-family="JetBrains Mono, monospace" font-size="8.5" fill="#4B5563">{g}</text>
		{/each}
		<path d={band} fill="#24D7FF" fill-opacity="0.07" />
		<path d={area} fill="url(#lpl-area)" />
		<path d={line} fill="none" stroke="#1687FF" stroke-width="1.6" stroke-linejoin="round" />
		<path d={proj} fill="none" stroke="#24D7FF" stroke-width="1.4" stroke-dasharray="4 4" />
		<line x1={px(current)} x2={px(current)} y1="0" y2={H} stroke="#fff" stroke-opacity="0.18" />
		<circle cx={px(current)} cy={py(prob[current])} r="4" fill="#000" stroke="#1687FF" stroke-width="1.6" />
		<circle cx={px(current)} cy={py(prob[current])} r="10" fill="#1687FF" fill-opacity="0.15">
			<animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
		</circle>

		<!-- runs per over -->
		<g transform="translate(0 {H + 26})">
			{#each runs as r, i (i)}
				<rect x={px(i) + 3} y={50 - r * 3.4} width={W / overs - 6} height={r * 3.4} rx="1.5" fill={r >= 10 ? '#EAB66A' : '#fff'} fill-opacity={r >= 10 ? 0.85 : 0.14} />
			{/each}
			{#each projection as _, i (i)}
				<rect x={px(current + 1 + i) + 3} y="40" width={W / overs - 6} height="10" rx="1.5" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-dasharray="2 2" />
			{/each}
			<text y="68" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#4B5563">OVER 1</text>
			<text x={W} y="68" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#4B5563">20</text>
		</g>
	</g>

	<!-- drivers -->
	<line x1="584" y1="38" x2="584" y2="500" stroke="#fff" stroke-opacity="0.06" />
	<g transform="translate(608 64)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">KEY DRIVERS</text>
		{#each drivers as d, i (d.k)}
			<g transform="translate(0 {32 + i * 44})">
				<text font-size="9.5" fill="#8A95A5">{d.k}</text>
				<text x="168" text-anchor="end" font-size="9.5" fill="#fff">{d.v.toFixed(2)}</text>
				<rect y="10" width="168" height="3" rx="1.5" fill="#fff" fill-opacity="0.05" />
				<rect y="10" width={168 * d.v} height="3" rx="1.5" fill="#1687FF" />
			</g>
		{/each}

		<text y="236" font-size="9" letter-spacing="2" fill="#4B5563">SIMULATION</text>
		<g transform="translate(0 252)">
			<rect width="168" height="96" rx="8" fill="#0b0b0b" stroke="#fff" stroke-opacity="0.06" />
			{#each Array(36) as _, i (i)}
				<circle cx={18 + (i % 9) * 16.5} cy={20 + Math.floor(i / 9) * 19} r="3" fill={i % 7 < 5 ? '#1687FF' : '#fff'} fill-opacity={i % 7 < 5 ? 0.8 : 0.15} />
			{/each}
		</g>
		<text y="370" font-size="9" fill="#8A95A5">10k Monte Carlo runs</text>
	</g>
</svg>
