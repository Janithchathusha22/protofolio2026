<script lang="ts">
	// Pose estimation and biomechanics telemetry: 33 body landmarks, bowling kinematics
	const landmarks = [
		{ x: 340, y: 110, r: 5, label: 'Nose' }, // head
		{ x: 330, y: 150, r: 4, label: 'L_Shoulder' }, // shoulders
		{ x: 360, y: 155, r: 4, label: 'R_Shoulder' },
		{ x: 310, y: 195, r: 4, label: 'L_Elbow' }, // arms
		{ x: 395, y: 185, r: 4, label: 'R_Elbow' },
		{ x: 295, y: 235, r: 4, label: 'L_Wrist' },
		{ x: 425, y: 130, r: 5, label: 'Release_Hand' }, // bowling arm extended up
		{ x: 335, y: 260, r: 4, label: 'L_Hip' }, // pelvis
		{ x: 365, y: 265, r: 4, label: 'R_Hip' },
		{ x: 325, y: 340, r: 4, label: 'L_Knee' }, // legs
		{ x: 380, y: 350, r: 4, label: 'R_Knee' },
		{ x: 315, y: 420, r: 4, label: 'L_Ankle' },
		{ x: 390, y: 430, r: 4, label: 'R_Ankle' }
	];

	const bones = [
		[0, 1], [0, 2], [1, 2], // head/neck
		[1, 3], [3, 5], // left arm
		[2, 4], [4, 6], // bowling right arm
		[1, 7], [2, 8], [7, 8], // torso
		[7, 9], [9, 11], // left leg
		[8, 10], [10, 12] // right leg
	];

	const angles = [
		{ joint: 'Bowling Arm Elbow Angle', val: '168.4°', delta: '+2.1° tolerance' },
		{ joint: 'Shoulder Counter-Rotation', val: '28.2°', delta: 'front-on alignment' },
		{ joint: 'Front Knee Flexion Angle', val: '154.0°', delta: 'brace-impact phase' },
		{ joint: 'Trunk Lateral Flexion', val: '14.8°', delta: 'release alignment' }
	];
</script>

<svg viewBox="0 0 800 500" class="h-full w-full" role="img" aria-label="Cricket Biomechanics pose estimation telemetry and kinematics">
	<rect width="800" height="500" fill="#06080a" />
	<!-- Top status bar -->
	<rect width="800" height="38" fill="#0b0e12" />
	<line x1="0" y1="38" x2="800" y2="38" stroke="#fff" stroke-opacity="0.08" />
	<g font-family="JetBrains Mono, monospace" font-size="9.5">
		<circle cx="22" cy="19" r="3.5" fill="#24D7FF"><animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" /></circle>
		<text x="34" y="22.5" fill="#8A95A5" letter-spacing="1.5">MEDIAPIPE POSE · FRAME #148 · RELEASE DETECTED</text>
		<text x="776" y="22.5" text-anchor="end" fill="#24D7FF">30 FPS · 33 LANDMARKS</text>
	</g>

	<!-- Left: Pose Landmark Wireframe View -->
	<g transform="translate(10 10)">
		<!-- Grid wireframe overlay -->
		<defs>
			<pattern id="bio-grid" width="30" height="30" patternUnits="userSpaceOnUse">
				<path d="M 30 0 L 0 0 0 30" fill="none" stroke="#fff" stroke-opacity="0.025" stroke-width="0.8" />
			</pattern>
		</defs>
		<rect x="24" y="44" width="460" height="420" rx="10" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />
		<rect x="24" y="44" width="460" height="420" rx="10" fill="url(#bio-grid)" />

		<!-- Coordinate axis -->
		<line x1="254" y1="54" x2="254" y2="454" stroke="#24D7FF" stroke-opacity="0.08" stroke-dasharray="3 4" />
		<line x1="34" y1="260" x2="474" y2="260" stroke="#24D7FF" stroke-opacity="0.08" stroke-dasharray="3 4" />

		<!-- Skeleton bones -->
		{#each bones as [a, b], i (i)}
			<line
				x1={landmarks[a].x - 90}
				y1={landmarks[a].y}
				x2={landmarks[b].x - 90}
				y2={landmarks[b].y}
				stroke={a === 2 || a === 4 || b === 6 ? '#24D7FF' : '#8A95A5'}
				stroke-width={a === 2 || a === 4 || b === 6 ? '2.4' : '1.4'}
				stroke-opacity={a === 2 || a === 4 || b === 6 ? '0.9' : '0.45'}
			/>
		{/each}

		<!-- Joint landmarks -->
		{#each landmarks as p, i (p.label)}
			<circle
				cx={p.x - 90}
				cy={p.y}
				r={p.r}
				fill={i === 6 ? '#EAB66A' : i === 4 ? '#24D7FF' : '#ffffff'}
				fill-opacity={i === 6 ? 1 : 0.85}
			/>
			{#if i === 6}
				<!-- Release point pulse -->
				<circle cx={p.x - 90} cy={p.y} r="12" fill="none" stroke="#EAB66A" stroke-width="1.2" stroke-opacity="0.7">
					<animate attributeName="r" values="6;22;6" dur="2s" repeatCount="indefinite" />
					<animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
				</circle>
			{/if}
		{/each}

		<!-- Joint angle arc on bowling arm -->
		<path d="M 270 185 A 18 18 0 0 1 292 165" fill="none" stroke="#EAB66A" stroke-width="1.4" />
		<text x="310" y="160" font-family="JetBrains Mono, monospace" font-size="9" fill="#EAB66A">168.4°</text>

		<text x="40" y="70" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5" fill="#4B5563">
			ESTIMATED POSE · 2D LANDMARK PROJECTION
		</text>
		<text x="40" y="445" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#8A95A5">
			● RELEASE POINT DETECTED AT T = 1.24s (FRAME 37)
		</text>
	</g>

	<!-- Right: Kinematic Angle Telemetry -->
	<line x1="510" y1="38" x2="510" y2="500" stroke="#fff" stroke-opacity="0.08" />
	<g transform="translate(532 64)" font-family="JetBrains Mono, monospace">
		<text font-size="9" letter-spacing="2" fill="#4B5563">KINEMATICS TELEMETRY</text>

		{#each angles as a, i (a.joint)}
			<g transform="translate(0 {30 + i * 56})">
				<text font-size="9" fill="#8A95A5">{a.joint}</text>
				<text x="240" text-anchor="end" font-size="12" font-weight="500" fill="#fff">{a.val}</text>
				<rect y="12" width="240" height="3" rx="1.5" fill="#fff" fill-opacity="0.06" />
				<rect y="12" width={i === 0 ? '204' : i === 1 ? '70' : i === 2 ? '185' : '45'} height="3" rx="1.5" fill={i === 0 ? '#EAB66A' : '#24D7FF'} />
				<text y="26" font-size="8" fill="#4B5563">{a.delta}</text>
			</g>
		{/each}

		<text y="278" font-size="9" letter-spacing="2" fill="#4B5563">RELEASE VELOCITY VECTOR</text>
		<g transform="translate(0 292)">
			<rect width="240" height="84" rx="8" fill="#080b0f" stroke="#fff" stroke-opacity="0.08" />
			<text x="16" y="28" font-size="10" fill="#8A95A5">Estimated Release Speed</text>
			<text x="16" y="56" font-family="Inter, sans-serif" font-size="24" font-weight="500" fill="#24D7FF">
				134.6 <tspan font-size="12" fill="#8A95A5">km/h (est.)</tspan>
			</text>
			<text x="16" y="72" font-size="7.5" fill="#4B5563">* Experimental video estimation · Not calibrated radar</text>
		</g>
	</g>
</svg>
