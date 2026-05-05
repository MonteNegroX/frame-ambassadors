"use client";

import { MarkerHighlight } from "@/components/remocn/marker-highlight";
import { PublicLeaderboard } from "@/components/PublicLeaderboard";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Trophy, ChevronRight } from "lucide-react";
import { CountUp } from "@/components/unlumen-ui/components/effects/count-up";

interface BentoLandingProps {
  stats: any;
}

export function BentoLanding({
  stats
}: BentoLandingProps) {
  return (
    <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-3 gap-4 mx-auto py-6 px-4 md:px-0">
      {/* System Overview - Long Card (Hero) - Row 1 */}
      <LiquidGlassCard
        draggable
        shadowIntensity="xs"
        glowIntensity="none"
        borderRadius="8px"
        blurIntensity="sm"
        className="col-span-1 md:col-span-2 px-6 pt-5 pb-6 text-white bg-black/40 border border-white/5 h-full"
      >
        <div className="flex flex-col h-full relative z-30">
          <div className="flex-1 flex flex-col justify-center mb-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter max-w-md leading-[1.1] text-white ">
                  → connect<br />
                  → create<br />
                  → get <MarkerHighlight highlight="PAID" markerColor="#ffd507" highlightedTextColor="#000000" />
                </h1>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 md:gap-8 divide-x divide-white/10 md:divide-x-0">
            <div className="flex flex-col pr-2 sm:pr-4 md:pr-0">
              <span className="text-[9px] sm:text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1.5 text-white truncate">Total Users</span>
              <CountUp
                to={stats?.totalUsers || 0}
                separator=","
                digitEffect="slide"
                className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-yellow-400"
              />
            </div>
            <div className="flex flex-col pl-3 sm:pl-4 px-2 sm:px-4 md:px-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1.5">
                <span className="text-[9px] sm:text-[10px] font-bold opacity-30 uppercase tracking-widest text-white truncate">Average</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 43" fill="none" className="h-[9px] sm:h-[11px] w-auto opacity-40 text-white flex-shrink-0">
                  <path d="M99.8862 2.83581C100.125 3.43282 100.244 4.38804 100.244 5.70148V38.4179C100.244 39.3731 100.105 40.0895 99.8265 40.5672C99.5877 41.005 99.1499 41.3035 98.5131 41.4627V42H105.916V41.4627C105.279 41.3035 104.822 40.9851 104.543 40.5075C104.264 40.0298 104.125 39.3333 104.125 38.4179V16.6279C104.815 15.7146 105.611 14.9979 106.513 14.4776C107.588 13.8806 108.722 13.5821 109.916 13.5821C111.866 13.5821 113.339 14.2786 114.334 15.6716C115.329 17.0249 115.827 19.0547 115.827 21.7612V38.4179C115.827 39.3333 115.687 40.0298 115.409 40.5075C115.13 40.9851 114.672 41.3035 114.035 41.4627V42H121.438V41.4627C120.802 41.3035 120.344 41.005 120.065 40.5672C119.827 40.0895 119.707 39.3731 119.707 38.4179V20.6866C119.707 17.7015 119.011 15.393 117.618 13.7612C116.225 12.0895 114.215 11.2537 111.588 11.2537C109.916 11.2537 108.364 11.7512 106.931 12.7463C105.776 13.5485 104.84 14.5707 104.125 15.8128V0.507446L98.5131 0.805954V1.34327C99.1897 1.70148 99.6474 2.19899 99.8862 2.83581Z" fill="currentColor"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M134.934 42.5971C132.745 42.5971 130.794 41.9404 129.083 40.627C127.411 39.3135 126.098 37.4827 125.143 35.1344C124.227 32.7464 123.77 30.0001 123.77 26.8956C123.77 23.7514 124.227 21.025 125.143 18.7165C126.058 16.3683 127.352 14.5374 129.023 13.224C130.735 11.9106 132.685 11.2538 134.874 11.2538C137.103 11.2538 139.053 11.9106 140.725 13.224C142.396 14.5374 143.69 16.3683 144.605 18.7165C145.561 21.025 146.038 23.7514 146.038 26.8956C146.038 30.0001 145.561 32.7464 144.605 35.1344C143.69 37.4827 142.396 39.3135 140.725 40.627C139.053 41.9404 137.123 42.5971 134.934 42.5971ZM134.874 12.5076C133.441 12.5076 132.207 13.0847 131.173 14.2389C130.138 15.3931 129.342 17.0449 128.784 19.1941C128.267 21.3036 128.008 23.8708 128.008 26.8956C128.008 29.8807 128.267 32.4678 128.008 26.8956C128.008 29.8807 128.267 32.4678 128.008 34.6568C129.342 36.8061 130.138 38.4578 131.173 39.6121C132.247 40.7663 133.481 41.3434 134.874 41.3434C136.307 41.3434 137.541 40.7663 138.575 39.6121C139.61 38.4578 140.406 36.8061 140.964 34.6568C141.521 32.4678 141.799 29.8807 141.799 26.8956C141.799 23.8708 141.521 21.3036 140.964 19.1941C140.406 17.0449 139.61 15.3931 138.575 14.2389C137.541 13.0847 136.307 12.5076 134.874 12.5076Z" fill="currentColor"></path>
                  <path d="M149.7 31.4329C150.735 34.7762 151.989 37.2638 153.461 38.8956C154.934 40.5275 156.705 41.3434 158.775 41.3434C160.287 41.3434 161.461 40.8857 162.297 39.9703C163.173 39.0548 163.61 37.8409 163.61 36.3285C163.61 34.7364 163.272 33.423 162.595 32.3882C161.919 31.3533 161.063 30.4578 160.028 29.7016C158.993 28.9454 157.879 28.229 156.685 27.5523C155.531 26.8757 154.416 26.1394 153.342 25.3434C152.307 24.5474 151.451 23.6121 150.775 22.5374C150.098 21.4628 149.76 20.1295 149.76 18.5374C149.76 17.1444 150.078 15.9106 150.715 14.8359C151.352 13.7215 152.227 12.8459 153.342 12.2091C154.456 11.5722 155.73 11.2538 157.163 11.2538C158.078 11.2538 158.854 11.3533 159.491 11.5523C160.168 11.7116 160.725 11.8907 161.163 12.0897C161.64 12.2489 162.038 12.3285 162.357 12.3285C163.073 12.3285 163.511 12.0698 163.67 11.5523H164.088L164.984 20.7464H164.446C163.61 17.9205 162.595 15.8509 161.401 14.5374C160.207 13.1842 158.775 12.5076 157.103 12.5076C155.75 12.5076 154.655 12.9056 153.819 13.7016C153.023 14.4976 152.625 15.5722 152.625 16.9255C152.625 18.1195 152.964 19.1344 153.64 19.9703C154.317 20.7663 155.173 21.4827 156.207 22.1195C157.282 22.7563 158.396 23.413 159.551 24.0897C160.745 24.7265 161.859 25.4827 162.894 26.3583C163.929 27.1941 164.785 28.229 165.461 29.4628C166.138 30.6966 166.476 32.229 166.476 34.0598C166.476 36.6071 165.76 38.6767 164.327 40.2688C162.894 41.821 161.003 42.5971 158.655 42.5971C157.62 42.5971 156.685 42.4976 155.849 42.2986C155.053 42.1394 154.337 41.9802 153.7 41.821C153.103 41.622 152.586 41.5225 152.148 41.5225C151.392 41.5225 150.834 41.7812 150.476 42.2986H150.118L149.222 31.4329H149.7Z" fill="currentColor"></path>
                  <path d="M85.197 12.4711C86.5888 12.2579 88.3646 11.9859 89.1085 10.7462C89.9841 9.35317 90.3105 4.33526 90.3105 1.93117L91.6539 1.73088V12.4473H95.833V13.9399H91.6539V37.1638C91.6539 38.517 91.8728 39.512 92.3106 40.1488C92.7484 40.7458 93.5245 41.1837 94.639 41.4623V41.9996H85.9823V41.4623C86.6191 41.3031 87.0768 40.9847 87.3554 40.507C87.634 40.0294 87.7733 39.3329 87.7733 38.4175V17.3429C87.7733 14.3838 86.9047 13.0865 84.701 13.0865V12.5492C84.8586 12.523 85.025 12.4975 85.197 12.4711Z" fill="currentColor"></path>
                  <path d="M78.958 1.99963H58.0625V2.59665C58.8187 2.75585 59.3361 3.09416 59.6147 3.61157C59.8933 4.08918 60.0326 4.8454 60.0326 5.88023V38.119C60.0326 39.1539 59.8933 39.93 59.6147 40.4474C59.3361 40.9648 58.8187 41.3031 58.0625 41.4623V41.9996H80.6297L81.9431 28.9847H81.3461C80.7889 31.4126 80.172 33.4026 79.4953 34.9549C78.8187 36.4673 78.0227 37.6414 77.1073 38.4772C76.2317 39.3131 75.2167 39.8902 74.0625 40.2086C72.9083 40.4872 71.5749 40.6265 70.0625 40.6265H64.2715V21.1041H67.3759C68.57 21.1041 69.6247 21.2633 70.5401 21.5817C71.4555 21.9001 72.2516 22.4772 72.9282 23.3131C73.6446 24.1489 74.2217 25.3429 74.6595 26.8952H75.1968V14.4175H74.6595C74.1023 16.4474 73.2665 17.8603 72.1521 18.6563C71.0376 19.4126 69.4456 19.7907 67.3759 19.7907H64.2715V3.37277H69.9431C71.3759 3.37277 72.6695 3.57177 73.8237 3.96978C74.9779 4.36779 75.9729 5.20361 76.8088 6.47724C77.6844 7.71108 78.4008 9.60162 78.958 12.1489H79.4356L78.958 1.99963Z" fill="currentColor"></path>
                  <path d="M19.92 21.96C19.92 23.3282 19.8351 24.6765 19.6703 26H0V34H17.606C16.444 36.8973 14.875 39.5876 12.9697 42H40V34H17.606C18.6188 31.475 19.3225 28.7927 19.6703 26H40V18H19.6801C19.3395 15.208 18.6432 12.5257 17.638 10H40V2H13.0327C14.927 4.4141 16.4855 7.10421 17.638 10H0V18H19.6801C19.8385 19.2978 19.92 20.6194 19.92 21.96Z" fill="currentColor"></path>
                </svg>
              </div>
              <CountUp
                to={stats?.avgEthos || 0}
                separator=","
                className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-white/90"
              />
            </div>
            <div className="flex flex-col pl-3 sm:pl-4 md:pl-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1.5">
                <span className="text-[9px] sm:text-[10px] font-bold opacity-30 uppercase tracking-widest text-white truncate">Average</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 169 34" className="h-[9px] sm:h-[11px] w-auto opacity-40 flex-shrink-0">
                  <path fill="#fff" d="M16.386 11.022a.155.155 0 0 1 .309 0l.182 1.622c.233 2.095 1.789 3.748 3.762 3.998l1.527.194c.183.022.183.303 0 .325l-1.527.194c-1.973.25-3.529 1.9-3.762 3.998l-.182 1.622a.155.155 0 0 1-.309 0l-.182-1.622c-.233-2.095-1.789-3.748-3.762-3.998l-1.527-.194c-.183-.022-.183-.303 0-.325l1.527-.194c1.973-.25 3.529-1.9 3.762-3.998z"></path>
                  <path fill="url(#logo_svg__a)" d="M44.114 27.607c-6.224.424-11.386-4.492-11.386-10.595S37.494 6.386 43.353 6.386s11.021 5.16 10.595 11.384c-.365 5.221-4.584 9.472-9.837 9.834zm-27.051 0c-6.406.396-11.69-4.888-11.294-11.291.334-5.28 4.615-9.593 9.899-9.927a10.66 10.66 0 0 1 11.324 11.322c-.334 5.28-4.646 9.562-9.926 9.896zM44.235.682C38.892.41 34.064 2.686 30.905 6.42c-.547.637-1.55.637-2.063 0-3.065-3.613-7.65-5.859-12.75-5.766C7.225.805.03 8.12 0 16.984c0 2.824.699 5.494 1.974 7.801a2.25 2.25 0 0 1-.365 2.673l-.351.35a3.226 3.226 0 0 0 0 4.585 3.226 3.226 0 0 0 4.584 0l.444-.44c.699-.7 1.729-.851 2.61-.396a16.2 16.2 0 0 0 7.44 1.79c4.98 0 9.44-2.245 12.447-5.766.548-.637 1.55-.637 2.064 0 3.006 3.52 7.467 5.767 12.447 5.767 9.261 0 16.698-7.681 16.333-16.998C59.383 7.971 52.614 1.11 44.235.684z"></path>
                  <defs>
                    <linearGradient id="logo_svg__a" x1="-4.211" x2="64.287" y1="11.178" y2="31.812" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38CCE8"></stop>
                      <stop offset="0.52" stopColor="#044CFE"></stop>
                      <stop offset="1" stopColor="#8C7AFE"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <CountUp
                to={stats?.avgSorsa || 0}
                separator=","
                className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tighter leading-none text-white/90"
              />
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Leaderboard Preview - Side Block - Row 1 */}
      <LiquidGlassCard
        id="full-leaderboard"
        draggable
        shadowIntensity="xs"
        glowIntensity="none"
        borderRadius="8px"
        blurIntensity="sm"
        className="col-span-1 bg-black/40 border border-white/5 p-6 text-white h-full"
      >
        <div className="relative z-30 flex flex-col gap-4 h-full w-full">
          <div className="flex items-center gap-2 px-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">Global Leaderboard</h2>
          </div>
          <div className="opacity-95 flex-1 overflow-y-auto custom-scrollbar min-h-0">
            <PublicLeaderboard limit={3} />
          </div>

          <div className="mt-auto pt-4">
            <a
              href="/leaderboard"
              className="flex items-center justify-center w-full py-2.5 rounded-lg border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-yellow-400 group"
            >
              Full Rankings <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
