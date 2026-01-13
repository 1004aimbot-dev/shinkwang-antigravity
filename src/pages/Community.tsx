import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, X, PenTool, Paperclip, FileText } from 'lucide-react';

import { db } from '../firebase'; // Import only db
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, arrayUnion, increment } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage disabled for now
import './Community.css';

interface Comment {
    id: number;
    author: string;
    content: string;
    date: string;
}

interface Post {
    id: string; // Firebase IDs are strings
    author: string;
    date: string;
    content: string;
    imageUrl?: string;
    fileUrl?: string; // Base64 data for file
    fileName?: string; // Original file name
    likes: number;
    comments: Comment[];
}

const Community = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Track local likes to show red heart immediately for this session/device
    const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
        const saved = localStorage.getItem('likedPostIds');
        return saved ? JSON.parse(saved) : [];
    });

    // Comment State
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');

    // Write Form State
    const [newAuthor, setNewAuthor] = useState('');
    const [newContent, setNewContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null); // Use this as the data to save
    const [fileData, setFileData] = useState<{ url: string, name: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    // Initial Load - Realtime Listener
    useEffect(() => {
        try {
            const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const loadedPosts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Post[];
                setPosts(loadedPosts);
                setIsLoading(false);
            }, (error) => {
                console.error("Firebase Connection Error:", error);
                setIsLoading(false);
                // Fallback or error message could be shown
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase likely not configured:", error);
            setIsLoading(false);
        }
    }, []);

    // Save local likes preference
    useEffect(() => {
        localStorage.setItem('likedPostIds', JSON.stringify(likedPostIds));
    }, [likedPostIds]);

    // Force reset submitting state when modal opens
    useEffect(() => {
        if (isWriteModalOpen) {
            setIsSubmitting(false);
        }
    }, [isWriteModalOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500000) { // Strictly enforce 500KB limit
                alert('사진 용량이 너무 큽니다. (500KB 이하만 가능)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (result.length > 900000) {
                    alert('이미지 데이터가 너무 큽니다.');
                    return;
                }
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1000000) { // Limit to 1MB
                alert('파일 용량이 너무 큽니다. (1MB 이하만 가능)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (result.length > 1500000) {
                    alert('데이터가 너무 큽니다.');
                    return;
                }
                setFileData({
                    url: result,
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAuthor || !newContent) {
            alert('작성자와 내용을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Using Base64 directly into Firestore to avoid Storage billing requirements
            // This is acceptable for small images on a low-traffic site.
            const imageUrl = imagePreview || '';

            // 2. Save Post Data
            // 2. Save Post Data
            const submitDoc = addDoc(collection(db, "posts"), {
                author: newAuthor,
                content: newContent,
                date: new Date().toLocaleDateString(),
                timestamp: Date.now(), // for sorting
                imageUrl: imageUrl,
                fileUrl: fileData?.url || '',
                fileName: fileData?.name || '',
                likes: 0,
                comments: []
            });

            await submitDoc;

            // Reset
            setNewAuthor('');
            setNewContent('');
            setImagePreview(null);
            setFileData(null);
            setIsWriteModalOpen(false);
        } catch (error: any) {
            console.error("Error adding document: ", error);
            alert("업로드 실패: " + (error.message || "데이터베이스 규칙을 확인해주세요 (allow read, write: if true)."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (id: string) => {
        const isAlreadyLiked = likedPostIds.includes(id);
        const postRef = doc(db, "posts", id);

        if (isAlreadyLiked) {
            // Unlike
            setLikedPostIds(prev => prev.filter(pid => pid !== id));
            await updateDoc(postRef, {
                likes: increment(-1)
            });
        } else {
            // Like
            setLikedPostIds(prev => [...prev, id]);
            await updateDoc(postRef, {
                likes: increment(1)
            });
        }
    };

    const handleDelete = async (id: string) => {
        // In a real app, you'd check auth. Here, simple client-side check is weak.
        // Assuming deletion is allowed for demo.
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteDoc(doc(db, "posts", id));
            } catch (error) {
                alert("삭제 권한이 없거나 오류가 발생했습니다.");
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: '글로리아 나눔터',
                text: '글로리아 찬양대 커뮤니티에 초대합니다.',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('주소가 복사되었습니다.');
        }
    };

    const toggleCommentSection = (id: string) => {
        if (activeCommentPostId === id) {
            setActiveCommentPostId(null);
        } else {
            setActiveCommentPostId(id);
            setCommentText('');
            setCommentAuthor('');
        }
    };

    const handleAddComment = async (e: React.FormEvent, postId: string) => {
        e.preventDefault();
        if (!commentText || !commentAuthor) {
            alert('이름과 내용을 입력해주세요.');
            return;
        }

        const newComment = {
            id: Date.now(),
            author: commentAuthor,
            content: commentText,
            date: new Date().toLocaleDateString()
        };

        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
            comments: arrayUnion(newComment)
        });

        setCommentText('');
    };

    return (
        <div className="community-page">
            <div className="community-header">
                <div className="container">
                    <h1 className="text-serif">글로리아 나눔터</h1>
                    <p>찬양대의 소식과 은혜를 나누는 공간입니다</p>
                </div>
            </div>

            <div className="container community-content">
                <div className="actions-bar">
                    <button className="btn-write" onClick={() => { setIsSubmitting(false); setIsWriteModalOpen(true); }}>
                        <PenTool size={18} /> 글쓰기
                    </button>
                </div>

                <div className="posts-feed">
                    {/* Warning if config is missing (simple check) */}

                    {isLoading ? (
                        <div className="empty-state"><p>로딩중...</p></div>
                    ) : posts.length === 0 ? (
                        <div className="empty-state">
                            <p>아직 작성된 글이 없습니다. 첫 글을 작성해보세요!</p>
                            <p style={{ fontSize: '0.8rem', color: 'red', marginTop: '10px' }}>
                                (만약 글을 썼는데 안 보인다면, Firebase 설정이 완료되었는지 확인해주세요.)
                            </p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <article key={post.id} className="post-card">
                                <div className="post-header">
                                    <div className="post-avatar">
                                        {post.author[0]}
                                    </div>
                                    <div className="post-meta">
                                        <span className="post-author">{post.author}</span>
                                        <span className="post-date">{post.date}</span>
                                    </div>
                                    <button className="btn-more" onClick={() => handleDelete(post.id)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="post-body">
                                    <p>{post.content}</p>
                                    {post.imageUrl && (
                                        <div className="post-image-container">
                                            <img src={post.imageUrl} alt="Uploaded" loading="lazy" />
                                        </div>
                                    )}
                                    {post.fileUrl && (
                                        <div className="post-file-attachment">
                                            <a href={post.fileUrl} download={post.fileName || 'attachment'} className="file-download-link">
                                                <FileText size={20} />
                                                <span className="file-name">{post.fileName}</span>
                                                <span className="file-hint">(다운로드)</span>
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="post-footer">
                                    <button
                                        className={`btn-action ${likedPostIds.includes(post.id) ? 'active' : ''}`}
                                        onClick={() => handleLike(post.id)}
                                    >
                                        <Heart size={20} fill={likedPostIds.includes(post.id) ? "currentColor" : "none"} />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="btn-action" onClick={() => toggleCommentSection(post.id)}>
                                        <MessageCircle size={20} />
                                        <span>댓글 {post.comments?.length || 0}</span>
                                    </button>
                                    <button className="btn-action" onClick={handleShare}>
                                        <Share2 size={20} />
                                    </button>
                                </div>

                                {/* Comment Section */}
                                {activeCommentPostId === post.id && (
                                    <div className="comments-section">
                                        <div className="comments-list">
                                            {post.comments?.map(comment => (
                                                <div key={comment.id} className="comment-item">
                                                    <strong>{comment.author}</strong>: {comment.content}
                                                    <span className="comment-date">{comment.date}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <form className="comment-form" onSubmit={(e) => handleAddComment(e, post.id)}>
                                            <input
                                                type="text"
                                                placeholder="이름"
                                                value={commentAuthor}
                                                onChange={(e) => setCommentAuthor(e.target.value)}
                                                className="comment-author-input"
                                                maxLength={5}
                                            />
                                            <div className="comment-input-wrapper">
                                                <input
                                                    type="text"
                                                    placeholder="댓글을 입력하세요..."
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    className="comment-input"
                                                />
                                                <button type="submit" className="btn-comment-submit">등록</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </article>
                        ))
                    )}
                </div>
            </div>

            {/* Write Modal */}
            {isWriteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content write-modal">
                        <div className="modal-header">
                            <h3>글쓰기</h3>
                            <button onClick={() => { setIsWriteModalOpen(false); setIsSubmitting(false); }}><X /></button>
                        </div>
                        <form key={isWriteModalOpen ? 'open' : 'closed'} onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>작성자</label>
                                <input
                                    type="text"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    placeholder="이름을 입력하세요"
                                    maxLength={10}
                                />
                            </div>
                            <div className="form-group">
                                <label>내용</label>
                                <textarea
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="나누고 싶은 이야기를 적어주세요..."
                                    rows={5}
                                />
                            </div>
                            <div className="form-group">
                                <label className="btn-upload">
                                    <ImageIcon size={18} /> 사진 추가
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </label>
                                {imagePreview && (
                                    <div className="preview-image">
                                        <img src={imagePreview} alt="Preview" />
                                        <button type="button" onClick={() => { setImagePreview(null); }}><X size={14} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="btn-upload btn-upload-file">
                                    <Paperclip size={18} /> 파일 첨부
                                    <input
                                        type="file"
                                        ref={docInputRef}
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                </label>
                                {fileData && (
                                    <div className="preview-file">
                                        <FileText size={16} />
                                        <span>{fileData.name}</span>
                                        <button type="button" onClick={() => { setFileData(null); }}><X size={14} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? '업로드 중...' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
