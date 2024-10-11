<script lang="ts">
    import { onMount } from "svelte";
    import { openSocket } from "$lib/socketManager";

    let recievedMessage: any = null;

    onMount(() => {

    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#if recievedMessage != null}
    <div class="flex">
        <h1>Recieved message:</h1>
        {recievedMessage}
    </div>
{/if}
