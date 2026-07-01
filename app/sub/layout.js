import HideChatling from '@/components/HideChatling'

// Wraps all /sub/* routes — strip the global chat widget from these pages.
export default function SubLayout({ children }) {
  return (
    <>
      <HideChatling />
      {children}
    </>
  )
}
