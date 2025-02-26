
<script lang='ts' setup>

import {useData} from 'vitepress'
import {computed} from 'vue'


const {params} = useData()

const src = computed(() =>
    `https://www.youtube-nocookie.com/embed/${params.value.id}?modestbranding=1&rel=0`)

</script>


<style lang='sass' scoped>

h1
    font-size: 2em

iframe
    margin: 2em 0

</style>


# {{ $params.title }}

<iframe :src='src' allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'></iframe>

<div v-html='$params.description_html'></div>
