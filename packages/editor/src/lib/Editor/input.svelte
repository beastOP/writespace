<script lang="ts">
	import { tick } from 'svelte';
	import { active } from './store';
	import { onMount, createEventDispatcher } from 'svelte';

	export let id = Math.floor(Math.random() * 100);
	let range;
	export let editor;
	export let text = '';
	const dispatch = createEventDispatcher();

	onMount(() => {
		document.execCommand('insertHTML', false, '<br>');
	});

	$: if (editor && !editor.textContent.trim().length) {
		text = '';
	}

	function saveRange() {
		if (window.getSelection()) {
			range = window.getSelection().getRangeAt(0);
		} else if (document.selection) {
			range = document.selection.createRange();
		}
	}

	function restoreSel() {
		editor.focus();
		if (range != null) {
			if (window.getSelection) {
				let s = window.getSelection();
				if (s.rangeCount > 0) s.removeAllRanges();
				s.addRange(range);
			} else if (document.createRange) {
				window.getSelection().addRange(range);
			} else if (document.selection) {
				range.select();
			}
		}
	}

	function bold() {
		console.log('bold');
		restoreSel();
		document.execCommand('bold');
	}

	function italic() {
		restoreSel();
		document.execCommand('italic');
	}

	function underline() {
		restoreSel();
		document.execCommand('underline');
	}

	async function keyDown(e) {
		const key = e.key;
		await tick();
		if (key === 'Backspace') {
			if (!editor.textContent.trim().length) {
				e.preventDefault();
				dispatch('backspace');
			}
		} else if (key === 'Enter') {
			if (editor.textContent && editor.textContent.trim().length) {
				dispatch('enter');
			}
		}
	}

	function activate() {
		$active = id;
		setTimeout(() => {
			$active = -1;
		}, 5000);
	}
</script>

<div
	on:focusin={activate}
	on:mouseenter={activate}
	on:mouseleave={() => ($active = -1)}
	class="relative"
>
	<!-- svelte-ignore a11y-autofocus -->
	<p
		bind:this={editor}
		bind:innerHTML={text}
		contenteditable
		class:textarea={true}
		class:writespace={true}
		class="inline-block rounded font-serif tracking-wide w-full whitespace-normal py-2 outline-none"
		placeholder="Type your thoughts..."
		on:focusout={saveRange}
		on:keydown={keyDown}
	/>
	{#if $active === id}
		<div class="absolute top-[80%] gap-3 flex">
			<div
				class="my-3 cursor-pointer z-20 bg-white font-serif w-8 h-8 flex items-center justify-center shadow rounded"
				on:click={italic}
			>
				<i>I</i>
			</div>

			<div
				class="my-3 cursor-pointer z-20 bg-white font-serif w-8 h-8 flex items-center justify-center shadow rounded"
				on:click={bold}
			>
				<b>B</b>
			</div>
			<div
				class="my-3 cursor-pointer z-20 bg-white font-serif w-8 h-8 flex items-center justify-center underline shadow rounded"
				on:click={underline}
			>
				U
			</div>
		</div>
	{/if}
</div>

<style>
	:global([placeholder]:empty::before) {
		content: attr(placeholder);
		color: #555;
	}

	:global([placeholder]:empty:focus::before) {
		content: '';
	}

	:global(p br) {
		display: none;
	}
</style>
