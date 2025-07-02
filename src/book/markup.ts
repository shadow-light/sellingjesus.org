
import {PassageReference, PassageReferenceMatch, detect_references}
    from '@gracious.tech/bible-references'


// Shadow global with own constants so don't need to polyfill
const NodeFilter = {
    FILTER_ACCEPT: 1,
    FILTER_REJECT: 2,
    FILTER_SKIP: 3,
    SHOW_ALL: 0xFFFFFFFF,
}


// Util for turning a passage ref into an <a> element
function _linkify_ref(node:Text, match:PassageReferenceMatch){

    // Separate ref text from preceeding text
    const ref_node = node.splitText(match.index_from_prev_match)

    // Separate ref text from trailing text
    const remainder = ref_node.splitText(match.text.length)

    // Turn ref text into a link
    const ref_a = node.ownerDocument.createElement('a')
    ref_a.setAttribute('class', 'fb-enhancer-link')
    ref_a.textContent = match.text
    ref_node.replaceWith(ref_a)

    // Return new <a> element and newly-created trailing text node
    return {element: ref_a, ref: match.ref, remainder}
}


// Default filter that excludes headings from reference detection
export function default_filter(element:Element):boolean{
    return !['H1','H2','H3','H4','H5','H6'].includes(element.tagName)
}


// Auto-discover references in provided DOM and transform into links
export async function markup_references(root:HTMLElement,
        translations:string[]=[], always_detect_english=true, filter=default_filter)
        :Promise<{element: HTMLAnchorElement, ref:PassageReference}[]>{

    // Create DOM walker that will ignore subtrees identified by filter arg
    // NOTE Not excluding non-text nodes initially so can filter out whole subtrees if needed
    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ALL, node => {

        // Process all text nodes
        if (node.nodeType === node.TEXT_NODE){
            return NodeFilter.FILTER_ACCEPT
        }

        // Test all element nodes against user-supplied filter
        if (node.nodeType === node.ELEMENT_NODE){
            if (node.nodeName === 'A'){
                return NodeFilter.FILTER_REJECT  // Ignore all existing links
            }
            return filter(node as Element) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }

        // Reject all other node types (comments etc.)
        return NodeFilter.FILTER_REJECT
    })

    // Get all relevant text nodes in advance (as modifying DOM will interrupt walk)
    const nodes:[Text, Generator<PassageReferenceMatch, null>, PassageReferenceMatch][] = []
    while (walker.nextNode()){
        if (walker.currentNode.nodeType === walker.currentNode.TEXT_NODE){
            const detector = detect_references(walker.currentNode.textContent!)
            const match = detector.next().value
            if (match){
                // NOTE Must include detector as it preserves state for relative matches
                nodes.push([walker.currentNode as Text, detector, match])
            }
        }
    }

    // Modify collected text nodes
    const elements:{element: HTMLAnchorElement, ref:PassageReference}[] = []
    for (const [orig_node, detector, first_valid_match] of nodes){

        // Keep track of whole references and any extra ranges they have
        let same_group:HTMLAnchorElement[] = []
        const wrap_if_multiple_ranges = () => {

            // If only a single range then don't need to wrap
            if (same_group.length < 2){
                return
            }

            // Create span to group nodes and insert before first <a>
            const span = root.ownerDocument.createElement('span')
            span.classList.add('fb-enhancer-multi')
            same_group[0]!.before(span)

            // Collect nodes from first ref to last
            // NOTE This will usually include a comma and other text, e.g. Matt 10:1{,}5
            const nodes_to_move:Node[] = []
            const end_node = same_group[same_group.length-1]!
            let current_node:Node|null = same_group[0]!
            while (current_node) {
                nodes_to_move.push(current_node)
                if (current_node === end_node)
                    break
                current_node = current_node.nextSibling
            }

            // Add nodes to span
            // NOTE Have to do this after locate all nodes otherwise get error
            for (const node of nodes_to_move){
                span.appendChild(node)
            }
        }

        // Linkify the first match
        let {element, ref, remainder} = _linkify_ref(orig_node, first_valid_match)
        elements.push({element, ref})
        same_group.push(element)

        // Linkify any remaining matches too
        while (true){
            const next_ref_result = detector.next().value
            if (next_ref_result){
                const next = _linkify_ref(remainder, next_ref_result)
                remainder = next.remainder
                elements.push({element: next.element, ref: next.ref})

                // If beginning a new group, need to wrap previous
                if (next_ref_result.whole){
                    wrap_if_multiple_ranges()
                    same_group = []
                }
                same_group.push(next.element)
            } else {
                break
            }
        }

        // See if should wrap last one
        wrap_if_multiple_ranges()
    }

    return elements
}
