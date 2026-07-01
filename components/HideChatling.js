'use client'
import { useEffect } from 'react'

// The gateway chat widget is injected globally from app/layout.js (shared with
// the public marketing pages, which keep it). It doesn't belong on internal/
// utility pages, so this strips the widget client-side wherever it's rendered —
// both via CSS and by removing the nodes as the async embed injects them.
export default function HideChatling() {
  useEffect(() => {
    // The gateway widget mounts a fixed launcher and panel with stable ids.
    const SELECTOR = '#sr-chat-launcher, #sr-chat-panel'

    const remove = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => el.remove())
    }

    remove()

    // The embed script loads async (afterInteractive) and may inject the widget
    // after this effect runs, so keep removing nodes as they appear.
    const observer = new MutationObserver(remove)
    observer.observe(document.documentElement, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      #sr-chat-launcher,
      #sr-chat-panel { display: none !important; }
    `}} />
  )
}
