import { ImageResponse } from 'next/og';
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';

// Load font from a reliable source
const loadFont = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to load font');
  return response.arrayBuffer();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    // Load fonts in parallel
    const [fontRegular, fontBold] = await Promise.all([
      loadFont('https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf'),
      loadFont('https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Bold.ttf'),
    ]);

    let user = null;
    if (ref) {
      // Find user by twitter handle
      user = await prisma.user.findFirst({
        where: { twitterHandle: { equals: ref, mode: 'insensitive' } },
      });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            color: '#fff',
            position: 'relative',
            fontFamily: 'IBMPlexMono',
          }}
        >
          {/* BACKGROUND LAYERS (Rendered first) */}

          {/* Neural Grid Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              backgroundImage: `
                linear-gradient(rgba(255, 213, 7, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 213, 7, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Radial Ambient Light */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(255, 213, 7, 0.1) 0%, transparent 60%)',
            }}
          />

          {/* MAIN CARD */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '1000px',
              height: '520px',
              border: '2px solid rgba(255, 213, 7, 0.5)',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: '50px',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 0 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(255, 213, 7, 0.05)',
            }}
          >
            {/* Corner Markers (Individual divs to satisfy Satori) */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', width: '20px', height: '2px', backgroundColor: '#FFD507', display: 'flex' }} />
            <div style={{ position: 'absolute', top: '15px', left: '15px', width: '2px', height: '20px', backgroundColor: '#FFD507', display: 'flex' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', width: '20px', height: '2px', backgroundColor: '#FFD507', display: 'flex' }} />
            <div style={{ position: 'absolute', top: '15px', right: '15px', width: '2px', height: '20px', backgroundColor: '#FFD507', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '20px', height: '2px', backgroundColor: '#FFD507', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '2px', height: '20px', backgroundColor: '#FFD507', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '20px', height: '2px', backgroundColor: '#FFD507', display: 'flex' }} />
            <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '2px', height: '20px', backgroundColor: '#FFD507', display: 'flex' }} />

            {/* Header / Identity Band */}
            <div style={{ display: 'flex', width: '100%', marginBottom: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {/* LOGO */}
                  <div style={{
                    display: 'flex',
                    width: '64px',
                    height: '64px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 213, 7, 0.4)',
                    overflow: 'hidden',
                    backgroundColor: '#000'
                  }}>
                    <img
                      src="https://pbs.twimg.com/profile_images/2013212275671224320/t8HXPK64_400x400.jpg"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, color: '#FFD507', letterSpacing: '0.12em' }}>
                      AMBASSADOR IDENTITY CARD
                    </div>
                    <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255, 255, 255, 0.3)', marginTop: 2, letterSpacing: '0.3em' }}>
                      SYSTEM_ID: AMB-{user?.twitterHandle?.toUpperCase() || ref?.toUpperCase() || 'REF-PNF-00'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Identity Hub */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flex: 1,
              gap: 120,
              backgroundColor: 'rgba(255, 213, 7, 0.01)',
              borderTop: '1px solid rgba(255, 213, 7, 0.08)',
              borderBottom: '1px solid rgba(255, 213, 7, 0.08)',
              position: 'relative',
              borderRadius: '2px',
              margin: '10px 0'
            }}>
              {/* Score Module */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', position: 'relative', padding: '10px 40px' }}>
                  {/* Tech Corners */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid #FFD507', borderLeft: '2px solid #FFD507', opacity: 0.6 }} />
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderTop: '2px solid #FFD507', borderRight: '2px solid #FFD507', opacity: 0.6 }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: 20, height: 20, borderBottom: '2px solid #FFD507', borderLeft: '2px solid #FFD507', opacity: 0.6 }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid #FFD507', borderRight: '2px solid #FFD507', opacity: 0.6 }} />

                  <span style={{ display: 'flex', fontSize: 220, fontWeight: 800, color: '#FFD507', lineHeight: 1, filter: 'drop-shadow(0 0 45px rgba(255,213,7,0.4))' }}>
                    {Math.floor(user?.frameScore || 0)}
                  </span>
                </div>

                {/* Stylyzed Tag Plate for Label */}
                <div style={{
                  display: 'flex',
                  padding: '10px 30px',
                  backgroundColor: '#FFD507',
                  borderRadius: '2px',
                  marginTop: 15,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}>
                  <span style={{ fontSize: '18px', color: '#000', fontWeight: 900, letterSpacing: '0.4em' }}>
                    FRAME SCORE
                  </span>
                </div>
              </div>

              {/* Avatar Module */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  width: '240px',
                  height: '240px',
                  borderRadius: '4px',
                  border: '2px solid rgba(255, 213, 7, 0.5)',
                  backgroundColor: '#000',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                }}>
                  {user?.ethosAvatarUrl ? (
                    <img
                      src={user.ethosAvatarUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 1
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', fontSize: '130px', filter: 'drop-shadow(0 0 20px #FFD507)' }}>⚡</div>
                  )}

                  {/* Scanner Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'linear-gradient(rgba(255, 213, 7, 0.1) 2px, transparent 2px)',
                    backgroundSize: '100% 8px',
                    opacity: 0.5
                  }} />

                  {/* Subtle Glow Ring */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: '1px solid rgba(255, 213, 7, 0.2)',
                    boxShadow: 'inset 0 0 40px rgba(255, 213, 7, 0.2)'
                  }} />
                </div>

                {/* ID Tag Plate */}
                <div style={{
                  display: 'flex',
                  marginTop: '15px',
                  padding: '10px 30px',
                  backgroundColor: '#FFD507',
                  borderRadius: '2px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}>
                  <span style={{ fontSize: '18px', color: '#000', fontWeight: 900, letterSpacing: '0.25em' }}>
                    {user?.ethosDisplayName?.toUpperCase() || ref?.toUpperCase() || 'SUBJECT_ALPHA'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'IBMPlexMono',
            data: fontRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'IBMPlexMono',
            data: fontBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e: any) {
    console.error(`OG Generation Error: ${e.message}`);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
