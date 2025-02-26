
import {BibleClient} from '@gracious.tech/fetch-client'


const client = new BibleClient()
const collection_promise = client.fetch_collection()


export async function get_passage(ref_str:string){
    const collection = await collection_promise
    const ref = collection.string_to_reference(ref_str)
    if (!ref){
        return null
    }
    const book = await collection.fetch_book('eng_bsb', ref.book)
    return book.get_passage_from_ref(ref, {attribute: false})
}
