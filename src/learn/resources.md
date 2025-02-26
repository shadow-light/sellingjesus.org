
<script lang='ts' setup>

import {cloneDeep} from 'lodash-es'

import ResourcePreview from '@/_comp/ResourcePreview.vue'
import {categories} from './resources_processed.json'
import {data as articles} from '../articles.data'


// Auto-add some own articles into list of resources
const relevant_articles = {
    'Licensing & Copyright': ['copyright-jesus-command-to-freely-give', 'letting-go', 'sharealike', 'copyright-and-the-bible'],
}
const new_categories = cloneDeep(categories)
for (const category of new_categories){
    for (const article_id of (relevant_articles[category.category] ?? [])){
        const article = articles.find(p => p.url.endsWith(`/${article_id}`))
        if (article){
            category.resources.push({
                title: article.frontmatter.title,
                file: article.url,
                authors: article.frontmatter.author,
                description: article.frontmatter.description,
                image: article.frontmatter.image,
                paywall: false,
            })
        }
    }
}


</script>


<style lang='sass' scoped>

.desc
    font-size: 0.9em
    color: var(--vp-c-text-2)
    margin-bottom: 36px

</style>


# Books and Other Resources

We recommend reading _[The Dorean Principle](https://thedoreanprinciple.org/)_ first, then _[The Christian Commons](https://www.unfoldingword.org/publications/the-christian-commons)_, both of which can be read for free online.

<template v-for='(category, i) of new_categories' :key='category.category'>
    <h2 :id='`category-${i+1}`'>{{ category.category }}</h2>
    <template v-for='resource of category.resources' :key='resource.file'>
        <ResourcePreview
            :title='resource.title'
            :desc='resource.authors'
            :image='resource.image'
            :url='resource.file'
            :paywall='String(resource.paywall)'
            square
        ></ResourcePreview>
        <div class='desc' v-html='resource.description'></div>
    </template>
</template>
