
<template lang='pug'>

ResourcePreview(:url='url' :image='poster' :title='episode.title'
    :desc='episode.description')

</template>


<script lang='ts' setup>

import {computed} from 'vue'

import ResourcePreview from './ResourcePreview.vue'


const props = defineProps<{episode:{id:string, title:string, description:string, number:number, type:string}}>()

const url = computed(() => {
    const type_long = props.episode.type === 'doc' ? 'documentary' : props.episode.type
    return `/videos/${type_long}/${props.episode.id}`
})
const poster = computed(() =>
    `https://img.youtube.com/vi/${props.episode.id}/hq720.jpg`)

</script>


<style lang='sass' scoped>


</style>
