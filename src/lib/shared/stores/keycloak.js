import { writable } from 'svelte/store';

export const keycloak = writable({});
export const loggedIn = writable(false);
export const userInfo = writable({});
