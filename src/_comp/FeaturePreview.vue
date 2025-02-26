
<template lang='pug'>

a.preview(:href='url')
    img(:src='image')
    div.text
        h3 {{ title }}
        div.desc {{ desc }}

</template>


<script lang='ts' setup>

const props = defineProps<{url:string, image:string, title:string, desc:string}>()

</script>


<style lang='sass' scoped>

.preview
    display: inline-flex
    align-items: center
    font-family: var(--vp-font-family-base)
    font-weight: normal  // Vitepress is 500 for <a>
    margin: 12px 0
    border-radius: 12px
    overflow: hidden
    width: 100%
    background-color: hsl(152, 60%, 40%, 0.1)
    color: inherit

    &:hover
        text-decoration: none
        filter: brightness(80%)
        color: inherit

    img
        width: 100%
        max-width: 200px
        aspect-ratio: 3 / 2
        object-fit: cover
        border-radius: 0

    .text
        padding: 14px 18px
        line-height: 1.3
        width: 100%

    h3
        font-size: 20px
        font-weight: bold
        margin: 0 0 8px 0
        line-height: 1.3

    .desc
        font-size: 14px

    @media (max-width: 600px)
        flex-direction: column

        img
            aspect-ratio: 2 / 1
            width: 100%
            max-width: none

        .text
            padding: 18px

        h3
            font-size: 15px
            margin-bottom: 6px

        .desc
            font-size: 12px




</style>
