<script lang="ts">
	// Explainability interface wireframe: article tokens shaded by LIME attribution.
	const text =
		'BREAKING: Scientists confirm miracle cure hidden by officials, sources say the shocking truth was suppressed for years while independent experts remain silent as viral claims keep spreading online today.';
	const heat: Record<string, number> = {
		'BREAKING:': 0.95,
		miracle: 0.9,
		hidden: 0.65,
		shocking: 0.85,
		truth: 0.4,
		suppressed: 0.75,
		viral: 0.6,
		confirm: -0.35,
		sources: -0.25,
		independent: -0.45,
		experts: -0.5
	};

	const CW = 7.2; // monospace char width @ 12px
	const MAXW = 440;
	const LH = 30;
	type Tok = { w: string; x: number; y: number; h: number };
	const tokens: Tok[] = [];
	let x = 0;
	let line = 0;
	for (const w of text.split(' ')) {
		const width = w.length * CW;
		if (x + width > MAXW) {
			x = 0;
			line++;
		}
		const key = w.replace(/[.,]/g, '');
		tokens.push({ w, x, y: line * LH, h: heat[w] ?? heat[key] ?? 0 });
		x += width + CW;
	}

	const bars = [
		{ t: 'BREAKING', v: 0.95 },
		{ t: 'miracle', v: 0.9 },
		{ t: 'shocking', v: 0.85 },
		{ t: 'suppressed', v: 0.75 },
		{ t: 'experts', v: -0.5 },
		{ t: 'independent', v: -0.45 }
	];

	// gauge arc 87%
	const pct = 0.87;
	const R = 54;
	const circ = Math.PI * R;
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="NewsShield explainability interface with token attribution heatmap">
	<rect width="800" height="500" fill="#070707" />
	<!-- chrome -->
	<rect width="800" height="38" fill="#0b0b0b" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.07" />
	<g fill="#fff" fill-opacity="0.14"><circle cx="22" cy="19" r="4.5" /><circle cx="38" cy="19" r="4.5" /><circle cx="54" cy="19" r="4.5" /></g>
	<rect x="290" y="10" width="220" height="18" rx="9" fill="#fff" fill-opacity="0.04" />
	<text x="400" y="23" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#4B5563">newsshield.app/analyze</text>

	<!-- left: article -->
	<g transform="translate(32 66)">
		<text font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">ARTICLE · TOKEN ATTRIBUTION</text>
		<g transform="translate(470 0)" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#8A95A5" text-anchor="end">
			<rect x="-118" y="-8" width="8" height="8" rx="1.5" fill="#EAB66A" /><text x="-64" y="0">FAKE</text>
			<rect x="-52" y="-8" width="8" height="8" rx="1.5" fill="#1687FF" /><text x="0" y="0">REAL</text>
		</g>
		<line x1="0" y1="16" x2="470" y2="16" stroke="#fff" stroke-opacity="0.06" />

		<g transform="translate(0 50)" font-family="JetBrains Mono, monospace" font-size="12">
			{#each tokens as t, i (i)}
				{#if t.h !== 0}
					<rect
						x={t.x - 3}
						y={t.y - 15}
						width={t.w.length * CW + 6}
						height="21"
						rx="3"
						fill={t.h > 0 ? '#EAB66A' : '#1687FF'}
						fill-opacity={Math.abs(t.h) * 0.42}
					/>
				{/if}
				<text x={t.x} y={t.y} fill={t.h === 0 ? '#8A95A5' : '#ffffff'}>{t.w}</text>
			{/each}
		</g>

		<!-- pipeline strip -->
		<g transform="translate(0 290)" font-family="JetBrains Mono, monospace" font-size="9">
			<line x1="0" y1="-24" x2="470" y2="-24" stroke="#fff" stroke-opacity="0.06" />
			{#each ['Tokenize', 'Embed', 'BiLSTM', 'Softmax', 'LIME'] as step, i (step)}
				<g transform="translate({i * 98} 0)">
					<rect width="82" height="30" rx="6" fill="#0d0d0d" stroke={i === 4 ? '#EAB66A' : '#fff'} stroke-opacity={i === 4 ? 0.6 : 0.09} />
					<text x="41" y="19" text-anchor="middle" fill={i === 4 ? '#EAB66A' : '#8A95A5'}>{step}</text>
					{#if i < 4}<line x1="84" y1="15" x2="96" y2="15" stroke="#fff" stroke-opacity="0.18" />{/if}
				</g>
			{/each}
		</g>
		<g transform="translate(0 362)">
			<rect width="470" height="40" rx="8" fill="#0b0b0b" stroke="#fff" stroke-opacity="0.06" />
			<text x="16" y="25" font-family="JetBrains Mono, monospace" font-size="9.5" fill="#8A95A5">
				<tspan fill="#EAB66A">▲</tspan>&nbsp;Sensational framing + unverified sourcing drive the prediction.
			</text>
		</g>
	</g>

	<!-- right: verdict -->
	<line x1="536" y1="38" x2="536" y2="500" stroke="#fff" stroke-opacity="0.06" />
	<g transform="translate(560 66)">
		<text font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">VERDICT</text>
		<g transform="translate(108 112)">
			<path d="M{-R} 0 A{R} {R} 0 0 1 {R} 0" fill="none" stroke="#fff" stroke-opacity="0.07" stroke-width="7" stroke-linecap="round" />
			<path
				d="M{-R} 0 A{R} {R} 0 0 1 {R} 0"
				fill="none"
				stroke="#EAB66A"
				stroke-width="7"
				stroke-linecap="round"
				stroke-dasharray="{circ * pct} {circ}"
			/>
			<text y="-8" text-anchor="middle" font-family="Inter, sans-serif" font-size="30" font-weight="500" fill="#fff">87%</text>
			<text y="14" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="1.6" fill="#EAB66A">LIKELY FALSE</text>
		</g>

		<text y="168" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">TOP ATTRIBUTIONS</text>
		{#each bars as b, i (b.t)}
			<g transform="translate(0 {192 + i * 32})" font-family="JetBrains Mono, monospace" font-size="9.5">
				<text y="9" fill="#8A95A5">{b.t}</text>
				<rect x="0" y="15" width="216" height="3" rx="1.5" fill="#fff" fill-opacity="0.05" />
				<rect x="0" y="15" width={216 * Math.abs(b.v)} height="3" rx="1.5" fill={b.v > 0 ? '#EAB66A' : '#1687FF'} />
				<text x="216" y="9" text-anchor="end" fill={b.v > 0 ? '#EAB66A' : '#1687FF'}>{b.v > 0 ? '+' : ''}{b.v.toFixed(2)}</text>
			</g>
		{/each}
	</g>
</svg>
