import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface NewsEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (date: string, content: string) => void;
    initialDate?: string;
    initialContent?: string;
    isEditing?: boolean;
}

const NewsEditModal: React.FC<NewsEditModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialDate = '',
    initialContent = '',
    isEditing = false
}) => {
    const [date, setDate] = useState(initialDate);
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        if (isOpen) {
            setDate(initialDate || new Date().toISOString().slice(0, 10).replace(/-/g, '.'));
            setContent(initialContent);
        }
    }, [isOpen, initialDate, initialContent]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(date, content);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "공지사항 수정" : "새 공지 등록"}>
            <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>날짜</label>
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="예: 2026.01.07"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="공지 내용을 입력하세요"
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            resize: 'none'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#f5f5f5',
                            cursor: 'pointer'
                        }}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            padding: '12px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {isEditing ? "수정 완료" : "등록 하기"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NewsEditModal;
