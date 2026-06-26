import { ReactNode } from 'react';

interface Partner {
  name: string;
  engName: string;
  renderLogo: () => ReactNode;
  bgLight: string;
  borderColor: string;
}

// -------------------------------------------------------------
// BEAUTIFUL POLISHED VECTOR SVG REPRESENTATIONS OF LOGOS
// -------------------------------------------------------------

const GovLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform duration-300 hover:scale-110">
    <g transform="rotate(-15 50 50)">
      <path d="M15 50 A35 35 0 0 1 85 50 A17.5 17.5 0 0 1 50 50 A17.5 17.5 0 0 0 15 50" fill="#CD2E3A" />
      <path d="M15 50 A35 35 0 0 0 85 50 A17.5 17.5 0 0 0 50 50 A17.5 17.5 0 0 1 15 50" fill="#0047A0" />
      <circle cx="32.5" cy="50" r="4.5" fill="#0047A0" />
      <circle cx="67.5" cy="50" r="4.5" fill="#CD2E3A" />
    </g>
    <path d="M50 35 C55 35, 60 40, 50 50 C40 60, 45 65, 50 65" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85" />
  </svg>
);

const HanaLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform duration-300 hover:scale-110">
    <path d="M50 82 C32 68, 18 45, 30 25 C38 12, 50 30, 50 48" fill="#10B981" />
    <path d="M50 82 C68 68, 82 45, 70 25 C62 12, 50 30, 50 48" fill="#F59E0B" />
    <path d="M50 80 L50 48" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="22" r="7" fill="#EF4444" />
  </svg>
);

const SeoulLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform duration-300 hover:scale-110">
    <circle cx="65" cy="35" r="13" fill="#EF4444" />
    <path d="M22 62 Q40 32, 58 52" stroke="#22C55E" strokeWidth="10" strokeLinecap="round" fill="none" />
    <path d="M15 78 C35 70, 55 86, 85 70" stroke="#3B82F6" strokeWidth="10" strokeLinecap="round" fill="none" />
  </svg>
);

const NuacLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform duration-300 hover:scale-110">
    <circle cx="50" cy="50" r="45" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2.5" />
    <path d="M15 50 A35 35 0 0 1 85 50" fill="#CD2E3A" opacity="0.18" />
    <path d="M15 50 A35 35 0 0 0 85 50" fill="#0047A0" opacity="0.18" />
    <path d="M30 52 Q45 42, 60 45 Q65 46, 70 42 C68 47, 65 52, 58 55 Q45 58, 35 55 Z" fill="#2563EB" />
    <path d="M48 46 Q35 32, 38 28 Q44 32, 48 40 Z" fill="#3B82F6" />
    <path d="M40 54 L30 65 Q33 63, 38 58 Z" fill="#1D4ED8" />
    <path d="M68 43 Q74 38, 76 35" stroke="#10B981" strokeWidth="2" fill="none" />
    <circle cx="76" cy="35" r="2.5" fill="#10B981" />
  </svg>
);

const ChestLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform duration-300 hover:scale-110">
    <path d="M50 20 C42 38, 28 48, 28 58" stroke="#10B981" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M50 20 C50 38, 50 48, 52 64" stroke="#10B981" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M50 20 C58 38, 72 48, 72 58" stroke="#10B981" strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="28" cy="64" r="15" fill="#EF4444" />
    <circle cx="72" cy="64" r="15" fill="#EF4444" />
    <circle cx="52" cy="76" r="15" fill="#EF4444" />
    <circle cx="24" cy="60" r="4" fill="white" opacity="0.75" />
    <circle cx="68" cy="60" r="4" fill="white" opacity="0.75" />
    <circle cx="48" cy="72" r="4" fill="white" opacity="0.75" />
  </svg>
);

const RedCrossLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform duration-300 hover:scale-110">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#DC2626" strokeWidth="5" />
    <circle cx="50" cy="50" r="37" fill="none" stroke="#DC2626" strokeWidth="2.5" />
    <rect x="44" y="24" width="12" height="52" fill="#DC2626" rx="3" />
    <rect x="24" y="44" width="52" height="12" fill="#DC2626" rx="3" />
  </svg>
);

const KWaterLogo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 transition-transform duration-300 hover:scale-110">
    <path d="M50 15 C50 15, 80 45, 80 65 C80 81, 66 92, 50 92 C34 92, 20 81, 20 65 C20 45, 50 15, 50 15 Z" fill="#0EA5E9" />
    <path d="M40 38 L40 78" stroke="white" strokeWidth="7" strokeLinecap="round" />
    <path d="M40 58 L58 40" stroke="white" strokeWidth="7" strokeLinecap="round" />
    <path d="M44 56 L60 76" stroke="white" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

const partners: Partner[] = [
  {
    name: "통일부",
    engName: "Ministry of Unification",
    renderLogo: GovLogo,
    bgLight: "bg-blue-50/60",
    borderColor: "border-blue-100/50"
  },
  {
    name: "남북하나재단",
    engName: "Korea Hana Foundation",
    renderLogo: HanaLogo,
    bgLight: "bg-emerald-50/60",
    borderColor: "border-emerald-100/50"
  },
  {
    name: "행정안전부",
    engName: "Ministry of the Interior & Safety",
    renderLogo: GovLogo,
    bgLight: "bg-indigo-50/60",
    borderColor: "border-indigo-100/50"
  },
  {
    name: "서울특별시",
    engName: "Seoul Metropolitan Govt",
    renderLogo: SeoulLogo,
    bgLight: "bg-rose-50/50",
    borderColor: "border-rose-100/50"
  },
  {
    name: "민주평화통일자문회의",
    engName: "NUAC",
    renderLogo: NuacLogo,
    bgLight: "bg-cyan-50/60",
    borderColor: "border-cyan-100/50"
  },
  {
    name: "사랑의열매",
    engName: "Community Chest of Korea",
    renderLogo: ChestLogo,
    bgLight: "bg-red-50/50",
    borderColor: "border-red-100/50"
  },
  {
    name: "대한적십자사",
    engName: "Korean Red Cross",
    renderLogo: RedCrossLogo,
    bgLight: "bg-red-50/60",
    borderColor: "border-red-200/50"
  },
  {
    name: "한국수자원공사",
    engName: "K-water",
    renderLogo: KWaterLogo,
    bgLight: "bg-sky-50/60",
    borderColor: "border-sky-100/50"
  }
];

export const PartnerBanners = () => {
  // Duplicate partners list multiple times to achieve seamless, non-flickering loop in dynamic container
  const marqueeList = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-white border-t border-gray-100 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center md:text-left">
        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Partners & Sponsors</span>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
          추천 협력사 및 후원 기관
        </h3>
        <p className="text-gray-400 text-sm mt-1">하나사랑협회는 국가 기관 및 사회 공헌 재단들과 함께 신뢰할 수 있는 미래를 그려갑니다.</p>
      </div>

      {/* Elegant fade mask to blend left and right flow edges smoothly */}
      <div className="absolute left-0 top-[100px] bottom-0 w-16 md:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-[100px] bottom-0 w-16 md:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Infinite Marquee Track with CSS Animation */}
      <div className="flex w-full overflow-hidden relative">
        <div className="flex gap-6 py-4 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap min-w-full">
          {marqueeList.map((partner, index) => {
            const Logo = partner.renderLogo;
            return (
              <div 
                key={`${partner.name}-${index}`}
                className="inline-flex items-center gap-4 bg-white border border-gray-100 hover:border-blue-200/80 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-300 min-w-[260px] md:min-w-[280px] cursor-pointer hover:-translate-y-0.5"
              >
                {/* Custom Vector Logo container */}
                <div className={`w-14 h-14 ${partner.bgLight} ${partner.borderColor} border rounded-xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden`}>
                  <Logo />
                </div>
                
                {/* Corporate Info */}
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900 tracking-tight">{partner.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium tracking-normal mt-0.5 uppercase">{partner.engName}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
