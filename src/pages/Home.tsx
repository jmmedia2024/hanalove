import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Globe, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  ArrowUpRight,
  HandHeart,
  ShieldCheck,
  Calendar,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, OperationType, handleFirestoreError, collection, addDoc } from '../firebase';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=2000" 
          alt="Community background" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full text-blue-400 text-sm font-semibold mb-6">
            <Heart size={16} fill="currentColor" />
            <span>함께 만드는 따뜻한 세상</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8">
            하나의 마음으로 <br />
            <span className="text-blue-500">사랑을 나눕니다</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
            하나사랑협회는 북한이탈주민의 성공적인 정착과 사회 통합을 위해 
            진심 어린 마음으로 동행하며, 모두가 행복한 미래를 꿈꿉니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/about" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20">
              협회 소개 보기 <ChevronRight size={20} />
            </Link>
            <Link to="/programs" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              사업 안내 <ArrowUpRight size={20} />
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
};

const AboutSection = () => {
  const features = [
    {
      icon: <Users className="text-blue-600" size={32} />,
      title: "정착 지원",
      desc: "초기 정착부터 자립까지 단계별 맞춤형 지원 프로그램을 운영합니다."
    },
    {
      icon: <BookOpen className="text-blue-600" size={32} />,
      title: "교육 및 훈련",
      desc: "사회 적응 교육, 직업 훈련 및 역량 강화 프로그램을 제공합니다."
    },
    {
      icon: <Globe className="text-blue-600" size={32} />,
      title: "문화 통합",
      desc: "남북한 주민이 함께 어우러지는 문화 교류 행사를 개최합니다."
    },
    {
      icon: <MessageCircle className="text-blue-600" size={32} />,
      title: "상담 및 복지",
      desc: "심리 상담과 생활 밀착형 복지 서비스를 통해 마음의 안정을 돕습니다."
    }
  ];

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(37,99,235,0.15)] border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000" 
                alt="Community members" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-10 -right-10 bg-blue-600 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-600/40 hidden md:block max-w-xs border-4 border-white"
            >
              <p className="text-4xl font-bold mb-2">10+</p>
              <p className="text-blue-100 text-sm leading-relaxed font-medium">
                10년이 넘는 시간 동안 북한이탈주민의 든든한 버팀목이 되어왔습니다.
              </p>
            </motion.div>
          </motion.div>

          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-6 block">About Us</span>
            <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              서로의 다름을 인정하고 <br />
              <span className="text-blue-600">함께 성장하는 공동체</span>
            </h2>
            <p className="text-gray-600 text-xl mb-12 leading-relaxed">
              하나사랑협회는 북한이탈주민들이 우리 사회의 당당한 일원으로 자리 잡을 수 있도록 
              다양한 지원 사업을 펼치고 있습니다. 우리는 단순한 원조를 넘어, 
              진정한 마음의 교류를 통해 하나 되는 세상을 꿈꿉니다.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-10">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col gap-4 group"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-900/5 group-hover:shadow-blue-600/30">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Stats = () => {
  const stats = [
    { label: '누적 지원 인원', value: '5,000+', icon: <Users size={24} /> },
    { label: '운영 프로그램', value: '120+', icon: <BookOpen size={24} /> },
    { label: '자원봉사자', value: '800+', icon: <HandHeart size={24} /> },
    { label: '협력 기관', value: '50+', icon: <ShieldCheck size={24} /> },
  ];

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {s.icon}
              </div>
              <div className="text-4xl font-bold mb-2">{s.value}</div>
              <div className="text-blue-100 text-sm font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const News = () => {
  const posts = [
    {
      tag: '공지사항',
      title: '2026년 상반기 정착 지원 프로그램 신청 안내',
      date: '2026.04.01',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600'
    },
    {
      tag: '활동소식',
      title: '제15회 하나사랑 어울림 한마당 성료',
      date: '2026.03.25',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600'
    },
    {
      tag: '언론보도',
      title: '하나사랑협회, 지역사회 통합 공로 표창 수상',
      date: '2026.03.10',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <section id="news" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">News & Notice</span>
            <h2 className="text-4xl font-bold text-gray-900">새로운 소식</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:underline">
            전체보기 <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('우리은행 1002-123-456789');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...form,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setIsSubmitted(true);
      setForm({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3 block">Participation & Contact</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">소통하고 함께하기</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">하나사랑협회는 여러분의 목소리에 항상 귀를 기울이며, 다양한 나눔의 손길을 환영합니다.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Info cards (Contact, Support Info, Volunteer Steps) - Span 7 */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Contact details card */}
            <div className="bg-gray-50/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info size={20} className="text-blue-600" /> 연락처 및 오시는 길
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">주소</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">서울특별시 중구 세종대로 110</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">전화번호</h4>
                    <p className="text-gray-500 text-xs">02-123-4567</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-3 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">이메일</h4>
                    <p className="text-gray-500 text-xs">info@hanalove.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Info card */}
            <div className="bg-blue-50/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-blue-100/50 shadow-xl shadow-blue-200/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30">
                    <HandHeart size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">후원 참여로 힘 보태기</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">소외된 이웃들이 안정되게 일어설 수 있도록 자립의 힘이 되어주세요.</p>
                  </div>
                </div>
                <Link to="/support" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 shrink-0 flex items-center gap-1">
                  후원 안내 <ChevronRight size={14} />
                </Link>
              </div>

              <div className="mt-6 p-4 bg-white rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600 block mb-1">정식 후원 계좌</span>
                  <span className="text-gray-700 font-bold text-sm">우리은행 1002-123-456789 <span className="text-gray-400 font-normal">(예금주: 하나사랑협회)</span></span>
                </div>
                <button 
                  onClick={handleCopyAccount}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-stretch sm:self-auto justify-center cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> 복사 완료
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> 계좌 복사
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Volunteer card */}
            <div className="bg-gray-50/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">따뜻한 동행, 자원봉사 신청</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">학습 지도, 정서 멘토링, 캠페인 등 따뜻한 나눔에 동참해 주세요.</p>
                  </div>
                </div>
                <Link to="/support" className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 shrink-0 flex items-center gap-1">
                  봉사 신청 <ChevronRight size={14} />
                </Link>
              </div>
            </div>

          </div>

          {/* Inquiry Form - Span 5 */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-gray-200/80 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle size={24} className="text-blue-600" /> 문의 보내기
              </h3>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">문의 접수 완료!</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    소중한 문의가 접수되었습니다. <br />
                    담당자가 검토 후 빠른 시일 내에 답변드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">이름</label>
                    <input 
                      required
                      type="text" 
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" 
                      placeholder="성함을 입력하세요" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">연락처</label>
                    <input 
                      required
                      type="tel" 
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" 
                      placeholder="010-0000-0000" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">이메일</label>
                    <input 
                      required
                      type="email" 
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" 
                      placeholder="example@email.com" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">문의 내용</label>
                    <textarea 
                      required
                      rows={4} 
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all resize-none" 
                      placeholder="문의하실 내용을 입력하세요"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? '전송 중...' : '문의 보내기'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Stats />
      <News />
      <Contact />
    </>
  );
}
