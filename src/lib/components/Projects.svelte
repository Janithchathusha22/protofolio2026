<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import ProjectRow from './ProjectRow.svelte';
	import { projects } from '../data/portfolio';
</script>

<section id="projects" class="section-rhythm border-t border-white/[0.06]">
	<div class="container-editorial">
		<SectionHeader
			index="01"
			eyebrow="Selected Projects"
			title={'Systems that turn noisy signals into <span class="font-serif italic font-normal text-fg-2">clear decisions.</span>'}
			lede="Six specialized engineering builds spanning deep learning explainability, computer vision kinematics, sports predictive modeling, and embedded IoT sensing — presented in glassmorphic telemetry cards."
		/>

		<div class="space-y-16 md:space-y-20">
			{#each projects as project, i (project.id)}
				<ProjectRow {project} reverse={i % 2 === 1} />
			{/each}
		</div>
	</div>
</section>
