import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
    const payload = await getPayload({ config: configPromise })
    const docs = await payload.find({ collection: 'tools', limit: 100, locale: 'es' })
    console.log('--- ESPAÑOL ---')
    docs.docs.forEach(d => console.log(`${d.slug.padEnd(20)} | ${d.title}`))

    const docsEn = await payload.find({ collection: 'tools', limit: 100, locale: 'en' })
    console.log('--- ENGLISH ---')
    docsEn.docs.forEach(d => console.log(`${d.slug.padEnd(20)} | ${d.title}`))

    process.exit(0)
}
run()
