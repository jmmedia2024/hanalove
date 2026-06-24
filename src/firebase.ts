import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup as realSignInWithPopup, 
  signOut as realSignOut,
  onAuthStateChanged as realOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection as realCollection, 
  doc as realDoc, 
  getDoc as realGetDoc, 
  getDocs as realGetDocs, 
  setDoc as realSetDoc, 
  updateDoc as realUpdateDoc, 
  deleteDoc as realDeleteDoc, 
  query as realQuery, 
  orderBy as realOrderBy, 
  where as realWhere,
  limit as realLimit, 
  onSnapshot as realOnSnapshot, 
  increment as realIncrement,
  serverTimestamp as realServerTimestamp,
  getDocFromServer,
  addDoc as realAddDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Force mock mode permanently true to respect user intent: "Firebase 이거사용하지마!" (Do not use Firebase!)
export const isMockMode = true;

console.log(`[Firebase Service] Running in pure LOCAL OFFLINE/MOCK mode.`);

// Initialize real Firebase SDK (with guards to avoid crashes if invalid configs)
let app: any;
let db: any;
let auth: any;
let googleProvider: any;

if (!isMockMode) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase Initialization failed, forcing mock mode:", error);
  }
}

// -------------------------------------------------------------
// LOCALSTORAGE-BASED MOCK FIREBASE DB & AUTH FALLBACK
// -------------------------------------------------------------

// Active onSnapshot listeners map
const snapshotListeners: { [colName: string]: Array<(snapshot: any) => void> } = {};

// Helper to trigger listeners when data changes
const triggerListeners = (colName: string) => {
  const listeners = snapshotListeners[colName];
  if (!listeners) return;
  const docs = getLocalCollection(colName);
  
  // Sort listings for boards
  let sortedDocs = [...docs];
  if (['notices', 'gallery', 'donations', 'volunteers', 'inquiries'].includes(colName)) {
    sortedDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const snapshot = {
    docs: sortedDocs.map(d => ({
      id: d.id,
      data: () => d
    }))
  };
  
  listeners.forEach(cb => cb(snapshot));
};

// Initial Mock Data Provider
const getInitialMockData = (colName: string): any[] => {
  switch (colName) {
    case 'notices':
      return [
        {
          id: "notice-1",
          title: "[공지] 하나사랑협회 공식 홈페이지 개설 안내",
          content: "안녕하세요. 하나사랑협회입니다.\n\n우리 협회의 새로운 공식 홈페이지가 개설되었습니다. 북한이탈주민 여러분의 안정적인 정착과 자립을 지원하기 위한 다양한 사업 소개와 소통의 장이 마련되었으니 많은 관심과 참여 부탁드립니다.\n\n감사합니다.",
          authorName: "관리자",
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          views: 154
        },
        {
          id: "notice-2",
          title: "[안내] 2026년 하반기 정착지원 장학생 선발 공고",
          content: "하나사랑협회에서 학업에 열중하고 있는 북한이탈주민 자녀 및 대학생을 대상으로 장학생을 선발합니다.\n\n1. 지원대상: 대학 재학생 및 고등학생\n2. 지원내용: 학업 장려금 및 도서 구입비 지원\n3. 접수기간: 2026년 7월 1일부터 7월 20일까지\n\n자세한 신청 서류 및 방법은 첨부파일을 확인해 주시기 바랍니다.",
          authorName: "사무국",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          views: 89
        },
        {
          id: "notice-3",
          title: "[행사] 북한이탈주민 한마음 체육대회 개최 안내",
          content: "북한이탈주민 여러분의 소통과 화합을 도모하기 위해 '2026 한마음 체육대회'를 개최합니다.\n\n- 일시: 2026년 7월 12일 (토) 오전 10시\n- 장소: 한마음 운동장\n- 참가대상: 북한이탈주민 가족 및 자원봉사자 누구나\n\n푸짐한 기념품과 경품이 준비되어 있으니 가족과 함께 오셔서 즐거운 시간 보내시기 바랍니다.",
          authorName: "홍보팀",
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          views: 45
        }
      ];
    case 'gallery':
      return [
        {
          id: "gallery-1",
          title: "2026 사랑의 김장 김치 나눔 봉사",
          description: "지역 사회 소외 계층과 북한이탈주민 가정을 위해 따뜻한 사랑을 담아 김장 나눔 행사를 가졌습니다. 봉사자분들의 헌신적인 노고에 진심으로 감사드립니다.",
          imageUrls: [
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800"
          ],
          authorName: "관리자",
          createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "gallery-2",
          title: "정착 자립 멘토링 프로그램 수료식",
          description: "6개월 동안 진행된 1:1 맞춤형 취업 및 사회 정착 멘토링 프로그램이 성공적으로 마무리되어 수료식을 개최했습니다. 멘티 여러분의 새로운 출발을 응원합니다!",
          imageUrls: [
            "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
          ],
          authorName: "교육팀",
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    case 'donations':
      return [
        {
          id: "donation-1",
          donorName: "김철수",
          amount: 50000,
          type: "regular",
          status: "completed",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "donation-2",
          donorName: "이영희",
          amount: 100000,
          type: "one-time",
          status: "completed",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ];
    case 'volunteers':
      return [
        {
          id: "volunteer-1",
          name: "박민준",
          email: "minjun@example.com",
          phone: "010-1234-5678",
          message: "북한이탈주민 청소년들을 위한 학습 멘토링 봉사에 참여하고 싶습니다.",
          status: "pending",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    case 'inquiries':
      return [
        {
          id: "inquiry-1",
          name: "홍길동",
          email: "gildong@example.com",
          phone: "010-9876-5432",
          message: "협회 후원금 세액공제 영수증 발급 방법에 대해 문의드립니다.",
          status: "pending",
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        }
      ];
    case 'users':
      return [
        {
          uid: "mock-admin-uid",
          email: "new2020.jeonil@gmail.com",
          displayName: "총괄관리자",
          photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
          role: "super_admin",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    default:
      return [];
  }
};

// Retrieve collection from localStorage
const getLocalCollection = (colName: string): any[] => {
  const data = localStorage.getItem(`mock_db_${colName}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  const initial = getInitialMockData(colName);
  localStorage.setItem(`mock_db_${colName}`, JSON.stringify(initial));
  return initial;
};

// Save collection to localStorage
const saveLocalCollection = (colName: string, data: any[]) => {
  localStorage.setItem(`mock_db_${colName}`, JSON.stringify(data));
  triggerListeners(colName);
};

// Mock User Session State
let mockCurrentUser: any = null;
const authListeners: Array<(user: any) => void> = [];

try {
  const cachedUser = localStorage.getItem('mock_auth_user');
  if (cachedUser) {
    mockCurrentUser = JSON.parse(cachedUser);
  }
} catch (e) {
  console.error(e);
}

// -------------------------------------------------------------
// FIREBASE EXPORTS (COMPATIBLE WRAPPERS FOR DB/AUTH)
// -------------------------------------------------------------

export { db, auth, googleProvider };

// Connection test (silent check in mock mode)
async function testConnection() {
  if (isMockMode) return;
  try {
    await getDocFromServer(realDoc(db, 'test', 'connection'));
  } catch (error) {
    console.warn("Firebase connection test: client is offline or unconfigured.");
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: isMockMode ? { userId: mockCurrentUser?.uid, email: mockCurrentUser?.email } : {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth API Mock & Real Wrappers
export const onAuthStateChanged = (authObj: any, callback: (user: any) => void) => {
  if (isMockMode) {
    authListeners.push(callback);
    setTimeout(() => callback(mockCurrentUser), 0);
    return () => {
      const idx = authListeners.indexOf(callback);
      if (idx !== -1) authListeners.splice(idx, 1);
    };
  } else {
    return realOnAuthStateChanged(authObj, callback);
  }
};

export const loginWithGoogle = async () => {
  if (isMockMode) {
    // 1-Click login as the AI Studio user to grant full admin & posting capabilities seamlessly
    const simulatedUser = {
      uid: "mock-admin-uid",
      email: "new2020.jeonil@gmail.com",
      displayName: "하나사랑 회원",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
      emailVerified: true,
      isAnonymous: false,
      providerData: []
    };
    mockCurrentUser = simulatedUser;
    localStorage.setItem('mock_auth_user', JSON.stringify(simulatedUser));
    
    // Add user to local DB
    const users = getLocalCollection('users');
    if (!users.some(u => u.uid === simulatedUser.uid)) {
      users.push({
        ...simulatedUser,
        role: 'super_admin',
        createdAt: new Date().toISOString()
      });
      saveLocalCollection('users', users);
    }

    authListeners.forEach(cb => cb(simulatedUser));
    return simulatedUser;
  } else {
    try {
      const result = await realSignInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDoc = await realGetDoc(realDoc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await realSetDoc(realDoc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }
};

export const logout = async () => {
  if (isMockMode) {
    mockCurrentUser = null;
    localStorage.removeItem('mock_auth_user');
    authListeners.forEach(cb => cb(null));
  } else {
    await realSignOut(auth);
  }
};

// Firestore API Mock & Real Wrappers
export const collection = (dbInstance: any, name: string) => {
  if (isMockMode) {
    return { type: 'collection', name };
  } else {
    return realCollection(dbInstance, name);
  }
};

export const doc = (dbInstance: any, collectionName: string, id?: string) => {
  if (isMockMode) {
    return { type: 'doc', collectionName, id: id || `${collectionName}-${Date.now()}` };
  } else {
    return realDoc(dbInstance, collectionName, id!);
  }
};

export const query = (ref: any, ...constraints: any[]) => {
  if (isMockMode) {
    const q = { ...ref, filters: [] as any[], limitCount: undefined as number | undefined };
    constraints.forEach(c => {
      if (c && c.type === 'where') {
        q.filters.push(c);
      } else if (c && c.type === 'limit') {
        q.limitCount = c.value;
      }
    });
    return q;
  } else {
    return realQuery(ref, ...constraints);
  }
};

export const where = (field: string, operator: string, value: any) => {
  if (isMockMode) {
    return { type: 'where', field, operator, value };
  } else {
    return realWhere(field, operator as any, value);
  }
};

export const limit = (value: number) => {
  if (isMockMode) {
    return { type: 'limit', value };
  } else {
    return realLimit(value);
  }
};

export const orderBy = (field: string, direction: string = 'asc') => {
  if (isMockMode) {
    return { type: 'orderBy', field, direction };
  } else {
    return realOrderBy(field, direction as any);
  }
};

export const increment = (value: number) => {
  if (isMockMode) {
    return { _type: 'increment', value };
  } else {
    return realIncrement(value);
  }
};

export const serverTimestamp = () => {
  if (isMockMode) {
    return new Date().toISOString();
  } else {
    return realServerTimestamp();
  }
};

export const addDoc = async (collectionRef: any, data: any) => {
  if (isMockMode) {
    const colName = collectionRef.name;
    const docs = getLocalCollection(colName);
    const newDoc = {
      id: `${colName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data
    };
    docs.push(newDoc);
    saveLocalCollection(colName, docs);
    return { id: newDoc.id };
  } else {
    return await realAddDoc(collectionRef, data);
  }
};

export const updateDoc = async (docRef: any, data: any) => {
  if (isMockMode) {
    const colName = docRef.collectionName;
    const docId = docRef.id;
    const docs = getLocalCollection(colName);
    const idx = docs.findIndex(d => d.id === docId);
    if (idx !== -1) {
      const updatedData = { ...docs[idx] };
      for (const key in data) {
        if (data[key] && typeof data[key] === 'object' && data[key]._type === 'increment') {
          updatedData[key] = (updatedData[key] || 0) + data[key].value;
        } else {
          updatedData[key] = data[key];
        }
      }
      docs[idx] = updatedData;
      saveLocalCollection(colName, docs);
    }
    return;
  } else {
    return await realUpdateDoc(docRef, data);
  }
};

export const deleteDoc = async (docRef: any) => {
  if (isMockMode) {
    const colName = docRef.collectionName;
    const docId = docRef.id;
    const docs = getLocalCollection(colName);
    const filtered = docs.filter(d => d.id !== docId);
    saveLocalCollection(colName, filtered);
    return;
  } else {
    return await realDeleteDoc(docRef);
  }
};

export const getDoc = async (docRef: any) => {
  if (isMockMode) {
    const colName = docRef.collectionName;
    const docId = docRef.id;
    const docs = getLocalCollection(colName);
    const d = docs.find(docItem => docItem.id === docId);
    return {
      exists: () => !!d,
      id: docId,
      data: () => d
    };
  } else {
    return await realGetDoc(docRef);
  }
};

export const getDocs = async (queryRef: any) => {
  if (isMockMode) {
    const colName = queryRef.collectionName || queryRef.name;
    const docs = getLocalCollection(colName);
    
    let filteredDocs = [...docs];
    if (queryRef.filters) {
      queryRef.filters.forEach((filter: any) => {
        const { field, operator, value } = filter;
        if (operator === '==') {
          filteredDocs = filteredDocs.filter(d => d[field] === value);
        }
      });
    }
    
    if (queryRef.limitCount !== undefined) {
      filteredDocs = filteredDocs.slice(0, queryRef.limitCount);
    }
    
    return {
      empty: filteredDocs.length === 0,
      docs: filteredDocs.map(d => ({
        id: d.id,
        data: () => d
      }))
    };
  } else {
    return await realGetDocs(queryRef);
  }
};

export const onSnapshot = (queryRef: any, callback: (snapshot: any) => void, onError?: (error: any) => void) => {
  if (isMockMode) {
    const colName = queryRef.collectionName || queryRef.name || 'default';
    if (!snapshotListeners[colName]) {
      snapshotListeners[colName] = [];
    }
    snapshotListeners[colName].push(callback);
    
    setTimeout(() => {
      const docs = getLocalCollection(colName);
      let sortedDocs = [...docs];
      if (['notices', 'gallery', 'donations', 'volunteers', 'inquiries'].includes(colName)) {
        sortedDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      callback({
        docs: sortedDocs.map(d => ({
          id: d.id,
          data: () => d
        }))
      });
    }, 0);
    
    return () => {
      const list = snapshotListeners[colName];
      if (list) {
        const idx = list.indexOf(callback);
        if (idx !== -1) list.splice(idx, 1);
      }
    };
  } else {
    return realOnSnapshot(queryRef, callback, onError);
  }
};
