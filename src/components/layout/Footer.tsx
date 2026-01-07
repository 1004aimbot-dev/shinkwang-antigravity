
import { useState } from 'react';
import './Footer.css';
import { Lock, Unlock } from 'lucide-react';
import AdminLoginModal from '../ui/AdminLoginModal';

const Footer = () => {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleAdminClick = () => {
        if (isAdmin) {
            if (confirm('관리자 모드를 종료하시겠습니까?')) {
                sessionStorage.removeItem('isAdmin');
                window.location.reload();
            }
        } else {
            setShowLoginModal(true);
        }
    };

    const handleLoginSuccess = () => {
        sessionStorage.setItem('isAdmin', 'true');
        alert('관리자 모드로 전환되었습니다.');
        window.location.reload();
    };

    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-info">
                    <p>성남신광교회 | 담임목사 : 이 현용</p>
                    <p>주소: 경기도 성남시 중원구 둔촌대로 148 (하대원동)</p>
                    <div className="copyright">
                        성남신광교회 1부 찬양대 글로리아 © 2026 Gloria Choir. All rights reserved.
                        <button
                            onClick={handleAdminClick}
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                border: '1px solid var(--color-accent-light)',
                                borderRadius: '4px',
                                color: 'var(--color-accent-light)',
                                opacity: 1,
                                marginLeft: '10px',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 'bold'
                            }}
                            title={isAdmin ? "관리자 로그아웃" : "관리자 로그인"}
                        >
                            {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
                            <span>관리자 설정</span>
                        </button>
                    </div>
                </div>
            </div>

            <AdminLoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </footer>
    );
};

export default Footer;
