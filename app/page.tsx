import { Metadata } from "next";
import { LandingContent } from "@/components/LandingContent";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const ref = params.ref as string;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://waitlist.frameonx.xyz";
  
  const ogImageUrl = ref 
    ? `${baseUrl}/api/og?ref=${ref}`
    : `${baseUrl}/og-default.png`;

  return {
    title: "FRAME OS | Waitlist",
    description: "The direct neural-link between Web3 projects and creators. No middlemen. Verified impact.",
    openGraph: {
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: ref ? `Join @${ref} on FRAME OS` : "FRAME OS | Waitlist",
      description: "Direct rewards. Neural verification. Cutting out the middleman.",
      images: [ogImageUrl],
    },
  };
}

export default function Home() {
  return <LandingContent />;
}
