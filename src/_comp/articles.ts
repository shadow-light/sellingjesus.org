
export const articles_by_category:Record<string, string[]> = {
    "Freely Giving": [
        'freely-give',
        'freely-give-today',
        'scope',
    ],
    "Supporting Ministry": [
        'defining-ministry',
        'biblical-funding',
        'colabor',
    ],
    "Selling Ministry": [
        'commerce-condemned',
        'sincerity',
        'buying',
        'judas',
        'prostitutes-wages',
    ],
    "Specific Passages": [
        'selling-truth',
        'commercializing-gods-word',
        '1cor9',
        '1cor9-authority',
        'temple-cleansing',
    ],
    "History": [
        'simony',
    ],
    "Application": [
        'should-preachers-be-paid',
        'paying-pastors',
        'covering-costs',
        'biblical-counseling',
        'counseling-fees',
        'ads',
        'pragmatism',
    ],
    "Copyright & Licensing": [
        'copyright-jesus-command-to-freely-give',
        'copyright-and-the-bible',
        'abuse',
        'letting-go',
        'copyright-hijacking',
        'sharealike',
    ],
    "Contemporary Commerce": [
        'bible-publishers',
        'worship-tax',
        'acbc',
        'kjv',
        'blood-money',
    ],
}


export const article_ids = Object.values(articles_by_category).flat()
