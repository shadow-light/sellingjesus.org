---
navbar: false
outline: [1, 2]
---

<script lang='ts' setup>

import {data as articles_data} from './book.data'


// Util to demote all headings in HTML
function demote_headings(html){
    return html.replace(/<(\/?)h([1-6])\b/g, (_, slash, level) => {
        let newLevel = Math.min(parseInt(level) + 1, 6)
        return `<${slash}h${newLevel}`
    })
}


// Convert to object with ids
const articles = Object.fromEntries(articles_data.map(a => [a.url.split('/').pop(), a]))


// Explicitly exclude
delete articles['response-dr-b']


// Hard-code order of articles by section
const sections = {
    "Freely Give": ['freely-give', 'freely-give-today', 'scope'],
    "History": ['simony'],
    "Theology": ['commerce-condemned', 'biblical-funding', 'colabor', 'defining-ministry', 'sincerity', 'buying', 'judas'],
    "Specific Passages": ['selling-truth', 'temple-cleansing', '1cor9', '1cor9-authority', 'commercializing-gods-word'],
    "Application": ['should-preachers-be-paid', 'paying-pastors', 'covering-costs', 'biblical-counseling', 'counseling-fees', 'ads', 'blood-money', 'pragmatism'],
    "Licensing & Copyright": ['copyright-jesus-command-to-freely-give', 'copyright-and-the-bible', 'letting-go', 'abuse', 'copyright-hijacking', 'sharealike'],
    "Specific Ministries": ['bible-publishers', 'worship-tax', 'acbc', 'kjv'],
}


// Add any not yet hardcoded to "Additional" section
// NOTE Should move out of this section before actually publishing, it's just to ensure nothing missed
const all_hardcoded = Object.values(sections).flat()
const additional = []
for (const id in articles){
    if (!articles[id].frontmatter.category){
        continue  // No category is for April fools etc
    }
    if (!all_hardcoded.includes(id)){
        additional.push(id)
    }
}
if (additional.length){
    sections["Additional"] = additional
}


// Concat all by section
let articles_html = ''
let ch = 1
for (const section in sections){

    articles_html += `<h1 id="${section}">${section}</h1>`

    for (const article_id of sections[section]){
        const article = articles[article_id]
        // Add titles/etc before concating
        const title = article.frontmatter.title_h1 || article.frontmatter.title
        const subtitle = article.frontmatter.title_h2
        articles_html += `<h2 id="${article_id}">${ch}. ${title}</h2>`
        if (subtitle){
            articles_html += `<div class="subtitle">${subtitle}</div>`
        }
        articles_html += demote_headings(article.html)
        ch++
    }
}

</script>


<style lang='sass' scoped>

:deep(h1)
    font-size: 30px

</style>


# Selling Jesus
The book...

<div v-html='articles_html' />
