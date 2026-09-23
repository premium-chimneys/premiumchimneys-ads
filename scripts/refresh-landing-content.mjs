import { createClient } from '@supabase/supabase-js'
import nextEnv from '@next/env'
import { writeFile, rename, readFile } from 'node:fs/promises'

nextEnv.loadEnvConfig(process.cwd())
const destination = new URL('../data/landing-content.json', import.meta.url)
const brand = 'Premium Chimneys'
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function rows(table, columns = '*', branded = false) {
  const all = []
  for (let offset = 0; ; offset += 500) {
    let query = db.from(table).select(columns).order('id').range(offset, offset + 499)
    if (branded) query = query.eq('brand', brand)
    const { data, error } = await query.abortSignal(AbortSignal.timeout(10000))
    if (error) throw error
    all.push(...data)
    if (data.length < 500) break
  }
  if (!all.length) throw new Error(`${table} was empty; keeping the previous snapshot`)
  return all
}

try {
  const [cities, services, landing_v2, v2_hero_images] = await Promise.all([
    rows('cities', '*', true),
    rows('services', '*, service_gallery(sort_order, image_url, image_url_small, scope, title, result, alt)', true),
    rows('landing_v2'),
    rows('v2_hero_images'),
  ])
  const snapshot = { generatedAt: new Date().toISOString(), cities, services, landing_v2, v2_hero_images }
  const temporary = new URL('../data/landing-content.json.tmp', import.meta.url)
  await writeFile(temporary, JSON.stringify(snapshot, null, 2) + '\n')
  await rename(temporary, destination)
  console.log(`Bundled landing content: ${cities.length} cities, ${services.length} services.`)
} catch (error) {
  const previous = JSON.parse(await readFile(destination, 'utf8'))
  if (!previous.cities?.length || !previous.services?.length || !previous.landing_v2?.length || !previous.v2_hero_images?.length) throw error
  console.warn(`Landing content refresh failed; keeping snapshot from ${previous.generatedAt}: ${error.message}`)
  if (process.argv.includes('--strict')) process.exitCode = 1
}
