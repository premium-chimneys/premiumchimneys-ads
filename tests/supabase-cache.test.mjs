import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cachedSupabaseFetch, createCachedClient, SUPABASE_CACHE_TAG, SUPABASE_REVALIDATE_SECONDS } from '../lib/supabase-cache.mjs'
import { sourceFiles } from './source-scan.mjs'

function withFetchSpy(run) {
  const calls = []
  const original = globalThis.fetch
  globalThis.fetch = async (input, init) => { calls.push({ input, init }); return new Response('[]') }
  return Promise.resolve(run(calls)).finally(() => { globalThis.fetch = original })
}

test('every Supabase read is put in the Next Data Cache with a revalidate window and tag', () => withFetchSpy(async (calls) => {
  await cachedSupabaseFetch('https://example.supabase.co/rest/v1/cities?select=*', { headers: { apikey: 'x' } })
  await cachedSupabaseFetch('https://example.supabase.co/rest/v1/cities?select=*', { method: 'HEAD' })
  for (const { init } of calls) {
    assert.equal(init.cache, 'force-cache')
    assert.ok(init.next.revalidate >= 300, 'revalidate window too short to protect the quota')
    assert.equal(init.next.revalidate, SUPABASE_REVALIDATE_SECONDS)
    assert.deepEqual(init.next.tags, [SUPABASE_CACHE_TAG])
  }
  assert.equal(calls[0].init.headers.apikey, 'x', 'request options must be preserved')
}))

test('writes are never cached', () => withFetchSpy(async (calls) => {
  await cachedSupabaseFetch('https://example.supabase.co/rest/v1/t', { method: 'POST', body: '{}' })
  assert.equal(calls[0].init.cache, undefined)
  assert.equal(calls[0].init.next, undefined)
}))

test('the shared client hands supabase-js the cached fetch', () => {
  let options
  createCachedClient((url, key, opts) => { options = opts }, 'https://x.supabase.co', 'anon')
  assert.equal(options.global.fetch, cachedSupabaseFetch)
  assert.equal(options.auth.persistSession, false)
})

// The regression this guards: a page creating its own Supabase client, or
// calling the REST API with plain fetch, reads the database on every request.
test('no Supabase client or REST call bypasses lib/supabase-cache.mjs', () => {
  const offenders = []
  for (const { path, text } of sourceFiles('app', 'components', 'lib')) {
    if (path === 'lib/supabase-cache.mjs') continue
    if (/\bcreateClient\s*\(/.test(text)) offenders.push(`${path}: creates its own Supabase client`)
    if (/['"`][^'"`]*\/rest\/v1\//.test(text)) offenders.push(`${path}: calls the Supabase REST API directly`)
  }
  assert.deepEqual(offenders, [])
})

// force-dynamic turns every fetch into no-store, cache option or not, so a
// route that reads landing content must not set it.
test('no route that reads Supabase opts out of the fetch cache', () => {
  const offenders = sourceFiles('app')
    .filter(({ text }) => /dynamic\s*=\s*['"]force-dynamic['"]|fetchCache\s*=\s*['"](force|only|default)-no-store['"]|revalidate\s*=\s*0\b/.test(text))
    .filter(({ text }) => /from\s+['"]@\/lib\/(get[A-Z]\w*|landingContent)['"]/.test(text))
    .map(({ path }) => path)
  assert.deepEqual(offenders, [])
})
