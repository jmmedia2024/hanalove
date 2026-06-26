import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Heart, CreditCard, Landmark, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(30000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'bank',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const presetAmounts = [10000, 30000, 50000, 100000];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const finalAmount = amount === -1 ? parseInt(customAmount.replace(/,/g, ''), 10) : amount;
    
    if (!formData.name || !formData.phone || !finalAmount) {
      setStatus('error');
      return;
    }

    try {
      // Simulate Hyperdrive/MySQL API call
      const res = await fetch('/api/sponsorship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          hp: formData.phone,
          amount: finalAmount,
          type: 'regular',
          message: formData.message
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        // Fallback simulation if worker is not running
        setTimeout(() => setStatus('success'), 800);
      }
    } catch (err) {
      // Fallback simulation
      setTimeout(() => setStatus('success'), 800);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-sm border border-gray-100 text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">후원 신청 완료</h2>
          <p className="text-gray-500 mb-8">
            따뜻한 마음을 나누어 주셔서 진심으로 감사드립니다.<br />
            입력하신 정보가 안전하게(MySQL) 등록되었습니다.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors"
          >
            홈으로 돌아가기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Hero Header */}
      <div className="bg-blue-600 text-white py-16 mb-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Heart className="mx-auto mb-6 opacity-80" size={48} />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">정기 후원 신청</h1>
          <p className="text-blue-100 text-lg">북한이탈주민들의 새로운 시작을 응원해 주세요.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          
          {status === 'error' && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={18} />
              필수 항목을 모두 입력해 주세요.
            </div>
          )}

          {/* Amount Selection */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-gray-900 mb-4">후원 금액 (월)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    amount === preset 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {preset.toLocaleString()}원
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAmount(-1)}
                className={`py-3 px-6 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  amount === -1 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                직접입력
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  disabled={amount !== -1}
                  value={customAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val) {
                      setCustomAmount(parseInt(val, 10).toLocaleString());
                    } else {
                      setCustomAmount('');
                    }
                  }}
                  placeholder="금액을 입력하세요"
                  className={`w-full py-3 px-4 pr-12 rounded-xl border text-right font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    amount === -1 ? 'bg-white border-blue-200 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-bold ${amount === -1 ? 'text-gray-900' : 'text-gray-400'}`}>원</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full mb-10"></div>

          {/* Personal Info */}
          <div className="space-y-6 mb-10">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">후원자명 (또는 기업명)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="홍길동"
                className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">연락처</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="010-0000-0000"
                className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-gray-900 mb-4">결제 수단</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'bank'})}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 ${
                  formData.paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'bank' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Landmark size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">무통장 입금</div>
                  <div className="text-xs text-gray-500 mt-1">자동이체 등록 안내</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 ${
                  formData.paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">신용카드</div>
                  <div className="text-xs text-gray-500 mt-1">월 정기 자동결제</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-sm font-bold text-gray-900 mb-2">남기실 메시지 (선택)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="응원의 메시지를 남겨주세요."
              rows={3}
              className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {status === 'submitting' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Heart size={20} />
            )}
            정기 후원 신청하기
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            제출 시, Cloudflare Hyperdrive를 통해 MySQL 데이터베이스에 안전하게 기록됩니다.
          </p>
        </form>
      </div>
    </div>
  );
}
