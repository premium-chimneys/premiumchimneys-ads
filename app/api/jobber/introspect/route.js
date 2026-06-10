import { jobberGraphQLRaw } from '@/lib/jobber'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// TEMPORARY introspection route (PREVIEW_SECRET ?key= gated). Single light call:
// the JobLineItem type's fields, to find the per-line cost + quantity fields so
// we can sum cumulative parts cost from a job. Delete once the mapping is set.
const JOB_LINE_ITEM_QUERY = `
  query JobLineItemFields {
    __type(name: "JobLineItem") {
      name
      fields {
        name
        type { kind name ofType { kind name ofType { kind name ofType { kind name } } } }
      }
    }
  }
`

export async function GET(request) {
  const secret = process.env.PREVIEW_SECRET
  if (!secret || request.nextUrl.searchParams.get('key') !== secret) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const res = await jobberGraphQLRaw(JOB_LINE_ITEM_QUERY)
  const t = res.ok ? res.data?.__type : null

  const jobLineItemFields = res.ok
    ? {
        ok: true,
        status: res.status,
        name: t?.name ?? null,
        fields: Array.isArray(t?.fields)
          ? t.fields.map((f) => ({ name: f.name, type: f.type }))
          : null,
      }
    : res // raw { ok, status, data, errors } on transport/GraphQL error

  return Response.json({ jobLineItemFields })
}
