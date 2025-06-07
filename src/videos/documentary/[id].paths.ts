
import items from '../../videos_doc.json'

// Videos that have a manually added markdown file
// Need to skip otherwise localSearch plugin complains about duplicate ids
const manually_added = ['fDoApqyqIG4']

export default {
    paths(){
        return items.filter(i => !manually_added.includes(i.id)).map(item => ({params: item}))
    },
}
