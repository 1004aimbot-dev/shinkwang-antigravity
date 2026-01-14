import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const ConnectionTest = () => {
    const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [message, setMessage] = useState('연결 확인 중...');
    const [details, setDetails] = useState('');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                // 1. Write Test
                const testCollection = collection(db, '_connection_test');
                const docRef = await addDoc(testCollection, {
                    timestamp: Date.now(),
                    test: 'connection_verify'
                });

                // 2. Read Test (optional, but good verification)
                // const querySnapshot = await getDocs(testCollection);

                // 3. Cleanup
                await deleteDoc(doc(db, '_connection_test', docRef.id));

                setStatus('connected');
                setMessage('서버 연결 성공 (정상)');
            } catch (error: any) {
                console.error("Connection Test Error:", error);
                setStatus('error');
                setMessage('서버 연결 실패');

                // Friendly error mapping
                if (error.code === 'permission-denied') {
                    setDetails('권한 거부됨: 보안 규칙(Rules)이 게시되지 않았거나 차단되었습니다.');
                } else if (error.code === 'unavailable') {
                    setDetails('네트워크 오류: 인터넷 연결을 확인하세요.');
                } else if (error.code === 'not-found') {
                    setDetails('프로젝트를 찾을 수 없음: API 설정(Project ID)을 확인하세요.');
                } else {
                    setDetails(error.message);
                }
            }
        };

        checkConnection();
    }, []);

    if (status === 'connected') return null; // Hide if successful

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px',
            backgroundColor: status === 'error' ? '#ffebee' : '#e3f2fd',
            border: `1px solid ${status === 'error' ? '#ef5350' : '#2196f3'}`,
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 9999,
            maxWidth: '300px',
            fontSize: '14px'
        }}>
            <h4 style={{ margin: '0 0 5px 0', color: status === 'error' ? '#c62828' : '#1565c0' }}>
                {message}
            </h4>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                <p>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</p>
                <p>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? 'Loaded' : 'Missing'}</p>
                <p>Status: {status}</p>
            </div>
            {details && <p style={{ margin: 0, color: '#333' }}>{details}</p>}
        </div>
    );
};

export default ConnectionTest;
