
export function nice_date(date:Date|null):string{
    // Get date as a localised string
    // WARN Safari doesn't support `dateStyle`
    return !date ? '' : date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}


export function ssr_date(date:Date|null):string{
    // Get date in US format in UTC timezone, so compatible with SSR (same everywhere)
    return !date ? '' : date.toLocaleDateString('en-us', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    })
}
