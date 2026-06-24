import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  Image as ImageIcon, 
  Calendar, 
  User, 
  ChevronRight, 
  ChevronLeft,
  Maximize2,
  ArrowLeft
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
  addDoc
} from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface GalleryPost {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  authorName: string;
  createdAt: string;
}

const GalleryBoard = () => {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auth and Post state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unsplash stock picture presets
  const stockPresets = [
    { name: '봉사활동 1', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800' },
    { name: '봉사활동 2', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800' },
    { name: '교육지원', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800' },
    { name: '문화행사', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800' },
    { name: '한마음축제', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800' },
  ];

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribeGallery = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryPost[];
      setPosts(list);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeGallery();
      unsubscribeAuth();
    };
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("제목과 설명을 입력해주세요.");
      return;
    }
    
    // Add default stock image if empty
    const finalImageUrls = newImageUrls.length > 0 ? newImageUrls : [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800'
    ];

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'gallery'), {
        title: newTitle,
        description: newDescription,
        imageUrls: finalImageUrls,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || '익명회원',
        createdAt: new Date().toISOString()
      });
      setNewTitle('');
      setNewDescription('');
      setNewImageUrls([]);
      setImageUrlInput('');
      setShowWriteModal(false);
    } catch (error) {
      console.error("갤러리 포스트 등록 실패:", error);
      alert("갤러리 포스트 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setNewImageUrls([...newImageUrls, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleAddPreset = (url: string) => {
    if (newImageUrls.includes(url)) return;
    setNewImageUrls([...newImageUrls, url]);
  };

  const handleRemoveImageUrl = (index: number) => {
    setNewImageUrls(newImageUrls.filter((_, i) => i !== index));
  };

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
        {selectedPost ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-8 md:p-12 border-b border-gray-100 flex justify-between items-center">
              <button 
                onClick={() => {
                  setSelectedPost(null);
                  setActiveImageIndex(0);
                }}
                className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
              >
                <ArrowLeft size={20} /> 갤러리로 돌아가기
              </button>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1"><User size={14} /> {selectedPost.authorName}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-12 bg-gray-900 flex flex-col items-center justify-center min-h-[500px] relative group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    src={selectedPost.imageUrls[activeImageIndex]} 
                    alt={selectedPost.title}
                    className="max-w-full max-h-[600px] object-contain rounded-2xl shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {selectedPost.imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? selectedPost.imageUrls.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev === selectedPost.imageUrls.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              <div className="p-8 md:p-12 flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedPost.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-10 whitespace-pre-wrap">
                  {selectedPost.description}
                </p>

                <div className="mt-auto">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">사진 목록 ({selectedPost.imageUrls.length})</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedPost.imageUrls.map((url, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImageIndex === idx ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Gallery Board</span>
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-gray-900">활동 갤러리</h1>
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
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <motion.div 
                    key={post.id}
                    whileHover={{ y: -10 }}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 cursor-pointer group"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={post.imageUrls[0]} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <div className="flex items-center gap-2 text-white font-bold">
                          <Maximize2 size={20} /> 자세히 보기
                        </div>
                      </div>
                      {post.imageUrls.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <ImageIcon size={14} /> +{post.imageUrls.length - 1}
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><User size={12} /> {post.authorName}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <ImageIcon size={40} />
                  </div>
                  <p className="text-gray-400 text-lg">등록된 사진이 없습니다.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Write Gallery Post Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full border border-gray-100 shadow-2xl relative my-8"
          >
            <button 
              onClick={() => setShowWriteModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">새 활동 갤러리 등록</h2>
            
            <form onSubmit={handleCreatePost} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                <input 
                  type="text" 
                  placeholder="활동 제목을 입력하세요"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">활동 설명</label>
                <textarea 
                  rows={4}
                  placeholder="활동에 관한 간단한 설명을 적어주세요"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">사진 추가</label>
                <p className="text-xs text-gray-400 mb-3">직접 이미지 URL을 추가하거나, 아래의 아름다운 추천 이미지를 한 번의 클릭으로 추가하세요!</p>
                
                {/* Stock Presets */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {stockPresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => handleAddPreset(preset.url)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <Plus size={12} /> {preset.name}
                    </button>
                  ))}
                </div>

                {/* Custom URL Input */}
                <div className="flex gap-2 mb-4">
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg (직접 입력)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all cursor-pointer active:scale-95"
                  >
                    추가
                  </button>
                </div>

                {/* Added Images Preview */}
                {newImageUrls.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 block mb-3">추가된 사진 목록 ({newImageUrls.length})</span>
                    <div className="flex flex-wrap gap-3">
                      {newImageUrls.map((url, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 relative group">
                          <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

export default GalleryBoard;
