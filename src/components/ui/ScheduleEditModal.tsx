import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { ScheduleEvent } from '../../pages/scheduleData';
import './ModalContent.css';

interface ScheduleEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<ScheduleEvent, 'id'> & { id?: number }) => void;
    initialEvent?: ScheduleEvent | null;
    selectedDate?: string;
}

const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({ isOpen, onClose, onSave, initialEvent, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState<ScheduleEvent['type']>('practice');
    const [time, setTime] = useState('');
    const [time2, setTime2] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialEvent) {
                setTitle(initialEvent.title);
                setDate(initialEvent.date);
                setType(initialEvent.type);
                setTime(initialEvent.time || '');
                setTime2(initialEvent.time2 || '');
                setLocation(initialEvent.location || '');
                setDescription(initialEvent.description || '');
            } else {
                // New Event
                setTitle('');
                setDate(selectedDate || new Date().toISOString().split('T')[0]);
                setType('practice');
                setTime('08:00');
                setTime2('10:20');
                setLocation('찬양대실');
                setDescription('');
            }
        }
    }, [isOpen, initialEvent, selectedDate]);

    const handleSubmit = () => {
        if (!title.trim() || !date) return;

        onSave({
            id: initialEvent?.id, // undefined if new
            title,
            date,
            type,

            time: time || undefined,
            time2: time2 || undefined,
            location: location || undefined,
            description: description || undefined
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialEvent ? '일정 수정' : '새 일정 추가'}
        >
            <div className="modal-body-content text-start">
                <div className="form-group">
                    <label>일정 제목 *</label>
                    <input
                        type="text"
                        className="modal-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="예: 정기 연습, 부활절 칸타타"
                    />
                </div>

                <div className="form-group">
                    <label>날짜 *</label>
                    <input
                        type="date"
                        className="modal-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>종류</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {(['practice', 'worship', 'special', 'other'] as const).map(t => (
                            <button
                                key={t}
                                className={`chip-btn ${type === t ? 'active' : ''}`}
                                onClick={() => setType(t)}
                                style={{
                                    backgroundColor: type === t
                                        ? (t === 'practice' ? '#5c6bc0' : t === 'worship' ? '#ffa726' : t === 'special' ? '#ef5350' : '#78909c')
                                        : '#eee',
                                    color: type === t ? 'white' : '#555'
                                }}
                            >
                                {t === 'practice' ? '연습' : t === 'worship' ? '예배' : t === 'special' ? '특별' : '기타'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>시간</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="time"
                            className="modal-input"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <input
                            type="time"
                            className="modal-input"
                            value={time2}
                            onChange={(e) => setTime2(e.target.value)}
                            style={{ flex: 1 }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>장소</label>
                    <input
                        type="text"
                        className="modal-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="예: 찬양대실, 대예배실"
                    />
                </div>

                <div className="form-group">
                    <label>설명</label>
                    <textarea
                        className="modal-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="상세 내용을 입력하세요"
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div className="modal-actions" style={{ marginTop: '20px' }}>
                    <button className="btn-action-primary" onClick={handleSubmit}>
                        저장하기
                    </button>
                    <button className="btn-action-secondary" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ScheduleEditModal;
