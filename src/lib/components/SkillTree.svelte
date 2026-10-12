<script lang="ts">
	import { onMount } from 'svelte';
	import { skillTreeData, treeRootsData, type SkillBranch, type SkillNode } from '../data/skills-tree';
	import { reveal } from '../actions/reveal';
	import {
		Terminal,
		Sparkles,
		Cpu,
		Activity,
		RotateCw,
		Layers,
		Zap,
		Compass,
		Check
	} from '@lucide/svelte';

	let container = $state<HTMLDivElement>();
	let treeCanvas = $state<HTMLCanvasElement>();
	let selectedBranch = $state<SkillBranch>(skillTreeData[0]);
	let activeSkill = $state<SkillNode>(skillTreeData[0].skills[0]);
	let hoveredBranchId = $state<string | null>(null);
	let hoveredRoot = $state<string | null>(null);

	// 3D Perspective Tilt state
	let tiltX = $state(0);
	let tiltY = $state(0);
	let targetTiltX = 0;
	let targetTiltY = 0;
	let isInteracting = $state(false);
	let is3DEnabled = $state(true);
	let isSurging = $state(false);

	// Coordinate mapping of the 4 major skill clusters on the neural tree artwork
	// (Normalized 0-100 coordinates relative to the 736x1104 artwork)
	interface ClusterHotspot {
		id: string;
		x: number; // percentage (0-100)
		y: number; // percentage (0-100)
		label: string;
		shortDesc: string;
		color: string;
		glowColor: string;
		metric: string;
	}

	const clusters: ClusterHotspot[] = [
		{
			id: 'ai-intelligence',
			x: 39,
			y: 24,
			label: 'AI & Agentic Systems',
			shortDesc: 'LangGraph · PyTorch · LIME',
			color: '#FFB800', // Luminous Solar Gold
			glowColor: 'rgba(255, 184, 0, 0.75)',
			metric: '96% Acc · Multi-Agent'
		},
		{
			id: 'sports-analytics',
			x: 74,
			y: 33,
			label: 'Sports Intelligence',
			shortDesc: 'Telemetry · Forecasting · Inplay Matrix',
			color: '#00F0FF', // Electric Neon Cyan
			glowColor: 'rgba(0, 240, 255, 0.75)',
			metric: 'Sub-Sec · Live Sim'
		},
		{
			id: 'fullstack-systems',
			x: 80,
			y: 53,
			label: 'Full-Stack Systems',
			shortDesc: 'Svelte 5 · Spring Boot · Microservices',
			color: '#3B82F6', // Royal Electric Blue
			glowColor: 'rgba(59, 130, 246, 0.75)',
			metric: 'Enterprise · High-Throughput'
		},
		{
			id: 'cloud-devops-iot',
			x: 22,
			y: 55,
			label: 'Cloud, Edge IoT & Telemetry',
			shortDesc: 'C++ Firmware · Docker · Sensor Fusion',
			color: '#10B981', // Bioluminescent Emerald
			glowColor: 'rgba(16, 185, 129, 0.75)',
			metric: 'Low-Latency · Hardware'
		}
	];

	function selectBranch(id: string) {
		const found = skillTreeData.find((b) => b.id === id);
		if (found) {
			selectedBranch = found;
			activeSkill = found.skills[0];
			triggerSurge();
		}
	}

	function triggerSurge() {
		isSurging = true;
		setTimeout(() => {
			isSurging = false;
		}, 1600);
	}

	function resetCamera() {
		targetTiltX = 0;
		targetTiltY = 0;
		tiltX = 0;
		tiltY = 0;
	}

	// ─── Biological Tree Pathways (Anatomically Tracing the Tree Contours) ───
	interface Waypoint {
		x: number; // 0.0 to 1.0
		y: number; // 0.0 to 1.0
	}

	interface CircuitPath {
		id: string;
		targetBranchId: string;
		color: string;
		waypoints: Waypoint[];
	}

	// Continuous anatomical pathways flowing from deep roots -> trunk -> specific branch nodes
	const treePathways: CircuitPath[] = [
		// 1. Path to AI & Agentic Systems (Root Left -> Trunk -> Upper Left Crown)
		{
			id: 'path-ai-1',
			targetBranchId: 'ai-intelligence',
			color: '#FFB800',
			waypoints: [
				{ x: 0.36, y: 0.96 },
				{ x: 0.43, y: 0.89 },
				{ x: 0.48, y: 0.82 },
				{ x: 0.48, y: 0.68 },
				{ x: 0.48, y: 0.54 },
				{ x: 0.48, y: 0.46 },
				{ x: 0.45, y: 0.38 },
				{ x: 0.42, y: 0.30 },
				{ x: 0.39, y: 0.24 } // Lands directly on AI Amber Node
			]
		},
		{
			id: 'path-ai-2',
			targetBranchId: 'ai-intelligence',
			color: '#FFB800',
			waypoints: [
				{ x: 0.50, y: 0.98 },
				{ x: 0.50, y: 0.86 },
				{ x: 0.50, y: 0.72 },
				{ x: 0.49, y: 0.58 },
				{ x: 0.48, y: 0.46 },
				{ x: 0.44, y: 0.35 },
				{ x: 0.39, y: 0.24 }
			]
		},
		// 2. Path to Sports Intelligence (Root Right -> Trunk -> Upper Right Cyan Canopy)
		{
			id: 'path-sports-1',
			targetBranchId: 'sports-analytics',
			color: '#00F0FF',
			waypoints: [
				{ x: 0.65, y: 0.96 },
				{ x: 0.58, y: 0.89 },
				{ x: 0.52, y: 0.82 },
				{ x: 0.52, y: 0.68 },
				{ x: 0.51, y: 0.54 },
				{ x: 0.51, y: 0.46 },
				{ x: 0.58, y: 0.42 },
				{ x: 0.66, y: 0.38 },
				{ x: 0.74, y: 0.33 } // Lands directly on Sports Cyan Node
			]
		},
		{
			id: 'path-sports-2',
			targetBranchId: 'sports-analytics',
			color: '#00F0FF',
			waypoints: [
				{ x: 0.76, y: 0.94 },
				{ x: 0.64, y: 0.88 },
				{ x: 0.53, y: 0.80 },
				{ x: 0.51, y: 0.62 },
				{ x: 0.51, y: 0.46 },
				{ x: 0.61, y: 0.41 },
				{ x: 0.74, y: 0.33 }
			]
		},
		// 3. Path to Full-Stack Systems (Root Right -> Mid-Trunk -> Lower Right Horizontal Limb)
		{
			id: 'path-fullstack-1',
			targetBranchId: 'fullstack-systems',
			color: '#3B82F6',
			waypoints: [
				{ x: 0.60, y: 0.95 },
				{ x: 0.54, y: 0.87 },
				{ x: 0.52, y: 0.76 },
				{ x: 0.52, y: 0.62 },
				{ x: 0.54, y: 0.54 },
				{ x: 0.62, y: 0.54 },
				{ x: 0.71, y: 0.535 },
				{ x: 0.80, y: 0.53 } // Lands directly on Blue Node
			]
		},
		{
			id: 'path-fullstack-2',
			targetBranchId: 'fullstack-systems',
			color: '#3B82F6',
			waypoints: [
				{ x: 0.50, y: 0.92 },
				{ x: 0.51, y: 0.78 },
				{ x: 0.53, y: 0.60 },
				{ x: 0.60, y: 0.55 },
				{ x: 0.72, y: 0.54 },
				{ x: 0.80, y: 0.53 }
			]
		},
		// 4. Path to Cloud, Edge IoT (Root Left -> Mid-Trunk -> Lower Left Curved Limb)
		{
			id: 'path-iot-1',
			targetBranchId: 'cloud-devops-iot',
			color: '#10B981',
			waypoints: [
				{ x: 0.28, y: 0.94 },
				{ x: 0.38, y: 0.88 },
				{ x: 0.47, y: 0.80 },
				{ x: 0.47, y: 0.64 },
				{ x: 0.46, y: 0.54 },
				{ x: 0.38, y: 0.54 },
				{ x: 0.29, y: 0.545 },
				{ x: 0.22, y: 0.55 } // Lands directly on Emerald Node
			]
		},
		{
			id: 'path-iot-2',
			targetBranchId: 'cloud-devops-iot',
			color: '#10B981',
			waypoints: [
				{ x: 0.44, y: 0.95 },
				{ x: 0.47, y: 0.84 },
				{ x: 0.47, y: 0.68 },
				{ x: 0.45, y: 0.56 },
				{ x: 0.34, y: 0.55 },
				{ x: 0.22, y: 0.55 }
			]
		},
		// 5. Central Trunk Apex Beacon (Root -> Straight Up to Red Apex Star)
		{
			id: 'path-apex',
			targetBranchId: 'core',
			color: '#FF3366',
			waypoints: [
				{ x: 0.50, y: 0.98 },
				{ x: 0.50, y: 0.84 },
				{ x: 0.50, y: 0.66 },
				{ x: 0.50, y: 0.48 },
				{ x: 0.50, y: 0.34 },
				{ x: 0.50, y: 0.20 } // Reaches brilliant Red Apex Light
			]
		}
	];

	// Interpolate (x, y) along a multi-waypoint path
	function getPointOnPath(points: Waypoint[], progress: number): Waypoint {
		if (points.length === 0) return { x: 0.5, y: 0.5 };
		if (points.length === 1) return points[0];
		const clamped = Math.max(0, Math.min(1, progress));

		const segLengths: number[] = [];
		let totalLen = 0;
		for (let i = 0; i < points.length - 1; i++) {
			const dx = points[i + 1].x - points[i].x;
			const dy = points[i + 1].y - points[i].y;
			const len = Math.hypot(dx, dy);
			segLengths.push(len);
			totalLen += len;
		}

		if (totalLen === 0) return points[0];
		const targetDist = clamped * totalLen;
		let accumulated = 0;
		for (let i = 0; i < segLengths.length; i++) {
			if (accumulated + segLengths[i] >= targetDist || i === segLengths.length - 1) {
				const segFraction = segLengths[i] === 0 ? 0 : (targetDist - accumulated) / segLengths[i];
				return {
					x: points[i].x + (points[i + 1].x - points[i].x) * segFraction,
					y: points[i].y + (points[i + 1].y - points[i].y) * segFraction
				};
			}
			accumulated += segLengths[i];
		}
		return points[points.length - 1];
	}

	// ─── Interactive 3D Parallax & Synaptic Conduction Engine ───
	onMount(() => {
		if (!treeCanvas || !container) return;
		const ctx = treeCanvas.getContext('2d');
		if (!ctx) return;

		let animId = 0;
		let width = (treeCanvas.width = treeCanvas.offsetWidth);
		let height = (treeCanvas.height = treeCanvas.offsetHeight);
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let t = 0;

		const onResize = () => {
			if (!treeCanvas || !container) return;
			width = treeCanvas.offsetWidth;
			height = treeCanvas.offsetHeight;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			treeCanvas.width = Math.round(width * dpr);
			treeCanvas.height = Math.round(height * dpr);
		};
		window.addEventListener('resize', onResize);
		onResize();

		// Mouse move tracking for 3D perspective tilt
		const onMouseMove = (e: MouseEvent) => {
			if (!container || !is3DEnabled) return;
			const rect = container.getBoundingClientRect();
			const relX = (e.clientX - rect.left) / rect.width - 0.5;
			const relY = (e.clientY - rect.top) / rect.height - 0.5;

			targetTiltY = relX * 18; // Max 18 deg yaw
			targetTiltX = -relY * 14; // Max 14 deg pitch
			isInteracting = true;
		};

		const onMouseLeave = () => {
			targetTiltX = 0;
			targetTiltY = 0;
			isInteracting = false;
		};

		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('mouseleave', onMouseLeave);

		// Action potential pulses traveling through tree pathways
		interface ActionPotential {
			pathIndex: number;
			progress: number;
			speed: number;
			size: number;
			trailLength: number;
		}

		const pulses: ActionPotential[] = [];
		for (let i = 0; i < 32; i++) {
			pulses.push({
				pathIndex: Math.floor(Math.random() * treePathways.length),
				progress: Math.random(),
				speed: 0.003 + Math.random() * 0.005,
				size: 1.5 + Math.random() * 1.8,
				trailLength: 0.08 + Math.random() * 0.06
			});
		}

		// Node burst shockwaves that flash when a pulse hits a node
		interface NodeFlash {
			x: number;
			y: number;
			color: string;
			radius: number;
			maxRadius: number;
			alpha: number;
		}
		const nodeFlashes: NodeFlash[] = [];

		function triggerNodeFlash(nx: number, ny: number, color: string) {
			nodeFlashes.push({
				x: nx,
				y: ny,
				color,
				radius: 8,
				maxRadius: 28,
				alpha: 0.9
			});
		}

		// Floating ambient neural spores orbiting the canopy
		interface Spore {
			x: number;
			y: number;
			radius: number;
			color: string;
			angle: number;
			speed: number;
			alpha: number;
		}

		const spores: Spore[] = [];
		const sporeColors = ['#FF3366', '#FFB800', '#00F0FF', '#3B82F6', '#10B981', '#8B5CF6'];
		for (let i = 0; i < 28; i++) {
			spores.push({
				x: 0.25 + Math.random() * 0.5,
				y: 0.2 + Math.random() * 0.6,
				radius: 0.8 + Math.random() * 1.4,
				color: sporeColors[Math.floor(Math.random() * sporeColors.length)],
				angle: Math.random() * Math.PI * 2,
				speed: 0.005 + Math.random() * 0.01,
				alpha: 0.2 + Math.random() * 0.4
			});
		}

		function draw() {
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);
			t += 0.02;

			// Smooth 3D tilt interpolation
			tiltX += (targetTiltX - tiltX) * 0.08;
			tiltY += (targetTiltY - tiltY) * 0.08;

			const speedBoost = isSurging ? 2.5 : 1;

			// ── 1. Render Active Synaptic Conduit Filaments along the branches ──
			treePathways.forEach((path) => {
				const isPathActive = path.targetBranchId === selectedBranch.id || path.targetBranchId === hoveredBranchId;
				if (isPathActive) {
					ctx.beginPath();
					const start = path.waypoints[0];
					ctx.moveTo(start.x * width, start.y * height);
					for (let i = 1; i < path.waypoints.length; i++) {
						ctx.lineTo(path.waypoints[i].x * width, path.waypoints[i].y * height);
					}
					ctx.strokeStyle = path.color;
					ctx.lineWidth = isSurging ? 2.2 : 1.4;
					ctx.shadowColor = path.color;
					ctx.shadowBlur = isSurging ? 16 : 8;
					ctx.globalAlpha = 0.65 + Math.sin(t * 3) * 0.25;
					ctx.stroke();
					ctx.globalAlpha = 1;
					ctx.shadowBlur = 0;
				}
			});

			// ── 2. Render Action Potential Electrical Pulses Traveling along Tree Pathways ──
			pulses.forEach((p) => {
				const path = treePathways[p.pathIndex];
				const isPathSelected = path.targetBranchId === selectedBranch.id || path.targetBranchId === hoveredBranchId;
				const currentSpeed = p.speed * speedBoost * (isPathSelected ? 1.4 : 1);

				p.progress += currentSpeed;

				// When pulse arrives at destination node, trigger a flash
				if (p.progress >= 1.0) {
					p.progress = 0;
					// Reassign path (bias toward selected branch)
					if (Math.random() < 0.5) {
						const matchingIndices = treePathways
							.map((pt, idx) => (pt.targetBranchId === selectedBranch.id ? idx : -1))
							.filter((idx) => idx !== -1);
						if (matchingIndices.length > 0) {
							p.pathIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
						} else {
							p.pathIndex = Math.floor(Math.random() * treePathways.length);
						}
					} else {
						p.pathIndex = Math.floor(Math.random() * treePathways.length);
					}

					// Trigger destination flash
					const lastWp = path.waypoints[path.waypoints.length - 1];
					triggerNodeFlash(lastWp.x * width, lastWp.y * height, path.color);
				}

				// Calculate head position
				const headPt = getPointOnPath(path.waypoints, p.progress);
				const px = headPt.x * width;
				const py = headPt.y * height;

				// Dynamic color gradient shifting:
				// Pulses in roots (y > 0.82) are ultraviolet, in trunk are crimson/coral, in branches match domain color!
				let pulseColor = path.color;
				if (headPt.y > 0.82) {
					pulseColor = '#8B5CF6'; // Root ultraviolet
				} else if (headPt.y > 0.50 && path.targetBranchId !== 'core') {
					pulseColor = '#FF3366'; // Trunk crimson
				}

				// Draw electrical comet tail along the curve
				const tailSteps = 6;
				for (let s = 1; s <= tailSteps; s++) {
					const tailFraction = p.progress - (p.trailLength * (s / tailSteps));
					if (tailFraction > 0) {
						const tailPt = getPointOnPath(path.waypoints, tailFraction);
						ctx.beginPath();
						ctx.arc(tailPt.x * width, tailPt.y * height, p.size * (1 - s / (tailSteps + 1)), 0, Math.PI * 2);
						ctx.fillStyle = pulseColor;
						ctx.globalAlpha = (1 - s / tailSteps) * 0.55;
						ctx.fill();
						ctx.globalAlpha = 1;
					}
				}

				// Draw radiant pulse head
				ctx.beginPath();
				ctx.arc(px, py, p.size * (isSurging ? 1.4 : 1), 0, Math.PI * 2);
				ctx.fillStyle = '#FFFFFF';
				ctx.shadowColor = pulseColor;
				ctx.shadowBlur = 12;
				ctx.fill();
				ctx.shadowBlur = 0;
			});

			// ── 3. Render Node Shockwave Flashes ──
			for (let i = nodeFlashes.length - 1; i >= 0; i--) {
				const flash = nodeFlashes[i];
				flash.radius += 0.8;
				flash.alpha -= 0.035;

				if (flash.alpha <= 0) {
					nodeFlashes.splice(i, 1);
					continue;
				}

				ctx.beginPath();
				ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
				ctx.strokeStyle = flash.color;
				ctx.lineWidth = 1.2;
				ctx.shadowColor = flash.color;
				ctx.shadowBlur = 10;
				ctx.globalAlpha = flash.alpha;
				ctx.stroke();
				ctx.globalAlpha = 1;
				ctx.shadowBlur = 0;
			}

			// ── 4. Render Ambient Canopy Neural Spores ──
			spores.forEach((s) => {
				s.angle += s.speed;
				const sx = (s.x + Math.cos(s.angle) * 0.02) * width;
				const sy = (s.y + Math.sin(s.angle) * 0.02) * height;
				const currentAlpha = s.alpha * (0.6 + Math.sin(t * 2 + s.angle) * 0.4);

				ctx.beginPath();
				ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
				ctx.fillStyle = s.color;
				ctx.globalAlpha = currentAlpha;
				ctx.shadowColor = s.color;
				ctx.shadowBlur = 6;
				ctx.fill();
				ctx.shadowBlur = 0;
				ctx.globalAlpha = 1;
			});

			// ── 5. Render Node Halos on the 4 Domain Hubs ──
			clusters.forEach((c) => {
				const isSelected = c.id === selectedBranch.id;
				const isHovered = c.id === hoveredBranchId;
				const cx = (c.x / 100) * width;
				const cy = (c.y / 100) * height;

				const pulseScale = isSelected || isHovered ? 1 + Math.sin(t * 3.5) * 0.3 : 1 + Math.sin(t * 1.5) * 0.12;
				const baseRadius = isSelected || isHovered ? 17 : 10;
				const radius = baseRadius * pulseScale;

				// Outer halo wave
				ctx.beginPath();
				ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
				ctx.strokeStyle = c.glowColor;
				ctx.lineWidth = isSelected ? 2 : 1;
				ctx.stroke();

				// Inner radiant core
				ctx.beginPath();
				ctx.arc(cx, cy, radius, 0, Math.PI * 2);
				ctx.fillStyle = c.color;
				ctx.shadowColor = c.color;
				ctx.shadowBlur = isSelected ? 26 : 12;
				ctx.fill();
				ctx.shadowBlur = 0;

				// Center white photon sparkle
				ctx.beginPath();
				ctx.arc(cx, cy, 3, 0, Math.PI * 2);
				ctx.fillStyle = '#FFFFFF';
				ctx.fill();
			});

			// ── 6. Roots Foundation Violet Illumination ──
			if (hoveredRoot) {
				const rootY = height * 0.90;
				ctx.beginPath();
				ctx.arc(width * 0.5, rootY, width * 0.38, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(139, 92, 246, 0.14)';
				ctx.shadowColor = '#8B5CF6';
				ctx.shadowBlur = 24;
				ctx.fill();
				ctx.shadowBlur = 0;
			}

			animId = requestAnimationFrame(draw);
		}

		draw();

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', onResize);
			container?.removeEventListener('mousemove', onMouseMove);
			container?.removeEventListener('mouseleave', onMouseLeave);
		};
	});
</script>

<section id="systems" class="relative overflow-hidden border-t border-white/[0.08] py-28 md:py-36 bg-[#000000]">
	<!-- Ambient Bioluminescent Auroras (Unified with Tree Colors) -->
	<div
		class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full blur-[140px] opacity-20 transition-all duration-1000"
		style="background: radial-gradient(circle, {selectedBranch.color} 0%, #FF3366 40%, transparent 70%);"
		aria-hidden="true"
	></div>

	<div class="container-editorial relative">
		<!-- Section Header -->
		<div class="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between" use:reveal>
			<div>
				<p class="eyebrow flex items-center gap-3" style="color: {selectedBranch.color};">
					<span class="font-mono text-fg-3">03</span>
					<span class="h-px w-6 bg-current opacity-50"></span>
					<span>Living Architecture</span>
				</p>
				<h2 class="mt-4 text-4xl font-medium tracking-tight text-white md:text-6xl">
					The Neural <span class="font-serif font-normal italic" style="color: {selectedBranch.color};">Skill Tree.</span>
				</h2>
			</div>

			<p class="max-w-md font-mono text-xs leading-relaxed text-[#94A3B8]">
				A living computational organism: foundational logic roots, high-throughput systems trunk, and four specialized intelligent branches rendered in real-time volumetric depth.
			</p>
		</div>

		<!-- ═════════════════════════════════════════════════════════════════════════════════ -->
		<!-- HEROIC CENTERPIECE: Volumetric Glass Neural Tree Chamber (Seamlessly Blended)     -->
		<!-- ═════════════════════════════════════════════════════════════════════════════════ -->
		<div class="mt-14 w-full" use:reveal={{ delay: 100 }}>
			
			<div
				class="relative mx-auto w-full max-w-5xl rounded-3xl border border-white/[0.10] bg-[#030307]/75 backdrop-blur-3xl shadow-[0_24px_90px_rgba(0,0,0,0.95)] overflow-hidden"
				style="box-shadow: 0 30px 100px -20px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(255, 255, 255, 0.03);"
			>
				<!-- Subtle Specular Glass Sheen -->
				<div
					class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.06] via-white/[0.01] to-transparent"
					aria-hidden="true"
				></div>

				<!-- Holographic Tech Corner Optical Brackets -->
				<div class="pointer-events-none absolute top-3 left-3 size-4 border-t-2 border-l-2 border-white/20" aria-hidden="true"></div>
				<div class="pointer-events-none absolute top-3 right-3 size-4 border-t-2 border-r-2 border-white/20" aria-hidden="true"></div>
				<div class="pointer-events-none absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-white/20" aria-hidden="true"></div>
				<div class="pointer-events-none absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-white/20" aria-hidden="true"></div>

				<!-- ── Top Glass Telemetry & HUD Bar ── -->
				<div class="relative z-20 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/[0.08] bg-black/60 px-3.5 sm:px-6 py-3 font-mono text-[10px] sm:text-[11px] backdrop-blur-xl">
					<!-- Left: Status & Cluster Telemetry -->
					<div class="flex items-center gap-2.5">
						<span
							class="size-2 rounded-full animate-pulse shrink-0"
							style="background-color: {selectedBranch.color}; box-shadow: 0 0 12px {selectedBranch.color};"
						></span>
						<span class="text-white font-medium tracking-wider truncate max-w-[200px] sm:max-w-none">NEURAL_TREE // SYNAPTIC CONDUCTION</span>
						<span class="hidden sm:inline text-fg-3">·</span>
						<span class="hidden sm:inline text-[#94A3B8]">PATH-FOLLOWING ACTION POTENTIALS</span>
					</div>

					<!-- Center: Active Domain Badge -->
					<div class="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
						<span class="size-1.5 rounded-full" style="background-color: {selectedBranch.color};"></span>
						<span class="text-white text-[10.5px] uppercase tracking-wider">{selectedBranch.title}</span>
					</div>

					<!-- Right: 3D Camera & Pulse Interactive Controls -->
					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => (is3DEnabled = !is3DEnabled)}
							class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-fg-2 transition-all hover:border-white/25 hover:text-white"
							title="Toggle 3D Mouse Parallax Tilt"
						>
							<Compass size={12} class={is3DEnabled ? 'text-[#00F0FF]' : 'text-fg-3'} />
							<span>{is3DEnabled ? '3D TILT' : '2D FIXED'}</span>
						</button>

						<button
							type="button"
							onclick={triggerSurge}
							class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-fg-2 transition-all hover:border-sig-gold hover:text-white"
							title="Trigger high-frequency action potential surge"
						>
							<Zap size={12} class={isSurging ? 'text-[#FFB800] animate-bounce' : 'text-fg-3'} />
							<span class="hidden xs:inline">SURGE</span>
						</button>

						<button
							type="button"
							onclick={resetCamera}
							class="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-fg-3 transition-colors hover:border-white/20 hover:text-white"
							title="Reset Camera Orientation"
							aria-label="Reset Camera"
						>
							<RotateCw size={12} />
						</button>
					</div>
				</div>

				<!-- ── Central 3D Interactive Tree Stage Viewport ── -->
				<div
					bind:this={container}
					class="relative h-[620px] sm:h-[700px] md:h-[780px] lg:h-[820px] w-full overflow-hidden flex items-center justify-center p-2 sm:p-4 cursor-crosshair select-none bg-[#000000]"
					style="perspective: 1400px;"
				>
					<!-- Ground Holographic Perspective Floor Grid -->
					<div
						class="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-44 w-[85%] rounded-full opacity-15"
						style="background: radial-gradient(ellipse at center, {selectedBranch.color} 0%, rgba(255,50,90,0.3) 40%, transparent 70%); transform: rotateX(75deg);"
						aria-hidden="true"
					></div>

					<!-- 3D Tilting Tree Anchor (Strict Aspect Ratio 736/1104 for 100% 1:1 Pixel Mapping) -->
					<div
						class="relative h-full aspect-[736/1104] max-h-[780px] flex items-center justify-center transition-transform duration-200 ease-out"
						style="transform: rotateX({tiltX}deg) rotateY({tiltY}deg) scale3d({isInteracting ? 1.025 : 1}, {isInteracting ? 1.025 : 1}, 1); transform-style: preserve-3d;"
					>
						<!-- Ambient Glow Behind Active Cluster -->
						<div
							class="pointer-events-none absolute inset-0 rounded-full blur-[80px] transition-all duration-700 opacity-30"
							style="background: radial-gradient(circle at 50% 40%, {selectedBranch.color}, transparent 65%); transform: translateZ(-35px);"
							aria-hidden="true"
						></div>

						<!-- Core Bioluminescent Trunk Glow -->
						<div
							class="pointer-events-none absolute inset-x-0 bottom-12 top-28 rounded-full blur-[70px] opacity-25"
							style="background: radial-gradient(ellipse at 50% 60%, #FF3366 0%, #FF5E36 30%, transparent 70%); transform: translateZ(-25px);"
							aria-hidden="true"
						></div>

						<!-- High-Res Neural Tree Artwork (Seamlessly Blended with Screen Mode: Zero Rectangle, Zero Edge) -->
						<img
							src="/skill-tree.jpg"
							alt="The Neural Tree of Engineering"
							class="h-full w-full object-contain pointer-events-none select-none mix-blend-screen"
							style="mask-image: radial-gradient(ellipse 72% 76% at 50% 50%, #000 25%, rgba(0,0,0,0.85) 52%, transparent 82%); -webkit-mask-image: radial-gradient(ellipse 72% 76% at 50% 50%, #000 25%, rgba(0,0,0,0.85) 52%, transparent 82%); filter: contrast(1.15) brightness(1.04); transform: translateZ(0px);"
						/>

						<!-- Live Synaptic Conduction Particle & Filament Canvas (100% Exact 1:1 Overlay) -->
						<canvas
							bind:this={treeCanvas}
							class="absolute inset-0 h-full w-full pointer-events-none"
							style="transform: translateZ(24px);"
							aria-hidden="true"
						></canvas>

						<!-- 3D Floating Canopy Hotspots & Glass Callouts -->
						{#each clusters as c}
							<button
								type="button"
								onclick={() => selectBranch(c.id)}
								onmouseenter={() => (hoveredBranchId = c.id)}
								onmouseleave={() => (hoveredBranchId = null)}
								class="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-300 focus:outline-none"
								style="left: {c.x}%; top: {c.y}%; transform: translate(-50%, -50%) translateZ(45px);"
								aria-label="{c.label} cluster"
							>
								<!-- Hit target area -->
								<div class="relative size-12 grid place-items-center">
									<!-- Pulse Wave Ring when selected -->
									{#if selectedBranch.id === c.id}
										<span
											class="absolute inset-0 rounded-full animate-ping opacity-35"
											style="background-color: {c.color};"
										></span>
									{/if}

									<!-- Floating Frosted Glass Callout Label Tag -->
									<div
										class="pointer-events-none absolute whitespace-nowrap rounded-xl border border-white/20 bg-black/85 px-3 py-1.5 font-mono text-[10.5px] text-white backdrop-blur-xl shadow-2xl transition-all duration-300
										{selectedBranch.id === c.id || hoveredBranchId === c.id
											? 'opacity-100 scale-100 translate-y-0'
											: 'opacity-0 scale-95 translate-y-2'}"
										style="top: 100%; margin-top: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 15px {c.glowColor};"
									>
										<div class="flex items-center gap-2">
											<span class="size-2 rounded-full" style="background-color: {c.color}; box-shadow: 0 0 8px {c.color};"></span>
											<span class="font-semibold">{c.label}</span>
											<span class="rounded px-1.5 py-0.2 text-[9px] bg-white/10 text-white/90">{c.metric}</span>
										</div>
										<p class="mt-0.5 text-[9.5px] text-[#94A3B8]">{c.shortDesc}</p>
									</div>
								</div>
							</button>
						{/each}
					</div>

					<!-- Floating Interaction Hints -->
					<div class="pointer-events-none absolute top-5 left-5 hidden sm:flex items-center gap-2.5 rounded-full border border-white/10 bg-black/75 px-3.5 py-1.5 font-mono text-[10.5px] text-[#94A3B8] backdrop-blur-md">
						<RotateCw size={11} class="text-[#FFB800] animate-spin" />
						<span>3D Perspective Parallax Active</span>
					</div>

					<!-- Floating Telemetry Coordinates Indicator -->
					<div class="pointer-events-none absolute bottom-5 right-5 hidden sm:flex items-center gap-3 rounded-full border border-white/10 bg-black/75 px-3.5 py-1.5 font-mono text-[10px] text-fg-3 backdrop-blur-md">
						<span>YAW: <strong class="text-white">{tiltY.toFixed(1)}°</strong></span>
						<span>PITCH: <strong class="text-white">{tiltX.toFixed(1)}°</strong></span>
					</div>
				</div>

				<!-- ── Bottom Foundations Bar: Roots of the Tree (CS Core) ── -->
				<div class="relative z-20 border-t border-white/[0.08] bg-black/85 p-4 md:px-6 backdrop-blur-xl">
					<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex items-center gap-2.5 text-[#94A3B8] font-mono text-[10.5px] uppercase tracking-wider">
							<Layers size={13} class="text-[#8B5CF6]" />
							<span>Roots // Foundational Logic:</span>
						</div>

						<div class="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
							{#each treeRootsData as root}
								<button
									type="button"
									onmouseenter={() => (hoveredRoot = root.id)}
									onmouseleave={() => (hoveredRoot = null)}
									class="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[#94A3B8] transition-all duration-300 hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 hover:text-white"
								>
									{root.name}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>

		</div>

		<!-- ═════════════════════════════════════════════════════════════════════════════════ -->
		<!-- DOMAIN MATRIX & SYNAPTIC INSPECTOR (Harmonized, Clean Glass Cockpit)             -->
		<!-- ═════════════════════════════════════════════════════════════════════════════════ -->
		<div class="mt-8 mx-auto w-full max-w-5xl space-y-6" use:reveal={{ delay: 200 }}>
			
			<!-- Row 1: 4-Domain Glass Quick Switchers -->
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each skillTreeData as branch}
					<button
						type="button"
						onclick={() => selectBranch(branch.id)}
						onmouseenter={() => (hoveredBranchId = branch.id)}
						onmouseleave={() => (hoveredBranchId = null)}
						class="group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300"
						style={selectedBranch.id === branch.id
							? `border-color: ${branch.color}; background: rgba(255, 255, 255, 0.04); box-shadow: 0 8px 30px -8px ${branch.color}40;`
							: 'border-color: rgba(255, 255, 255, 0.07); background: rgba(255, 255, 255, 0.015);'}
					>
						<div class="flex items-center justify-between">
							<span
								class="size-2.5 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
								style="background-color: {branch.color}; box-shadow: 0 0 10px {branch.color};"
							></span>
							<span class="font-mono text-[9px] uppercase tracking-wider text-fg-3">Domain</span>
						</div>

						<div class="mt-3">
							<p class="font-mono text-xs font-semibold text-white group-hover:text-white transition-colors">
								{branch.title}
							</p>
							<p class="mt-1 font-mono text-[9.5px] text-[#94A3B8]">
								{branch.skills.length} Sub-systems · Live Telemetry
							</p>
						</div>
					</button>
				{/each}
			</div>

			<!-- Row 2: Master Synaptic Inspector Deck (Dual-Column Glass Deck) -->
			<div
				class="relative rounded-2xl border border-white/[0.08] bg-[#050508]/80 p-6 md:p-8 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.7)]"
			>
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
					
					<!-- Left: Domain Architecture & Sub-System Selectors (6 Cols) -->
					<div class="lg:col-span-6 space-y-5">
						<!-- Domain Header Pill -->
						<div class="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
							<div class="flex items-center gap-2.5">
								<span
									class="size-3 rounded-full"
									style="background-color: {selectedBranch.color}; box-shadow: 0 0 12px {selectedBranch.color};"
								></span>
								<h3 class="font-mono text-xs font-bold uppercase tracking-wider text-white">
									{selectedBranch.title}
								</h3>
							</div>
							<span class="font-mono text-[10px] text-fg-3 uppercase">Active Cluster</span>
						</div>

						<p class="text-sm leading-relaxed text-[#94A3B8] font-light">
							{selectedBranch.description}
						</p>

						<!-- Sub-Systems Node List -->
						<div class="space-y-2.5 pt-2">
							<p class="font-mono text-[10.5px] uppercase tracking-wider text-fg-3">
								Synaptic Sub-Systems (Select to Inspect):
							</p>

							<div class="space-y-2">
								{#each selectedBranch.skills as skill}
									<button
										type="button"
										onclick={() => (activeSkill = skill)}
										class="w-full text-left rounded-xl border p-3.5 transition-all duration-300 group"
										style={activeSkill.id === skill.id
											? `border-color: ${selectedBranch.color}; background: rgba(255, 255, 255, 0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.6);`
											: 'border-color: rgba(255, 255, 255, 0.06); background: rgba(255, 255, 255, 0.015);'}
									>
										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2">
												<span
													class="size-1.5 rounded-full"
													style="background-color: {activeSkill.id === skill.id ? selectedBranch.color : 'rgba(255,255,255,0.2)'};"
												></span>
												<p class="text-xs font-medium text-white tracking-wide group-hover:text-white transition-colors">
													{skill.name}
												</p>
											</div>

											<span
												class="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-white/10 text-fg-3 bg-white/[0.02]"
											>
												{skill.level}
											</span>
										</div>

										<!-- Tech Tool Badges -->
										<div class="mt-2 flex flex-wrap gap-1.5">
											{#each skill.tools as tool}
												<span
													class="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-[#94A3B8]"
												>
													{tool}
												</span>
											{/each}
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>

					<!-- Right: Production Deployment Telemetry Terminal (6 Cols) -->
					<div class="lg:col-span-6 flex flex-col justify-between h-full">
						<div class="rounded-xl border border-white/[0.08] bg-[#000000]/70 p-5 backdrop-blur-xl">
							<!-- Terminal HUD Bar -->
							<div class="flex items-center justify-between border-b border-white/[0.07] pb-3 font-mono text-[10.5px]">
								<div class="flex items-center gap-2" style="color: {selectedBranch.color};">
									<Terminal size={13} />
									<span class="font-semibold">PRODUCTION_CONTEXT // TELEMETRY</span>
								</div>
								<span class="text-fg-3 uppercase">{activeSkill.level} LEVEL</span>
							</div>

							<!-- Active Node Title -->
							<div class="mt-4 flex items-center justify-between">
								<h4 class="text-base font-medium text-white">
									{activeSkill.name}
								</h4>
								<span
									class="font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white"
									style="border-color: {selectedBranch.color}40; background: {selectedBranch.color}15;"
								>
									VERIFIED NODE
								</span>
							</div>

							<!-- Production Narrative Context -->
							<p class="mt-3 text-xs leading-relaxed text-[#CBD5E1] font-light">
								{activeSkill.context}
							</p>

							<!-- Tools & Engine Badges -->
							<div class="mt-5 border-t border-white/[0.06] pt-3.5">
								<p class="font-mono text-[9.5px] uppercase tracking-wider text-fg-3">
									Core Frameworks &amp; Toolchain:
								</p>
								<div class="mt-2 flex flex-wrap gap-1.5">
									{#each activeSkill.tools as tool}
										<span
											class="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-white"
										>
											<Check size={10} style="color: {selectedBranch.color};" />
											<span>{tool}</span>
										</span>
									{/each}
								</div>
							</div>

							<!-- Live SLA & Node Metrics -->
							<div class="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3.5 font-mono text-center">
								<div class="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2">
									<p class="text-[9px] text-fg-3 uppercase">Status</p>
									<p class="mt-0.5 text-xs font-semibold text-emerald-400">Production</p>
								</div>
								<div class="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2">
									<p class="text-[9px] text-fg-3 uppercase">Architecture</p>
									<p class="mt-0.5 text-xs font-semibold text-white">Distributed</p>
								</div>
								<div class="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2">
									<p class="text-[9px] text-fg-3 uppercase">Integration</p>
									<p class="mt-0.5 text-xs font-semibold" style="color: {selectedBranch.color};">Active</p>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>

		</div>
	</div>
</section>
