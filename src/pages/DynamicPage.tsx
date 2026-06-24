import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, limit, db } from '../firebase';
import { motion } from 'motion/react';

const DynamicPage = () => {
  const location = useLocation();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'pages'), 
          where('path', '==', location.pathname),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setPage(querySnapshot.docs[0].data());
        } else {
          setPage(null);
        }
      } catch (error) {
        console.error("Error fetching dynamic page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-8">요청하신 경로는 존재하지 않거나 삭제된 페이지입니다.</p>
        <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
          홈으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            {page.title}
          </h1>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 prose prose-lg max-w-none"
        >
          {/* We use dangerouslySetInnerHTML to support the HTML content from admin */}
          <div 
            className="dynamic-content text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DynamicPage;
