import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MessageCircle, Send, PlayCircle, Minimize2 } from 'lucide-react';
import { getRecommendationByKeyword, getRandomRecommendation } from '../../data/recommendations';
import './Chatbot.css';

interface Message {
    id: number;
    text: ReactNode;
    sender: 'bot' | 'user';
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "안녕하세요! 현재 마음 상태나 기도 제목을 알려주시면, 함께 나눌 말씀과 찬양을 추천해드릴게요. 🙏 (예: 힘들어요, 감사해요, 불안해요)",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!isOpen) {
            // Reset messages when closed
            setMessages([{
                id: 1,
                text: "안녕하세요! 현재 마음 상태나 기도 제목을 알려주시면, 함께 나눌 말씀과 찬양을 추천해드릴게요. 🙏 (예: 힘들어요, 감사해요, 불안해요)",
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: Message = {
            id: Date.now(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Process bot response
        setTimeout(() => {
            const recommendation = getRecommendationByKeyword(text);
            let botResponse: ReactNode;

            if (recommendation) {
                botResponse = (
                    <div>
                        <p style={{ fontWeight: '600', marginBottom: '8px' }}>위로가 되는 말씀과 찬양입니다.</p>
                        <div className="recommendation-card">
                            <p className="verse-text">"{recommendation.verse.text}"</p>
                            <span className="verse-ref">- {recommendation.verse.reference}</span>
                            <p className="comfort-message" style={{ margin: '12px 0', fontSize: '0.93rem', color: '#444', lineHeight: '1.5', wordBreak: 'keep-all', whiteSpace: 'pre-wrap' }}>
                                {recommendation.comfortMessage}
                            </p>

                            <hr style={{ margin: '8px 0', border: 0, borderTop: '1px dashed #eee' }} />
                            {recommendation.praises.map((praise, idx) => (
                                <a key={idx} href={praise.link} target="_blank" rel="noopener noreferrer" className="praise-link">
                                    <PlayCircle size={16} />
                                    {praise.title}
                                </a>
                            ))}
                        </div>
                    </div>
                );
            } else {
                // Determine random fallback if no keyword matched, but maybe just a gentle prompt
                // actually, let's give a random one if they say something we don't know, helps with discovery
                const randomRec = getRandomRecommendation();
                botResponse = (
                    <div>
                        <p>입력하신 내용에 딱 맞는 주제를 찾지 못했지만, 이 말씀과 찬양은 어떠신가요?</p>
                        <div className="recommendation-card">
                            <p className="verse-text">"{randomRec.verse.text}"</p>
                            <span className="verse-ref">- {randomRec.verse.reference}</span>
                            <p className="comfort-message" style={{ margin: '12px 0', fontSize: '0.93rem', color: '#444', lineHeight: '1.5', wordBreak: 'keep-all', whiteSpace: 'pre-wrap' }}>
                                {randomRec.comfortMessage}
                            </p>

                            <hr style={{ margin: '8px 0', border: 0, borderTop: '1px dashed #eee' }} />
                            {randomRec.praises.map((praise, idx) => (
                                <a key={idx} href={praise.link} target="_blank" rel="noopener noreferrer" className="praise-link">
                                    <PlayCircle size={16} />
                                    {praise.title}
                                </a>
                            ))}
                        </div>
                    </div>
                );
            }

            const botMsg: Message = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage(inputValue);
        }
    };

    const quickChips = ['힘들어요', '감사해요', '불안해요', '기도가 필요해요'];

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    className="chatbot-fab"
                    onClick={() => setIsOpen(true)}
                    aria-label="찬양 추천 챗봇 열기"
                >
                    <MessageCircle size={32} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <MessageCircle size={20} />
                            <span>기도 & 찬양 도우미</span>
                        </div>
                        <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                            <Minimize2 size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <div className="chatbot-chips">
                            {quickChips.map(chip => (
                                <button
                                    key={chip}
                                    className="chip-btn"
                                    onClick={() => handleSendMessage(chip)}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                        <div className="input-row">
                            <input
                                type="text"
                                className="chatbot-input"
                                placeholder="마음 상태를 입력하세요..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="chatbot-send"
                                onClick={() => handleSendMessage(inputValue)}
                                disabled={!inputValue.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
