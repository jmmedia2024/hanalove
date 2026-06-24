import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  HandHeart, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Banknote, 
  CreditCard, 
  Gift,
  ArrowRight,
  X,
  Check
} from 'lucide-react';
import { db, OperationType, handleFirestoreError, collection, addDoc } from '../firebase';

const SupportPage = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [donationForm, setDonationForm] = useState({
    donorName: '',
    amount: 10000,
    type: 'one-time' as 'regular' | 'one-time'
  });

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'volunteers'), {
        ...volunteerForm,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setTimeout(() => {
        setShowVolunteerModal(false);
        setSubmitted(false);
        setVolunteerForm({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'volunteers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'donations'), {
        ...donationForm,
        status: 'completed', // In a real app, this would depend on payment gateway
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setTimeout(() => {
        setShowDonationModal(false);
        setSubmitted(false);
        setDonationForm({ donorName: '', amount: 10000, type: 'one-time' });
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'donations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const donationTypes = [
    {
      icon: <Heart className="text-rose-500" size={32} />,
      title: "정기 후원",
      desc: "매월 정기적인 후원을 통해 북한이탈주민들의 안정적인 자립 기반을 함께 만들어갑니다.",
      methods: ["신용카드", "계좌이체", "CMS 자동이체"]
    },
    {
      icon: <Gift className="text-blue-500" size={32} />,
      title: "일시 후원",
      desc: "특별한 날, 따뜻한 마음을 전하고 싶을 때 언제든 자유롭게 참여하실 수 있습니다.",
      methods: ["신용카드", "계좌이체", "간편결제"]
    },
    {
      icon: <HandHeart className="text-emerald-500" size={32} />,
      title: "물품 후원",
      desc: "생활필수품, 교육 도서, 가전제품 등 정착에 필요한 물품을 직접 기부하실 수 있습니다.",
      methods: ["택배 발송", "방문 기증"]
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-32 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000" 
            alt="Support background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/50 to-blue-600" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold mb-6 border border-white/30">
              Support & Participation
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              당신의 따뜻한 손길이 <br />
              <span className="text-blue-200">새로운 희망</span>이 됩니다
            </h1>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
              하나사랑협회는 여러분의 소중한 후원과 참여로 운영됩니다. 
              북한이탈주민들이 우리 사회에 잘 정착할 수 있도록 함께해 주세요.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Types */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">후원 종류 및 방법</h2>
            <p className="text-gray-600 text-xl">다양한 방법으로 하나사랑협회의 활동을 응원해 주세요.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {donationTypes.map((type, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="p-12 bg-white rounded-[3rem] border border-gray-100 flex flex-col h-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_32px_64px_-12px_rgba(37,99,235,0.15)] transition-all duration-500"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-10 shadow-xl shadow-blue-900/5">
                  {type.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{type.title}</h3>
                <p className="text-gray-600 text-lg mb-10 flex-grow leading-relaxed">{type.desc}</p>
                
                <div className="space-y-4 mb-10">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">후원 방법</h4>
                  {type.methods.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700 font-bold">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowDonationModal(true)}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50"
                >
                  후원 신청하기
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-24 p-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-blue-600/30 border-4 border-white/10"
          >
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 shadow-2xl">
                <Banknote size={40} />
              </div>
              <div>
                <h4 className="text-3xl font-bold mb-3">후원 계좌 안내</h4>
                <p className="text-blue-100 text-xl font-medium">우리은행 1002-123-456789 (예금주: 하나사랑협회)</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shrink-0 shadow-2xl active:scale-95">
              영수증 발급 안내
            </button>
          </motion.div>
        </div>
      </section>


      {/* Volunteer */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Volunteer</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">자원봉사 참여 안내</h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                여러분의 재능과 시간을 나누어 주세요. 
                작은 관심이 북한이탈주민들에게는 큰 힘이 됩니다.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { title: "학습 지원", desc: "청소년 및 성인 대상 검정고시, 기초 학습 지도" },
                  { title: "정서 지원", desc: "멘토링 프로그램을 통한 정서적 교감 및 한국 사회 적응 지원" },
                  { title: "행사 지원", desc: "협회 주관 각종 문화 행사 및 캠페인 운영 보조" },
                  { title: "재능 기부", desc: "법률, 의료, 상담, IT 등 전문 분야 재능 나눔" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowVolunteerModal(true)}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2"
              >
                자원봉사 신청하기 <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd2673675250?auto=format&fit=crop&q=80&w=1000" 
                  alt="Volunteering" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl hidden md:block border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="font-bold text-gray-900">신청 절차</p>
                </div>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li className="flex items-center gap-2"><span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">1</span> 온라인 신청서 접수</li>
                  <li className="flex items-center gap-2"><span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">2</span> 담당자 유선 상담</li>
                  <li className="flex items-center gap-2"><span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">3</span> 오리엔테이션 및 교육</li>
                  <li className="flex items-center gap-2"><span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">4</span> 봉사 활동 시작</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showDonationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonationModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">후원 신청</h2>
                <button onClick={() => setShowDonationModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">감사합니다!</h3>
                    <p className="text-gray-500">후원 신청이 정상적으로 접수되었습니다.</p>
                  </div>
                ) : (
                  <form onSubmit={handleDonationSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">성함</label>
                      <input 
                        required
                        type="text" 
                        value={donationForm.donorName}
                        onChange={(e) => setDonationForm({...donationForm, donorName: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="성함을 입력하세요"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">후원 금액 (원)</label>
                      <input 
                        required
                        type="number" 
                        step="1000"
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm({...donationForm, amount: parseInt(e.target.value)})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setDonationForm({...donationForm, type: 'one-time'})}
                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${donationForm.type === 'one-time' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-100 text-gray-400'}`}
                      >
                        일시 후원
                      </button>
                      <button 
                        type="button"
                        onClick={() => setDonationForm({...donationForm, type: 'regular'})}
                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${donationForm.type === 'regular' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-gray-100 text-gray-400'}`}
                      >
                        정기 후원
                      </button>
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? '처리 중...' : '후원하기'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {showVolunteerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVolunteerModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">자원봉사 신청</h2>
                <button onClick={() => setShowVolunteerModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">감사합니다!</h3>
                    <p className="text-gray-500">자원봉사 신청이 정상적으로 접수되었습니다.</p>
                  </div>
                ) : (
                  <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700">이름</label>
                      <input 
                        required
                        type="text" 
                        value={volunteerForm.name}
                        onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="성함을 입력하세요"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700">이메일</label>
                      <input 
                        required
                        type="email" 
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="이메일 주소를 입력하세요"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700">연락처</label>
                      <input 
                        required
                        type="tel" 
                        value={volunteerForm.phone}
                        onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="연락처를 입력하세요"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700">메모 (관심 분야 등)</label>
                      <textarea 
                        rows={3}
                        value={volunteerForm.message}
                        onChange={(e) => setVolunteerForm({...volunteerForm, message: e.target.value})}
                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        placeholder="하고 싶은 말씀을 적어주세요"
                      />
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? '처리 중...' : '신청하기'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportPage;
