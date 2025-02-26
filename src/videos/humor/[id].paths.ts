
import items from '../../videos_humor.json'


export default {
    paths(){
        return items.map(item => ({params: item}))
    },
}
