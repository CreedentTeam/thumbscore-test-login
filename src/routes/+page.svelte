<script>
	import { loggedIn, userInfo } from '$lib/shared/stores/keycloak';

	$: {
		if ($loggedIn) {
			console.log('im logged in');
		} else {
			console.log('im not logged in');
		}
	}
</script>

<p>Logged in: {$loggedIn}</p>
<!-- <p>{$userInfo.token}</p> -->
