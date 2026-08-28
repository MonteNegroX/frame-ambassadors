import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Capsule Ambassador Program",
  description: "Apply for the Capsule Ambassador Program",
};

export default function CapsuleContentProgramPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black z-50 overflow-hidden">
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
      />
      <iframe
        data-tally-src="https://tally.so/r/lbk1Nv?transparentBackground=1"
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          border: 0,
          width: "100%",
          height: "100%",
        }}
        title="Capsule Ambassador Program"
      />
    </div>
  );
}
