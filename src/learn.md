---
aside: false
---

<script lang='ts' setup>

import {data as articles} from './articles.data'


// Group articles by category
// NOTE Main categories/articles hard-coded to preserve order, but more may be added (to end)
const categories = {
    "Freely Give": ['freely-give'],
    "Theology": ['commerce-condemned', 'biblical-funding', 'colabor', 'defining-ministry'],
    "Application": ['should-preachers-be-paid', 'paying-pastors', 'biblical-counseling', 'counseling-fees', 'ads'],
    "Licensing & Copyright": ['copyright-jesus-command-to-freely-give', 'copyright-and-the-bible', 'letting-go'],
    "Specific Passages": ['selling-truth', 'temple-cleansing', '1cor9', '1cor9-authority', 'commercializing-gods-word'],
    "Specific Ministries": ['bible-publishers', 'worship-tax', 'acbc'],
    "History": ['simony'],
    "Responses": [],
}

for (const article of articles){

    // Ignore if no category
    const category = article.frontmatter.category
    if (!category){
        continue
    }

    // Add category if it hasn't been hard-coded (for order) yet
    if (! (category in categories)){
        categories[category] = []
    }

    // Add article
    const article_id = article.url.split('/').pop()
    if (!categories[category].includes(article_id)){
        categories[category].push(article_id)
    }
}

</script>

<style lang='sass' scoped>

@media (min-width: 1300px)
    .categories, .conversations, .study
        display: grid
        grid-template-columns: 1fr 1fr
        column-gap: 48px

.profiles
    display: flex
    justify-content: space-around
    margin-top: 24px

    a
        flex-grow: 1
        flex-basis: 0
        display: flex
        flex-direction: column
        align-items: center
        text-align: center
        img
            width: 120px
            height: 120px
            border-radius: 50%
            object-fit: cover
            margin-bottom: 12px

    @media (max-width: 800px)
        a
            font-size: 14px
            line-height: 1.25
            img
                width: 60px
                height: 60px

.categories
    h3
        text-transform: uppercase
        background-color: hsl(50, 100%, 50%, 0.25)
        padding: 8px
        border-radius: 4px

</style>


# Ministry should be supported, not sold.
We're a group of pastors and disciples of Jesus, who love him and want everyone to have free access to truth about him. The commercialization of ministry deeply concerns us, practically and theologically. We hope you'll take a moment to carefully consider God's Word on this matter.

## Conversations

<div class='conversations'>
    <FeaturePreview url='/learn/conversations' image='/_assets/learn/conversations.jpg'
        title="Conversations about Selling Jesus" desc="Learn more about foundational issues around the Jesus-trade through a series of conversations between Tim and his pastor."></FeaturePreview>
    <FeaturePreview url='/learn/corinthians' image='/_assets/learn/corinthians.jpg'
        title="Conversations between Paul and the Corinthians" desc="Follow the flow of Paul's teaching on finance to the Corinthians across his letters to them."></FeaturePreview>
</div>


## Christians Who Sell Jesus

<div class='profiles'>
    <a href='/learn/profiles#joe-the-author'>
        <img src='/media/joe-the-author.jpg'>
        Joe the Author
    </a>
    <a href='/learn/profiles#steve-the-biblical-counselor'>
        <img src='/media/steve-the-biblical-counselor.jpg'>
        Steve the Biblical Counselor
    </a>
    <a href='/learn/profiles#james-the-worship-composer'>
        <img src='/media/james-the-worship-composer.jpg'>
        James the Worship Composer
    </a>
    <a href='/learn/profiles#susan-the-bible-study-author'>
        <img src='/media/susan.jpg'>
        Susan the Bible Study Author
    </a>
    <a href='/learn/profiles'>
        <img src='/_assets/learn/profiles.jpg'>
        10 more ...
    </a>
</div>


## Articles

<div class='categories'>
    <div v-for='[category, articles] in Object.entries(categories)'>
        <h3>{{ category }}</h3>
        <ArticlePreview v-for='(article, i) of articles' :id='article' :short='i !== 0'></ArticlePreview>
    </div>
</div>


## Further Study
<div class='study'>
    <FeaturePreview url='/learn/objections' image='/_assets/learn/objections.jpg'
        title="Common Objections" desc="Have your concerns answered."></FeaturePreview>
    <FeaturePreview url='/learn/resources' image='/_assets/learn/resources.jpg'
        title="Books and Other Resources" desc="Dive deeper into the historical, practical, exegetical, and theological matters related to the commercialization of Christianity."></FeaturePreview>
</div>

&nbsp;

<div style='text-align: center;'>
    <VPButton href="/act" text="Take Action"></VPButton>
</div>
