import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, X } from 'lucide-react';
import Modal from '../components/ui/Modal';
import './Praise.css';

interface PraiseVideo {
    id: string;
    title: string;
    date: string; // YYYY.MM.DD
    youtubeLink: string;
    videoId: string;
    choir: string;
    startTime?: string; // seconds
    endTime?: string; // seconds
    timestamp: number;
}

const Praise = () => {
    const [videos, setVideos] = useState<PraiseVideo[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Filter State
    // Default filter: From Jan 2026 onwards
    const FILTER_DATE = '2026.01.01';

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [playerVideo, setPlayerVideo] = useState<PraiseVideo | null>(null);
    const [editingVideo, setEditingVideo] = useState<PraiseVideo | null>(null);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newLink, setNewLink] = useState('');
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    // Default to "성남신광교회 1부 찬양대" as requested
    const [newChoir, setNewChoir] = useState('성남신광교회 1부 찬양대');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAddModalOpen) {
            setIsSubmitting(false);
        }
    }, [isAddModalOpen]);

    useEffect(() => {
        setIsAdmin(sessionStorage.getItem('isAdmin') === 'true');

        const q = query(collection(db, "praise_videos"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedVideos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PraiseVideo[];

            // Filter logic: Only show videos from 2026-01-01 onwards AND matching the specific choir name if needed
            // The prompt asked to "Only show 'Seoul Shinkwang Church 1st Choir' videos made from Jan 2026"
            // We'll filter client-side for simplicity as the dataset is likely small initially.
            const filtered = loadedVideos.filter(v => {
                return v.date >= FILTER_DATE && v.choir.includes('1부');
            });

            setVideos(filtered);
            setIsLoading(false);
        });



        // Fallback for loading state if firestore is slow or empty
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const extractVideoId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const convertToSeconds = (timeStr: string) => {
        if (!timeStr) return '';
        if (timeStr.includes(':')) {
            const [min, sec] = timeStr.split(':').map(Number);
            return String((min * 60) + (sec || 0));
        }
        return timeStr;
    };

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        const videoId = extractVideoId(newLink);

        if (!videoId) {
            alert('올바른 유튜브 링크를 입력해주세요.');
            return;
        }

        if (!newTitle || !newDate) {
            alert('제목과 날짜는 필수입니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const submitPromise = editingVideo
                ? updateDoc(doc(db, "praise_videos", editingVideo.id), {
                    title: newTitle,
                    date: newDate,
                    youtubeLink: newLink,
                    videoId: videoId,
                    choir: newChoir,
                    startTime: convertToSeconds(newStartTime),
                    endTime: convertToSeconds(newEndTime)
                })
                : addDoc(collection(db, "praise_videos"), {
                    title: newTitle,
                    date: newDate,
                    youtubeLink: newLink,
                    videoId: videoId,
                    choir: newChoir,
                    startTime: convertToSeconds(newStartTime),
                    endTime: convertToSeconds(newEndTime),
                    timestamp: Date.now()
                });

            await submitPromise;

            // Reset form fields
            resetForm();

            // Close modal
            // Close modal
            setIsAddModalOpen(false);
            setIsSubmitting(false); // Explicitly reset submitting logic even inside the flow to be safe

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            console.error(error);
            let errorMsg = "알 수 없는 오류";
            if (error.code === 'permission-denied') errorMsg = "권한이 없습니다.";
            else if (error.message) errorMsg = error.message;

            alert((editingVideo ? '수정 실패: ' : '등록 실패: ') + errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewDate('');
        setNewLink('');
        setNewStartTime('');
        setNewEndTime('');
        setNewChoir('성남신광교회 1부 찬양대');
        setEditingVideo(null);
        setIsSubmitting(false);
    };

    const handleEditClick = (e: React.MouseEvent, video: PraiseVideo) => {
        e.stopPropagation();
        setEditingVideo(video);
        setNewTitle(video.title);
        setNewDate(video.date);
        setNewLink(video.youtubeLink);
        setNewChoir(video.choir);

        // Convert seconds back to MM:SS if possible, or leave as seconds
        // Simple conversion for display if it's just seconds
        const start = video.startTime ? formatSecondsToTime(video.startTime) : '';
        const end = video.endTime ? formatSecondsToTime(video.endTime) : '';

        setNewStartTime(start);
        setNewEndTime(end);

        setIsSubmitting(false);
        setIsAddModalOpen(true);
    };

    // Helper to format seconds back to MM:SS if needed (optional improvement)
    const formatSecondsToTime = (secondsStr: string) => {
        const total = parseInt(secondsStr, 10);
        if (isNaN(total)) return secondsStr;
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        // Prevent row selection
        e.stopPropagation();
        e.preventDefault();

        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteDoc(doc(db, "praise_videos", id));
            } catch (error) {
                console.error("Delete failed:", error);
                alert("삭제에 실패했습니다.");
            }
        }
    };

    const getEmbedUrl = (video: PraiseVideo) => {
        let url = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;
        if (video.startTime) url += `&start=${video.startTime}`;
        if (video.endTime) url += `&end=${video.endTime}`;
        return url;
    };

    return (
        <div className="praise-page">
            <div className="praise-header">
                <div className="container">
                    <h1 className="text-serif">찬양 다시보기</h1>
                    <p>은혜의 찬양을 다시 들으며 감동을 나눕니다</p>
                </div>
            </div>

            <div className="container praise-content">
                {isAdmin && (
                    <div className="praise-actions">
                        <button className="btn-add-video" onClick={() => { resetForm(); setIsAddModalOpen(true); }}>
                            <Plus size={20} /> 찬양 영상 등록
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center">로딩중...</div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-10" style={{ color: '#888' }}>
                        <p>등록된 찬양 영상이 없습니다.</p>
                        <p className="text-sm mt-2">2026년 1월 이후의 영상만 표시됩니다.</p>
                    </div>
                ) : (
                    <div className="praise-board-container">
                        <table className="praise-board">
                            <thead>
                                <tr>
                                    <th className="th-num">번호</th>
                                    <th className="th-date">찬양일자</th>
                                    <th className="th-title">제목</th>
                                    <th className="th-remark">비고</th>
                                    {isAdmin && <th className="th-action">관리</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {videos.map((video, index) => (
                                    <tr key={video.id} onClick={() => setPlayerVideo(video)} className="praise-row">
                                        <td className="td-num">{videos.length - index}</td>
                                        <td className="td-date">{video.date}</td>
                                        <td className="td-title">
                                            {video.title}
                                            {video.startTime && <span className="time-badge">구간재생</span>}
                                        </td>
                                        <td className="td-remark">{video.choir}</td>
                                        {isAdmin && (
                                            <td className="td-action" onClick={(e) => e.stopPropagation()}>
                                                <div className="action-buttons">
                                                    <button className="btn-edit-text" onClick={(e) => handleEditClick(e, video)}>
                                                        수정
                                                    </button>
                                                    <button className="btn-delete-text" onClick={(e) => handleDelete(e, video.id)}>
                                                        삭제
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            {playerVideo && (
                <div className="modal-overlay" onClick={() => setPlayerVideo(null)}>
                    <div className="modal-content video-player-modal-content">
                        <button className="modal-close-btn-floating" onClick={() => setPlayerVideo(null)}>
                            <X size={30} color="white" />
                        </button>
                        <iframe
                            src={getEmbedUrl(playerVideo)}
                            title={playerVideo.title}
                            className="video-frame"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Add Video Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => { setIsAddModalOpen(false); setIsSubmitting(false); }}
                title={editingVideo ? "찬양 영상 수정" : "찬양 영상 등록"}
            >
                <form key={isAddModalOpen ? 'open' : 'closed'} onSubmit={handleAddVideo} className="praise-form">
                    <div className="form-group">
                        <label>찬양 제목</label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="예: 주 은혜임을"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>날짜 (YYYY.MM.DD)</label>
                        <input
                            type="text"
                            value={newDate}
                            onChange={e => setNewDate(e.target.value)}
                            placeholder="2026.01.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>찬양대</label>
                        <input
                            type="text"
                            value={newChoir}
                            onChange={e => setNewChoir(e.target.value)}
                            placeholder="성남신광교회 1부 찬양대"
                        />
                    </div>

                    <div className="form-group">
                        <label>유튜브 링크 (주일예배 전체 영상 또는 찬양 영상)</label>
                        <input
                            type="text"
                            value={newLink}
                            onChange={e => setNewLink(e.target.value)}
                            placeholder="예: https://youtu.be/... (주일예배 영상 링크)"
                            required
                        />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>시작 시간 (분:초)</label>
                            <input
                                type="text"
                                value={newStartTime}
                                onChange={e => setNewStartTime(e.target.value)}
                                placeholder="예: 4:15 (4분 15초)"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>종료 시간 (분:초)</label>
                            <input
                                type="text"
                                value={newEndTime}
                                onChange={e => setNewEndTime(e.target.value)}
                                placeholder="예: 5:00 (5분 00초)"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={isSubmitting} style={{ width: '100%', marginTop: '20px' }}>
                        {isSubmitting ? (editingVideo ? '수정 중...' : '등록 중...') : (editingVideo ? '수정하기' : '등록하기')}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Praise;
