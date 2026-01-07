import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface SingleInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
    title: string;
    label: string;
    initialValue?: string;
    placeholder?: string;
}

const SingleInputModal: React.FC<SingleInputModalProps> = ({
    isOpen,
    onClose,
    onSave,
    title,
    label,
    initialValue = '',
    placeholder = ''
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [isOpen, initialValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(value);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{label}</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
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
                        저장
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SingleInputModal;
