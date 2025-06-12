
<template lang='pug'>

template(v-if='file_id === "conversations" && !book')
    div(v-for='(topic, i) of topics')
        a(:href='`#topic-${i+1}`')
            h3 {{ topic.heading }}

div(v-for='(topic, i) of topics')
    component(:is='book ? "h3" : "h2"' :id='`topic-${i+1}`') {{ topic.heading }}
    div(v-html='topic.description')
    podcast-player(v-if='topic.podcast' :id='topic.podcast')
    div
        div.msg(v-for='(message, i) of topic.messages')
            img(:src='`/_assets/convos/${file_id}_${i % 2 === 0 ? "asker" : "responder"}.jpg`')
            div.txt(v-html='message')

</template>


<script lang='ts' setup>

const props = defineProps<{
    file_id:string,
    topics:{heading:string, description?:string, podcast?:string, messages:string[]}[],
    book?:boolean,
}>()

</script>


<style lang='sass' scoped>

h2, h3
    margin-bottom: 36px

.msg
    display: flex

img
    position: relative
    top: -10px
    width: 48px
    height: 48px
    border-radius: 50% !important
    margin: 0  // To counter default auto margin for images

.txt
    padding: 6px 12px
    border-radius: 6px
    margin-bottom: 24px
    position: relative

    > :deep(*:first-child)
        margin-top: 0 !important

    > :deep(*:last-child)
        margin-bottom: 0 !important

    &:after
        content: ' '
        position: absolute
        width: 0
        height: 0
        top: 0px
        border: 10px solid transparent

.msg:nth-of-type(odd)

    img
        margin-right: 24px

    .txt
        background-color: var(--solid-bg)
        @media (min-width: 600px)
            margin-right: 100px

        &:after
            left: -10px
            border-top-color: var(--solid-bg)

.msg:nth-of-type(even)
    flex-direction: row-reverse

    img
        margin-left: 24px

    .txt
        background-color: var(--vp-c-bg-soft)
        @media (min-width: 600px)
            margin-left: 100px

        &:after
            right: -10px
            border-top-color: var(--vp-c-bg-soft)

</style>
