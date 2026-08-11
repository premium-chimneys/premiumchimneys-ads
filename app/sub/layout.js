import HideChatling from '@/components/HideChatling'
import LegacyTracking from '@/components/tracking/LegacyTracking'

// Wraps all /sub/* routes — strip the global chat widget from these pages.
export default function SubLayout({ children }) {
  return (
    <>
      <HideChatling />
      {children}
      {/* Same scripts these routes already loaded from the root layout. */}
      <LegacyTracking />
    </>
  )
}
