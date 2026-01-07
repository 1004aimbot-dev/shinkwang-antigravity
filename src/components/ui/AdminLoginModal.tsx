import React, { useState } from 'react';
import Modal from './Modal';

interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'gloria1234') {
            onLoginSuccess();
            onClose();
            setPassword('');
            setError('');
        } else {
            setError('비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="관리자 로그인">
            <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="관리자 비밀번호 입력"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '1rem'
                        }}
                        autoFocus
                    />
                    {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}
                </div>
                <button
                    type="submit"
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    로그인 확인
                </button>
            </form>
        </Modal>
    );
};

export default AdminLoginModal;
