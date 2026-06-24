import { motion } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  Globe, 
  MessageCircle, 
  ChevronRight, 
  ArrowUpRight,
  HandHeart,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Target
} from 'lucide-react';

const ProgramsPage = () => {
  const programs = [
    {
      icon: <Users className="text-blue-600" size={32} />,
      title: "정착 지원 사업",
      desc: "초기 정착부터 자립까지 단계별 맞춤형 지원 프로그램을 운영합니다.",
      details: [
        "초기 정착 가이드 및 생활 밀착형 상담",
        "주거 및 행정 절차 지원",
        "지역사회 자원 연계 및 네트워크 구축"
      ],
      goal: "북한이탈주민의 안정적인 초기 정착 및 사회 적응력 향상",
      effect: "사회적 고립감 해소 및 자립 의지 고취",
      achievements: [
        { label: "누적 지원 가구", value: "1,500+ 세대" },
        { label: "초기 정착률", value: "95.8%" },
        { label: "상담 만족도", value: "98.2%" }
      ]
    },
    {
      icon: <BookOpen className="text-blue-600" size={32} />,
      title: "교육 및 훈련 사업",
      desc: "사회 적응 교육, 직업 훈련 및 역량 강화 프로그램을 제공합니다.",
      details: [
        "취업 역량 강화 교육 (자격증 취득 지원)",
        "디지털 문해력 및 IT 기술 교육",
        "청소년 학습 지원 및 진로 상담"
      ],
      goal: "경제적 자립을 위한 실질적인 직무 능력 배양",
      effect: "취업률 향상 및 전문 인력 양성",
      achievements: [
        { label: "자격증 취득자", value: "480여 명" },
        { label: "IT 교육 이수", value: "620명" },
        { label: "평균 취업률", value: "82.5%" }
      ]
    },
    {
      icon: <Globe className="text-blue-600" size={32} />,
      title: "문화 통합 사업",
      desc: "남북한 주민이 함께 어우러지는 문화 교류 행사를 개최합니다.",
      details: [
        "남북한 주민 어울림 한마당 축제",
        "문화 예술 체험 및 역사 탐방 프로그램",
        "상호 이해 증진을 위한 소통 워크숍"
      ],
      goal: "문화적 이질감 해소 및 상호 존중 문화 확산",
      effect: "사회적 통합 및 공동체 의식 강화",
      achievements: [
        { label: "누적 문화 행사", value: "85회 개최" },
        { label: "어울림 축제 참여", value: "4,200+ 명" },
        { label: "상호 존중도", value: "96.4%" }
      ]
    },
    {
      icon: <MessageCircle className="text-blue-600" size={32} />,
      title: "상담 및 복지 사업",
      desc: "심리 상담과 생활 밀착형 복지 서비스를 통해 마음의 안정을 돕습니다.",
      details: [
        "전문 심리 상담 및 트라우마 치유 프로그램",
        "위기 가정 긴급 지원 및 의료 서비스 연계",
        "법률 자문 및 권익 보호 활동"
      ],
      goal: "정서적 안정 및 삶의 질 향상",
      effect: "심리적 건강 회복 및 사회적 안전망 강화",
      achievements: [
        { label: "심리 상담 횟수", value: "3,500+ 회" },
        { label: "긴급 생계 지원", value: "240건" },
        { label: "정서 건강 개선율", value: "91.2%" }
      ]
    }
  ];

  const campaigns = [
    {
      title: "2026 따뜻한 겨울나기 캠페인",
      desc: "소외된 이웃들에게 따뜻한 온기를 전하는 연말 캠페인입니다.",
      period: "2026.11.01 ~ 2026.12.31",
      status: "진행 예정",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "하나되는 마음, 걷기 챌린지",
      desc: "남북한 주민이 함께 걸으며 소통하는 건강 캠페인입니다.",
      period: "2026.05.15 ~ 2026.06.15",
      status: "모집 중",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-blue-600 py-20 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            주요 사업 및 캠페인
          </motion.h1>
          <p className="text-xl text-blue-100">
            하나사랑협회는 실질적인 지원과 진심 어린 소통을 통해 <br className="hidden md:block" />
            북한이탈주민의 행복한 내일을 만들어갑니다.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-32">
            {programs.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row gap-20 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-900/5"
                  >
                    {p.icon}
                  </motion.div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">{p.title}</h2>
                  <p className="text-gray-600 text-xl mb-10 leading-relaxed">{p.desc}</p>
                  
                  <div className="space-y-5 mb-10">
                    {p.details.map((detail, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-blue-600/30">
                          <CheckCircle2 className="text-white" size={14} />
                        </div>
                        <span className="text-gray-700 font-medium">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Target size={18} className="text-blue-600" /> 사업 목표
                        </h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{p.goal}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-600/30 text-white flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <ArrowUpRight size={18} className="text-blue-200" /> 기대 효과
                        </h4>
                        <p className="text-blue-100 text-xs leading-relaxed">{p.effect}</p>
                      </div>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-xl shadow-emerald-200/30 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-emerald-600" /> 주요 성과
                        </h4>
                        <div className="space-y-2 mt-1">
                          {p.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="flex justify-between items-center text-[11px]">
                              <span className="text-emerald-700 font-semibold">{ach.label}</span>
                              <span className="text-emerald-900 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">{ach.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border-8 border-white"
                >
                  <img 
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&q=80&w=1000`} 
                    alt={p.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Campaigns */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">진행 중인 캠페인</h2>
            <p className="text-gray-600">여러분의 작은 참여가 누군가에게는 큰 희망이 됩니다.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {campaigns.map((c, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={c.image} 
                    alt={c.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      c.status === '모집 중' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Calendar size={12} /> {c.period}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{c.title}</h3>
                  <p className="text-gray-600 mb-6">{c.desc}</p>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
                    캠페인 참여하기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;
