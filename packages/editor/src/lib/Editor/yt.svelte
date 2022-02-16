<script context="module">
	let YouTubeIframeAPIReady = false;
</script>

<script>
	let player;
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();
	let divId = 'player_' + parseInt(Math.random() * 100000).toString();
	export let videoId;

	onMount(() => {
		let ytTagUrl = 'https://www.youtube.com/iframe_api';
		if (!isMyScriptLoaded(ytTagUrl)) {
			// 2. This code loads the IFrame Player API code asynchronously.
			var tag = document.createElement('script');
			tag.src = ytTagUrl;
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}

		window.onYouTubeIframeAPIReady = function () {
			//console.log('hello')
			window.dispatchEvent(new Event('YouTubeIframeAPIReady'));
		};

		window.addEventListener('YouTubeIframeAPIReady', function () {
			if (YouTubeIframeAPIReady == false) {
				// first load of an YT Video on this project
				YouTubeIframeAPIReady = true; // now the Player can be created
				createPlayer();
			}
		});
		function createPlayer() {
			player = new window.YT.Player(divId, {
				videoId: videoId,
				events: {
					//'onReady': onPlayerReady,
					onStateChange: onPlayerStateChange
				}
			});
		}
		if (YouTubeIframeAPIReady) {
			createPlayer(); // if the YT Script is ready, we can create our player
		}
	});

	function isMyScriptLoaded(url = '') {
		var scripts = document.getElementsByTagName('script');
		for (var i = scripts.length; i--; ) {
			if (scripts[i].src == url) return true;
		}
		return false;
	}

	function onPlayerStateChange({ data }) {
		dispatch('StateChange', data);
	}
	export function playVideo() {
		player.playVideo();
	}
	function remove() {
		dispatch('delete');
	}
</script>

<div class="yt-component my-2 py-2">
	<div id={divId} />
	<div
		on:click={remove}
		class="cursor-pointer mt-2 w-min z-20 hover:border-red-500 hover:text-red-500 hover:border-2 hover:bg-white py-2 px-4 rounded-lg bg-red-500 text-white"
	>
		Delete
	</div>
</div>

<style>
	:global(iframe) {
		width: 100%;
		margin: 0 auto;
		border-radius: 10px;
	}
</style>
