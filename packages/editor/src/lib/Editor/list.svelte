<script lang="js">
	import { createEventDispatcher } from 'svelte';
	import { tick } from 'svelte';
	import Input from './input.svelte';
	import { setEndOfContenteditable } from './utils';

	let dispatch = createEventDispatcher();
	let refs = [];
	export let list = [];
	export let last_element = refs.length ? refs[refs.length - 1] : null;

	$: if (refs.length) {
		last_element = refs[refs.length - 1];
	}

	async function focus(key) {
		let text = list.data[key];
		refs[key].focus();
		await tick();
		list.data[key] = text;
		setEndOfContenteditable(refs[key]);
	}

	async function addNew(key) {
		list.data[key] = list.data[key].replaceAll('<br>', '');
		if (list.data[key].trim() === '') return;
		if (refs[key + 1]) focus(key + 1);
		else {
			list.data[key + 1] = '';
			await tick();
			focus(key + 1);
		}
	}

	function deleteExisting(key) {
		delete list.data[key];
		list = list;
		if (Object.keys(list.data).length > 0) focus(key - 1);
	}

	$: if (!Object.keys(list.data).length) dispatch('delete');
</script>

<div class="my-4">
	{#each Object.values(list.data) as val, key (key)}
		<div class="flex items-center">
			<li class="ml-2" />
			<div class="w-full">
				<Input
					bind:editor={refs[key]}
					on:backspace={() => deleteExisting(key)}
					on:enter={() => addNew(key)}
					bind:text={list.data[key]}
				/>
			</div>
		</div>
	{/each}
</div>
