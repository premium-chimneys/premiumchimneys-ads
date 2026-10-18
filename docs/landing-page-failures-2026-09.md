# Landing-page failures: September 11-14, 2026

36 recorded service-page requests returned HTTP 500 across these 32 paths. 34 requests also had Gateway Timeout errors under the same request ID. Tracking query strings are omitted. This is the retained log evidence, not a count of unique visitors.

- [ /chimney-caps/mckinney-tx ](https://book.premiumchimneys.com/chimney-caps/mckinney-tx)
- [ /chimney-inspection/garland-tx ](https://book.premiumchimneys.com/chimney-inspection/garland-tx)
- [ /chimney-inspection/lago-vista-tx ](https://book.premiumchimneys.com/chimney-inspection/lago-vista-tx)
- [ /chimney-inspection/seattle-wa/v2 ](https://book.premiumchimneys.com/chimney-inspection/seattle-wa/v2)
- [ /chimney-inspection/tacoma-wa/v2 ](https://book.premiumchimneys.com/chimney-inspection/tacoma-wa/v2)
- [ /chimney-repair/austin-tx/v2 ](https://book.premiumchimneys.com/chimney-repair/austin-tx/v2)
- [ /chimney-repair/carrollton-tx ](https://book.premiumchimneys.com/chimney-repair/carrollton-tx)
- [ /chimney-repair/dallas-tx/v2 ](https://book.premiumchimneys.com/chimney-repair/dallas-tx/v2)
- [ /chimney-repair/new-lenox-il ](https://book.premiumchimneys.com/chimney-repair/new-lenox-il)
- [ /chimney-repair/waukegan-il ](https://book.premiumchimneys.com/chimney-repair/waukegan-il)
- [ /chimney-sweep/barrington-il ](https://book.premiumchimneys.com/chimney-sweep/barrington-il)
- [ /chimney-sweep/bastrop-tx/v2 ](https://book.premiumchimneys.com/chimney-sweep/bastrop-tx/v2)
- [ /chimney-sweep/dallas-tx/v2 ](https://book.premiumchimneys.com/chimney-sweep/dallas-tx/v2)
- [ /chimney-sweep/darien-il ](https://book.premiumchimneys.com/chimney-sweep/darien-il)
- [ /chimney-sweep/park-ridge-il ](https://book.premiumchimneys.com/chimney-sweep/park-ridge-il)
- [ /chimney-sweep/rowlett-tx ](https://book.premiumchimneys.com/chimney-sweep/rowlett-tx)
- [ /fireplace-cleaning/arlington-tx/v2 ](https://book.premiumchimneys.com/fireplace-cleaning/arlington-tx/v2)
- [ /fireplace-cleaning/lakeway-tx ](https://book.premiumchimneys.com/fireplace-cleaning/lakeway-tx)
- [ /fireplace-inspection/garland-tx ](https://book.premiumchimneys.com/fireplace-inspection/garland-tx)
- [ /fireplace-maintenance/bolingbrook-il ](https://book.premiumchimneys.com/fireplace-maintenance/bolingbrook-il)
- [ /fireplace-maintenance/plano-tx/v2 ](https://book.premiumchimneys.com/fireplace-maintenance/plano-tx/v2)
- [ /fireplace-repair/austin-tx/v2 ](https://book.premiumchimneys.com/fireplace-repair/austin-tx/v2)
- [ /fireplace-repair/bellevue-wa/v2 ](https://book.premiumchimneys.com/fireplace-repair/bellevue-wa/v2)
- [ /fireplace-repair/denton-county-tx/v2 ](https://book.premiumchimneys.com/fireplace-repair/denton-county-tx/v2)
- [ /fireplace-repair/grand-prairie-tx ](https://book.premiumchimneys.com/fireplace-repair/grand-prairie-tx)
- [ /fireplace-repair/little-elm-tx ](https://book.premiumchimneys.com/fireplace-repair/little-elm-tx)
- [ /fireplace-repair/mckinney-tx ](https://book.premiumchimneys.com/fireplace-repair/mckinney-tx)
- [ /fireplace-repair/watauga-tx ](https://book.premiumchimneys.com/fireplace-repair/watauga-tx)
- [ /gas-fireplace-repair/bastrop-tx ](https://book.premiumchimneys.com/gas-fireplace-repair/bastrop-tx)
- [ /gas-fireplace-repair/georgetown-tx ](https://book.premiumchimneys.com/gas-fireplace-repair/georgetown-tx)
- [ /gas-fireplace-repair/tacoma-wa/v2 ](https://book.premiumchimneys.com/gas-fireplace-repair/tacoma-wa/v2)
- [ /gas-fireplace-repair/tinley-park-il/v2 ](https://book.premiumchimneys.com/gas-fireplace-repair/tinley-park-il/v2)

## Resilience change

Public landing content is cached for one hour. Database reads stop after 5 seconds and are retried once. If both fail, the page render throws: ISR keeps serving the last page built from live data and retries on the next request (a URL never built before returns an error). There is no bundled snapshot; it was removed on 2026-10-18 after it served a stale Chicago address. Successful empty reads remain empty (404). Customer forms and submissions do not use this cached client.

The validation below describes the earlier snapshot design.

Validation: production build and changed-file ESLint passed. All 32 paths rendered HTTP 200 with headings when every Supabase REST request was forced to return 504; unknown city and service paths returned 404. A previously uncached V2 page also rendered HTTP 200 in 1.7 seconds with Supabase requests stalled until abort. External image storage and form submission availability are separate dependencies.
