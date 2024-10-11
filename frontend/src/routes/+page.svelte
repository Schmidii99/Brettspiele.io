<script lang="ts">
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import { API_URL } from "$lib/config";

    let recievedMessage: any = null;

    onMount(() => {
        const socket = io(API_URL);

        socket.on("message", (message) => {
            recievedMessage = message;
            socket.emit("message", "Hello from the frontend!");
        })
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
