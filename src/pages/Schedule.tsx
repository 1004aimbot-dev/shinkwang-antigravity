import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Edit, Trash, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './Schedule.css';
import ScheduleEditModal from '../components/ui/ScheduleEditModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import type { ScheduleEvent } from './scheduleData';
// import { defaultSchedules } from './scheduleData';

import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

const Schedule: React.FC = () => {
    // console.log('Schedule Page Mounted');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [scheduleList, setScheduleList] = useState<ScheduleEvent[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
    const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null); // Changed to string for Firestore ID

    const eventListRef = useRef<HTMLDivElement>(null);

    // Initial Load - Realtime Listener
    useEffect(() => {
        setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');

        const q = query(collection(db, "schedules"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                // Optional: Seed default data if completely empty
                // For now, let's just show empty or use defaults in memory? 
                // Better to not auto-write defaults to DB without admin action to avoid duplicates.
                // But user might want to see the defaults initially.
                // Let's just use defaults if empty locally, or maybe just show nothing.
                // To be safe and consistent, if DB is empty, we might want to suggest adding data or manually seed.
                // For this user context, let's fall back to defaultSchedules locally if DB is truly empty,
                // BUT that brings back the sync issue if we don't save it.
                // Let's trust the DB. If it's empty, it's empty.
                // However, the user probably wants the 'defaultSchedules' to be there initially.
                // I'll add a check: if 0 docs, maybe we can rely on manual entry or one-time seed.
                // User said "shows old things", implying they see *something*.
                setScheduleList([]);
            } else {
                const events = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as any[]; // Cast to match ScheduleEvent but ID is string now

                // Need to map string ID to number if interface strictly requires number, 
                // but usually better to change interface to string | number.
                // For now, let's adjust the interface or cast.
                // The ScheduleEvent interface says id: number. 
                // I should update scheduleData.ts to accept string IDs or allow string here.
                // Let's cast for now and assume we can handle string IDs in the component.
                setScheduleList(events);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Firebase Schedule Error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Helper: Compare dates (ignoring time)
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);

        // Scroll
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setTimeout(() => {
            const element = document.getElementById(`event-${dateStr}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    };

    // --- Admin Actions ---
    const handleAddClick = () => {
        setEditingEvent(null);
        setIsEditModalOpen(true);
    };

    const handleEditClick = (event: ScheduleEvent) => {
        setEditingEvent(event);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (id: number | string) => {
        setTargetDeleteId(id.toString());
        setIsDeleteModalOpen(true);
    };

    const saveEvent = async (eventData: Omit<ScheduleEvent, 'id'> & { id?: number | string }) => {
        try {
            if (eventData.id) {
                // Update existing
                const docRef = doc(db, "schedules", eventData.id.toString());
                await updateDoc(docRef, {
                    title: eventData.title,
                    date: eventData.date,
                    type: eventData.type,
                    time: eventData.time || '',
                    time2: eventData.time2 || '',
                    location: eventData.location || '',
                    description: eventData.description || ''
                });
            } else {
                // Create new
                await addDoc(collection(db, "schedules"), {
                    title: eventData.title,
                    date: eventData.date,
                    type: eventData.type,
                    time: eventData.time || '',
                    time2: eventData.time2 || '',
                    location: eventData.location || '',
                    description: eventData.description || ''
                });
            }
            setIsEditModalOpen(false);
            setEditingEvent(null);
        } catch (error) {
            console.error("Error saving event:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const confirmDelete = async () => {
        if (targetDeleteId) {
            try {
                await deleteDoc(doc(db, "schedules", targetDeleteId));
                setIsDeleteModalOpen(false);
                setTargetDeleteId(null);
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // Optimized: Memoize calendar grid generation
    const calendarDays = React.useMemo(() => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="mini-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = scheduleList.filter(s => s.date === dateStr);
            const hasEvent = dayEvents.length > 0;
            const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), day));

            days.push(
                <div
                    key={day}
                    className={`mini-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    <span className="day-text">{day}</span>
                    {hasEvent && <span className="event-dot"></span>}
                </div>
            );
        }
        return days;
    }, [currentDate, scheduleList, selectedDate]);

    // Optimized: Memoize event list filtering
    const filteredEvents = React.useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

        return scheduleList
            .filter(s => s.date.startsWith(monthPrefix))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [currentDate, scheduleList]);

    // Render List
    const renderEventList = () => {
        if (isLoading) {
            return <div className="loading-state">일정을 불러오는 중...</div>;
        }

        if (filteredEvents.length === 0) {
            return (
                <div className="no-events">
                    <CalendarIcon size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>이 달의 일정이 없습니다.</p>
                </div>
            );
        }

        return (
            <div className="event-list" ref={eventListRef}>
                {filteredEvents.map((event) => {
                    const isSelectedDay = selectedDate && event.date === selectedDate.toISOString().split('T')[0];
                    return (
                        <div
                            key={event.id}
                            id={`event-${event.date}`}
                            className={`event-card ${isSelectedDay ? 'highlight' : ''}`}
                        >
                            <div className="event-card-header">
                                <div className="event-date-badge">
                                    <CalendarIcon size={14} />
                                    {event.date}
                                </div>
                                {isAdmin && (
                                    <div className="admin-controls">
                                        <button onClick={() => handleEditClick(event)} className="btn-icon"><Edit size={14} /></button>
                                        <button onClick={() => handleDeleteClick(event.id)} className="btn-icon delete"><Trash size={14} /></button>
                                    </div>
                                )}
                            </div>
                            <h3 className="event-title">{event.title}</h3>
                            <div className="event-details">
                                {(event.time || event.time2) && (
                                    <div className="detail-item">
                                        <Clock size={14} />
                                        {event.time}
                                        {event.time && event.time2 && ' / '}
                                        {event.time2}
                                    </div>
                                )}
                                {event.location && (
                                    <div className="detail-item"><MapPin size={14} /> {event.location}</div>
                                )}
                            </div>
                            {event.description && (
                                <p className="event-desc">{event.description}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    return (
        <div className="schedule-page-v2">
            <div className="schedule-container">
                <div className="calendar-top-section">
                    <div className="month-navigation">
                        <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={24} /></button>
                        <h2 className="current-month-title">
                            <span className="year">{currentDate.getFullYear()}년</span> {monthNames[currentDate.getMonth()]}
                        </h2>
                        <button className="nav-btn" onClick={nextMonth}><ChevronRight size={24} /></button>
                    </div>

                    <div className="mini-calendar-grid">
                        <div className="week-header">일</div>
                        <div className="week-header">월</div>
                        <div className="week-header">화</div>
                        <div className="week-header">수</div>
                        <div className="week-header">목</div>
                        <div className="week-header">금</div>
                        <div className="week-header">토</div>
                        {calendarDays}
                    </div>

                    <div className="calendar-legend-simple">
                        <span className="legend-item"><span className="legend-dot event"></span> 일정 있음</span>
                        <span className="legend-item"><span className="legend-dot none"></span> 일정 없음</span>
                    </div>

                    {isAdmin && (
                        <button onClick={handleAddClick} className="btn-floating-add">
                            <Plus size={24} />
                        </button>
                    )}
                </div>

                <div className="events-section">
                    {renderEventList()}
                </div>
            </div>

            <ScheduleEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={saveEvent}
                initialEvent={editingEvent}
                selectedDate={currentDate.toISOString().split('T')[0].substring(0, 7) + '-01'}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="일정 삭제"
                message="정말로 이 일정을 삭제하시겠습니까?"
            />
        </div>
    );
};

export default Schedule;

