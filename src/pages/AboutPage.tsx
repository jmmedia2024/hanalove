import { motion } from 'motion/react';
import { Heart, Target, Eye, History, Users, Compass, Phone, Mail, MapPin, Bus, Train } from 'lucide-react';

const AboutPage = () => {
  const history = [
    { year: '2015', event: '하나사랑협회 설립 및 초대 이사회 구성' },
    { year: '2017', event: '북한이탈주민 정착 지원 센터 개소' },
    { year: '2019', event: '보건복지부 비영리 민간단체 등록' },
    { year: '2021', event: '누적 지원 인원 3,000명 돌파' },
    { year: '2023', event: '사회 통합 공로 대통령 표창 수상' },
    { year: '2025', event: '디지털 자립 교육 프로그램 런칭' },
  ];

  const members = [
    { name: '김하나', role: '이사장', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
    { name: '이사랑', role: '사무총장', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
    { name: '박정착', role: '사업본부장', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
    { name: '최통합', role: '대외협력팀장', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
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
            협회 소개
          </motion.h1>
          <p className="text-xl text-blue-100">
            하나사랑협회는 북한이탈주민의 성공적인 정착과 <br className="hidden md:block" />
            남북한 주민의 진정한 사회 통합을 위해 존재합니다.
          </p>
        </div>
      </section>

      {/* Purpose & Vision */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-12 bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-600/30">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">설립 목적</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                북한이탈주민이 우리 사회의 당당한 구성원으로 자립할 수 있도록 돕고, 
                서로 다른 문화적 배경을 가진 남북한 주민들이 이해와 사랑으로 하나 되는 
                사회적 기반을 마련하는 데 그 목적이 있습니다.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="p-12 bg-blue-600 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(37,99,235,0.2)] text-white transition-all duration-500"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-8 shadow-xl">
                <Eye size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-6">비전</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                "경계를 넘어 마음으로 하나 되는 세상" <br />
                북한이탈주민이 차별 없이 꿈을 펼칠 수 있는 사회, 
                모든 주민이 서로를 가족처럼 아끼는 따뜻한 공동체를 지향합니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* History */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4">
              <History size={20} />
              <span>History</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">걸어온 길</h2>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-blue-200 hidden md:block" />
            <div className="space-y-12">
              {history.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 text-center md:text-right">
                    {i % 2 === 0 ? null : (
                      <div className="md:pr-12">
                        <span className="text-2xl font-bold text-blue-600 mb-2 block">{item.year}</span>
                        <p className="text-gray-700 font-medium">{item.event}</p>
                      </div>
                    )}
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md z-10 hidden md:block" />
                  <div className="flex-1 text-center md:text-left">
                    {i % 2 === 0 ? (
                      <div className="md:pl-12">
                        <span className="text-2xl font-bold text-blue-600 mb-2 block">{item.year}</span>
                        <p className="text-gray-700 font-medium">{item.event}</p>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Organization */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4">
              <Users size={20} />
              <span>Organization</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">조직 구성원</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {members.map((m, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <div className="aspect-square rounded-3xl overflow-hidden mb-6 shadow-lg">
                  <img 
                    src={m.image} 
                    alt={m.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{m.name}</h4>
                <p className="text-blue-600 text-sm font-medium">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Activities */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4">
              <Compass size={20} />
              <span>Core Activities</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">주요 활동 내용</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "밀착형 정착 지원",
                desc: "입국 초기 필요한 생활 정보 안내, 거주지 마련 및 행정적 정착 절차를 1:1 밀착형 상담으로 동행합니다.",
                icon: "🤝"
              },
              {
                title: "맞춤형 역량 강화",
                desc: "컴퓨터, 자격증, 디지털 문해력 등 취업과 진학에 필수적인 맞춤형 전문 실무 교육을 제공합니다.",
                icon: "💻"
              },
              {
                title: "남북 주민 문화 교류",
                desc: "편견 없는 소통을 위해 어울림 한마당, 스포츠 교류, 역사 기행 등 건강한 문화 통합 플랫폼을 만듭니다.",
                icon: "🌟"
              },
              {
                title: "심리 힐링 및 긴급 복지",
                desc: "트라우마 치유를 위한 전문 심리 세션과 예기치 못한 생계 위기 가정을 위한 긴급 구호 및 의료 연계를 지속합니다.",
                icon: "💖"
              }
            ].map((act, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/30 flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-6">{act.icon}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{act.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{act.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Guide */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4">
              <MapPin size={20} />
              <span>Location</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">연락처 및 오시는 길</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Card 1 */}
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Compass size={18} className="text-blue-600" /> 기본 연락 정보
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-blue-100/30 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-xs mb-1">사무처 주소</h5>
                    <p className="text-gray-500 text-xs leading-relaxed">서울특별시 중구 세종대로 110 (태평로1가)</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-blue-100/30 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-xs mb-1">상담 및 대표번호</h5>
                    <p className="text-gray-500 text-xs">02-123-4567</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-blue-100/30 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-xs mb-1">공식 메일</h5>
                    <p className="text-gray-500 text-xs">info@hanalove.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subway Guide Card */}
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Train size={18} className="text-blue-600" /> 지하철 안내
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-xs mb-1">1호선 시청역</h5>
                    <p className="text-gray-500 text-xs">5번 출구에서 도보 1분</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-xs mb-1">2호선 시청역</h5>
                    <p className="text-gray-500 text-xs">12번 출구에서 도보 2분</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">5</div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-xs mb-1">5호선 광화문역</h5>
                    <p className="text-gray-500 text-xs">6번 출구에서 도보 5분</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Guide Card */}
            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bus size={18} className="text-blue-600" /> 버스 안내
              </h3>
              <div className="space-y-4">
                <div>
                  <h5 className="font-bold text-gray-700 text-xs mb-1">시청앞 / 서울광장 정류장</h5>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    지선버스: 7019, 7022 <br />
                    간선버스: 150, 172, 402, 506, 604
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-gray-700 text-xs mb-1">광화문 한국프레스센터 정류장</h5>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    간선버스: 101, 150, 402, 501, 506 <br />
                    직행버스: 1002, 1500, 9703
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
