
<template lang='pug'>

div.player(ref='player_div')

</template>


<script lang='ts' setup>

import {ref, onMounted, onBeforeUnmount, computed} from 'vue'

// NOTE Vitepress build treats shikwasa as a CJS module and fails (probably wrong package.json config)
// So symlinking into src dir avoids package.json config and loads properly
import {Player} from './shikwasa.es.js'

import {episodes} from '../podcast.json'


const props = defineProps<{id:string}>()

const episode = computed(() => {
    return episodes.find(ep => ep.id === props.id)
})

const player_div = ref()

let player_instance:{destroy:()=>void}

onMounted(() => {
    // WARN Player will default to taking over <body> if div doesn't exist, so double check
    if (episode.value?.audio && player_div.value){
        player_instance = new Player({
            container: player_div.value,
            audio: {
                src: episode.value.audio,
                title: ' ',
                artist: episode.value.title,
                cover: episode.value.image,
                duration: (episode.value.duration as number) / 1000,
            },
            themeColor: '#26d985',  // Works on either dark or light
            speedOptions: [0.75, 1.25, 1.5, 1.75, 2],
            download: true,
            fixed: {
                type: 'static',
            },
        })
    }
})

onBeforeUnmount(() => {
    if (player_instance){
        player_instance.destroy()
    }
})


</script>


<style lang='sass' scoped>

.player
    margin: 24px 0

.player :deep(.shk-player)
    border-radius: 12px
    @media (max-width: 640px)
        padding: 16px !important  // Override default
    overflow: hidden
    margin-bottom: 12px

    .shk-cover
        border-radius: 12px

    .shk-text
        align-self: center

    .shk-artist
        white-space: inherit

    .shk-title_wrap
        display: none

</style>
