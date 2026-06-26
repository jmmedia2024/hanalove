import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, User, MapPin, Search, Plus, X, Send } from 'lucide-react';
import { db, collection, getDocs, orderBy, query, addDoc } from '../firebase';

interface Story {
  id: string;
  author: string;
  title: string;
  content: string;
  location: string;
  createdAt: string;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    location: '',
    content: ''
  });

  const fetchStories = async () => {
    try {
      const storiesRef = collection(db, 'success_stories');
      const q = query(storiesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        const initialStories: Story[] = [
          {
            id: '1',
            title: '처음 만난 남한의 봄, 그리고 나의 작은 카페',
            author: '김하나',
            location: '서울',
            content: '한국에 온 지 벌써 3년, 하나사랑협회의 바리스타 교육 과정을 수료하고 작은 카페를 열었습니다. 처음엔 낯선 문화와 언어 차이로 힘들었지만, 멘토님의 따뜻한 격려 덕분에 포기하지 않을 수 있었습니다. 이제는 제가 받은 사랑을 맛있는 커피 한 잔으로 이웃들에게 나누고 싶습니다.',
            createdAt: '2026-05-12T10:00:00Z'
          },
          {
            id: '2',
            title: '자격증 취득으로 찾은 나의 길',
            author: '박정우',
            location: '경기',
            content: '하나사랑협회의 정착 지원 장학생으로 선발되어 IT 자격증을 준비할 수 있었습니다. 주경야독으로 힘들게 공부했지만, 합격증을 받았을 때의 기쁨은 이루 말할 수 없습니다. 저처럼 새로운 길을 찾고 있는 후배들에게 언제든 도움을 주고 싶습니다.',
            createdAt: '2026-06-01T14:30:00Z'
          },
          {
            id: '3',
            title: '우리가족 첫 보금자리',
            author: '이영철',
            location: '인천',
            content: '협회의 주거 지원 상담을 통해 임대주택을 배정받고 우리 가족만의 첫 보금자리를 마련했습니다. 텅 빈 집에 처음 들어서던 날, 아내와 부둥켜안고 울었던 기억이 납니다. 이 안정감 속에서 아이들이 더 밝게 자라기를 기도합니다.',
            createdAt: '2026-06-15T09:15:00Z'
          }
        ];
        setStories(initialStories);
      } else {
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Story[];
        setStories(fetchedData);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.content) return;
    
    setIsSubmitting(true);
    try {
      const storiesRef = collection(db, 'success_stories');
      await addDoc(storiesRef, {
        title: formData.title,
        author: formData.author,
        location: formData.location || '기타 지역',
        content: formData.content,
        createdAt: new Date().toISOString()
      });
      
      setFormData({ title: '', author: '', location: '', content: '' });
      setIsFormOpen(false);
      await fetchStories();
    } catch (error) {
      console.error('Failed to submit story:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStories = stories.filter(story => 
    story.title.includes(searchTerm) || 
    story.content.includes(searchTerm) || 
    story.author.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 relative">
      <div className="bg-emerald-600 text-white py-16 mb-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Quote className="mx-auto mb-6 opacity-80" size={48} />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">희망을 나누는 이야기</h1>
          <p className="text-emerald-100 text-lg">성공적인 정착을 이루어낸 분들의 생생한 경험담을 공유합니다.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Success Stories</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="이야기 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">나의 이야기 나누기</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-20 bg-gray-200 rounded w-full mb-6"></div>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={story.id}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                <Quote size={32} className="text-emerald-100 mb-6 group-hover:text-emerald-200 transition-colors" />
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{story.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1 line-clamp-4 whitespace-pre-line">
                  "{story.content}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{story.author}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <MapPin size={12} />
                      {story.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredStories.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-500 font-medium">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Write Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Quote size={20} className="text-emerald-500" />
                  나의 성공사례 쓰기
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">제목</label>
                    <input 
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="경험을 잘 나타내는 제목을 적어주세요"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">작성자명 (가명 가능)</label>
                      <input 
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        placeholder="이름"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">거주 지역</label>
                      <input 
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="예: 서울, 경기"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">나의 이야기</label>
                    <textarea 
                      required
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="어떤 어려움을 극복하고 어떤 목표를 이루셨나요? 다른 분들께 용기가 될 수 있는 따뜻한 이야기를 들려주세요."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    이야기 등록하기
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
