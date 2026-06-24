import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  User, 
  Eye, 
  Plus,
  ArrowLeft,
  X
} from 'lucide-react';
import { 
  db, 
  auth, 
  OperationType, 
  handleFirestoreError,
  onAuthStateChanged,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  addDoc
} from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface Notice {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  views: number;
}

const NoticeBoard = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auth and Post state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribeNotices = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];
      setNotices(list);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notices');
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeNotices();
      unsubscribeAuth();
    };
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'notices'), {
        title: newTitle,
        content: newContent,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || '익명회원',
        views: 0,
        createdAt: new Date().toISOString()
      });
      setNewTitle('');
      setNewContent('');
      setShowWriteModal(false);
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("공지사항 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewNotice = async (notice: Notice) => {
    setSelectedNotice(notice);
    try {
      await updateDoc(doc(db, 'notices', notice.id), {
        views: increment(1)
      });
    } catch (error) {
      console.error("Failed to update view count:", error);
    }
  };

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {selectedNotice ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-8 md:p-12 border-b border-gray-100">
              <button 
                onClick={() => setSelectedNotice(null)}
                className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline"
              >
                <ArrowLeft size={20} /> 목록으로 돌아가기
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{selectedNotice.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User size={16} /> {selectedNotice.authorName}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} /> {new Date(selectedNotice.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} /> {selectedNotice.views}
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12 prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                {selectedNotice.content}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Notice Board</span>
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-gray-900">공지사항</h1>
                  {currentUser && (
                    <button 
                      onClick={() => setShowWriteModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Plus size={14} /> 글쓰기
                    </button>
                  )}
                </div>
              </div>
              <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-8 py-6 font-bold text-gray-900">제목</th>
                      <th className="px-8 py-6 font-bold text-gray-900 w-32">작성자</th>
                      <th className="px-8 py-6 font-bold text-gray-900 w-40">날짜</th>
                      <th className="px-8 py-6 font-bold text-gray-900 w-24">조회</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredNotices.length > 0 ? (
                      filteredNotices.map((notice) => (
                        <tr 
                          key={notice.id} 
                          onClick={() => handleViewNotice(notice)}
                          className="hover:bg-blue-50/30 transition-all cursor-pointer group"
                        >
                          <td className="px-8 py-6">
                            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {notice.title}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-gray-500 text-sm">{notice.authorName}</td>
                          <td className="px-8 py-6 text-gray-500 text-sm">
                            {new Date(notice.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-8 py-6 text-gray-500 text-sm">{notice.views}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                          등록된 공지사항이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">
                1
              </button>
              <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Write Notice Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full border border-gray-100 shadow-2xl relative"
          >
            <button 
              onClick={() => setShowWriteModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">새 공지사항 등록</h2>
            
            <form onSubmit={handleCreateNotice} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input 
                  type="text" 
                  placeholder="제목을 입력하세요"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                <textarea 
                  rows={8}
                  placeholder="내용을 입력하세요"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 leading-relaxed resize-none"
                />
              </div>
              
              <div className="flex gap-4 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-6 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : '등록하기'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
