import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FRAME OS",
  description: "Privacy Policy for the FRAME OS Ambassador Platform.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-[#FFD507] font-mono">Privacy Policy</h1>
        
        <div className="space-y-8 text-white/80 leading-relaxed font-mono">
          <p className="text-sm opacity-60 italic">Last Updated: May 12, 2026</p>

          <section>
            <p>We respect your privacy and are committed to protecting the data we collect. This Privacy Policy explains how we handle information when you use our Services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Information Collection</h2>
            <p>We collect limited information necessary to provide our Services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Public profile data provided through third-party authentication services you choose to use.</li>
              <li><strong>Blockchain Information:</strong> Public wallet addresses associated with your activity on the Platform.</li>
              <li><strong>Activity Data:</strong> Data related to your engagement with Platform features and tasks for the purpose of verification and reward distribution.</li>
              <li><strong>Technical Data:</strong> Standard web analytics such as IP addresses and device information to ensure platform security and performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Use of Information</h2>
            <p>We use the information to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Enable access to the Services and manage user profiles.</li>
              <li>Verify participation in platform activities and programs.</li>
              <li>Identify and prevent fraudulent or abusive behavior.</li>
              <li>Improve the user experience and maintain service quality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Data Storage and Blockchain</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Immutability:</strong> Some data related to your interactions may be recorded on public blockchains. This information is permanent and cannot be deleted once broadcast to the network.</li>
              <li><strong>Security:</strong> We use industry-standard measures to protect your information, but no system is completely secure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Third-Party Services</h2>
            <p>We may use third-party tools for authentication, data storage, or analytics. Each of these services has its own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Information Sharing</h2>
            <p>We do not sell your data. Information may be shared only:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To comply with legal obligations.</li>
              <li>In an aggregated and anonymous form for analytics.</li>
              <li>To service providers assisting in Platform operations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p>You may have rights regarding the access or deletion of your personal data. Please contact us to exercise these rights. Note that blockchain-based data cannot be modified or removed by us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Updates</h2>
            <p>We may update this policy periodically. Changes will be posted on this page with an updated date.</p>
          </section>

          <div className="pt-8 border-t border-white/10 mt-12">
            <p className="text-sm">Contact: <span className="text-[#FFD507]">support@frameonx.xyz</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
