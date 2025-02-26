
<template lang='pug'>

h1 {{ frontmatter.title }}
p.meta(v-if='date') {{ date }} &mdash; {{ frontmatter.author }}
img(v-if='frontmatter.image' :src='frontmatter.image')

</template>


<script lang='ts' setup>

import {useData} from 'vitepress'
import {onMounted, ref} from 'vue'

import {nice_date, ssr_date} from '../utils'


const {page, frontmatter} = useData()


const date = ref(ssr_date(new Date(frontmatter.value.date)))

onMounted(() => {
    date.value = nice_date(new Date(frontmatter.value.date))
})

</script>


<style lang='sass' scoped>

.meta
    margin: 1em 0
    opacity: 0.8

img
    margin-top: 24px
    margin-bottom: 48px
    border-radius: 8px
    object-fit: cover
    aspect-ratio: 16 / 9

</style>
