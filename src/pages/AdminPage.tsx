import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Heart, 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  TrendingUp,
  BarChart3,
  Bell,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  LogIn,
  ShieldCheck,
  Globe,
  Database,
  Sparkles,
  Loader2,
  GripVertical,
  Upload,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  logout, 
  OperationType, 
  handleFirestoreError,
  onAuthStateChanged,
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from '../firebase';
import { generateImage } from '../services/geminiService';
import { User as FirebaseUser } from 'firebase/auth';

const AdminPage = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminRole, setAdminRole] = useState<'super_admin' | 'content_manager' | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPostModal, setShowPostModal] = useState<'notice' | 'gallery' | 'page' | 'donation' | 'volunteer' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Form states
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', imageUrls: [''] });
  const [pageForm, setPageForm] = useState({ title: '', path: '', content: '' });
  const [donationForm, setDonationForm] = useState({ donorName: '', amount: 0, type: 'one-time', status: 'completed' });
  const [volunteerForm, setVolunteerForm] = useState({ name: '', email: '', phone: '', message: '', status: 'pending' });

  // Data states
  const [notices, setNotices] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        
        if (currentUser.email === '20250114jl@gmail.com' || currentUser.email === 'new2020.jeonil@gmail.com' || userData?.role === 'super_admin') {
          setAdminRole('super_admin');
        } else if (userData?.role === 'content_manager') {
          setAdminRole('content_manager');
        } else {
          setAdminRole(null);
        }
      } else {
        setAdminRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!adminRole) return;

    const qNotices = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubNotices = onSnapshot(qNotices, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notices');
    });

    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubGallery = onSnapshot(qGallery, (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    const qDonations = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
    const unsubDonations = onSnapshot(qDonations, (snapshot) => {
      setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'donations');
    });

    const qVolunteers = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'));
    const unsubVolunteers = onSnapshot(qVolunteers, (snapshot) => {
      setVolunteers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'volunteers');
    });

    const qPages = query(collection(db, 'pages'), orderBy('createdAt', 'desc'));
    const unsubPages = onSnapshot(qPages, (snapshot) => {
      setPages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pages');
    });

    return () => {
      unsubNotices();
      unsubGallery();
      unsubDonations();
      unsubVolunteers();
      unsubPages();
    };
  }, [adminRole]);

  useEffect(() => {
    if (adminRole !== 'super_admin') return;

    const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubUsers();
  }, [adminRole]);

  const generatePathFromTitle = (title: string) => {
    // Mapping common Korean terms to English slugs
    const mapping: { [key: string]: string } = {
      '협회 소개': 'about',
      '협회소개': 'about',
      '주요 사업': 'programs',
      '주요사업': 'programs',
      '후원 안내': 'support',
      '후원안내': 'support',
      '공지 사항': 'notices',
      '공지사항': 'notices',
      '활동 갤러리': 'gallery',
      '활동갤러리': 'gallery',
      '오시는 길': 'contact',
      '오시는길': 'contact',
      '인사말': 'greeting',
      '연혁': 'history',
      '조직도': 'organization'
    };

    if (mapping[title]) return '/' + mapping[title];

    // Fallback slugifier
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-');
    
    return '/' + slug;
  };

  const handlePageTitleChange = (title: string) => {
    setPageForm(prev => ({
      ...prev,
      title,
      path: editingId ? prev.path : generatePathFromTitle(title)
    }));
  };

  const handleEditNotice = (notice: any) => {
    setEditingId(notice.id);
    setNoticeForm({ title: notice.title, content: notice.content });
    setShowPostModal('notice');
  };

  const handleEditGallery = (post: any) => {
    setEditingId(post.id);
    setGalleryForm({ title: post.title, description: post.description, imageUrls: [...post.imageUrls] });
    setShowPostModal('gallery');
  };

  const handleEditPage = (page: any) => {
    setEditingId(page.id);
    setPageForm({ title: page.title, path: page.path, content: page.content });
    setShowPostModal('page');
  };

  const handleEditDonation = (d: any) => {
    setEditingId(d.id);
    setDonationForm({ donorName: d.donorName, amount: d.amount, type: d.type, status: d.status || 'completed' });
    setShowPostModal('donation');
  };

  const handleEditVolunteer = (v: any) => {
    setEditingId(v.id);
    setVolunteerForm({ name: v.name, email: v.email, phone: v.phone, message: v.message || '', status: v.status || 'pending' });
    setShowPostModal('volunteer');
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !adminRole) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'notices', editingId), {
          ...noticeForm,
          updatedAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '공지사항이 수정되었습니다.' });
      } else {
        await addDoc(collection(db, 'notices'), {
          ...noticeForm,
          authorId: user.uid,
          authorName: user.displayName || '관리자',
          views: 0,
          createdAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '새 공지사항이 등록되었습니다.' });
      }
      setNoticeForm({ title: '', content: '' });
      setEditingId(null);
      setShowPostModal(null);
    } catch (error) {
      setFeedback({ type: 'error', message: '작업 중 오류가 발생했습니다.' });
      handleFirestoreError(error, OperationType.WRITE, 'notices');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !adminRole) return;
    const validUrls = galleryForm.imageUrls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) return alert('최소 한 장의 사진 URL이 필요합니다.');

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'gallery', editingId), {
          title: galleryForm.title,
          description: galleryForm.description,
          imageUrls: validUrls,
          updatedAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '갤러리가 수정되었습니다.' });
      } else {
        await addDoc(collection(db, 'gallery'), {
          title: galleryForm.title,
          description: galleryForm.description,
          imageUrls: validUrls,
          authorId: user.uid,
          authorName: user.displayName || '관리자',
          createdAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '새 갤러리가 등록되었습니다.' });
      }
      setGalleryForm({ title: '', description: '', imageUrls: [''] });
      setEditingId(null);
      setShowPostModal(null);
    } catch (error) {
      setFeedback({ type: 'error', message: '작업 중 오류가 발생했습니다.' });
      handleFirestoreError(error, OperationType.WRITE, 'gallery');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !adminRole) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'pages', editingId), {
          ...pageForm,
          updatedAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '페이지가 수정되었습니다.' });
      } else {
        await addDoc(collection(db, 'pages'), {
          ...pageForm,
          authorId: user.uid,
          createdAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '새 페이지가 등록되었습니다.' });
      }
      setPageForm({ title: '', path: '', content: '' });
      setEditingId(null);
      setShowPostModal(null);
    } catch (error) {
      setFeedback({ type: 'error', message: '작업 중 오류가 발생했습니다.' });
      handleFirestoreError(error, OperationType.WRITE, 'pages');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || adminRole !== 'super_admin') return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'donations', editingId), {
          ...donationForm,
          updatedAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '후원 내역이 수정되었습니다.' });
      } else {
        await addDoc(collection(db, 'donations'), {
          ...donationForm,
          createdAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '새 후원 내역이 등록되었습니다.' });
      }
      setDonationForm({ donorName: '', amount: 0, type: 'one-time', status: 'completed' });
      setEditingId(null);
      setShowPostModal(null);
    } catch (error) {
      setFeedback({ type: 'error', message: '작업 중 오류가 발생했습니다.' });
      handleFirestoreError(error, OperationType.WRITE, 'donations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || adminRole !== 'super_admin') return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'volunteers', editingId), {
          ...volunteerForm,
          updatedAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '봉사자 정보가 수정되었습니다.' });
      } else {
        await addDoc(collection(db, 'volunteers'), {
          ...volunteerForm,
          createdAt: new Date().toISOString()
        });
        setFeedback({ type: 'success', message: '새 봉사자 신청이 등록되었습니다.' });
      }
      setVolunteerForm({ name: '', email: '', phone: '', message: '', status: 'pending' });
      setEditingId(null);
      setShowPostModal(null);
    } catch (error) {
      setFeedback({ type: 'error', message: '작업 중 오류가 발생했습니다.' });
      handleFirestoreError(error, OperationType.WRITE, 'volunteers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(aiPrompt);
      const newUrls = [...galleryForm.imageUrls].filter(url => url !== '');
      if (newUrls.length < 10) {
        newUrls.push(imageUrl);
        setGalleryForm({ ...galleryForm, imageUrls: newUrls });
        setAiPrompt('');
        setFeedback({ type: 'success', message: 'AI 이미지가 생성되었습니다.' });
      } else {
        alert('최대 10장까지만 등록 가능합니다.');
      }
    } catch (error) {
      setFeedback({ type: 'error', message: '이미지 생성에 실패했습니다.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newUrls = [...galleryForm.imageUrls].filter(url => url !== '');
    const remainingSlots = 10 - newUrls.length;
    
    Array.from(files).slice(0, remainingSlots).forEach((file: File) => {
      // Validation
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}의 용량이 너무 큽니다 (최대 5MB).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setGalleryForm(prev => {
            const updatedUrls = [...prev.imageUrls].filter(url => url !== '');
            if (updatedUrls.length < 10) {
              return { ...prev, imageUrls: [...updatedUrls, event.target!.result as string] };
            }
            return prev;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const moveImage = (fromIdx: number, toIdx: number) => {
    const newUrls = [...galleryForm.imageUrls];
    const [movedItem] = newUrls.splice(fromIdx, 1);
    newUrls.splice(toIdx, 0, movedItem);
    setGalleryForm({ ...galleryForm, imageUrls: newUrls });
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.setData('idx', idx.toString());
  };

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    const fromIdx = parseInt(e.dataTransfer.getData('idx'));
    if (fromIdx !== toIdx) {
      moveImage(fromIdx, toIdx);
    }
    setDragOverIdx(null);
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      setFeedback({ type: 'success', message: '삭제되었습니다.' });
    } catch (error) {
      setFeedback({ type: 'error', message: '삭제 중 오류가 발생했습니다.' });
      handleFirestoreError(error, OperationType.DELETE, collectionName);
    }
  };

  const handleUpdateUserRole = async (userId: string, targetUserEmail: string, newRole: string) => {
    if (adminRole !== 'super_admin') return;
    
    // Prevent changing the default super admin
    if (targetUserEmail === '20250114jl@gmail.com') {
      alert('기본 최고 관리자의 권한은 변경할 수 없습니다.');
      return;
    }

    // Confirmation
    const roleNames: {[key: string]: string} = {
      'user': '일반 사용자',
      'content_manager': '콘텐츠 매니저',
      'super_admin': '최고 관리자'
    };
    
    if (!window.confirm(`'${targetUserEmail}' 사용자의 권한을 '${roleNames[newRole]}'으로 변경하시겠습니까?`)) {
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setFeedback({ type: 'success', message: '사용자 권한이 변경되었습니다.' });
    } catch (error) {
      setFeedback({ type: 'error', message: '권한 변경 중 오류가 발생했습니다.' });
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-blue-600">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">관리자 로그인</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            하나사랑협회 관리자 전용 페이지입니다. <br />
            계정 확인을 위해 로그인이 필요합니다.
          </p>
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
          >
            <LogIn size={24} /> Google로 계속하기
          </button>
        </motion.div>
      </div>
    );
  }

  if (!adminRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-rose-500">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">권한 없음</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            관리자 권한이 없는 계정입니다. <br />
            접근 권한이 필요하시면 시스템 관리자에게 문의하세요.
          </p>
          <button 
            onClick={logout}
            className="w-full bg-gray-100 text-gray-700 py-5 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all"
          >
            로그아웃
          </button>
        </motion.div>
      </div>
    );
  }

  const SidebarItem = ({ id, icon, label }: { id: string, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="space-y-2 flex-grow">
            <SidebarItem id="dashboard" icon={<LayoutDashboard size={20} />} label="대시보드" />
            <SidebarItem id="notices" icon={<FileText size={20} />} label="공지사항 관리" />
            <SidebarItem id="gallery" icon={<ImageIcon size={20} />} label="갤러리 관리" />
            <SidebarItem id="pages" icon={<Globe size={20} />} label="페이지 관리" />
            {adminRole === 'super_admin' && (
              <>
                <SidebarItem id="donations" icon={<Heart size={20} />} label="후원 관리" />
                <SidebarItem id="users" icon={<Users size={20} />} label="사용자 관리" />
                <SidebarItem id="schema" icon={<Database size={20} />} label="DB 스키마" />
              </>
            )}
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all mt-auto"
          >
            <LogOut size={20} />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto relative">
        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-24 left-1/2 z-[110] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                feedback.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold">{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <>
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
                  <p className="text-gray-500 mt-1">
                    하나사랑협회 웹사이트의 통합 관리 환경입니다. 
                    <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-bold">
                      {adminRole === 'super_admin' ? '최고 관리자' : '콘텐츠 매니저'}
                    </span>
                  </p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: '총 공지사항', value: notices.length, icon: <FileText className="text-blue-500" size={20} /> },
                  { label: '갤러리 포스트', value: gallery.length, icon: <ImageIcon className="text-emerald-500" size={20} /> },
                  { label: '총 후원자', value: '128명', icon: <Users className="text-amber-500" size={20} /> },
                  { label: '미확인 문의', value: '5건', icon: <Bell className="text-rose-500" size={20} /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="p-3 bg-gray-50 rounded-2xl w-fit mb-4">{stat.icon}</div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <section className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">최근 공지사항</h2>
                    <button onClick={() => setActiveTab('notices')} className="text-blue-600 text-sm font-bold hover:underline">전체보기</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {notices.slice(0, 5).map((notice) => (
                      <div key={notice.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">{notice.title}</h4>
                            <p className="text-xs text-gray-400">{new Date(notice.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditNotice(notice)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete('notices', notice.id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">최근 갤러리</h2>
                    <button onClick={() => setActiveTab('gallery')} className="text-blue-600 text-sm font-bold hover:underline">전체보기</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {gallery.slice(0, 5).map((post) => (
                      <div key={post.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl overflow-hidden">
                            <img src={post.imageUrls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">{post.title}</h4>
                            <p className="text-xs text-gray-400">{post.imageUrls.length}장의 사진</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditGallery(post)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete('gallery', post.id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeTab === 'notices' && (
            <>
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">공지사항 관리</h1>
                  <p className="text-gray-500 mt-1">공지사항을 등록하고 관리할 수 있습니다.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setNoticeForm({ title: '', content: '' });
                    setShowPostModal('notice');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
                >
                  <Plus size={20} /> 새 공지사항 등록
                </button>
              </header>

              <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 font-bold text-gray-900">제목</th>
                      <th className="px-8 py-6 font-bold text-gray-900 w-40">작성일</th>
                      <th className="px-8 py-6 font-bold text-gray-900 w-32 text-center">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {notices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-gray-50 transition-all">
                        <td className="px-8 py-6 font-medium text-gray-900">{notice.title}</td>
                        <td className="px-8 py-6 text-gray-500 text-sm">{new Date(notice.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEditNotice(notice)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete('notices', notice.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'gallery' && (
            <>
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">갤러리 관리</h1>
                  <p className="text-gray-500 mt-1">갤러리 포스트를 등록하고 관리할 수 있습니다.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setGalleryForm({ title: '', description: '', imageUrls: [''] });
                    setShowPostModal('gallery');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
                >
                  <Plus size={20} /> 새 갤러리 등록
                </button>
              </header>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map((post) => (
                  <div key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={post.imageUrls[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button onClick={() => handleEditGallery(post)} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => handleDelete('gallery', post.id)} className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-gray-400">{post.imageUrls.length}장의 사진 · {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'pages' && (
            <>
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">페이지 관리</h1>
                  <p className="text-gray-500 mt-1">웹사이트의 동적 페이지를 생성하고 관리합니다.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setPageForm({ title: '', path: '', content: '' });
                    setShowPostModal('page');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
                >
                  <Plus size={20} /> 새 페이지 추가
                </button>
              </header>

              <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 font-bold text-gray-900">페이지 제목</th>
                      <th className="px-8 py-6 font-bold text-gray-900">경로 (Path)</th>
                      <th className="px-8 py-6 font-bold text-gray-900 w-32 text-center">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50 transition-all">
                        <td className="px-8 py-6 font-medium text-gray-900">{page.title}</td>
                        <td className="px-8 py-6 text-blue-600 font-mono text-sm">{page.path}</td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEditPage(page)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete('pages', page.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'donations' && (
            <>
              <header className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">후원 내역 관리</h1>
                  <p className="text-gray-500 mt-1">접수된 후원 내역을 확인하고 관리합니다.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setDonationForm({ donorName: '', amount: 0, type: 'one-time', status: 'completed' });
                    setShowPostModal('donation');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
                >
                  <Plus size={20} /> 새 후원 등록
                </button>
              </header>

              <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 font-bold text-gray-900">후원자</th>
                      <th className="px-8 py-6 font-bold text-gray-900">금액</th>
                      <th className="px-8 py-6 font-bold text-gray-900">유형</th>
                      <th className="px-8 py-6 font-bold text-gray-900">날짜</th>
                      <th className="px-8 py-6 font-bold text-gray-900 text-center">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {donations.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50 transition-all">
                        <td className="px-8 py-6 font-medium text-gray-900">{d.donorName}</td>
                        <td className="px-8 py-6 text-blue-600 font-bold">{d.amount.toLocaleString()}원</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.type === 'regular' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                            {d.type === 'regular' ? '정기후원' : '일시후원'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-gray-500 text-sm">{new Date(d.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEditDonation(d)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete('donations', d.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="space-y-12">
              <section>
                <header className="flex justify-between items-end mb-10">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">자원봉사 신청 관리</h1>
                    <p className="text-gray-500 mt-1">자원봉사 신청자 명단을 확인하고 관리합니다.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setVolunteerForm({ name: '', email: '', phone: '', message: '', status: 'pending' });
                      setShowPostModal('volunteer');
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
                  >
                    <Plus size={20} /> 새 신청 등록
                  </button>
                </header>

                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-6 font-bold text-gray-900">이름</th>
                        <th className="px-8 py-6 font-bold text-gray-900">연락처</th>
                        <th className="px-8 py-6 font-bold text-gray-900">이메일</th>
                        <th className="px-8 py-6 font-bold text-gray-900">신청일</th>
                        <th className="px-8 py-6 font-bold text-gray-900 text-center">작업</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {volunteers.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50 transition-all">
                          <td className="px-8 py-6 font-medium text-gray-900">{v.name}</td>
                          <td className="px-8 py-6 text-gray-500 text-sm">{v.phone}</td>
                          <td className="px-8 py-6 text-gray-500 text-sm">{v.email}</td>
                          <td className="px-8 py-6 text-gray-500 text-sm">{new Date(v.createdAt).toLocaleDateString()}</td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEditVolunteer(v)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDelete('volunteers', v.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {adminRole === 'super_admin' && (
                <section>
                  <header className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">사용자 권한 관리</h1>
                    <p className="text-gray-500 mt-1">관리자 및 사용자 권한을 설정합니다.</p>
                  </header>

                  <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-8 py-6 font-bold text-gray-900">사용자</th>
                          <th className="px-8 py-6 font-bold text-gray-900">이메일</th>
                          <th className="px-8 py-6 font-bold text-gray-900">현재 권한</th>
                          <th className="px-8 py-6 font-bold text-gray-900 text-center">권한 변경</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {usersList.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50 transition-all">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                {u.photoURL && <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />}
                                <span className="font-medium text-gray-900">{u.displayName || '이름 없음'}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-gray-500 text-sm">{u.email}</td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                u.role === 'super_admin' ? 'bg-rose-50 text-rose-600' : 
                                u.role === 'content_manager' ? 'bg-blue-50 text-blue-600' : 
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {u.role === 'super_admin' ? '최고 관리자' : u.role === 'content_manager' ? '콘텐츠 매니저' : '일반 사용자'}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center gap-2">
                                <select 
                                  value={u.role}
                                  onChange={(e) => handleUpdateUserRole(u.id, u.email, e.target.value)}
                                  disabled={u.email === '20250114jl@gmail.com'}
                                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 cursor-pointer"
                                >
                                  <option value="user">일반 사용자</option>
                                  <option value="content_manager">콘텐츠 매니저</option>
                                  <option value="super_admin">최고 관리자</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'schema' && (
            <>
              <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">데이터베이스 스키마</h1>
                <p className="text-gray-500 mt-1">현재 애플리케이션에서 사용하는 데이터 구조 정의입니다.</p>
              </header>

              <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-gray-800">
                <pre className="text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify({
                    entities: {
                      User: { properties: { uid: "string", email: "string", role: "admin|user" } },
                      Notice: { properties: { title: "string", content: "string", views: "number" } },
                      Gallery: { properties: { title: "string", imageUrls: "string[]" } },
                      Donation: { properties: { donorName: "string", amount: "number", type: "regular|one-time" } },
                      Volunteer: { properties: { name: "string", email: "string", phone: "string", status: "pending|accepted" } },
                      Page: { properties: { title: "string", path: "string", content: "string" } }
                    }
                  }, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </main>


      {/* Modals */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPostModal(null);
                setEditingId(null);
              }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? '게시글 수정' : (
                    showPostModal === 'notice' ? '새 공지사항 등록' : 
                    showPostModal === 'gallery' ? '새 갤러리 등록' : 
                    showPostModal === 'page' ? '새 페이지 추가' :
                    showPostModal === 'donation' ? '새 후원 내역 등록' :
                    '새 봉사자 신청 등록'
                  )}
                </h2>
                <button onClick={() => {
                  setShowPostModal(null);
                  setEditingId(null);
                }} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                {showPostModal === 'notice' ? (
                  <form onSubmit={handleCreateNotice} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">제목</label>
                      <input 
                        required
                        type="text" 
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="공지사항 제목을 입력하세요"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">내용</label>
                      <textarea 
                        required
                        rows={8}
                        value={noticeForm.content}
                        onChange={(e) => setNoticeForm({...noticeForm, content: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        placeholder="공지사항 내용을 입력하세요"
                      />
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? '처리 중...' : (editingId ? '수정 완료' : '등록하기')}
                    </button>
                  </form>
                ) : showPostModal === 'gallery' ? (
                  <form onSubmit={handleCreateGallery} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">제목</label>
                      <input 
                        required
                        type="text" 
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="갤러리 제목을 입력하세요"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">설명</label>
                      <textarea 
                        required
                        rows={3}
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        placeholder="활동에 대한 설명을 입력하세요"
                      />
                    </div>

                    {/* AI Image Generation Section */}
                    <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 space-y-4">
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <Sparkles size={20} />
                        <span>AI 이미지 생성</span>
                      </div>
                      <p className="text-xs text-blue-600/70">원하는 이미지의 설명을 입력하면 AI가 이미지를 생성해줍니다.</p>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="예: 행복하게 웃고 있는 아이들의 모습"
                          className="flex-grow px-5 py-3 bg-white border border-blue-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button 
                          type="button"
                          onClick={handleAiGenerate}
                          disabled={isGenerating || !aiPrompt.trim()}
                          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : '생성'}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">사진 관리 (최대 10장)</label>
                        <div className="flex gap-4">
                          <label className="text-blue-600 text-xs font-bold hover:underline cursor-pointer flex items-center gap-1">
                            <Upload size={14} /> 파일 업로드
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleFileUpload}
                            />
                          </label>
                          <button 
                            type="button"
                            onClick={() => galleryForm.imageUrls.length < 10 && setGalleryForm({...galleryForm, imageUrls: [...galleryForm.imageUrls, '']})}
                            className="text-blue-600 text-xs font-bold hover:underline"
                          >
                            + URL 추가
                          </button>
                        </div>
                      </div>

                      {/* Drag & Drop Zone */}
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const files = e.dataTransfer.files;
                          if (files.length > 0) {
                            const event = { target: { files } } as any;
                            handleFileUpload(event);
                          }
                        }}
                        className="border-2 border-dashed border-gray-200 rounded-[2rem] p-8 text-center bg-gray-50/50 hover:bg-gray-50 hover:border-blue-300 transition-all group"
                      >
                        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-blue-500">
                          <Upload size={32} />
                          <p className="text-sm font-medium">이미지를 드래그하여 놓거나 클릭하여 업로드하세요</p>
                          <p className="text-xs opacity-60">최대 10장, 장당 5MB 이하 (JPG, PNG, WebP)</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {galleryForm.imageUrls.map((url, idx) => (
                          <div 
                            key={idx} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverIdx(idx);
                            }}
                            onDragLeave={() => setDragOverIdx(null)}
                            onDrop={(e) => handleDrop(e, idx)}
                            className={`flex items-center gap-4 p-4 bg-white border rounded-2xl transition-all ${
                              dragOverIdx === idx ? 'border-blue-500 bg-blue-50/30 scale-[1.02]' : 'border-gray-100'
                            }`}
                          >
                            <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                              <GripVertical size={20} />
                            </div>
                            
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                              {url ? (
                                <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <ImageIcon size={24} />
                                </div>
                              )}
                            </div>

                            <div className="flex-grow space-y-1">
                              <input 
                                required
                                type="url" 
                                value={url}
                                onChange={(e) => {
                                  const newUrls = [...galleryForm.imageUrls];
                                  newUrls[idx] = e.target.value;
                                  setGalleryForm({...galleryForm, imageUrls: newUrls});
                                }}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <button 
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveImage(idx, idx - 1)}
                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                              >
                                <ChevronUp size={16} />
                              </button>
                              <button 
                                type="button"
                                disabled={idx === galleryForm.imageUrls.length - 1}
                                onClick={() => moveImage(idx, idx + 1)}
                                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-20"
                              >
                                <ChevronDown size={16} />
                              </button>
                            </div>

                            <button 
                              type="button"
                              onClick={() => {
                                const newUrls = galleryForm.imageUrls.filter((_, i) => i !== idx);
                                setGalleryForm({...galleryForm, imageUrls: newUrls});
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? '처리 중...' : (editingId ? '수정 완료' : '등록하기')}
                    </button>
                  </form>
                ) : showPostModal === 'donation' ? (
                  <form onSubmit={handleCreateDonation} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">후원자 성함</label>
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
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm({...donationForm, amount: parseInt(e.target.value)})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">후원 유형</label>
                        <select 
                          value={donationForm.type}
                          onChange={(e) => setDonationForm({...donationForm, type: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        >
                          <option value="one-time">일시후원</option>
                          <option value="regular">정기후원</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">상태</label>
                        <select 
                          value={donationForm.status}
                          onChange={(e) => setDonationForm({...donationForm, status: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        >
                          <option value="completed">완료</option>
                          <option value="pending">대기</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? '처리 중...' : (editingId ? '수정 완료' : '등록하기')}
                    </button>
                  </form>
                ) : showPostModal === 'volunteer' ? (
                  <form onSubmit={handleCreateVolunteer} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">신청자 성함</label>
                      <input 
                        required
                        type="text" 
                        value={volunteerForm.name}
                        onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="성함을 입력하세요"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">연락처</label>
                        <input 
                          required
                          type="tel" 
                          value={volunteerForm.phone}
                          onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">이메일</label>
                        <input 
                          required
                          type="email" 
                          value={volunteerForm.email}
                          onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">상태</label>
                      <select 
                        value={volunteerForm.status}
                        onChange={(e) => setVolunteerForm({...volunteerForm, status: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      >
                        <option value="pending">대기</option>
                        <option value="reviewed">검토중</option>
                        <option value="accepted">수락됨</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">메시지</label>
                      <textarea 
                        rows={3}
                        value={volunteerForm.message}
                        onChange={(e) => setVolunteerForm({...volunteerForm, message: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                      />
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? '처리 중...' : (editingId ? '수정 완료' : '등록하기')}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCreatePage} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">페이지 제목</label>
                      <input 
                        required
                        type="text" 
                        value={pageForm.title}
                        onChange={(e) => handlePageTitleChange(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="예: 협회 소개"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">경로 (Path)</label>
                        <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">자동 생성됨</span>
                      </div>
                      <input 
                        required
                        type="text" 
                        value={pageForm.path}
                        onChange={(e) => setPageForm({...pageForm, path: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
                        placeholder="/about"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">내용 (HTML/Markdown)</label>
                      <textarea 
                        required
                        rows={10}
                        value={pageForm.content}
                        onChange={(e) => setPageForm({...pageForm, content: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-mono text-sm"
                        placeholder="페이지 내용을 입력하세요"
                      />
                    </div>
                    <button 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSubmitting ? '처리 중...' : (editingId ? '수정 완료' : '등록하기')}
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

export default AdminPage;
