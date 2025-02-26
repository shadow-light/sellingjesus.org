
<template lang='pug'>

blockquote
    div.fetch-bible(v-html='html' class='no-notes no-headings no-red-letter no-chapters')
    p.info {{ passage }} (BSB)

</template>


<script lang='ts' setup>

import {ref} from 'vue'

import {get_passage} from './fetch'


const props = defineProps({passage: String})

const html = ref('')


get_passage(props.passage ?? '').then(result => {
    if (!result){
        return
    }
    html.value = result
})

</script>


<style lang='sass' scoped>

.info a
    font-weight: bold
    color: inherit

</style>
