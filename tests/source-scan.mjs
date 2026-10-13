// Helpers for the tests that guard the Supabase quota fixes by reading source.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = fileURLToPath(new URL('..', import.meta.url))

const SOURCE = /\.(m?js|jsx)$/

// Every source file under the given top-level folders, as { path, text } with
// forward-slash paths relative to the repo root.
export function sourceFiles(...dirs) {
  const out = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) walk(full)
      else if (SOURCE.test(name)) out.push({ path: relative(ROOT, full).split(sep).join('/'), text: readFileSync(full, 'utf8') })
    }
  }
  for (const dir of dirs) walk(join(ROOT, dir))
  return out
}

// Each JSX element `<tag ...>` in the text, from its name to the end of its
// opening tag. Attribute expressions are balanced on braces so an arrow
// function inside one does not end the tag early.
export function jsxElements(text, tag) {
  const out = []
  const open = new RegExp(`<${tag}(?=[\\s/>])`, 'g')
  let match
  while ((match = open.exec(text))) {
    let depth = 0
    let i = match.index + match[0].length
    for (; i < text.length; i++) {
      const c = text[i]
      if (c === '{') depth++
      else if (c === '}') depth--
      else if (c === '>' && depth === 0) break
    }
    out.push({ source: text.slice(match.index, i + 1), line: text.slice(0, match.index).split('\n').length })
  }
  return out
}
