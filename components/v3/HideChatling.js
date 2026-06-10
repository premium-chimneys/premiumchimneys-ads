'use client';
import { useEffect } from 'react';

// V2-only: the Chatling chatbot is injected globally from app/layout.js, which
// is shared with V1 and the rest of the site. We can't remove it at the source
// without affecting V1, so this component strips the widget on V2 pages only.
export default function HideChatling() {
  useEffect(() => {
    // Chatling prefixes its injected elements with "chtl-" (launcher, iframe,
    // hovering message) and the chat iframe loads from *.chatling.ai.
    const SELECTOR =
      '[id^="chtl-"], [class*="chtl-"], iframe[src*="chatling" i]';

    const remove = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => el.remove());
    };

    remove();

    // The embed script loads async (afterInteractive) and may inject the widget
    // after this effect runs, so keep removing nodes as they appear.
    const observer = new MutationObserver(remove);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      [id^="chtl-"],
      [class*="chtl-"],
      iframe[src*="chatling" i] { display: none !important; }
    `}} />
  );
}
