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
	import { SITE_URL } from '$lib/data/portfolio';

	const siteUrl = SITE_URL;
	const title = 'Janith Chathusha | Software Engineer, AI & Data Analytics';
	const description =
		'Explore Janith Chathusha’s portfolio of software engineering, AI, machine learning, sports analytics, and automation projects in Sri Lanka.';
	const socialImage = `${siteUrl}/janith-hero.jpg`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content="Janith Chathusha" />
	<meta name="publisher" content="Janith Chathusha" />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<link rel="canonical" href="{siteUrl}/" />

	<!-- Open Graph / Social Sharing (WhatsApp, LinkedIn, Facebook, Slack) -->
	<meta property="og:site_name" content="Janith Chathusha" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="{siteUrl}/" />
	<meta property="og:type" content="profile" />
	<meta property="og:image" content={socialImage} />
	<meta property="og:image:secure_url" content={socialImage} />
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
	<meta name="twitter:image" content={socialImage} />
	<meta name="twitter:image:alt" content="Janith Chathusha — Software Engineer" />

	<!-- Schema.org Rich Structured Data Graph -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': `${siteUrl}/#person`,
				name: 'Janith Chathusha',
				alternateName: 'ජනිත් චතුෂ',
				url: `${siteUrl}/`,
				image: socialImage,
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
					'Software Engineering',
					'Full-Stack Development',
					'Artificial Intelligence',
					'Machine Learning',
					'Sports Analytics',
					'Explainable AI',
					'Automation Pipelines',
					'Python',
					'React',
					'SvelteKit',
					'Node.js'
				],
				sameAs: [
					'https://github.com/JanithChathusha22',
					'https://www.linkedin.com/in/janith-chathusha/'
				]
			},
			{
				'@type': 'WebSite',
				'@id': `${siteUrl}/#website`,
				url: `${siteUrl}/`,
				name: title,
				description: description,
				author: {
					'@id': `${siteUrl}/#person`
				},
				inLanguage: 'en-US'
			},
			{
				'@type': 'WebPage',
				'@id': `${siteUrl}/#webpage`,
				url: `${siteUrl}/`,
				name: title,
				description: description,
				isPartOf: {
					'@id': `${siteUrl}/#website`
				},
				about: {
					'@id': `${siteUrl}/#person`
				},
				mainEntity: {
					'@id': `${siteUrl}/#person`
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
