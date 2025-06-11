
<script lang='ts' setup>

import {useData} from 'vitepress'


const {params} = useData()

const url_base = `https://sellingjesus.s3.us-west-2.amazonaws.com/videos/`
const download_url = params.value.filename ? url_base + params.value.filename : null

</script>


<style lang='sass' scoped>

h1
    font-size: 2em

iframe
    margin-bottom: 12px

.download
    margin-bottom: 12px
    text-align: right

</style>


# {{ $params.title }}

<YouTube :id='params.id' />

<div v-if='download_url' class='download'>
    <VPButton text="Download (4K)" :href="download_url" />
</div>

<div v-html='$params.description_html'></div>
