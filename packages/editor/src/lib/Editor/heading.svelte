<script>
	import { createEventDispatcher, tick } from 'svelte';

	export let text;
	export let editor;
	const dispatch = createEventDispatcher();

	async function keyDown(e) {
		const key = e.key;
		await tick;
		if (key === 'Backspace') {
			if (!editor.textContent.trim().length) {
				e.preventDefault();
				dispatch('backspace');
			}
		} else if (key === 'Enter') {
			if (editor.textContent.trim().length) {
				dispatch('enter');
			}
		}
	}
</script>

<div>
	<!-- svelte-ignore a11y-autofocus -->
	<h2
		on:keydown={keyDown}
		bind:this={editor}
		placeholder="Your Heading"
		bind:textContent={text}
		contenteditable
		autofocus
	/>
</div>

<style>
	h2 {
		outline: none;
		font-size: 1.4rem;
		font-family: serif;
		font-weight: 600;
	}
</style>
