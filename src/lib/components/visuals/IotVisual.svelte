<script lang="ts">
	// Hardware → cloud telemetry wireframe with freshness decay forecast.
	const sensors = [
		{ k: 'TEMP', v: '4.2°C', c: '#24D7FF' },
		{ k: 'HUMIDITY', v: '86%', c: '#24D7FF' },
		{ k: 'ETHYLENE', v: '0.8ppm', c: '#EAB66A' }
	];
	const pipeline = ['Edge Gateway', 'Ingest API', 'InfluxDB', 'Forecast Svc'];

	// decay curve (freshness index over 7 days)
	const CW = 500;
	const CH = 130;
	const days = 7;
	const now = 2.4;
	const f = (d: number) => 100 * Math.exp(-0.16 * d) - d * 1.2;
	const px = (d: number) => (d / days) * CW;
	const py = (v: number) => CH - (v / 100) * CH;
	const steps = (a: number, b: number) => Array.from({ length: 30 }, (_, i) => a + ((b - a) * i) / 29);

	const observed = steps(0, now)
		.map((d, i) => `${i ? 'L' : 'M'}${px(d).toFixed(1)} ${py(f(d) + Math.sin(d * 9) * 1.6).toFixed(1)}`)
		.join(' ');
	const forecast = steps(now, days).map((d, i) => `${i ? 'L' : 'M'}${px(d).toFixed(1)} ${py(f(d)).toFixed(1)}`).join(' ');
	const up = steps(now, days).map((d) => `${px(d).toFixed(1)} ${py(f(d) + (d - now) * 3).toFixed(1)}`);
	const dn = steps(now, days)
		.map((d) => `${px(d).toFixed(1)} ${py(f(d) - (d - now) * 3.4).toFixed(1)}`)
		.reverse();
	const band = `M${up.join(' L')} L${dn.join(' L')} Z`;
	const threshold = 40;
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="IoT freshness telemetry pipeline and shelf-life forecast">
	<rect width="800" height="500" fill="#070707" />
	<rect width="800" height="38" fill="#0b0b0b" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.07" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<text x="24" y="22.5" fill="#8A95A5" letter-spacing="1.5">COLD-CHAIN · BAY 03 · 3 SENSORS ONLINE</text>
		<text x="776" y="22.5" text-anchor="end" fill="#24D7FF">● streaming 1Hz</text>
	</g>

	<!-- sensors -->
	<g transform="translate(32 70)" font-family="JetBrains Mono, monospace">
		{#each sensors as s, i (s.k)}
			<g transform="translate(0 {i * 54})">
				<rect width="128" height="42" rx="8" fill="#0b0b0b" stroke="#fff" stroke-opacity="0.08" />
				<circle cx="16" cy="21" r="3" fill={s.c} />
				<text x="28" y="17" font-size="8" letter-spacing="1.4" fill="#4B5563">{s.k}</text>
				<text x="28" y="31" font-size="11" fill="#fff">{s.v}</text>
				<path d="M128 21 C 160 21, 160 {75 - i * 54}, 184 {75 - i * 54}" fill="none" stroke={s.c} stroke-opacity="0.4" stroke-width="1" />
			</g>
		{/each}
	</g>

	<!-- pipeline -->
	<g transform="translate(216 127)" font-family="JetBrains Mono, monospace" font-size="9.5">
		{#each pipeline as p, i (p)}
			<g transform="translate({i * 140} 0)">
				<rect width="116" height="36" rx="8" fill="#0d0d0d" stroke={i === 2 ? '#24D7FF' : '#fff'} stroke-opacity={i === 2 ? 0.55 : 0.09} />
				<text x="58" y="22" text-anchor="middle" fill={i === 2 ? '#24D7FF' : '#8A95A5'}>{p}</text>
				{#if i < pipeline.length - 1}
					<line x1="116" y1="18" x2="140" y2="18" stroke="#fff" stroke-opacity="0.12" />
					<line x1="116" y1="18" x2="140" y2="18" stroke="#24D7FF" stroke-width="1.4" stroke-dasharray="4 20" class="flow" />
				{/if}
			</g>
		{/each}
		<text x="0" y="62" font-size="8.5" fill="#4B5563">MQTT → REST → time-series → model</text>
	</g>

	<!-- forecast chart -->
	<line x1="0" y1="250" x2="800" y2="250" stroke="#fff" stroke-opacity="0.06" />
	<g transform="translate(32 280)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">FRESHNESS INDEX · 7-DAY FORECAST</text>
		<g transform="translate(0 28)">
			<line x1="0" x2={CW} y1={py(threshold)} y2={py(threshold)} stroke="#EAB66A" stroke-opacity="0.5" stroke-dasharray="3 4" />
			<text x={CW} y={py(threshold) - 6} text-anchor="end" font-size="8.5" fill="#EAB66A">SAFE LIMIT</text>
			<path d={band} fill="#24D7FF" fill-opacity="0.08" />
			<path d={observed} fill="none" stroke="#24D7FF" stroke-width="1.6" />
			<path d={forecast} fill="none" stroke="#24D7FF" stroke-width="1.3" stroke-dasharray="4 4" stroke-opacity="0.8" />
			<line x1={px(now)} x2={px(now)} y1="0" y2={CH} stroke="#fff" stroke-opacity="0.16" />
			<circle cx={px(now)} cy={py(f(now))} r="4" fill="#000" stroke="#24D7FF" stroke-width="1.5" />
			<line x1="0" x2={CW} y1={CH} y2={CH} stroke="#fff" stroke-opacity="0.08" />
			{#each Array(days + 1) as _, d (d)}
				<text x={px(d)} y={CH + 16} font-size="8" fill="#4B5563" text-anchor="middle">D{d}</text>
			{/each}
		</g>
	</g>

	<!-- summary -->
	<line x1="584" y1="250" x2="584" y2="500" stroke="#fff" stroke-opacity="0.06" />
	<g transform="translate(608 280)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">EST. SHELF LIFE</text>
		<text y="44" font-family="Inter, sans-serif" font-size="34" font-weight="500" fill="#fff">3.4<tspan font-size="14" fill="#8A95A5"> days</tspan></text>
		<text y="84" font-size="9" letter-spacing="2" fill="#4B5563">CONFIDENCE</text>
		<rect y="96" width="160" height="3" rx="1.5" fill="#fff" fill-opacity="0.05" />
		<rect y="96" width="132" height="3" rx="1.5" fill="#24D7FF" />
		<text y="124" font-size="9.5" fill="#8A95A5">±0.6d · 82% CI</text>
		<g transform="translate(0 150)">
			<rect width="160" height="34" rx="8" fill="#EAB66A" fill-opacity="0.06" stroke="#EAB66A" stroke-opacity="0.35" />
			<text x="14" y="21" font-size="9" fill="#EAB66A">⚑ Reprioritize dispatch</text>
		</g>
	</g>
</svg>

<style>
	.flow {
		animation: flow 1.2s linear infinite;
	}
	@keyframes flow {
		to {
			stroke-dashoffset: -24;
		}
	}
</style>
