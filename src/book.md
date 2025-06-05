---
navbar: false
outline: [1, 2]
---

<script lang='ts' setup>

import {data as articles_data} from './book_articles.data'
import {data as profiles_data} from './book_profiles.data'


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
    "Theology": ['defining-ministry', 'commerce-condemned', 'biblical-funding', 'colabor', 'sincerity', 'buying', 'judas'],
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
let ch = 2
for (const section in sections){

    articles_html += `<h1 id="${section}">${section}</h1>`

    for (const article_id of sections[section]){
        const article = articles[article_id]

        // Add titles/etc before concating
        articles_html += '<div class="titles">'
        const title = article.frontmatter.title_h1 || article.frontmatter.title
        const subtitle = article.frontmatter.title_h2
        articles_html += `<h2 id="${article_id}">${ch}. ${title}</h2>`
        if (subtitle){
            articles_html += `<div class="subtitle">${subtitle}</div>`
        }
        articles_html += `<div class="author">${article.frontmatter.author}</div>`
        articles_html += '</div>'
        articles_html += demote_headings(article.html)
        ch++
    }
}


// Prepare profiles HTML
const profiles_title = `
    <div class="titles">
        <h2 id="profiles">1. Christians Who Sell Jesus</h2>
        <div class="author">Andrew Case</div>
    </div>
`
const profiles_html = demote_headings(profiles_data[0].html)
    .replace(/<h2.*?<\/h2>/, profiles_title)



</script>


<style lang='sass' scoped>

:deep(.articles_html), :deep(.profiles_html)

    h1
        break-before: page

    .titles
        break-before: page
        text-align: center !important

        .author
            font-style: italic

:deep(.profiles_html)
    img
        display: none

</style>


# Selling Jesus
### Abolish the Jesus Trade
Preface...

<div class='profiles_html' v-html='profiles_html' />

<div class='articles_html' v-html='articles_html' />
