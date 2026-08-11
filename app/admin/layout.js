import HideChatling from '@/components/HideChatling'
import LegacyTracking from '@/components/tracking/LegacyTracking'

export const metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AdminLayout({ children }) {
  return (
    <>
      <HideChatling />
      {children}
      {/* Same scripts these routes already loaded from the root layout. */}
      <LegacyTracking />
    </>
  )
}
