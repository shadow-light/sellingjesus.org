
import fs from 'node:fs'
import path from 'node:path'


// Input
const language = process.argv[2]
const api_key = process.env.OPENAI_KEY
if (language.length !== 2){
    throw new Error("Pass language code as arg")
}


async function translate_md(content) {
    const sys_prompt = `Translate all human text into ${language}, but preserve all Markdown and HTML formatting. These are Christian theological articles. Translate quotes and Bible verses. Translate the text contents of any HTML, including within tables. Translate link text but don't change the URLs. Never translate Greek or Hebrew.`

    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-5',
            instructions: sys_prompt,
            input: content,
        })
    })

    const data = await response.json()
    try {
        return data.output.find(i => i.type === 'message').content[0].text
    } catch {
        throw new Error(JSON.stringify(data))
    }
}


// Translate dirs
const lang_dir = language
const dirs = ['articles']


for (const dir of dirs){

    // Ensure outdir exists
    const out_dir = path.join(lang_dir, dir)
    fs.mkdirSync(out_dir, {recursive: true})

    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))){

        // Determine paths
        const in_file = path.join(dir, file)
        const out_file = path.join(out_dir, file)
        console.log(`Translating: ${in_file} → ${out_file}`)

        // Translate file
        const content = fs.readFileSync(in_file, 'utf8')
        const translated = await translate_md(content)
        fs.writeFileSync(out_file, translated + '\n', 'utf8')
    }
}
