
<template lang='pug'>

div.type(class='ui')
    a(href='/videos/documentary' :class='{active: active === "doc"}') Informative
    a(href='/videos/reactions' :class='{active: active === "reactions"}') Reactions
    a(href='/videos/humor' :class='{active: active === "humor"}') Humor

</template>


<script lang='ts' setup>

const props = defineProps<{active:'doc'|'humor'|'reactions'}>()

</script>


<style lang='sass' scoped>

.type
    display: flex
    justify-content: center

    a
        padding: 4px 16px
        border-radius: 8px
        font-size: 16px
        text-align: center
        color: var(--vp-c-text-1)

        &:first-child
            margin-right: 12px

        &:last-child
            margin-left: 12px

        &:hover
            text-decoration: none
            background-color: var(--vp-c-gray-soft)

        &.active
            background-color: var(--vp-c-brand-soft)


</style>
