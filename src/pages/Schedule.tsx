import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Edit, Trash, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './Schedule.css';
import ScheduleEditModal from '../components/ui/ScheduleEditModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import type { ScheduleEvent } from './scheduleData';
import { defaultSchedules } from './scheduleData';

const Schedule: React.FC = () => {
    // console.log('Schedule Page Mounted');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [scheduleList, setScheduleList] = useState<ScheduleEvent[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
    const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null);

    const eventListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');
            const saved = localStorage.getItem('schedules');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setScheduleList(parsed);
                } catch (e) {
                    console.error('JSON Parse Error:', e);
                    setScheduleList(defaultSchedules);
                    localStorage.setItem('schedules', JSON.stringify(defaultSchedules));
                }
            } else {
                setScheduleList(defaultSchedules);
                localStorage.setItem('schedules', JSON.stringify(defaultSchedules));
            }
        } catch (err) {
            console.error('Critical Error in useEffect:', err);
        }
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

    const handleDeleteClick = (id: number) => {
        setTargetDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const saveEvent = (eventData: Omit<ScheduleEvent, 'id'> & { id?: number }) => {
        let newList;
        if (eventData.id) {
            newList = scheduleList.map(s => s.id === eventData.id ? { ...eventData, id: eventData.id! } : s);
        } else {
            const newEvent = { ...eventData, id: Date.now() };
            newList = [...scheduleList, newEvent];
        }
        setScheduleList(newList);
        localStorage.setItem('schedules', JSON.stringify(newList));
        setIsEditModalOpen(false);
        setEditingEvent(null);
    };

    const confirmDelete = () => {
        if (targetDeleteId) {
            const newList = scheduleList.filter(s => s.id !== targetDeleteId);
            setScheduleList(newList);
            localStorage.setItem('schedules', JSON.stringify(newList));
            setIsDeleteModalOpen(false);
            setTargetDeleteId(null);
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
                                {event.time && (
                                    <div className="detail-item"><Clock size={14} /> {event.time}</div>
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

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="schedule-page-v2">
            <div className="schedule-container">
                <div className="calendar-top-section">
                    <div className="month-navigation">
                        <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={24} /></button>
                        <h2 className="current-month-title">
                            {monthNames[currentDate.getMonth()]} <span className="year">{currentDate.getFullYear()}</span>
                        </h2>
                        <button className="nav-btn" onClick={nextMonth}><ChevronRight size={24} /></button>
                    </div>

                    <div className="mini-calendar-grid">
                        <div className="week-header">S</div>
                        <div className="week-header">M</div>
                        <div className="week-header">T</div>
                        <div className="week-header">W</div>
                        <div className="week-header">T</div>
                        <div className="week-header">F</div>
                        <div className="week-header">S</div>
                        {calendarDays}
                    </div>

                    <div className="calendar-legend-simple">
                        <span className="legend-item"><span className="legend-dot event"></span> Event</span>
                        <span className="legend-item"><span className="legend-dot none"></span> No Schedule</span>
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
