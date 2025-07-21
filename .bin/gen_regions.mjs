// Execute to generate src/_comp/regions.json

import {writeFileSync} from 'node:fs'

import iso3166 from 'iso3166-2-db/i18n/dispute/UN/en.json' with {type: 'json'}


const countries = Object.entries(iso3166).map(([code, data]) => {
    const regions = data.regions.map(region => ({name: region.name, code: region.iso}))
    regions.sort((a, b) => a.name.localeCompare(b.name))
    return {
        code,
        name: data.name,
        regions,
    }
})
countries.sort((a, b) => a.name.localeCompare(b.name))

writeFileSync('src/_comp/regions.json', JSON.stringify(countries))
