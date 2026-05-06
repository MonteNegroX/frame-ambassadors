import { useState, useEffect } from "react";

export function useSolanaMobile() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSaga, setIsSaga] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // Check if running as a PWA (standalone mode)
    const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches || 
                            (window.navigator as any).standalone || 
                            document.referrer.includes("android-app://");
    
    setIsStandalone(isStandaloneMode);

    // Basic mobile detection
    const mobileCheck = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
    setIsMobile(mobileCheck);

    // Specific detection for Solana Saga/Seeker (if possible via UA or other signals)
    const sagaCheck = userAgent.includes("solana") || userAgent.includes("saga");
    setIsSaga(sagaCheck);
  }, []);

  return { isStandalone, isMobile, isSaga };
}
