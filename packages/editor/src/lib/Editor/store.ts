import { writable } from 'svelte/store';
import { browser } from '$app/env';

export function setLocalStorage(key, value) {
	if (browser) {
		window.localStorage.setItem(key, JSON.stringify(value));
	}
}

export function getLocalStorage(key) {
	return browser ? JSON.parse(window.localStorage.getItem(key)) ?? {} : {};
}

export function removeLocalStorage(key) {
	if (browser) {
		window.localStorage.removeItem(key);
	}
}

export const active = writable(-1);

export const data = writable([]);
