import OptimizedTracking from '@/components/tracking/OptimizedTracking'

// V2 is the only variant with its own third-party loading schedule, so it is
// the only one that mounts OptimizedTracking. Everything else in the app
// mounts LegacyTracking and is byte-for-byte unchanged.
//
// This wraps only /[service]/[city]/v2 — V1 sits at /[service]/[city] and
// never renders through here.
export default function V2Layout({ children }) {
  return (
    <>
      {children}
      <OptimizedTracking />
    </>
  )
}
