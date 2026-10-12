<script lang="ts">
	import { onMount } from 'svelte';
	import { Terminal, Sparkles, Zap, RotateCw } from '@lucide/svelte';

	let container = $state<HTMLDivElement>();
	let canvas = $state<HTMLCanvasElement>();

	let tiltX = $state(0);
	let tiltY = $state(0);
	let targetTiltX = 0;
	let targetTiltY = 0;
	let isHovered = $state(false);
	let mousePos = $state({ x: 0, y: 0, normalizedX: 0.5, normalizedY: 0.5 });
	let sparkIntensity = $state(1);

	onMount(() => {
		if (!canvas || !container) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animId = 0;
		let width = (canvas.width = canvas.offsetWidth);
		let height = (canvas.offsetHeight || 420);
		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let t = 0;

		const onResize = () => {
			if (!canvas || !container) return;
			width = canvas.offsetWidth;
			height = canvas.offsetHeight;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
		};
		window.addEventListener('resize', onResize);
		onResize();

		const onMouseMove = (e: MouseEvent) => {
			if (!container) return;
			const rect = container.getBoundingClientRect();
			const relX = (e.clientX - rect.left) / rect.width - 0.5;
			const relY = (e.clientY - rect.top) / rect.height - 0.5;

			targetTiltY = relX * 14; // Max 14 deg yaw
			targetTiltX = -relY * 10; // Max 10 deg pitch
			isHovered = true;

			mousePos = {
				x: Math.round(e.clientX - rect.left),
				y: Math.round(e.clientY - rect.top),
				normalizedX: (e.clientX - rect.left) / rect.width,
				normalizedY: (e.clientY - rect.top) / rect.height
			};
		};

		const onMouseLeave = () => {
			targetTiltX = 0;
			targetTiltY = 0;
			isHovered = false;
		};

		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('mouseleave', onMouseLeave);

		// Contact point coordinates (where human & AI index fingertips meet)
		const touchNormX = 0.492;
		const touchNormY = 0.522;

		// AI Hand neural wireframe pathways (flowing from wrist to fingertips)
		const aiPathways = [
			// Wrist -> Palm -> Index Finger -> Touch Point
			[
				{ x: 0.12, y: 0.46 },
				{ x: 0.20, y: 0.49 },
				{ x: 0.30, y: 0.45 },
				{ x: 0.38, y: 0.47 },
				{ x: 0.44, y: 0.50 },
				{ x: touchNormX, y: touchNormY }
			],
			// Lower Wrist -> Palm Center -> Index Knuckle -> Touch Point
			[
				{ x: 0.16, y: 0.55 },
				{ x: 0.25, y: 0.54 },
				{ x: 0.34, y: 0.52 },
				{ x: 0.42, y: 0.51 },
				{ x: touchNormX, y: touchNormY }
			],
			// Thumb arc -> Index bridge
			[
				{ x: 0.25, y: 0.42 },
				{ x: 0.32, y: 0.38 },
				{ x: 0.38, y: 0.37 },
				{ x: 0.42, y: 0.44 },
				{ x: touchNormX, y: touchNormY }
			],
			// Middle finger digital branch
			[
				{ x: 0.34, y: 0.52 },
				{ x: 0.42, y: 0.55 },
				{ x: 0.48, y: 0.54 },
				{ x: 0.52, y: 0.53 }
			],
			// Lower Palm Constellation
			[
				{ x: 0.22, y: 0.58 },
				{ x: 0.32, y: 0.62 },
				{ x: 0.40, y: 0.62 },
				{ x: 0.44, y: 0.65 }
			]
		];

		// Traveling synaptic photon pulses
		interface NeuralPulse {
			pathIndex: number;
			progress: number;
			speed: number;
			size: number;
			color: string;
		}

		const pulses: NeuralPulse[] = [];
		const pulseColors = ['#00F0FF', '#24D7FF', '#1687FF', '#FFB800'];
		for (let i = 0; i < 24; i++) {
			pulses.push({
				pathIndex: Math.floor(Math.random() * aiPathways.length),
				progress: Math.random(),
				speed: 0.004 + Math.random() * 0.007,
				size: 1.2 + Math.random() * 1.6,
				color: pulseColors[Math.floor(Math.random() * pulseColors.length)]
			});
		}

		// Expanding touch singularity shockwaves
		interface Ripple {
			radius: number;
			maxRadius: number;
			alpha: number;
			speed: number;
			color: string;
		}

		const ripples: Ripple[] = [];
		let rippleTimer = 0;

		function spawnRipple() {
			ripples.push({
				radius: 4,
				maxRadius: 75 + Math.random() * 30,
				alpha: 0.85,
				speed: 1.2 + Math.random() * 0.8,
				color: Math.random() > 0.4 ? '#00F0FF' : '#FFB800'
			});
		}

		// Floating stardust & neural sparks
		interface SparkParticle {
			x: number;
			y: number;
			vx: number;
			vy: number;
			size: number;
			alpha: number;
			color: string;
			life: number;
			maxLife: number;
		}

		const sparks: SparkParticle[] = [];

		function spawnSparkAtTouch(tx: number, ty: number) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 0.5 + Math.random() * 2.2;
			sparks.push({
				x: tx,
				y: ty,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				size: 0.8 + Math.random() * 1.6,
				alpha: 1.0,
				color: Math.random() > 0.35 ? '#00F0FF' : '#FFFFFF',
				life: 0,
				maxLife: 35 + Math.random() * 25
			});
		}

		// Draw a jagged electric arc between two points
		function drawLightning(
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			segments: number,
			displacement: number,
			color: string,
			widthPx: number
		) {
			if (!ctx) return;
			ctx.beginPath();
			ctx.moveTo(x1, y1);

			for (let i = 1; i < segments; i++) {
				const frac = i / segments;
				const curX = x1 + (x2 - x1) * frac;
				const curY = y1 + (y2 - y1) * frac;
				const normalX = -(y2 - y1) / Math.hypot(x2 - x1, y2 - y1 || 1);
				const normalY = (x2 - x1) / Math.hypot(x2 - x1, y2 - y1 || 1);
				const offset = (Math.random() - 0.5) * displacement;

				ctx.lineTo(curX + normalX * offset, curY + normalY * offset);
			}

			ctx.lineTo(x2, y2);
			ctx.strokeStyle = color;
			ctx.lineWidth = widthPx;
			ctx.shadowColor = color;
			ctx.shadowBlur = 8;
			ctx.stroke();
			ctx.shadowBlur = 0;
		}

		function draw() {
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);
			t += 0.02;

			// Smooth 3D tilt
			tiltX += (targetTiltX - tiltX) * 0.08;
			tiltY += (targetTiltY - tiltY) * 0.08;

			const touchX = touchNormX * width;
			const touchY = touchNormY * height;

			// Cursor interaction boost
			const distToTouch = Math.hypot(mousePos.x - touchX, mousePos.y - touchY);
			const mouseNearBoost = isHovered ? Math.max(0, 1 - distToTouch / (width * 0.45)) : 0;
			sparkIntensity = 1 + mouseNearBoost * 1.5;

			// ── 1. Synaptic Pulses Traveling through AI Hand Wireframes ──
			pulses.forEach((p) => {
				const path = aiPathways[p.pathIndex];
				p.progress += p.speed * (1 + mouseNearBoost * 0.8);

				if (p.progress >= 1.0) {
					p.progress = 0;
					p.pathIndex = Math.floor(Math.random() * aiPathways.length);
					// When pulse arrives at touch point, spark!
					if (p.pathIndex <= 2) {
						for (let s = 0; s < 3; s++) spawnSparkAtTouch(touchX, touchY);
					}
				}

				// Interpolate along path waypoints
				const segCount = path.length - 1;
				const scaledProgress = p.progress * segCount;
				const segIdx = Math.min(Math.floor(scaledProgress), segCount - 1);
				const segFrac = scaledProgress - segIdx;

				const p1 = path[segIdx];
				const p2 = path[segIdx + 1];
				const px = (p1.x + (p2.x - p1.x) * segFrac) * width;
				const py = (p1.y + (p2.y - p1.y) * segFrac) * height;

				ctx.beginPath();
				ctx.arc(px, py, p.size, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.shadowColor = p.color;
				ctx.shadowBlur = 8;
				ctx.fill();
				ctx.shadowBlur = 0;
			});

			// ── 2. Periodic Shockwave Ripples Expanding from Touch Point ──
			rippleTimer++;
			if (rippleTimer % 45 === 0) {
				spawnRipple();
			}

			for (let i = ripples.length - 1; i >= 0; i--) {
				const r = ripples[i];
				r.radius += r.speed;
				r.alpha -= 0.016;

				if (r.alpha <= 0 || r.radius >= r.maxRadius) {
					ripples.splice(i, 1);
					continue;
				}

				ctx.beginPath();
				ctx.arc(touchX, touchY, r.radius, 0, Math.PI * 2);
				ctx.strokeStyle = r.color;
				ctx.lineWidth = 1.2;
				ctx.globalAlpha = r.alpha;
				ctx.shadowColor = r.color;
				ctx.shadowBlur = 10;
				ctx.stroke();
				ctx.globalAlpha = 1;
				ctx.shadowBlur = 0;
			}

			// ── 3. Touch Point Crackling Lightning Arcs ──
			// Electric micro-arcs connecting the human and AI fingertips
			const arcCount = isHovered ? 4 : 2;
			for (let a = 0; a < arcCount; a++) {
				const xOffsetLeft = -12 - Math.random() * 8;
				const yOffsetLeft = (Math.random() - 0.5) * 8;
				const xOffsetRight = 10 + Math.random() * 8;
				const yOffsetRight = (Math.random() - 0.5) * 8;

				drawLightning(
					touchX + xOffsetLeft,
					touchY + yOffsetLeft,
					touchX + xOffsetRight,
					touchY + yOffsetRight,
					5,
					6,
					Math.random() > 0.5 ? '#00F0FF' : '#FFFFFF',
					0.8 + Math.random() * 0.6
				);
			}

			// If cursor is active and nearby, draw interactive lightning filament towards cursor
			if (isHovered && mouseNearBoost > 0.2) {
				drawLightning(
					touchX,
					touchY,
					mousePos.x,
					mousePos.y,
					8,
					14,
					'#00F0FF',
					1.1
				);
			}

			// ── 4. The Luminous Touch Point Core (The Spark of Creation) ──
			const corePulse = 1 + Math.sin(t * 5) * 0.25;
			const coreRadius = (6 + mouseNearBoost * 4) * corePulse;

			// Outer cyan halo
			const sparkGlow = ctx.createRadialGradient(touchX, touchY, 0, touchX, touchY, coreRadius * 4.5);
			sparkGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
			sparkGlow.addColorStop(0.25, 'rgba(0, 240, 255, 0.7)');
			sparkGlow.addColorStop(0.65, 'rgba(22, 135, 255, 0.2)');
			sparkGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = sparkGlow;
			ctx.beginPath();
			ctx.arc(touchX, touchY, coreRadius * 4.5, 0, Math.PI * 2);
			ctx.fill();

			// Brilliant incandescent core
			ctx.beginPath();
			ctx.arc(touchX, touchY, coreRadius * 0.6, 0, Math.PI * 2);
			ctx.fillStyle = '#FFFFFF';
			ctx.shadowColor = '#00F0FF';
			ctx.shadowBlur = 18;
			ctx.fill();
			ctx.shadowBlur = 0;

			// ── 5. Flying Micro-Sparks ──
			if (Math.random() < 0.6) {
				spawnSparkAtTouch(touchX, touchY);
			}

			for (let i = sparks.length - 1; i >= 0; i--) {
				const sp = sparks[i];
				sp.life++;
				sp.x += sp.vx;
				sp.y += sp.vy;
				sp.vx *= 0.96;
				sp.vy *= 0.96;
				sp.alpha = Math.max(0, 1 - sp.life / sp.maxLife);

				if (sp.life >= sp.maxLife) {
					sparks.splice(i, 1);
					continue;
				}

				ctx.beginPath();
				ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
				ctx.fillStyle = sp.color;
				ctx.globalAlpha = sp.alpha;
				ctx.shadowColor = sp.color;
				ctx.shadowBlur = 6;
				ctx.fill();
				ctx.globalAlpha = 1;
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

<div class="relative w-full overflow-hidden rounded-2xl border border-white/[0.10] bg-[#020205] shadow-[0_20px_70px_rgba(0,0,0,0.95)]">
	<!-- Specular Top Glass Sheen -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.06] via-white/[0.01] to-transparent z-10"
		aria-hidden="true"
	></div>

	<!-- Corner Tech Optical Brackets -->
	<div class="pointer-events-none absolute top-3 left-3 size-4 border-t-2 border-l-2 border-white/20 z-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute top-3 right-3 size-4 border-t-2 border-r-2 border-white/20 z-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-white/20 z-20" aria-hidden="true"></div>
	<div class="pointer-events-none absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-white/20 z-20" aria-hidden="true"></div>

	<!-- ── Top HUD Telemetry Bar ── -->
	<div class="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-black/65 px-6 py-3.5 font-mono text-[11px] backdrop-blur-xl">
		<div class="flex items-center gap-2.5">
			<span class="size-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_#00F0FF]"></span>
			<span class="text-white font-medium tracking-wider">NEURAL_SYNTHESIS // HUMAN COGNITION &amp; PRACTICAL AI</span>
		</div>

		<div class="flex items-center gap-6 text-fg-3">
			<span class="hidden sm:inline">SYNAPSE STATE: <strong class="text-white">ACTIVE COUPLING</strong></span>
			<span class="text-sig-gold font-medium tracking-widest">FROM SIGNAL TO SYSTEM</span>
		</div>
	</div>

	<!-- ── Interactive 3D Neural Hands Viewport ── -->
	<div
		bind:this={container}
		class="relative h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] w-full overflow-hidden flex items-center justify-center p-2 sm:p-4 cursor-crosshair select-none bg-[#000000]"
		style="perspective: 1200px;"
	>
		<!-- Ambient Bioluminescent Nebula Background Behind Touch Point -->
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center blur-[90px] opacity-25"
			style="background: radial-gradient(circle at 50% 52%, #00F0FF 0%, #1687FF 35%, transparent 70%);"
			aria-hidden="true"
		></div>

		<!-- 3D Tilting Frame with Aspect Ratio Locked to hand.jpg (1199/757) -->
		<div
			class="relative h-full aspect-[1199/757] max-w-full flex items-center justify-center transition-transform duration-200 ease-out"
			style="transform: rotateX({tiltX}deg) rotateY({tiltY}deg) scale3d({isHovered ? 1.02 : 1}, {isHovered ? 1.02 : 1}, 1); transform-style: preserve-3d;"
		>
			<!-- The Hand Artwork: High-Res Seamless Screen Blend (Zero Rectangular Box, Zero Edges) -->
			<img
				src="/hand.jpg"
				alt="Human Intuition Meets Artificial Intelligence"
				class="h-full w-full object-contain pointer-events-none select-none mix-blend-screen"
				style="mask-image: radial-gradient(ellipse 85% 82% at 50% 50%, #000 35%, rgba(0,0,0,0.85) 60%, transparent 92%); -webkit-mask-image: radial-gradient(ellipse 85% 82% at 50% 50%, #000 35%, rgba(0,0,0,0.85) 60%, transparent 92%); filter: contrast(1.15) brightness(1.05); transform: translateZ(0px);"
			/>

			<!-- Live Synaptic Particle & Crackling Lightning Arc Canvas (1:1 Exact Overlay) -->
			<canvas
				bind:this={canvas}
				class="absolute inset-0 h-full w-full pointer-events-none"
				style="transform: translateZ(20px);"
				aria-hidden="true"
			></canvas>
		</div>

		<!-- Floating Telemetry Indicator -->
		<div class="pointer-events-none absolute bottom-4 left-6 hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider backdrop-blur-md bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
			<Zap size={11} class="text-[#00F0FF] animate-pulse" />
			<span>Spark of Synthesis · Move cursor to modulate neural resonance</span>
		</div>
	</div>
</div>
