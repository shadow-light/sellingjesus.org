
<script lang='ts' setup>

import {useData} from 'vitepress'


const {params} = useData()

</script>


<style lang='sass' scoped>

h1
    font-size: 2em

</style>


# {{ $params.title }}

<YouTube :id='params.id' />

<div v-html='$params.description_html'></div>
