<script lang="js">
	import { createEventDispatcher } from 'svelte';

	let ref;
	let files;
	export let image;
	let active = false;
	const dispatch = createEventDispatcher();

	$: if (files && files[0]) {
		console.log(files);
		const file = new FileReader();
		file.readAsDataURL(files[0]);
		file.onload = (e) => (image = e.target.result);
	}

	function remove() {
		dispatch('delete');
	}

	function handleDrop(e) {
		if (e.dataTransfer) {
			image = e.dataTransfer.getData('URL');
			files = [e.dataTransfer.items[0].getAsFile()];
		}
	}
</script>

<div
	class="relative my-4"
	on:drop|preventDefault={handleDrop}
	on:dragover|preventDefault
	on:focusin={() => (active = true)}
	on:mouseenter={() => (active = true)}
	on:mouseleave={() => (active = false)}
>
	<input bind:this={ref} accept="image/*" class="hidden" id="img" type="file" bind:files />
	<label class="cursor-pointer max-w-full max-h-48" for="img" class:inactive={!image}>
		{#if image}
			<img
				class:hover:opacity-50={active}
				class="object-contain mx-auto max-h-96"
				alt="imgx"
				src={image}
			/>
		{:else}
			<img alt="Icon" src="https://www.svgrepo.com/show/315196/image.svg" />
			<p class="font-semibold">Choose an Image</p>
		{/if}
	</label>
	<div
		on:click={remove}
		class="cursor-pointer mt-2 w-min -bottom-8 z-20 hover:border-red-500 hover:text-red-500 hover:border-2 hover:bg-white py-1 px-2 rounded-lg bg-red-500 text-white"
	>
		Delete
	</div>
</div>

<style>
	.inactive {
		@apply rounded-lg w-full flex gap-2 items-center justify-center h-20 border;
	}
</style>
