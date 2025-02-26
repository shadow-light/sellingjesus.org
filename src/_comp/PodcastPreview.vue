
<template lang='pug'>

ResourcePreview.rp(:url='url' :image='pod.image' :number='pod.number' :title='pod.title'
    :desc='pod.description' square)

</template>


<script lang='ts' setup>

import {computed} from 'vue'

import ResourcePreview from './ResourcePreview.vue'


const props = defineProps<{pod:{id:string, title:string, description:string, number:number, image:string}}>()

const url = computed(() => `/podcast/${props.pod.id}`)

</script>


<style lang='sass' scoped>

.rp
    margin: 0

@media (max-width: 599px)

    .rp
        flex-direction: row !important
        :deep()
            h3
                font-size: 14px !important
            .img
                margin-right: 24px
                @media (max-width: 800px)
                    max-width: 48px !important
            .desc
                display: none

</style>
