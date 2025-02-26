
<template lang='pug'>

div.person(v-if='person' class='vp-doc')

    div.identity
        img(:src='person.image')
        div.cred
            h3 {{ person.name }}
            h4
                span.title {{ person.title }}
                span.edu {{ person.degrees }}
        a.website(v-if='person.site' :href='person.site' target='_blank' title="Website")
            svg(viewBox='0 0 48 48')
                path(d='M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h13.95v3H9v30h30V25.05h3V39q0 1.2-.9 2.1-.9.9-2.1.9Zm10.1-10.95L17 28.9 36.9 9H25.95V6H42v16.05h-3v-10.9Z')

    div
        p {{ person.bio }}
        p.quote(v-if='person.quote') #[span.q1 “]{{ person.quote }}#[span.q2 ”]

</template>


<script lang='ts' setup>

import {computed} from 'vue'

import {people} from '../people.json'


const props = defineProps({name: String})

const person = computed(() => people.find(p => p.name === props.name))

</script>


<style lang='sass' scoped>

.person
    border: 1px solid #8885
    border-radius: 12px
    padding: 12px
    @media (min-width: 800px)
        padding: 24px
    margin: 24px 0
    font-size: 18px

    p
        font-size: inherit

    .identity
        display: flex
        align-items: center

        img
            width: 80px
            height: 80px
            border-radius: 40px
            margin-right: 24px

        .cred
            flex-grow: 1

            h3
                margin-top: 0
                margin-bottom: 8px

            .title
                margin-right: 12px

            .edu
                opacity: 0.7
                font-size: 0.8em

        .website
            align-self: flex-start
            width: 48px
            height: 48px
            display: flex
            align-items: center
            justify-content: center
            cursor: pointer

            svg
                width: 24px
                height: 24px
                fill: currentColor

    .quote
        font-style: italic
        opacity: 0.8

        span
            font-size: 2.2em
            opacity: 0.4
            font-weight: bold
            vertical-align: middle
            line-height: 0

            &.q1
                margin-right: 12px

            &.q2
                margin-left: 4px

</style>
