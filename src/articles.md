
<script lang='ts' setup>

import {data} from './articles.data'
import {article_ids} from '@/_comp/articles'


const sorted_ids = data
    .map(page => /([^\/]+)$/.exec(page.url)[1])  // Just want ids but keep time-based sorting
    .filter(id => !!article_ids.includes(id))  // Only include if included in categories (i.e. exclude April Fools etc)


</script>


# Articles

<ArticlePreview v-for='article of sorted_ids' :key='article' :id='article'></ArticlePreview>
