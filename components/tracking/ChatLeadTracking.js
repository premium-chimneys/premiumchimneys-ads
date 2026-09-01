import Script from 'next/script'

// WhatConverts chat-lead tracking for the Agent HQ widget.
//
// WhatConverts scores calls and form fills on its own, but a chat lead has to
// be handed to it explicitly: `$wc_leads.track.chat({...})`. That call is what
// attaches the visitor's session — the gclid, the source, the landing page
// WhatConverts has been holding since wc-init ran — to the name and phone the
// visitor typed into the chat panel. Without it a chat lead is invisible in
// WhatConverts and, downstream, in the Google Ads conversion it feeds.
//
// The vendor's own example is a literal call with placeholder values baked in
// (Joe Smith, joe.smith@example.com). Shipped as written it would fire on
// every page load and post a fake lead for every visitor, so what is here is
// that same call wired to the real values instead.
//
// Where the values come from: chat.js is served from agents.premiumchimneys.com
// and lives in the CRM repo, not this one. It exposes no global and dispatches
// no event, so there is nothing to subscribe to from here. What it does do is
// POST — the running `messages` array to /api/chat-agent/message on every turn,
// and `{name, phone}` to /api/chat-agent/lead when the visitor submits the
// "Speak to an agent" form. Wrapping `fetch` reads both off the wire: the
// message posts build the transcript, and a *successful* lead post is the
// trigger. Nothing is sent on a failed submit, which matches what the widget
// itself treats as a lead.
//
// This is the seam that will move: if chat.js ever dispatches a real lead
// event, this should listen for that and the fetch wrapper should go.
//
// Must mount after wc-init/wc-loader — WhatConverts requires its own tag first,
// and `$wc_leads.track` does not exist until 137765.js has booted, which is why
// the call below polls for it rather than assuming it is there.
export default function ChatLeadTracking() {
  return (
    <Script id="wc-chat-track" strategy="afterInteractive">
      {`(function(){
if (window.__wcChatTrack) return;
window.__wcChatTrack = true;

var MSG = '/api/chat-agent/message';
var LEAD = '/api/chat-agent/lead';
// Rebuilt on every turn from the full history the widget posts, so it is
// always the whole conversation and never a partial tail.
var transcript = [];

function urlOf(input) {
  try {
    if (typeof input === 'string') return input;
    if (input && typeof input.url === 'string') return input.url;
    if (input) return String(input);
  } catch (e) {}
  return '';
}

function jsonBody(init) {
  try {
    if (init && typeof init.body === 'string') return JSON.parse(init.body);
  } catch (e) {}
  return null;
}

function line(role, text) {
  return (role === 'assistant' ? 'Dan' : 'Visitor') + ' - ' + text;
}

function rebuild(body) {
  if (!body || !body.messages || !body.messages.length) return;
  var out = [];
  for (var i = 0; i < body.messages.length; i++) {
    var m = body.messages[i];
    if (m && m.content) out.push(line(m.role, m.content));
  }
  transcript = out;
}

// WhatConverts is loaded by then in every normal case; the poll covers a slow
// or blocked 137765.js rather than a race we expect to lose. It gives up after
// ~20s so a blocked tag leaves a dangling timer, not a permanent one.
function send(lead) {
  var tries = 0;
  (function attempt() {
    var wc = window.$wc_leads;
    if (wc && wc.track && typeof wc.track.chat === 'function') {
      try { wc.track.chat(lead); } catch (e) {}
      return;
    }
    if (tries++ < 100) setTimeout(attempt, 200);
  })();
}

function track(body) {
  if (!body) return;
  // The widget collects one free-text name field. First token is the first
  // name, whatever remains is the last name, and a single-word entry leaves
  // Last Name empty rather than duplicating it.
  var name = String(body.name || '').trim();
  var cut = name.indexOf(' ');
  var lead = {
    'First Name': cut === -1 ? name : name.slice(0, cut),
    'Last Name': cut === -1 ? '' : name.slice(cut + 1).trim(),
    'Phone Number': String(body.phone || ''),
    'Chat Log': transcript.join('\\n')
  };
  // The widget asks for name and phone only. Email is sent if a future
  // version starts collecting one, and omitted rather than blank until then.
  if (body.email) lead['Email Address'] = String(body.email);
  send(lead);
}

var orig = window.fetch;
if (typeof orig !== 'function') return;

window.fetch = function (input, init) {
  var url = urlOf(input);
  var isMsg = url.indexOf(MSG) !== -1;
  var isLead = url.indexOf(LEAD) !== -1;
  if (!isMsg && !isLead) return orig.apply(this, arguments);

  var body = jsonBody(init);
  if (isMsg) rebuild(body);

  var res = orig.apply(this, arguments);

  // Every branch below reads a *clone*, so the widget still gets an unread
  // body. Failures here are swallowed: tracking must never break the chat.
  return res.then(function (r) {
    try {
      r.clone().json().then(function (data) {
        if (isMsg) {
          // The assistant's reply is only pushed into the widget's history
          // after this response resolves, so the last thing said would be
          // missing from a transcript built from request bodies alone.
          if (data && typeof data.reply === 'string' && data.reply) {
            transcript.push(line('assistant', data.reply));
          }
          return;
        }
        // Same success test the widget uses before it tells the visitor
        // someone will call.
        if (r.ok && (!data || data.ok !== false)) track(body);
      }, function () {
        if (isLead && r.ok) track(body);
      });
    } catch (e) {}
    return r;
  });
};
})();`}
    </Script>
  )
}
