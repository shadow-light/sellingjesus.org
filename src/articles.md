
<script lang='ts' setup>

import {data} from './articles.data'


const article_ids = data
    .filter(page => !!page.frontmatter.category)
    .map(page => /([^\/]+)$/.exec(page.url)[1])


</script>


# Articles

<ArticlePreview v-for='article of article_ids' :key='article' :id='article'></ArticlePreview>
