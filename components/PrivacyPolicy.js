import BackButton from './BackButton'

export default function PrivacyPolicy() {
  const lastUpdated = 'April 2026'

  return (
    <section className="privacy">
      <div className="privacy-inner">
        <div className="privacy-back">
          <BackButton />
        </div>
        <div className="privacy-header">
          <span className="privacy-eyebrow">
            <span className="privacy-eyebrow-dot" />
            Legal
          </span>
          <h1 className="privacy-title">Privacy Policy.</h1>
          <p className="privacy-updated">Last updated: {lastUpdated}</p>
          <p className="privacy-intro">
            At Premium Chimneys, we are committed to protecting your privacy and ensuring that your
            personal information is handled responsibly. This Privacy Policy explains how we collect,
            use, disclose, and protect your personal information when you visit our website or use
            our fireplace and chimney services.
          </p>
        </div>

        <div className="privacy-body">
          <h2>Information We Collect</h2>
          <p>
            We collect personal information to provide you with the best possible service. The types
            of information we may collect include:
          </p>
          <ul>
            <li>
              <strong>Contact Information:</strong> Name, email address, phone number, and physical
              address when you request services or submit inquiries.
            </li>
            <li>
              <strong>Service-Related Information:</strong> Details of the services you request, such
              as appointment dates, service history, and feedback.
            </li>
            <li>
              <strong>Payment Information:</strong> Billing details, such as credit card information,
              when you make payments for our services.
            </li>
            <li>
              <strong>Website Usage Information:</strong> Data such as your IP address, browser type,
              and browsing activity on our site, collected through cookies and other tracking
              technologies.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>The personal information we collect is used for the following purposes:</p>
          <ul>
            <li>
              To provide and fulfill the services you request, such as scheduling appointments and
              processing payments.
            </li>
            <li>
              To communicate with you regarding your service requests, promotional offers, and
              updates about our company.
            </li>
            <li>To improve our website and services based on your feedback and browsing patterns.</li>
            <li>To comply with legal obligations and resolve disputes.</li>
          </ul>

          <h2>How We Share Your Information</h2>
          <p>
            We do not sell your personal information. However, we may share your information in the
            following cases:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We may share your data with third-party service
              providers who assist us in delivering services, such as payment processors or
              subcontractors.
            </li>
            <li>
              <strong>Legal Obligations:</strong> We may disclose personal information if required by
              law, such as in response to subpoenas or legal investigations.
            </li>
            <li>
              <strong>Business Transfers:</strong> If our business undergoes a merger, acquisition, or
              sale, your information may be transferred as part of the business transaction.
            </li>
          </ul>

          <h2>Security of Your Information</h2>
          <p>
            We use appropriate technical and organizational measures to protect your personal
            information from unauthorized access, alteration, or disclosure. However, please note
            that no system for data transmission or storage can be guaranteed to be 100% secure.
          </p>

          <h2>SMS / Text Messaging</h2>
          <p>
            By providing your phone number to Premium Chimneys during booking, service requests, or
            payment, you consent to receive SMS (text) messages from us related to your service,
            including appointment confirmations, service updates, payment receipts, and post-service
            feedback requests.
          </p>
          <ul>
            <li>
              <strong>Message frequency:</strong> Varies based on your service activity. Typically
              1&ndash;4 messages per service.
            </li>
            <li>
              <strong>Message and data rates:</strong> May apply depending on your mobile carrier
              plan.
            </li>
            <li>
              <strong>Opt-out:</strong> You may opt out at any time by replying STOP to any text
              message. You may also reply HELP for assistance or contact us at{' '}
              <a href="mailto:hello@premiumchimneys.com">hello@premiumchimneys.com</a>.
            </li>
            <li>
              <strong>No sharing for marketing:</strong> We do not share your phone number or SMS
              consent with third parties for marketing purposes.
            </li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li>
              <strong>Access and Correction:</strong> You may request access to the personal
              information we hold about you and ask for corrections if it is inaccurate.
            </li>
            <li>
              <strong>Deletion:</strong> You can request that we delete your personal information,
              subject to certain exceptions, such as compliance with legal obligations.
            </li>
            <li>
              <strong>Opt-Out:</strong> You may opt out of marketing emails by following the
              unsubscribe instructions in our emails. You may opt out of SMS messages at any time by
              replying STOP to any text. You may contact us directly at{' '}
              <a href="mailto:hello@premiumchimneys.com">hello@premiumchimneys.com</a> for any
              opt-out assistance.
            </li>
          </ul>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and other tracking technologies to enhance your experience on our
            website. These help us analyze website traffic and improve our services. You may adjust
            your browser settings to refuse cookies, though doing so may affect certain features of
            the website.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to external websites operated by third parties. We are not
            responsible for the privacy practices of these third-party sites, and we recommend
            reviewing their privacy policies before providing any personal information.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in our practices or in
            legal requirements. Updates will be posted on this page, and we encourage you to review
            the policy regularly.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your personal
            information, please contact us at:
          </p>
          <p className="privacy-contact">
            <strong>Premium Chimneys</strong>
            <br />
            <a href="mailto:hello@premiumchimneys.com">hello@premiumchimneys.com</a>
          </p>
        </div>
      </div>

      <style>{`
        .privacy {
          position: relative;
          padding: 80px 24px 120px;
          background:
            radial-gradient(circle at 10% 0%, rgba(167, 139, 250, 0.08), transparent 50%),
            radial-gradient(circle at 90% 100%, rgba(124, 58, 237, 0.06), transparent 55%),
            #ffffff;
          font-family: 'Inter Tight', sans-serif;
        }

        .privacy-inner {
          max-width: 820px;
          margin: 0 auto;
        }

        .privacy-back {
          margin-bottom: 32px;
        }

        .privacy-header {
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(124, 58, 237, 0.12);
          margin-bottom: 48px;
        }

        .privacy-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          color: #6d28d9;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .privacy-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7c3aed;
          flex-shrink: 0;
        }

        .privacy-title {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700;
          color: #1a1225;
          letter-spacing: -0.04em;
          line-height: 1.04;
          margin: 0 0 12px;
        }

        .privacy-updated {
          font-size: 13px;
          color: #9b8fb4;
          margin: 0 0 24px;
          letter-spacing: 0.02em;
        }

        .privacy-intro {
          font-size: 17px;
          line-height: 1.65;
          color: #4a3f65;
          margin: 0;
          max-width: 720px;
        }

        .privacy-body h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1a1225;
          letter-spacing: -0.02em;
          margin: 44px 0 14px;
          line-height: 1.2;
        }

        .privacy-body h2:first-child {
          margin-top: 0;
        }

        .privacy-body p {
          font-size: 15.5px;
          line-height: 1.7;
          color: #4a3f65;
          margin: 0 0 14px;
        }

        .privacy-body ul {
          margin: 0 0 18px;
          padding: 0 0 0 22px;
          list-style: none;
        }

        .privacy-body li {
          position: relative;
          font-size: 15.5px;
          line-height: 1.7;
          color: #4a3f65;
          padding: 0 0 10px 0;
        }

        .privacy-body li::before {
          content: '';
          position: absolute;
          left: -18px;
          top: 11px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9b5de5, #7c3aed);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08);
        }

        .privacy-body strong {
          color: #1a1225;
          font-weight: 600;
        }

        .privacy-body a {
          color: #7c3aed;
          text-decoration: none;
          border-bottom: 1px solid rgba(124, 58, 237, 0.3);
          transition: border-color 0.2s ease, color 0.2s ease;
        }

        .privacy-body a:hover {
          color: #6d28d9;
          border-bottom-color: #6d28d9;
        }

        .privacy-contact {
          padding: 20px 24px;
          background: #f8f6fd;
          border: 1px solid rgba(124, 58, 237, 0.12);
          border-radius: 12px;
          line-height: 1.8 !important;
        }

        @media (max-width: 640px) {
          .privacy {
            padding: 56px 20px 88px;
          }
          .privacy-header {
            padding-bottom: 28px;
            margin-bottom: 36px;
          }
          .privacy-intro {
            font-size: 16px;
          }
          .privacy-body h2 {
            font-size: 20px;
            margin-top: 36px;
          }
          .privacy-body p,
          .privacy-body li {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  )
}
