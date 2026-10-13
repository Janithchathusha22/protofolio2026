<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import { projects } from '../data/portfolio';
</script>

<section id="projects" class="section-rhythm border-t border-white/[0.06]">
	<div class="container-editorial">
		<SectionHeader
			index="01"
			eyebrow="Selected Projects"
			title={'Systems that turn noisy signals into <span class="font-serif italic font-normal text-fg-2">clear decisions.</span>'}
			lede="Eight specialized engineering builds spanning deep learning explainability, AI editorial pipelines, computer vision kinematics, sports predictive modeling, and embedded IoT sensing — presented in glassmorphic telemetry cards."
		/>

		<!-- Desktop: two equal columns, four rows. Mobile: one column in reading order. -->
		<div class="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
			{#each projects as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>
	</div>
</section>
