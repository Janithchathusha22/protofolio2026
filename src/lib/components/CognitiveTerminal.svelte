<script lang="ts">
	import { onMount, tick } from 'svelte';
	import {
		Bot,
		Send,
		Sparkles,
		Zap,
		RotateCw,
		Copy,
		Check,
		ArrowUpRight,
		Mail,
		User,
		MessageSquare,
		CheckCircle2,
		MessageCircle
	} from '@lucide/svelte';
	import { profile } from '../data/portfolio';

	// ──────────────── Chat Message State ────────────────
	interface Message {
		id: string;
		role: 'user' | 'assistant';
		content: string;
		timestamp: string;
	}

	let isGenerating = $state(false);
	let inputMessage = $state('');
	let copiedEmail = $state(false);
	let copiedMsgId = $state<string | null>(null);

	// First-person welcome message without raw asterisks
	let messages = $state<Message[]>([
		{
			id: 'welcome',
			role: 'assistant',
			content:
				"Hello! I am Janith Chathusha.\n\nWelcome to my portfolio. I specialize in Full-Stack Engineering, Agentic AI Architectures (LangGraph, CrewAI), and Scalable Distributed Systems. Whether you have questions regarding my production experience, systems architecture, my research project NewsShield XAI, or custom engineering solutions — feel free to ask me anything in English or සිංහල.\n\nHow can I help you today?",
			timestamp: 'Just now'
		}
	]);

	// Professional suggestion prompts (1st person oriented from visitor to Janith)
	const suggestions = [
		{ label: 'Core Tech Stack ⚡', prompt: 'What is your core tech stack and specialized engineering toolchain?' },
		{ label: 'NewsShield XAI 🧠', prompt: 'Tell me about your NewsShield Explainable AI research project and its 96% accuracy.' },
		{ label: 'Industry Experience 💼', prompt: 'Can you summarize your industry experience at Absol X, Inplay Matrix, and Bank of Ceylon?' },
		{ label: 'Backend Architecture 🚀', prompt: 'How do you design scalable backends with Spring Boot, FastAPI, and Node.js?' },
		{ label: 'ඔබේ Experience එක? 🇱🇰', prompt: 'ඔබගේ Software Engineering සහ AI ක්ෂේත්‍රයේ අත්දැකීම් ගැන කෙටියෙන් විස්තර කරන්න.' }
	];

	// ──────────────── Contact Form State ────────────────
	let formName = $state('');
	let formEmail = $state('');
	let formSubject = $state('Full-Time Engineering Opportunity');
	let formMessage = $state('');
	let formStatus = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let formStatusMessage = $state('');

	// References
	let headContainer = $state<HTMLButtonElement>();
	let canvas = $state<HTMLCanvasElement>();
	let chatScrollContainer = $state<HTMLDivElement>();

	// 3D Parallax Tilt
	let tiltX = $state(0);
	let tiltY = $state(0);
	let targetTiltX = 0;
	let targetTiltY = 0;
	let isHoveringHead = $state(false);

	// Direct Groq fallback credentials if local server is bypassed
	const GROQ_FALLBACK_KEY = (import.meta as any).env?.VITE_GROQ_API_KEY || '';
	const GROQ_FALLBACK_MODEL = 'openai/gpt-oss-120b';

	// ──────────────── Rich Markdown Formatter (Stripping raw asterisks cleanly) ────────────────
	function renderFormattedContent(text: string): string {
		if (!text) return '';

		// 1. Escape HTML special characters
		let s = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');

		// 2. Fenced Code Blocks ```code```
		s = s.replace(/```(?:[a-zA-Z]*\n)?([\s\S]*?)```/g, (_m, code) => {
			return `<pre class="my-2.5 overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-3 font-mono text-[11px] text-sig-cyan"><code>${code.trim()}</code></pre>`;
		});

		// 3. Inline code `code`
		s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-sig-cyan">$1</code>');

		// 4. Bold **text** or __text__
		s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-medium text-white">$1</strong>');
		s = s.replace(/__([^_]+)__/g, '<strong class="font-medium text-white">$1</strong>');

		// 5. Italic *text* or _text_
		s = s.replace(/\*([^*]+)\*/g, '<em class="text-fg-2 italic">$1</em>');
		s = s.replace(/_([^_]+)_/g, '<em class="text-fg-2 italic">$1</em>');

		// 6. Clean any remaining stray asterisks
		s = s.replace(/\*/g, '');

		// 7. Bullet lists (- or • or * at line start)
		const lines = s.split('\n');
		let inList = false;
		const formatted: string[] = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();

			if (/^[-•]\s+(.*)/.test(trimmed)) {
				const item = trimmed.replace(/^[-•]\s+/, '');
				if (!inList) {
					inList = true;
					formatted.push('<ul class="my-2 space-y-1.5">');
				}
				formatted.push(`<li class="flex items-start gap-2.5 text-fg-2"><span class="size-1.5 rounded-full bg-sig-gold mt-1.5 shrink-0"></span><span>${item}</span></li>`);
			} else {
				if (inList) {
					inList = false;
					formatted.push('</ul>');
				}
				if (trimmed) {
					formatted.push(`<p class="my-1.5 leading-relaxed text-fg-2">${line}</p>`);
				} else {
					formatted.push('<div class="h-1"></div>');
				}
			}
		}
		if (inList) formatted.push('</ul>');

		return formatted.join('');
	}

	// ──────────────── Groq Streaming Chat Handler ────────────────
	async function sendMessage(textToSend?: string) {
		const text = (textToSend ?? inputMessage).trim();
		if (!text || isGenerating) return;

		inputMessage = '';
		const userMsgId = 'u_' + Date.now();
		const assistantMsgId = 'a_' + Date.now();
		const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

		// Append user message
		messages = [
			...messages,
			{ id: userMsgId, role: 'user', content: text, timestamp: nowTime },
			{ id: assistantMsgId, role: 'assistant', content: '', timestamp: nowTime }
		];

		isGenerating = true;
		await scrollToBottom();

		// Trigger instant high-energy synaptic spark on head
		triggerSynapseBurst(8);

		try {
			// Convert conversation to OpenAI message format
			const payloadMessages = messages
				.filter((m) => m.id !== assistantMsgId)
				.map((m) => ({ role: m.role, content: m.content }));

			let response: Response;

			// Step 1: Try local SvelteKit server endpoint
			try {
				response = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: payloadMessages })
				});

				if (!response.ok && response.status === 404) {
					throw new Error('FallbackToGroqDirect');
				}
			} catch (err: any) {
				// Step 2: Fallback directly to Groq API client
				response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${GROQ_FALLBACK_KEY}`,
						'User-Agent': 'Mozilla/5.0'
					},
					body: JSON.stringify({
						model: GROQ_FALLBACK_MODEL,
						messages: [
							{
								role: 'system',
								content: `You are Janith Chathusha (ජනිත් චතුෂ) speaking directly in the FIRST PERSON ("I", "my", "මම", "මගේ"). You are NOT a third-party bot or assistant talking about Janith; YOU ARE JANITH HIMSELF speaking directly with the visitor.
Associate Software Engineer at Absol X (Agentic AI with LangGraph/CrewAI, React, Node, Python), former Associate Data Analyst at Inplay Matrix (time-series forecasting, sports feeds, SQL), Software Engineer at Nextzela (RESTful APIs, MongoDB), and Trainee Developer at Bank of Ceylon (React Native loan calculator). SLIIT B.Sc (Hons) IT graduate (2020-2024).
Featured projects: NewsShield (96% accuracy Bi-LSTM + LIME explainable AI), IoT produce freshness monitoring (C++ firmware, MQ sensors), MediPulse (Llama 3 via Groq + Gemini healthcare assistant).
WhatsApp: +94 783356601 (0783356601) | Email: chathushadayawansha1346@gmail.com.
Always speak in the FIRST PERSON. Answer ANY question logically, intellectually, and accurately with clear step-by-step reasoning. Respond in Sinhala if the user speaks Sinhala or Singlish, and English if in English. Never output raw markdown asterisks or messy syntax.`
							},
							...payloadMessages
						],
						temperature: 0.8,
						max_completion_tokens: 1200,
						top_p: 0.95,
						stream: true
					})
				});
			}

			if (!response.ok) {
				throw new Error(`Failed to establish connection: ${response.statusText}`);
			}

			// Stream reading
			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let accumulated = '';

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });

					if (chunk.includes('data: ')) {
						const lines = chunk.split('\n');
						for (const line of lines) {
							const trimmed = line.trim();
							if (!trimmed || trimmed === 'data: [DONE]') continue;
							if (trimmed.startsWith('data: ')) {
								try {
									const json = JSON.parse(trimmed.slice(6));
									const token = json.choices?.[0]?.delta?.content;
									if (token) {
										accumulated += token;
										updateLastMessage(assistantMsgId, accumulated);
										triggerSynapseBurst(1);
									}
								} catch {}
							}
						}
					} else {
						// Raw plain text stream from server
						accumulated += chunk;
						updateLastMessage(assistantMsgId, accumulated);
						triggerSynapseBurst(1);
					}

					await scrollToBottom();
				}
			}
		} catch (error: any) {
			console.error('Chat error:', error);
			updateLastMessage(
				assistantMsgId,
				"Unable to establish connection to neural core at this moment. Please reach out to me directly on WhatsApp at +94 783356601 or via email at chathushadayawansha1346@gmail.com below."
			);
		} finally {
			isGenerating = false;
			await scrollToBottom();
		}
	}

	function updateLastMessage(id: string, content: string) {
		messages = messages.map((m) => (m.id === id ? { ...m, content } : m));
	}

	async function scrollToBottom() {
		await tick();
		if (chatScrollContainer) {
			chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
		}
	}

	function resetChat() {
		messages = [
			{
				id: 'welcome_reset_' + Date.now(),
				role: 'assistant',
				content:
					"Conversation reset. Feel free to ask me anything about my full-stack engineering work, systems architecture, or AI research in English or සිංහල!",
				timestamp: 'Just now'
			}
		];
	}

	async function copyMessage(text: string, id: string) {
		try {
			await navigator.clipboard.writeText(text);
			copiedMsgId = id;
			setTimeout(() => (copiedMsgId = null), 2000);
		} catch {}
	}

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(profile.email);
			copiedEmail = true;
			setTimeout(() => (copiedEmail = false), 2200);
		} catch {}
	}

	// ──────────────── Contact Form Submission (EmailJS + Direct Mailto Fallback) ────────────────
	async function handleContactSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!formName || !formEmail || !formMessage) return;

		formStatus = 'sending';

		const serviceId = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID || 'service_8jg7egt';
		const templateId = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID || 'template_9xgt0tf';
		const publicKey = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY || 'POPj6AEBWitg2GNn7';

		const subject = encodeURIComponent(`[Portfolio Transmission] ${formSubject} - ${formName}`);
		const body = encodeURIComponent(
			`Name: ${formName}\nEmail: ${formEmail}\nPurpose: ${formSubject}\n\nMessage:\n${formMessage}`
		);
		const mailtoUrl = `mailto:${profile.email}?subject=${subject}&body=${body}`;

		if (serviceId && templateId) {
			try {
				const emailjs = await import('@emailjs/browser');
				const res = await emailjs.default.send(
					serviceId,
					templateId,
					{
						// Full Name parameter variants for EmailJS templates
						full_name: formName,
						fullName: formName,
						user_name: formName,
						userName: formName,
						from_name: formName,
						name: formName,
						your_name: formName,
						sender_name: formName,
						client_name: formName,
						contact_name: formName,

						// Email parameter variants
						from_email: formEmail,
						email: formEmail,
						user_email: formEmail,
						reply_to: formEmail,

						// Subject parameter variants
						subject: formSubject,
						title: formSubject,
						purpose: formSubject,

						// Message parameter variants
						message: formMessage,
						content: formMessage,

						// Recipient info
						to_name: 'Janith Chathusha',
						to_email: profile.email
					},
					publicKey
				);

				if (res.status === 200) {
					formStatus = 'sent';
					formStatusMessage = 'Transmission successfully delivered directly to Janith Chathusha\'s inbox!';
					formName = '';
					formEmail = '';
					formMessage = '';
					return;
				}
			} catch (err) {
				console.warn('EmailJS direct send error, falling back to mail client:', err);
			}
		}

		// Fallback only if EmailJS fails
		formStatus = 'sent';
		formStatusMessage = 'Opening default mail application to guarantee direct delivery...';

		setTimeout(() => {
			window.location.href = mailtoUrl;
		}, 400);
	}

	// ──────────────── Golden Brain Synaptic Sparks & Lightning Engine ────────────────
	interface Spark {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
		color: string;
	}

	interface Shockwave {
		x: number;
		y: number;
		radius: number;
		maxRadius: number;
		alpha: number;
		color: string;
	}

	let sparks: Spark[] = [];
	let shockwaves: Shockwave[] = [];
	let lightningBurstRequest = 0;

	function triggerSynapseBurst(count: number = 5) {
		lightningBurstRequest += count;
	}

	// 3D Parallax Mouse Handlers
	function handleMouseMove(e: MouseEvent) {
		if (!headContainer) return;
		const rect = headContainer.getBoundingClientRect();
		const relX = (e.clientX - rect.left) / rect.width - 0.5;
		const relY = (e.clientY - rect.top) / rect.height - 0.5;
		targetTiltY = relX * 14;
		targetTiltX = -relY * 10;
		isHoveringHead = true;
	}

	function handleMouseLeave() {
		targetTiltX = 0;
		targetTiltY = 0;
		isHoveringHead = false;
	}

	function handleHeadClick(e: MouseEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const clickY = e.clientY - rect.top;

		shockwaves.push({
			x: clickX,
			y: clickY,
			radius: 8,
			maxRadius: 130,
			alpha: 1,
			color: 'rgba(255, 190, 40, 0.9)'
		});

		triggerSynapseBurst(12);
	}

	onMount(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animId = 0;
		let width = 0;
		let height = 0;
		let dpr = 1;
		let time = 0;

		const resize = () => {
			if (!canvas || !headContainer) return;
			width = headContainer.clientWidth || 340;
			height = headContainer.clientHeight || 520;
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
		};

		resize();
		window.addEventListener('resize', resize);

		function drawLightningBranch(
			startX: number,
			startY: number,
			endX: number,
			endY: number,
			iterations: number,
			jitter: number,
			coreColor: string,
			glowColor: string
		) {
			if (!ctx) return;
			const points = [{ x: startX, y: startY }, { x: endX, y: endY }];

			for (let i = 0; i < iterations; i++) {
				const currentLen = points.length;
				for (let j = currentLen - 1; j > 0; j--) {
					const p1 = points[j - 1];
					const p2 = points[j];
					const midX = (p1.x + p2.x) / 2;
					const midY = (p1.y + p2.y) / 2;
					const offset = (Math.random() - 0.5) * jitter;
					points.splice(j, 0, { x: midX + offset, y: midY + offset });
				}
				jitter *= 0.55;
			}

			ctx.beginPath();
			ctx.moveTo(points[0].x, points[0].y);
			for (let i = 1; i < points.length; i++) {
				ctx.lineTo(points[i].x, points[i].y);
			}
			ctx.shadowBlur = 14;
			ctx.shadowColor = glowColor;
			ctx.strokeStyle = glowColor;
			ctx.lineWidth = 2.4;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(points[0].x, points[0].y);
			for (let i = 1; i < points.length; i++) {
				ctx.lineTo(points[i].x, points[i].y);
			}
			ctx.shadowBlur = 4;
			ctx.shadowColor = coreColor;
			ctx.strokeStyle = coreColor;
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.shadowBlur = 0;
		}

		const render = () => {
			time += 0.03;

			tiltX += (targetTiltX - tiltX) * 0.08;
			tiltY += (targetTiltY - tiltY) * 0.08;

			ctx.save();
			ctx.scale(dpr, dpr);
			ctx.clearRect(0, 0, width, height);

			const brainX = width * 0.5;
			const brainY = height * 0.34;
			const brainRx = width * 0.22;
			const brainRy = height * 0.15;

			// 1. Ambient / Active Bioluminescent Brain Glow
			const glowIntensity = isGenerating ? 0.65 + Math.sin(time * 8) * 0.25 : 0.22 + Math.sin(time * 2) * 0.08;
			const radialGlow = ctx.createRadialGradient(brainX, brainY, 4, brainX, brainY, brainRx * 1.5);
			radialGlow.addColorStop(0, `rgba(255, 195, 45, ${glowIntensity})`);
			radialGlow.addColorStop(0.4, `rgba(234, 150, 20, ${glowIntensity * 0.6})`);
			radialGlow.addColorStop(0.8, `rgba(36, 215, 255, ${glowIntensity * 0.2})`);
			radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

			ctx.fillStyle = radialGlow;
			ctx.beginPath();
			ctx.ellipse(brainX, brainY, brainRx * 1.5, brainRy * 1.6, 0, 0, Math.PI * 2);
			ctx.fill();

			// 2. Synaptic Sparks
			const spawnChance = isGenerating ? 0.95 : isHoveringHead ? 0.45 : 0.2;
			if (Math.random() < spawnChance) {
				const angle = Math.random() * Math.PI * 2;
				const r = Math.random() * 0.85;
				const spX = brainX + Math.cos(angle) * brainRx * r;
				const spY = brainY + Math.sin(angle) * brainRy * r;

				const colors = isGenerating
					? ['#FFF8D6', '#FFB800', '#FFA000', '#24D7FF', '#FFFFFF']
					: ['#FFC837', '#FFA000', '#FFD700', 'rgba(255, 220, 100, 0.8)'];

				sparks.push({
					x: spX,
					y: spY,
					vx: (Math.random() - 0.5) * (isGenerating ? 3.5 : 1.2),
					vy: (Math.random() - 0.6) * (isGenerating ? 4 : 1.5) - 0.5,
					life: 1,
					maxLife: Math.random() * 25 + (isGenerating ? 20 : 35),
					size: Math.random() * (isGenerating ? 3 : 1.8) + 0.8,
					color: colors[Math.floor(Math.random() * colors.length)]
				});
			}

			for (let i = sparks.length - 1; i >= 0; i--) {
				const s = sparks[i];
				s.x += s.vx;
				s.y += s.vy;
				s.vy += 0.02;
				s.life -= 1 / s.maxLife;

				if (s.life <= 0) {
					sparks.splice(i, 1);
					continue;
				}

				ctx.beginPath();
				ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
				ctx.shadowBlur = isGenerating ? 8 : 4;
				ctx.shadowColor = s.color;
				ctx.fillStyle = s.color;
				ctx.globalAlpha = s.life;
				ctx.fill();
				ctx.globalAlpha = 1;
				ctx.shadowBlur = 0;
			}

			// 3. Synaptic Lightning Arcs Across Marked Golden Brain
			const lightningArcsCount = isGenerating ? Math.floor(Math.random() * 4) + 3 : lightningBurstRequest > 0 ? 3 : Math.random() < 0.12 ? 1 : 0;

			if (lightningBurstRequest > 0) lightningBurstRequest--;

			for (let k = 0; k < lightningArcsCount; k++) {
				const a1 = Math.random() * Math.PI * 2;
				const r1 = Math.random() * 0.75;
				const p1X = brainX + Math.cos(a1) * brainRx * r1;
				const p1Y = brainY + Math.sin(a1) * brainRy * r1;

				const a2 = a1 + (Math.random() * 2 - 1) * Math.PI * 0.8;
				const r2 = Math.random() * 0.85;
				const p2X = brainX + Math.cos(a2) * brainRx * r2;
				const p2Y = brainY + Math.sin(a2) * brainRy * r2;

				const isGold = Math.random() > 0.25;
				const glow = isGold ? 'rgba(255, 184, 0, 0.85)' : 'rgba(36, 215, 255, 0.9)';
				const core = isGold ? '#FFF9E6' : '#E0FAFF';

				drawLightningBranch(p1X, p1Y, p2X, p2Y, 3, isGenerating ? 14 : 8, core, glow);
			}

			// 4. Shockwave Expansion Rings
			for (let j = shockwaves.length - 1; j >= 0; j--) {
				const sw = shockwaves[j];
				sw.radius += (sw.maxRadius - sw.radius) * 0.12;
				sw.alpha *= 0.92;

				if (sw.alpha <= 0.02) {
					shockwaves.splice(j, 1);
					continue;
				}

				ctx.beginPath();
				ctx.ellipse(sw.x, sw.y, sw.radius, sw.radius * 0.65, 0, 0, Math.PI * 2);
				ctx.strokeStyle = sw.color;
				ctx.lineWidth = 2 * sw.alpha;
				ctx.shadowBlur = 10;
				ctx.shadowColor = sw.color;
				ctx.globalAlpha = sw.alpha;
				ctx.stroke();
				ctx.globalAlpha = 1;
				ctx.shadowBlur = 0;
			}

			if (!isGenerating && Math.random() < 0.015) {
				shockwaves.push({
					x: brainX,
					y: brainY,
					radius: 10,
					maxRadius: brainRx * 1.2,
					alpha: 0.5,
					color: 'rgba(255, 195, 45, 0.6)'
				});
			}

			ctx.restore();
			animId = requestAnimationFrame(render);
		};

		render();

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animId);
		};
	});
</script>

<div class="relative w-full rounded-3xl border border-white/10 bg-[#060608]/90 p-5 md:p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.85)]">
	<!-- Atmospheric Ambient Glow -->
	<div
		class="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-sig-gold/[0.08] blur-[100px]"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-sig-cyan/[0.06] blur-[100px]"
		aria-hidden="true"
	></div>

	<!-- ──────── Top Row: Interactive 3D Holographic Head + Executive AI Terminal ──────── -->
	<div class="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
		<!-- ── Left: Borderless Free-Floating 3D Crystal Mind (NO BOX / NO FRAME) ── -->
		<div class="flex flex-col items-center justify-center lg:col-span-5">
			<button
				type="button"
				bind:this={headContainer}
				onmousemove={handleMouseMove}
				onmouseleave={handleMouseLeave}
				onclick={handleHeadClick}
				aria-label="Interactive 3D Holographic Neural Interface - Click to stimulate synapses"
				class="group relative flex w-full max-w-[340px] cursor-pointer flex-col items-center justify-center select-none transition-all duration-300 focus:outline-none"
				style="perspective: 1200px;"
			>
				<!-- Volumetric Golden and Cyan Back-Aura (Floating behind head, NO CARD) -->
				<div
					class="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sig-gold blur-[80px] transition-all duration-700 {isGenerating
						? 'size-72 opacity-40'
						: 'size-52 opacity-20'}"
				></div>
				<div
					class="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sig-cyan blur-[100px] transition-all duration-700 {isGenerating
						? 'size-80 opacity-25'
						: 'size-60 opacity-10'}"
				></div>

				<!-- 3D Perspective Tilt Wrapper -->
				<div
					class="relative flex w-full items-center justify-center transition-transform duration-150 ease-out"
					style="transform: rotateX({tiltX}deg) rotateY({tiltY}deg) scale3d({isHoveringHead
						? 1.03
						: 1}, {isHoveringHead ? 1.03 : 1}, 1);"
				>
					<!-- The Crystal Mannequin Head with ZERO box border and feathered mask -->
					<div class="relative w-full flex items-center justify-center">
						<img
							src="/rtu.jpg"
							alt="Janith Chathusha 3D Holographic Mind"
							class="h-auto w-full max-w-[310px] object-contain transition-all duration-500 {isGenerating
								? 'brightness-110 drop-shadow-[0_0_40px_rgba(255,184,0,0.5)]'
								: 'drop-shadow-[0_0_25px_rgba(255,184,0,0.2)]'}"
							style="
								mix-blend-mode: screen;
								mask-image: radial-gradient(ellipse 65% 78% at 50% 45%, black 35%, rgba(0,0,0,0.7) 60%, transparent 92%);
								-webkit-mask-image: radial-gradient(ellipse 65% 78% at 50% 45%, black 35%, rgba(0,0,0,0.7) 60%, transparent 92%);
							"
						/>

						<!-- Live Synaptic Spark Canvas Layer aligned precisely with the cerebral cortex -->
						<canvas
							bind:this={canvas}
							class="pointer-events-none absolute inset-0 size-full"
							style="mix-blend-mode: screen;"
						></canvas>
					</div>
				</div>

				<!-- Clean Typographic Caption (No box framing) -->
				<div class="mt-4 text-center">
					<div class="inline-flex items-center gap-2 rounded-full border border-sig-gold/25 bg-sig-gold/[0.06] px-3.5 py-1 backdrop-blur-md">
						<Zap size={11} class={isGenerating ? 'animate-bounce text-amber-300' : 'text-sig-gold'} />
						<span class="font-mono text-[10px] uppercase tracking-wider text-sig-gold font-medium">
							{isGenerating ? 'Synaptic Transmission Active' : 'Digital Neural Presence'}
						</span>
					</div>
					<p class="font-mono text-[10px] text-fg-3 mt-1.5">
						Parallax 3D · Click head to stimulate synapses
					</p>
				</div>
			</button>
		</div>

		<!-- ── Right: Janith Executive AI Chatbot (First Person, High Intellect, Clean Output) ── -->
		<div class="flex flex-col lg:col-span-7">
			<div
				class="flex h-[560px] flex-col rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-inner"
			>
				<!-- Terminal Control Bar -->
				<div class="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
					<div class="flex items-center gap-2.5">
						<div class="flex size-7 items-center justify-center rounded-lg border border-sig-gold/40 bg-sig-gold/10 text-sig-gold">
							<Bot size={15} />
						</div>
						<div>
							<div class="flex items-center gap-2">
								<span class="font-mono text-xs font-medium text-white">Janith Chathusha</span>
								<span class="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
									ONLINE
								</span>
							</div>
							<p class="font-mono text-[10px] text-fg-3">
								Associate Software Engineer @ Absol X · Full-Stack &amp; AI
							</p>
						</div>
					</div>

					<button
						type="button"
						onclick={resetChat}
						title="Reset Conversation"
						class="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-[10px] text-fg-3 transition-colors hover:border-white/20 hover:text-white"
					>
						<RotateCw size={11} />
						<span>Reset</span>
					</button>
				</div>

				<!-- Chat Messages Viewport -->
				<div
					bind:this={chatScrollContainer}
					class="flex-1 space-y-4 overflow-y-auto p-4 md:p-5 font-sans text-xs md:text-[13px] leading-relaxed scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
				>
					{#each messages as msg (msg.id)}
						<div class="flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'}">
							<div class="flex items-center gap-2 text-[10px] font-mono text-fg-3 mb-1">
								<span>{msg.role === 'user' ? 'You' : 'Janith Chathusha'}</span>
								<span>·</span>
								<span>{msg.timestamp}</span>
							</div>

							<div
								class="relative max-w-[92%] rounded-2xl p-4 leading-relaxed backdrop-blur-md transition-all {msg.role ===
								'user'
									? 'bg-sig-gold/[0.12] border border-sig-gold/40 text-white rounded-br-xs'
									: 'bg-white/[0.035] border border-white/10 text-fg-2 rounded-bl-xs shadow-[0_4px_24px_rgba(0,0,0,0.4)]'}"
							>
								<!-- Rendered formatted content without raw asterisks -->
								<div class="space-y-1">
									{@html renderFormattedContent(msg.content)}
								</div>

								{#if msg.role === 'assistant' && msg.content}
									<div class="mt-2.5 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-2">
										<button
											type="button"
											onclick={() => copyMessage(msg.content, msg.id)}
											class="flex items-center gap-1 font-mono text-[10px] text-fg-3 hover:text-white transition-colors"
										>
											{#if copiedMsgId === msg.id}
												<Check size={11} class="text-sig-gold" />
												<span class="text-sig-gold">Copied</span>
											{:else}
												<Copy size={11} />
												<span>Copy</span>
											{/if}
										</button>
									</div>
								{/if}
							</div>
						</div>
					{/each}

					{#if isGenerating}
						<div class="flex items-center gap-2 font-mono text-xs text-sig-gold animate-pulse pl-1">
							<Zap size={13} class="text-amber-400" />
							<span>Formulating response in real-time...</span>
						</div>
					{/if}
				</div>

				<!-- Suggestion Prompt Pills -->
				<div class="border-t border-white/[0.06] bg-white/[0.01] px-4 py-2.5">
					<div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
						<span class="font-mono text-[10px] text-fg-3 uppercase shrink-0">Prompts:</span>
						{#each suggestions as s}
							<button
								type="button"
								disabled={isGenerating}
								onclick={() => sendMessage(s.prompt)}
								class="shrink-0 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-fg-2 transition-all hover:border-sig-gold/50 hover:bg-sig-gold/10 hover:text-white disabled:opacity-50"
							>
								{s.label}
							</button>
						{/each}
					</div>
				</div>

				<!-- Input Form Bar -->
				<div class="border-t border-white/[0.08] p-3 bg-black/40">
					<form
						onsubmit={(e) => {
							e.preventDefault();
							sendMessage();
						}}
						class="flex items-center gap-2"
					>
						<input
							type="text"
							bind:value={inputMessage}
							placeholder="Ask anything in English or සිංහල (e.g. skills, projects, experience)..."
							disabled={isGenerating}
							class="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs md:text-sm text-white placeholder-fg-3 outline-none transition-all focus:border-sig-gold/60 focus:bg-white/[0.06] focus:ring-1 focus:ring-sig-gold/40 disabled:opacity-50"
						/>

						<button
							type="submit"
							disabled={!inputMessage.trim() || isGenerating}
							class="flex size-11 items-center justify-center rounded-xl border border-sig-gold/50 bg-sig-gold/15 text-white transition-all hover:bg-sig-gold/30 hover:shadow-[0_0_20px_rgba(234,182,106,0.3)] disabled:opacity-30 disabled:hover:shadow-none"
						>
							{#if isGenerating}
								<Zap size={16} class="animate-spin text-sig-gold" />
							{:else}
								<Send size={16} class="text-sig-gold" />
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- ──────── Lower Deck: Dedicated Contact Form & WhatsApp Channels ("Pahalin") ──────── -->
	<div class="mt-14 border-t border-white/[0.08] pt-12">
		<!-- Section Header -->
		<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
			<div>
				<div class="flex items-center gap-2">
					<span class="size-1.5 rounded-full bg-sig-gold"></span>
					<span class="font-mono text-xs uppercase tracking-widest text-sig-gold font-medium">
						Direct Client Communication
					</span>
				</div>
				<h3 class="mt-2 text-2xl md:text-3xl font-medium tracking-tight text-white">
					Initiate Instant Connection.
				</h3>
			</div>
			<p class="font-mono text-xs text-fg-3 max-w-md">
				Reach out directly for engineering roles, technical consultations, or agentic AI architectures via WhatsApp or direct transmission.
			</p>
		</div>

		<!-- 2-Column Responsive Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
			<!-- Left Column: Fast Instant Channels (WhatsApp + Email Launcher) (5 cols) -->
			<div class="lg:col-span-5 space-y-4">
				<!-- 1. Direct WhatsApp Action Card (Number 0783356601) -->
				<a
					href="https://wa.me/94783356601?text=Hello%20Janith,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity."
					target="_blank"
					rel="noopener noreferrer"
					class="group relative block overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-white/[0.02] to-black p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]"
				>
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-3.5">
							<div class="flex size-12 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
								<!-- Official WhatsApp SVG Icon -->
								<svg class="size-6" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.53 1.761.815 2.796.815 3.183 0 5.769-2.587 5.769-5.766 0-3.181-2.586-5.766-5.769-5.766zm3.376 8.211c-.14.394-.813.729-1.127.777-.314.048-.724.08-2.079-.479-1.733-.715-2.853-2.482-2.939-2.597-.086-.115-.705-.939-.705-1.792 0-.853.447-1.272.607-1.446.16-.174.349-.217.465-.217.116 0 .232.002.333.007.107.006.251-.04.392.298.145.348.494 1.206.538 1.293.044.087.073.189.015.305-.058.116-.087.189-.174.29-.087.102-.183.228-.261.306-.087.087-.178.182-.076.356.102.174.453.747.972 1.21.669.596 1.232.78 1.406.867.174.087.276.073.378-.044.102-.116.436-.508.552-.682.116-.174.232-.145.392-.087.16.058 1.017.479 1.191.566.174.087.29.131.333.203.044.073.044.421-.096.815z"/>
								</svg>
							</div>
							<div>
								<div class="flex items-center gap-2">
									<span class="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">WhatsApp Direct</span>
									<span class="flex size-2 rounded-full bg-emerald-400 animate-pulse"></span>
								</div>
								<p class="mt-0.5 text-base font-mono text-white font-medium">+94 783356601</p>
								<p class="text-[11px] text-fg-3">Instant client communication · Chat now ↗</p>
							</div>
						</div>
						<ArrowUpRight size={18} class="text-emerald-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
					</div>
				</a>

				<!-- 2. Direct Email Navigation Card -->
				<div class="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-3.5">
							<div class="flex size-12 items-center justify-center rounded-xl border border-sig-gold/40 bg-sig-gold/10 text-sig-gold shadow-[0_0_15px_rgba(234,182,106,0.15)]">
								<Mail size={20} />
							</div>
							<div>
								<span class="font-mono text-xs uppercase tracking-wider text-sig-gold font-semibold">Direct Email Channel</span>
								<p class="mt-0.5 text-xs font-mono text-white break-all">chathushadayawansha1346@gmail.com</p>
								<p class="text-[11px] text-fg-3">&lt; 24h SLA · Encrypted transmission</p>
							</div>
						</div>
					</div>

					<div class="mt-4 flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/[0.06]">
						<a
							href="mailto:chathushadayawansha1346@gmail.com?subject=Project%20Opportunity%20-%20Janith%20Chathusha"
							class="inline-flex items-center gap-1.5 rounded-lg border border-sig-gold/50 bg-sig-gold/15 px-3.5 py-1.5 font-mono text-xs text-white transition-all hover:bg-sig-gold/25 shadow-[0_0_15px_rgba(234,182,106,0.2)]"
						>
							<span>Open Mail App</span>
							<ArrowUpRight size={13} class="text-sig-gold" />
						</a>
						<button
							type="button"
							onclick={copyEmail}
							class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-fg-2 transition-all hover:text-white hover:border-white/20"
						>
							{#if copiedEmail}
								<Check size={13} class="text-sig-gold" />
								<span class="text-sig-gold">Copied to Clipboard!</span>
							{:else}
								<Copy size={13} />
								<span>Copy Address</span>
							{/if}
						</button>
					</div>
				</div>
			</div>

			<!-- Right Column: Dedicated Contact Form (7 cols) -->
			<div class="lg:col-span-7">
				<div class="rounded-2xl border border-white/[0.08] bg-[#07070a]/90 p-6 md:p-8 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
					<div class="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
						<div>
							<h4 class="font-mono text-sm font-medium text-white flex items-center gap-2">
								<span class="size-2 rounded-full bg-sig-gold"></span>
								<span>Direct Transmission Protocol</span>
							</h4>
							<p class="font-mono text-[11px] text-fg-3 mt-1">
								Dispatches straight to Janith Chathusha's primary inbox.
							</p>
						</div>
						<span class="rounded-full border border-sig-gold/30 bg-sig-gold/10 px-2.5 py-1 font-mono text-[10px] text-sig-gold">
							Active Channel
						</span>
					</div>

					<form onsubmit={handleContactSubmit} class="space-y-4">
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="deck-name" class="block font-mono text-[11px] text-fg-3 mb-1.5">
									YOUR NAME / ORGANIZATION *
								</label>
								<div class="relative">
									<User size={14} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3" />
									<input
										id="deck-name"
										type="text"
										required
										bind:value={formName}
										placeholder="Alex Rivera / Tech Corp"
										class="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-white placeholder-fg-3 outline-none focus:border-sig-gold focus:ring-1 focus:ring-sig-gold/40 transition-all"
									/>
								</div>
							</div>

							<div>
								<label for="deck-email" class="block font-mono text-[11px] text-fg-3 mb-1.5">
									ELECTRONIC MAIL ADDRESS *
								</label>
								<div class="relative">
									<Mail size={14} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3" />
									<input
										id="deck-email"
										type="email"
										required
										bind:value={formEmail}
										placeholder="alex@company.com"
										class="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-white placeholder-fg-3 outline-none focus:border-sig-gold focus:ring-1 focus:ring-sig-gold/40 transition-all"
									/>
								</div>
							</div>
						</div>

						<div>
							<label for="deck-subject" class="block font-mono text-[11px] text-fg-3 mb-1.5">
								TRANSMISSION PURPOSE
							</label>
							<select
								id="deck-subject"
								bind:value={formSubject}
								class="w-full rounded-xl border border-white/10 bg-[#0e0e12] px-4 py-2.5 text-xs text-white outline-none focus:border-sig-gold transition-all"
							>
								<option value="Full-Time Engineering Opportunity">Full-Time Engineering Opportunity</option>
								<option value="Agentic AI / Full-Stack Project Collaboration">Agentic AI / Full-Stack Project Collaboration</option>
								<option value="Technical Architecture Consulting">Technical Architecture Consulting</option>
								<option value="General Engineering Inquiry">General Engineering Inquiry</option>
							</select>
						</div>

						<div>
							<label for="deck-message" class="block font-mono text-[11px] text-fg-3 mb-1.5">
								MESSAGE SPECIFICATION *
							</label>
							<textarea
								id="deck-message"
								rows={4}
								required
								bind:value={formMessage}
								placeholder="Detail your requirements, project scope, or opportunity..."
								class="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder-fg-3 outline-none focus:border-sig-gold focus:ring-1 focus:ring-sig-gold/40 transition-all"
							></textarea>
						</div>

						<div class="flex flex-wrap items-center justify-between gap-4 pt-2">
							<p class="font-mono text-[11px] text-fg-3">
								Direct: <span class="text-sig-gold">{profile.email}</span>
							</p>

							<button
								type="submit"
								disabled={formStatus === 'sending'}
								class="inline-flex items-center gap-2 rounded-xl border border-sig-gold/60 bg-sig-gold/20 px-6 py-2.5 font-mono text-xs font-medium text-white shadow-[0_0_20px_rgba(234,182,106,0.2)] transition-all hover:bg-sig-gold/30 hover:shadow-[0_0_30px_rgba(234,182,106,0.35)] disabled:opacity-50"
							>
								<span>{formStatus === 'sending' ? 'Transmitting...' : 'Dispatch Message'}</span>
								<ArrowUpRight size={14} class="text-sig-gold" />
							</button>
						</div>
					</form>

					{#if formStatus === 'sent'}
						<div
							class="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400"
						>
							<CheckCircle2 size={16} />
							<span>{formStatusMessage}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
