import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | FRAME OS",
  description: "Terms of Use for the FRAME OS Ambassador Platform.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-[#FFD507] font-mono">Terms of Use</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed font-mono">
          <p className="text-sm opacity-60 italic">Last Updated: May 12, 2026</p>

          <section>
            <p>Welcome to the Platform (the "Platform", "we", "us", or "our"). By accessing or using our application, website, and services (collectively, the "Services"), you agree to be bound by these Terms of Use ("Terms").</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Eligibility</h2>
            <p>You must be of legal age in your jurisdiction to form a binding contract to use the Services. By using the Platform, you represent that you meet all eligibility requirements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Account and Authentication</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Authentication:</strong> We may use third-party authentication providers. You are responsible for maintaining the security of any accounts used to access the Services.</li>
              <li><strong>Digital Wallets:</strong> Our services may integrate with digital asset wallets. You are solely responsible for the security of your private keys, seed phrases, and digital assets. We do not have access to, nor can we recover, your private keys or funds.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Platform Participation and Rewards</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Engagement:</strong> Users may participate in various activities, tasks, or programs offered through the Platform.</li>
              <li><strong>Verification:</strong> Participation is subject to verification by our internal systems or third-party tools. We reserve the right to disqualify any participation that we deem fraudulent or in violation of our community standards.</li>
              <li><strong>Points and Rewards:</strong> Any points, scores, or virtual rewards provided through the Services are for engagement purposes only and do not constitute financial instruments or investments.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Prohibited Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use automated systems (bots, scripts) to interact with the Services.</li>
              <li>Create multiple identities to manipulate Platform mechanics or reward systems.</li>
              <li>Engage in any activity that interferes with the integrity or security of the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Disclaimers and Risks</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Technology Risks:</strong> You acknowledge the risks associated with using blockchain-based systems and digital assets, including volatility and technical vulnerabilities.</li>
              <li><strong>No Warranty:</strong> The Services are provided on an "as is" and "as available" basis without warranties of any kind.</li>
              <li><strong>No Advice:</strong> No content on the Platform constitutes financial, legal, or investment advice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, the Platform and its affiliates shall not be liable for any damages arising from your use of the Services or any loss of digital assets.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Continued use of the Services constitutes acceptance of the updated Terms.</p>
          </section>

          <div className="pt-8 border-t border-white/10 mt-12">
            <p className="text-sm">Contact: <span className="text-[#FFD507]">support@frameonx.xyz</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
