<script>
	import { keycloak, loggedIn } from '$lib/shared/stores/keycloak';
</script>

{#if $loggedIn}
	<button
		on:click={() => {
			$keycloak.logout();
		}}>Log Out</button
	>
{:else}
	<button
		on:click={() => {
			$keycloak.login();
		}}>Log In</button
	>
{/if}
