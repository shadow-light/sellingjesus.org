
<template lang='pug'>

ResourcePreview(v-if='article' :url='article.url' :image='article.frontmatter.image'
    :title='article.frontmatter.title' :desc='article.frontmatter.description' :short='short')

</template>


<script lang='ts' setup>

import {computed} from 'vue'

import ResourcePreview from './ResourcePreview.vue'
import {data as articles_data} from '../articles.data'

const props = defineProps<{id:string, short?:boolean}>()

const article = computed(() => articles_data.find(p => p.url.endsWith(`/${props.id}`)))

</script>


<style lang='sass' scoped>


</style>
