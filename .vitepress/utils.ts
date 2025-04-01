
export function nice_date(date:Date|null, locale?:string):string{
    // Get date as a localised string
    // WARN timeZone always UTC so always same as entered in articles (assumes date is UTC too)
    // WARN Safari doesn't support `dateStyle`
    return !date ? '' : date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    })
}
