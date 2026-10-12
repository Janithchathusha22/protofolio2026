<script lang="ts">
	import CinematicIntro from '$lib/components/CinematicIntro.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Workflows from '$lib/components/Workflows.svelte';
	import SkillTree from '$lib/components/SkillTree.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import About from '$lib/components/About.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import { ui } from '$lib/state/ui.svelte.js';

	const title = 'Janith Chathusha — Software Engineer · Full-Stack & Practical AI';
	const description =
		'Janith Chathusha builds full-stack products and practical AI systems — scalable backends, explainable ML, and intelligent automation.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="Janith Chathusha, Software Engineer, Full-Stack Developer, AI Engineer, Machine Learning, LangGraph, CrewAI, Python, React, Svelte, Node.js, Sri Lanka, SLIIT, Absolx, NewsShield, Explainable AI"
	/>
	<meta name="author" content="Janith Chathusha" />
	<meta name="publisher" content="Janith Chathusha" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<link rel="canonical" href="https://janithchathusha9.netlify.app/" />

	<!-- Open Graph / Social Sharing (WhatsApp, LinkedIn, Facebook, Slack) -->
	<meta property="og:site_name" content="Janith Chathusha Portfolio" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://janithchathusha9.netlify.app/" />
	<meta property="og:type" content="profile" />
	<meta property="og:image" content="https://janithchathusha9.netlify.app/janith-hero.jpg" />
	<meta property="og:image:secure_url" content="https://janithchathusha9.netlify.app/janith-hero.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="1600" />
	<meta property="og:image:alt" content="Janith Chathusha — Software Engineer" />
	<meta property="og:locale" content="en_US" />
	<meta property="profile:first_name" content="Janith" />
	<meta property="profile:last_name" content="Chathusha" />
	<meta property="profile:username" content="janith-chathusha" />

	<!-- Twitter / X Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://janithchathusha9.netlify.app/janith-hero.jpg" />
	<meta name="twitter:image:alt" content="Janith Chathusha — Software Engineer" />

	<!-- Schema.org Rich Structured Data Graph -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': 'https://janithchathusha9.netlify.app/#person',
				name: 'Janith Chathusha',
				alternateName: 'ජනිත් චතුෂ',
				url: 'https://janithchathusha9.netlify.app/',
				image: 'https://janithchathusha9.netlify.app/janith-hero.jpg',
				jobTitle: 'Software Engineer',
				worksFor: {
					'@type': 'Organization',
					name: 'Absolx'
				},
				alumniOf: {
					'@type': 'EducationalOrganization',
					name: 'Sri Lanka Institute of Information Technology (SLIIT)'
				},
				knowsAbout: [
					'Full-Stack Engineering',
					'Artificial Intelligence',
					'Agentic Workflows',
					'LangGraph',
					'CrewAI',
					'Machine Learning',
					'Python',
					'React',
					'Node.js',
					'Svelte',
					'System Architecture'
				],
				sameAs: [
					'https://www.linkedin.com/in/janith-chathusha/',
					'https://github.com/Janithchathusha22',
					'https://www.behance.net/janithchathusha'
				]
			},
			{
				'@type': 'WebSite',
				'@id': 'https://janithchathusha9.netlify.app/#website',
				url: 'https://janithchathusha9.netlify.app/',
				name: 'Janith Chathusha Portfolio',
				description: description,
				author: {
					'@id': 'https://janithchathusha9.netlify.app/#person'
				},
				inLanguage: 'en-US'
			},
			{
				'@type': 'ProfilePage',
				'@id': 'https://janithchathusha9.netlify.app/#webpage',
				url: 'https://janithchathusha9.netlify.app/',
				name: title,
				isPartOf: {
					'@id': 'https://janithchathusha9.netlify.app/#website'
				},
				about: {
					'@id': 'https://janithchathusha9.netlify.app/#person'
				},
				mainEntity: {
					'@id': 'https://janithchathusha9.netlify.app/#person'
				}
			}
		]
	})}</` + `script>`}
</svelte:head>

{#key ui.introKey}
	<CinematicIntro forcePlay={ui.introKey > 0} />
{/key}

<Nav />

<main>
	<Hero />
	<Projects />
	<Workflows />
	<SkillTree />
	<Timeline />
	<About />
	<Contact />
</main>
