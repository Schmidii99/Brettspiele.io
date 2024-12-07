<script setup lang="ts">
    import CustomFooter from '@/components/home/CustomFooter.vue';
    import GameDisplay from '@/components/home/GameDisplay.vue';
</script>

<template>
    <header class="container mx-auto text-center py-16">
        <h1 class="text-5xl font-bold text-blue-800 mb-4">Discover Amazing Board Games</h1>
        <p class="text-xl text-gray-600 mb-8">Connect, Play, and Create Memories Together</p>
        <p class="text-lg text-blue-600 mb-8">No ads. No cookies. No login required. Just pure fun! 🎮</p>
        <a href="#games" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">Start Playing</a>
    </header>

    <section id="games" class="container mx-auto py-16">
        <h2 class="text-3xl font-bold text-center mb-12">Popular Games</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GameDisplay :base-link="'/ttt/'" :title="'Tic Tac Toe'" :description="'The classic paper-and-pencil game for two players'">
                <template v-slot:icon>
                    <svg fill="#000000" class="aspect-square w-10" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 455.896 455.896" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M432.458,330.806c8.794,0,15.926-7.132,15.926-15.926c0-8.794-7.132-15.926-15.926-15.926H331.599V155.62h100.859 c8.794,0,15.926-7.132,15.926-15.926c0-8.794-7.132-15.926-15.926-15.926H331.599V22.909c0-8.796-7.132-15.926-15.926-15.926 c-8.796,0-15.926,7.13-15.926,15.926v100.859H156.414V22.902c0-8.794-7.132-15.926-15.926-15.926 c-8.796,0-15.926,7.132-15.926,15.926v100.867H23.695c-8.794,0-15.926,7.132-15.926,15.926c0,8.794,7.132,15.926,15.926,15.926 h100.867v143.333H23.695c-8.794,0-15.926,7.132-15.926,15.926c0,8.794,7.132,15.926,15.926,15.926h100.867v100.859 c0,8.796,7.13,15.926,15.926,15.926c8.794,0,15.926-7.13,15.926-15.926V330.806h143.333v100.867c0,8.794,7.13,15.926,15.926,15.926 c8.794,0,15.926-7.132,15.926-15.926V330.806H432.458z M156.414,298.954V155.62h143.333v143.333H156.414z"></path> <path d="M27.652,106.497l25.235-25.241l25.235,25.241c3.11,3.11,7.184,4.666,11.26,4.666c4.075,0,8.149-1.556,11.26-4.666 c6.222-6.213,6.222-16.299,0-22.519L75.408,58.735l25.233-25.243c6.222-6.221,6.222-16.306,0-22.519 c-6.221-6.221-16.299-6.221-22.519,0L52.887,36.214L27.652,10.973c-6.221-6.221-16.299-6.221-22.519,0 c-6.222,6.213-6.222,16.299,0,22.519l25.233,25.243L5.133,83.977c-6.222,6.221-6.222,16.307,0,22.519 c3.11,3.11,7.184,4.666,11.26,4.666C20.468,111.163,24.542,109.607,27.652,106.497z"></path> <path d="M250.596,227.287l25.235-25.243c6.221-6.221,6.221-16.307,0-22.519c-6.222-6.222-16.3-6.222-22.521,0l-25.235,25.241 l-25.235-25.241c-6.221-6.222-16.299-6.222-22.519,0c-6.221,6.213-6.221,16.299,0,22.519l25.235,25.243l-25.235,25.243 c-6.221,6.221-6.221,16.307,0,22.519c3.11,3.11,7.186,4.666,11.26,4.666c4.075,0,8.149-1.556,11.26-4.666l25.235-25.241 l25.235,25.241c3.11,3.11,7.186,4.666,11.26,4.666c4.076,0,8.149-1.556,11.261-4.666c6.221-6.213,6.221-16.299,0-22.519 L250.596,227.287z"></path> <path d="M228.072,117.47c32.389,0,58.735-26.346,58.735-58.735C286.807,26.346,260.461,0,228.072,0 c-32.389,0-58.735,26.346-58.735,58.735C169.337,91.123,195.684,117.47,228.072,117.47z M228.072,31.852 c14.822,0,26.883,12.061,26.883,26.883c0,14.822-12.061,26.883-26.883,26.883c-14.822,0-26.883-12.061-26.883-26.883 C201.189,43.913,213.25,31.852,228.072,31.852z"></path> <path d="M396.695,338.426c-32.389,0-58.735,26.346-58.735,58.735s26.346,58.735,58.735,58.735 c32.388,0,58.735-26.346,58.735-58.735S429.083,338.426,396.695,338.426z M396.695,424.044c-14.822,0-26.883-12.061-26.883-26.883 s12.061-26.883,26.883-26.883c14.822,0,26.883,12.061,26.883,26.883S411.517,424.044,396.695,424.044z"></path> </g> </g></svg>
                </template>
            </GameDisplay>
            <GameDisplay :base-link="'/c4/'" :title="'Connect Four'" :description="'Drop your discs and claim four in a row!'">
                <template v-slot:icon>
                    <img class="w-10 aspect-square" src="@/assets/icons/connect-four.png" alt="🔴">
                </template>
            </GameDisplay>
            <GameDisplay :disabled="true" :title="'Memory'" :description="'Match pairs of identical cards to clear the board.'">
                <template v-slot:icon>
                    <img class="w-10 aspect-square" src="@/assets/icons/memory.png">
                </template>
            </GameDisplay>
        </div>
    </section>

    <section id="features" class="bg-blue-50 py-16">
        <div class="container mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="flex items-start space-x-4">
                    <div class="text-2xl">🔗</div>
                    <div>
                        <h3 class="text-xl font-bold mb-2">Easy Link Share</h3>
                        <p class="text-gray-600">Just send a link to your friends and start playing immediatly</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4">
                    <div class="text-2xl">🚫</div>
                    <div>
                        <h3 class="text-xl font-bold mb-2">No Ads Ever</h3>
                        <p class="text-gray-600">Game on, no interruptions!</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4">
                    <div class="text-2xl">🫵</div>
                    <div>
                        <h3 class="text-xl font-bold mb-2">Users first</h3>
                        <p class="text-gray-600">We listen to YOUR suggestions</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4">
                    <div class="text-2xl">🎲</div>
                    <div>
                        <h3 class="text-xl font-bold mb-2">Jump Right In</h3>
                        <p class="text-gray-600">No login required to start playing</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4">
                    <div class="text-2xl">✨</div>
                    <div>
                        <h3 class="text-xl font-bold mb-2">Always Free</h3>
                        <p class="text-gray-600">Access all features without any cost</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="improve" class="container mx-auto py-16 text-center">
        <h2 class="text-3xl font-bold mb-8">Can we improve?</h2>
        <p class="text-xl text-gray-600 mb-2">Share your thoughts about this page and submit a feedback!</p>
        <a class="text-blue-400 hover:text-blue-600" href="https://forms.gle/948CxsVReqLteKC56" target="_blank" rel="noopener noreferrer">
            Feedback survey
        </a>
    </section>

    <section id="join" class="py-16 text-center bg-blue-50">
        <h2 class="text-3xl font-bold mb-8">Ready to Join?</h2>
        <p class="text-xl text-gray-600 mb-8">Start your board gaming journey today - no registration needed!</p>
        <a href="#games" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Start Playing 🎲
        </a>
    </section>

    <CustomFooter />
</template>