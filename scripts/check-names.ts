import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
    const payload = await getPayload({ config: configPromise })

    for (const slug of ['file-carver', 'hex-diff']) {
        console.log(`\n--- SLUG: ${slug} ---`)
        for (const lang of ['es', 'en']) {
            const docs = await payload.find({
                collection: 'tools',
                where: { slug: { equals: slug } },
                locale: lang as any
            })
            if (docs.docs[0]) {
                const d = docs.docs[0]
                console.log(`[${lang}] title: "${d.title}" | codeKey: "${d.codeKey}"`)
            }
        }
    }
    process.exit(0)
}
run()
