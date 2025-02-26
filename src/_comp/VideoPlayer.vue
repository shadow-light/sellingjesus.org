<template lang='pug'>

video(ref='video_el' controls preload playsinline :src='fallback' :poster='poster')

</template>


<script lang='ts' setup>

import {onMounted, ref, computed} from 'vue'


const props = defineProps<{address:string}>()


const video_el = ref<HTMLVideoElement>()
const fallback = computed(() => props.address + 'fallback.mp4')
const poster = computed(() => props.address + 'poster.jpg')


onMounted(async () => {
    // Enable DASH player for video element
    const shaka = await import('shaka-player')
    try {
        shaka.polyfill.installAll()
        if (shaka.Player.isBrowserSupported()){
            const player = new shaka.Player()
            await player.attach(video_el.value)
            await player.load(props.address + 'dash.mpd')  // await so can catch failure
        }
    } catch (error){
        // Return to fallback video
        video_el.value!.src = fallback.value
        console.error(error)
    }
})

</script>


<style lang='sass' scoped>

video
    width: 100%
    aspect-ratio: 16 / 9
    border-radius: 12px

</style>
