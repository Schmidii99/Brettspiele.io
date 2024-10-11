<script lang="ts">
    import "../app.css";
    import {onMount} from "svelte";
    import {SocketStore} from "$lib/stores";
    import {openSocket} from "$lib/socketManager";

    onMount(() => {
        SocketStore.set(openSocket());
    });
</script>
  
<slot />