import { userInfo, keycloak, loggedIn } from '$lib/shared/stores/keycloak';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

export const ssr = false;

// need

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const kc = new Keycloak({
		url: 'https://identity.mythumbscore.com:8443',
		realm: 'testing',
		clientId: 'testing'
	});
	keycloak.set(kc);

	try {
		let authenticated = await kc.init({
			onLoad: 'check-sso',
			redirectUri: window.location.href.split(/[#]/)[0],
			silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
		});
		loggedIn.set(authenticated);
		if (authenticated) {
			let user = await kc.loadUserInfo();
			user.token = kc.token;
			user.roles = kc.realmAccess;
			userInfo.set(user);

			kc.onAuthError = function () {
				console.log('auth error');
			};
			kc.onAuthLogout = function () {
				loggedIn.set(false);
				userInfo.set(null);
				goto('/');
			};
			kc.onTokenExpired = function () {
				console.log('token expired');
			};

			setInterval(() => {
				kc.updateToken(70)
					.then((refreshed) => {
						console.log('refreshed ', refreshed);
						let user = get(userInfo);
						if (refreshed) {
							user.token = kc.token;
							user.roles = kc.realmAccess;
						}
					})
					.catch(() => {
						loggedIn.set(false);
						userInfo.set(null);
					});
			}, 10000);
		} else {
			userInfo.set(null);
		}

		return {
			loggedIn: authenticated
		};
	} catch (error) {
		console.error(error);

		return {
			loggedIn: false
		};
	}
}
