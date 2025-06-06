
<template lang='pug'>

iframe(:src='src' allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')

</template>


<script lang='ts' setup>

import {computed} from 'vue'


const props = defineProps<{id:string}>()

const src = computed(() =>
    `https://www.youtube-nocookie.com/embed/${props.id}?modestbranding=1&rel=0`)

</script>


<style lang='sass' scoped>

iframe
    margin: 36px 0

</style>
