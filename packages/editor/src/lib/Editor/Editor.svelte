<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
<script context="module">
	export const prerender = false;
</script>
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { active, data, getLocalStorage, setLocalStorage } from './store';
	import Input from './input.svelte';
	import Heading from './heading.svelte';
	import List from './list.svelte';
	import ImageUpload from './image_uploader.svelte';
	import YT from './yt.svelte';
	import {
		generate_paragraph,
		add_at,
		remove_at,
		setEndOfContenteditable,
		generate_heading,
		generate_list,
		generate_image
	} from './utils';

	let add = false;
	let refs = [];

    onMount(async () => {
       	let ls_data = getLocalStorage('ws-data')
		if (!Array.isArray(ls_data)) {
			ls_data = []
		}
	   if(ls_data.length) {
           $data = ls_data
       } else {
           $data = [
                {
                    id: 1011,
                    type: 'paragraph',
                    data: {
                        text: ''
                    }
                }
            ]
       }
        data.subscribe(i => setLocalStorage('ws-data', i))
    })

	function activateAdd() {
		add = true;
		setTimeout(() => (add = false), 5000);
	}

	async function add_paragraph(e, key = -1) {
		if (key === -1) {
			$data = [...$data, generate_paragraph()];
		} else {
			const para = generate_paragraph();
			$data = add_at($data, key + 1, para);
			await tick();
			let text = $data[key + 1].data.text;
			refs[key + 1].focus();
			await tick();
			$data[key + 1].data.text = text;
			setEndOfContenteditable(refs[key + 1]);
			await tick();
			$active = para.id;
		}
	}

	function add_heading(e, key = -1) {
		if (key === -1) {
			$data = [...$data, generate_heading()];
		} else {
			$data = add_at($data, key + 1, generate_heading());
		}
	}

	function add_list(e, key = -1) {
		if (key === -1) {
			$data = [...$data, generate_list()];
		} else {
			$data = add_at($data, key + 1, generate_list());
		}
	}

	function add_image(e, key = -1) {
		if (key === -1) {
			$data = [...$data, generate_image()];
		} else {
			$data = add_at($data, key + 1, generate_image());
		}
	}

	async function remove(e, key) {
		if (key >= 0) {
			$data = remove_at($data, key);
			await tick();
			refs = remove_at(refs, key);
			await tick();
			if (refs.length > 0 && key - 1 >= 0)
				if (
					$data[key - 1].type === 'paragraph' ||
					$data[key - 1].type === 'heading' ||
					$data[key - 1].type === 'list'
				) {
					let text = $data[key - 1].data.text;
					refs[key - 1].focus();
					await tick();
					$data[key - 1].data.text = text;
					setEndOfContenteditable(refs[key - 1]);
				}
		}
	}
</script>

<div class="p-4 max-w-3xl ml-auto mr-auto">
	<div class="flex items-center gap-4 mb-4">
		<button on:click={activateAdd} class="text-white px-2 py-1 bg-blue-500 rounded">ADD</button>
		{#if add}
			<div class="flex items-center gap-4">
				<button on:click={add_paragraph} class="text-white px-2 py-1 bg-blue-500 rounded"
					>Paragraph</button>
				<button on:click={add_heading} class="text-white px-2 py-1 bg-blue-500 rounded"
					>Heading</button>
				<button on:click={add_list} class="text-white px-2 py-1 bg-blue-500 rounded">List</button>
				<button on:click={add_image} class="text-white px-2 py-1 bg-blue-500 rounded">Image</button>
			</div>
		{/if}
	</div>
	{#each $data as val, idx}
		{#if val.type === 'paragraph'}
			<Input
				bind:editor={refs[idx]}
				on:backspace={(e) => remove(e, idx)}
				on:enter={(e) => add_paragraph(e, idx)}
				bind:text={$data[idx].data.text}
			/>
		{:else if val.type === 'heading'}
			<Heading
				bind:editor={refs[idx]}
				on:backspace={(e) => remove(e, idx)}
				on:enter={(e) => add_paragraph(e, idx)}
				bind:text={$data[idx].data.text}
			/>
		{:else if val.type === 'list'}
			<List
				bind:list={$data[idx]}
				bind:last_element={refs[idx]}
				on:delete={(e) => remove(e, idx)}
			/>
		{:else if val.type === 'image'}
			<ImageUpload on:delete={(e) => remove(e, idx)} />
        {:else if val.type === "youtube"}
            <YT on:delete={(e) => remove(e, idx)} videoId="lHhRhPV--G0" />
		{/if}
	{/each}
	
</div>
