import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Menu, X, Globe, ShieldCheck, Settings, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { auth, loginWithGoogle, logout, onAuthStateChanged } from '../firebase';
import { User } from 'firebase/auth';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: '협회소개', href: '/about' },
    { name: '주요사업', href: '/programs' },
    { name: '후원안내', href: '/support' },
    { name: '공지사항', href: '/notices' },
    { name: '활동갤러리', href: '/gallery' },
  ];

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
    isScrolled 
      ? 'bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-900/5 py-3 border-b border-gray-100' 
      : isHome ? 'bg-transparent py-6' : 'bg-white/80 backdrop-blur-xl py-4 border-b border-gray-100'
  }`;

  const textColor = isScrolled || !isHome ? 'text-gray-900' : 'text-white';

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all"
          >
            <Heart fill="currentColor" size={22} />
          </motion.div>
          <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${textColor}`}>
            하나사랑협회
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-sm font-bold transition-all hover:text-blue-600 relative group ${textColor}`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </Link>
          ))}
          
          {/* User Auth Info */}
          {user ? (
            <div className="flex items-center gap-3 bg-gray-100/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover shadow-inner" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <span className={`text-xs font-bold ${textColor} max-w-[100px] truncate`}>
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button 
                onClick={logout} 
                title="로그아웃"
                className={`p-1 rounded-full text-gray-400 hover:text-rose-500 transition-colors cursor-pointer`}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle} 
              className={`text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all cursor-pointer shadow-md`}
            >
              로그인 / 회원가입
            </button>
          )}

          <Link to="/support" className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-95">
            후원하기
          </Link>
        </div>
 
        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 rounded-xl transition-colors ${isScrolled || !isHome ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
 
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl shadow-2xl border-t border-gray-100 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center justify-between"
                >
                  {link.name}
                  <Settings size={18} className="text-gray-300" />
                </Link>
              ))}

              {user ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-gray-900">{user.displayName || '회원'}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all font-bold text-xs"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { loginWithGoogle(); setIsMobileMenuOpen(false); }} 
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-center shadow-lg hover:bg-blue-700 transition-all cursor-pointer"
                >
                  구글 로그인 / 회원가입
                </button>
              )}

              <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-center shadow-xl shadow-blue-600/30">
                후원하기
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                <Heart fill="currentColor" size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight">하나사랑협회</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
              북한이탈주민의 성공적인 정착과 사회 통합을 지원하여 
              모두가 행복한 미래를 만드는 비영리 단체입니다.
            </p>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'youtube', 'blog'].map((social) => (
                <motion.div 
                  key={social} 
                  whileHover={{ y: -5, backgroundColor: '#2563eb' }}
                  className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center transition-all cursor-pointer border border-white/5"
                >
                  <Globe size={20} />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> 주요 메뉴
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">협회 소개</Link></li>
              <li><Link to="/programs" className="hover:text-white hover:translate-x-1 transition-all inline-block">주요 사업</Link></li>
              <li><Link to="/notices" className="hover:text-white hover:translate-x-1 transition-all inline-block">공지사항</Link></li>
              <li><Link to="/gallery" className="hover:text-white hover:translate-x-1 transition-all inline-block">활동 갤러리</Link></li>
              <li><Link to="/support" className="hover:text-white hover:translate-x-1 transition-all inline-block">후원 안내</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> 관련 사이트
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><a href="https://www.unikorea.go.kr" target="_blank" rel="noreferrer" className="hover:text-white hover:translate-x-1 transition-all inline-block">통일부</a></li>
              <li><a href="https://www.koreahana.or.kr" target="_blank" rel="noreferrer" className="hover:text-white hover:translate-x-1 transition-all inline-block">남북하나재단</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> 뉴스레터 구독
            </h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">협회의 새로운 소식과 활동 보고서를 이메일로 받아보세요.</p>
            <div className="space-y-3">
              <input type="email" placeholder="이메일 주소" className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 w-full transition-all" />
              <button className="w-full bg-blue-600 px-5 py-4 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">구독하기</button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">이메일무단수집거부</a>
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-gray-600 text-xs font-medium">© 2026 하나사랑협회. All rights reserved.</p>
            <Link 
              to="/admin" 
              className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white/10 transition-all"
              title="관리자 페이지"
            >
              <ShieldCheck size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

