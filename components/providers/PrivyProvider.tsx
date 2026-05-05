"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#FFD507",
          logo: "https://pbs.twimg.com/profile_images/2013212275671224320/t8HXPK64_400x400.jpg",
          showWalletLoginFirst: false,
        },
        loginMethods: ["twitter"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
