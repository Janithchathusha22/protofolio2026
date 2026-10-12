<script lang="ts">
	// Food Quality Checker: embedded sensor telemetry, MQ-3 alcohol, MQ-4 methane, DHT11 temperature/humidity, 16x2 LCD
	const sensors = [
		{ sensor: 'MQ-4 (Methane / CH4)', val: '142 ppm', status: 'Elevated fermentation', col: '#EAB66A' },
		{ sensor: 'MQ-3 (Alcohol / C2H5OH)', val: '86 ppm', status: 'Early spoilage threshold', col: '#EAB66A' },
		{ sensor: 'DHT11 Temperature', val: '28.4 °C', status: 'Ambient storage', col: '#24D7FF' },
		{ sensor: 'DHT11 Humidity', val: '78.2 %', status: 'High moisture zone', col: '#24D7FF' }
	];
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="Food Quality Checker embedded sensor telemetry and LCD interface">
	<rect width="800" height="500" fill="#06080a" />
	<!-- Top status bar -->
	<rect width="800" height="38" fill="#0b0e12" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.08" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<circle cx="22" cy="19" r="3.5" fill="#EAB66A"><animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" /></circle>
		<text x="34" y="22.5" fill="#8A95A5" letter-spacing="1.5">EMBEDDED HARDWARE PROTOTYPE · SAMPLING 1Hz · ACADEMIC RESEARCH</text>
		<text x="776" y="22.5" text-anchor="end" fill="#EAB66A">BAUD: 9600</text>
	</g>

	<!-- Physical 16x2 LCD Interface Recreation -->
	<g transform="translate(30 60)">
		<text font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2" fill="#4B5563">16x2 ALPHANUMERIC LCD INTERFACE</text>
		<!-- LCD Blue/Green Display Bezel -->
		<g transform="translate(0 16)">
			<rect width="470" height="150" rx="10" fill="#04090e" stroke="#24D7FF" stroke-opacity="0.3" stroke-width="1.5" />
			<rect x="20" y="20" width="430" height="110" rx="4" fill="#061826" stroke="#24D7FF" stroke-opacity="0.2" />

			<!-- Matrix text glow effect -->
			<g font-family="JetBrains Mono, monospace" fill="#24D7FF" letter-spacing="1.5">
				<!-- Row 1 -->
				<text x="36" y="60" font-size="14" font-weight="600" opacity="0.95" filter="drop-shadow(0 0 8px #24D7FF)">
					FRUIT: BANANA D4
				</text>
				<text x="360" y="60" font-size="12" opacity="0.8">T:28C H:78%</text>

				<!-- Row 2 -->
				<text x="36" y="100" font-size="14" font-weight="600" fill="#EAB66A" opacity="0.95" filter="drop-shadow(0 0 8px #EAB66A)">
					MQ4:142 MQ3:086ppm
				</text>
			</g>
		</g>
	</g>

	<!-- Gas sensor concentration graph -->
	<g transform="translate(30 250)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">TIME-SERIES SPOILAGE DECAY CURVE (72 HOURS)</text>
		<g transform="translate(0 18)">
			<rect width="470" height="190" rx="10" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />

			<!-- Axes & Grid -->
			<line x1="40" y1="20" x2="40" y2="150" stroke="#fff" stroke-opacity="0.1" />
			<line x1="40" y1="150" x2="440" y2="150" stroke="#fff" stroke-opacity="0.1" />

			<!-- Threshold line -->
			<line x1="40" y1="75" x2="440" y2="75" stroke="#EAB66A" stroke-opacity="0.4" stroke-dasharray="4 4" />
			<text x="440" y="70" text-anchor="end" font-size="8" fill="#EAB66A">SPOILAGE THRESHOLD (100 ppm)</text>

			<!-- Gas curve 1: MQ-4 (methane) -->
			<path
				d="M 40 140 Q 160 135 240 120 T 340 85 T 440 38"
				fill="none"
				stroke="#EAB66A"
				stroke-width="2"
			/>
			<!-- Gas curve 2: MQ-3 (alcohol) -->
			<path
				d="M 40 145 Q 160 142 240 132 T 340 105 T 440 65"
				fill="none"
				stroke="#24D7FF"
				stroke-width="1.8"
				stroke-dasharray="3 3"
			/>

			<!-- Legend -->
			<g transform="translate(50 30)" font-size="8">
				<rect width="10" height="3" fill="#EAB66A" /><text x="16" y="4" fill="#EAB66A">MQ-4 (Methane)</text>
				<rect x="110" width="10" height="3" fill="#24D7FF" /><text x="126" y="4" fill="#24D7FF">MQ-3 (Alcohol)</text>
			</g>

			<text x="40" y="170" font-size="8" fill="#4B5563">0h (FRESH)</text>
			<text x="240" y="170" font-size="8" fill="#4B5563" text-anchor="middle">36h (RIPE)</text>
			<text x="440" y="170" font-size="8" fill="#4B5563" text-anchor="end">72h (OVERRIPE)</text>
		</g>
	</g>

	<!-- Right: Telemetry Indicators -->
	<line x1="530" y1="38" x2="530" y2="500" stroke="#fff" stroke-opacity="0.08" />
	<g transform="translate(554 60)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">SENSOR CHANNELS</text>

		{#each sensors as s, i (s.sensor)}
			<g transform="translate(0 {28 + i * 58})">
				<text font-size="9" fill="#8A95A5">{s.sensor}</text>
				<text x="216" text-anchor="end" font-size="12" font-weight="500" fill="#fff">{s.val}</text>
				<rect y="12" width="216" height="3" rx="1.5" fill="#fff" fill-opacity="0.06" />
				<rect y="12" width={i === 0 ? '160' : i === 1 ? '110' : i === 2 ? '140' : '170'} height="3" rx="1.5" fill={s.col} />
				<text y="26" font-size="8" fill={s.col}>{s.status}</text>
			</g>
		{/each}

		<text y="290" font-size="9" letter-spacing="2" fill="#4B5563">HARDWARE ARCHITECTURE</text>
		<g transform="translate(0 304)" font-size="8.5" fill="#8A95A5">
			<rect width="216" height="85" rx="8" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />
			<text x="12" y="24" fill="#fff">● Microcontroller MCU (ADC)</text>
			<text x="12" y="44">● MQ-3/4 Heated Analog Sensors</text>
			<text x="12" y="64">● 16x2 HD44780 Liquid Crystal</text>
		</g>
	</g>
</svg>
