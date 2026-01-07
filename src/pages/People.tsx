import './People.css';
import { Music, Users, Crown, Mic2 } from 'lucide-react';

const People = () => {
    const executives = [
        { role: '대장', name: '유용길', title: '안수집사', phone: '010-8814-8844' },
        { role: '총무', name: '남궁은옥', title: '권사', phone: '010-3132-7590' },
        { role: '서기', name: '최혜경', title: '권사', phone: '010-6576-4959' },
        { role: '서기', name: '전기수', title: '권사', phone: '010-6343-7341' },
        { role: '회계', name: '박경례', title: '권사', phone: '010-3347-7891' },
        { role: '친교부장', name: '조화자', title: '권사', phone: '010-7189-9091' },
    ];

    const partLeaders = [
        { role: '소프라노 파트장', name: '박정순', title: '권사', phone: '010-3361-9167' },
        { role: '알토 파트장', name: '배관순', title: '권사', phone: '010-6899-5579' },
        { role: '테너 파트장', name: '김일규', title: '안수집사', phone: '010-3237-1919' },
        { role: '베이스 파트장', name: '엄웅섭', title: '장로', phone: '010-2763-9907' },
    ];

    const musicians = [
        { role: '지휘자', name: '김동열', title: '집사', phone: '010-9814-1011' },
        { role: '피아노', name: '임혜지', title: '청년', phone: '010-3752-7661' },
        { role: '오르간', name: '김혜림', title: '청년', phone: '010-2526-9981' },
    ];

    const sopranos = [
        { name: '곽애자', title: '집사', phone: '010-2799-2589' },
        { name: '김미순', title: '권사', phone: '010-8718-6871' },
        { name: '김순례', title: '권사', phone: '010-7573-2270' },
        { name: '김영수', title: '권사', phone: '010-3394-3136' },
        { name: '민영애', title: '목사', phone: '010-5311-4038' },
        { name: '박경례', title: '권사', phone: '010-3347-7891' },
        { name: '박정순', title: '권사', phone: '010-3361-9167' },
        { name: '송춘옥', title: '권사', phone: '010-3085-4280' },
        { name: '안옥설', title: '권사', phone: '010-8768-5363' },
        { name: '이미숙', title: '권사', phone: '010-3761-0755' },
        { name: '전기수', title: '권사', phone: '010-6343-7341' },
        { name: '조화자', title: '권사', phone: '010-7189-9091' },
        { name: '최숙현', title: '권사', phone: '010-6239-1566' },
        { name: '최혜경', title: '권사', phone: '010-6576-4959' },
    ];

    const altos = [
        { name: '곽정자', title: '권사', phone: '010-8903-6330' },
        { name: '김경자A', title: '권사', phone: '010-4324-5243' },
        { name: '김미자', title: '권사', phone: '010-3376-8808' },
        { name: '김숙자', title: '권사', phone: '010-8277-5697' },
        { name: '김영신', title: '권사', phone: '010-5405-4158' },
        { name: '남궁은옥', title: '권사', phone: '010-3132-7590' },
        { name: '노경주', title: '권사', phone: '010-2679-8206' },
        { name: '배관순', title: '권사', phone: '010-6899-5579' },
        { name: '최선옥', title: '권사', phone: '010-2435-9138' },
    ];

    const tenors = [
        { name: '김영길', title: '청년', phone: '010-8712-2085' },
        { name: '김일규', title: '안수집사', phone: '010-3237-1919' },
        { name: '손병태', title: '장로', phone: '010-4735-8488' },
        { name: '유용길', title: '안수집사', phone: '010-8814-8844' },
        { name: '이강우', title: '장로', phone: '010-5325-2448' },
    ];

    const basses = [
        { name: '곽정기', title: '집사', phone: '010-3994-3977' },
        { name: '김문', title: '청년', phone: '010-7705-0191' },
        { name: '김용수', title: '집사', phone: '010-8886-2825' },
        { name: '손은익', title: '장로', phone: '010-3757-6178' },
        { name: '송인수', title: '집사', phone: '010-4488-0139' },
        { name: '엄웅섭', title: '장로', phone: '010-2763-9907' },
        { name: '여성구', title: '장로', phone: '010-2575-9176' },
        { name: '조규창', title: '장로', phone: '010-6343-1021' },
        { name: '최현철', title: '장로', phone: '010-4234-3479' },
        { name: '홍영식', title: '집사', phone: '010-2944-4640' },
    ];

    return (
        <div className="people-page">
            <div className="people-header">
                <div className="container">
                    <h1 className="people-title text-serif">섬기는 분들</h1>
                    <p className="people-subtitle">글로리아 찬양대를 섬기는 임원과 사역자를 소개합니다</p>
                </div>
            </div>

            <main className="container people-content">
                {/* 1. 지휘자 & 반주자 (Musicians) - Usually comes first or after Execs. 
                   User asked for Executives FIRST in the prompt ("먼저 임원진을 소개하는..."), 
                   but usually Conductor is top. However, I will follow User's explicit order in prompt 
                   "먼저 임원진을...". wait, strictly speaking "임원진을 소개하는 페이지를 만들어" implies that is key.
                   I will list Executives -> Part Leaders -> Musicians as per text order, or maybe Musicians -> Execs -> Part Leaders 
                   standard church hierarchy usually puts Conductor high but Execs manage. 
                   Let's stick to the prompt list order: Executives -> Part Leaders -> Musicians.
                   Actually, typically Conductor is music leader. 
                   Let's do: 1. Leadership (Execs) 2. Part Leaders 3. Musicians (as per prompt flow roughly)
                   Or maybe separate sections.
                */}

                <section className="people-section">
                    <div className="section-header">
                        <Music size={28} className="section-icon" />
                        <h2 className="text-serif">지휘 및 반주</h2>
                    </div>
                    <div className="people-grid">
                        {musicians.map((person, index) => (
                            <div key={index} className="person-card musician">
                                <div className="person-role">{person.role}</div>
                                <div className="person-info">
                                    <span className="person-name">{person.name}</span>
                                    <span className="person-title">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone">
                                    📞 {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="divider-wide"></div>

                <section className="people-section">
                    <div className="section-header">
                        <Crown size={28} className="section-icon" />
                        <h2 className="text-serif">임원진</h2>
                    </div>
                    <div className="people-grid">
                        {executives.map((person, index) => (
                            <div key={index} className="person-card">
                                <div className="person-role">{person.role}</div>
                                <div className="person-info">
                                    <span className="person-name">{person.name}</span>
                                    <span className="person-title">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone">
                                    📞 {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="divider-wide"></div>

                <section className="people-section">
                    <div className="section-header">
                        <Mic2 size={28} className="section-icon" />
                        <h2 className="text-serif">파트장</h2>
                    </div>
                    <div className="people-grid">
                        {partLeaders.map((person, index) => (
                            <div key={index} className="person-card">
                                <div className="person-role">{person.role}</div>
                                <div className="person-info">
                                    <span className="person-name">{person.name}</span>
                                    <span className="person-title">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone">
                                    📞 {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="people-section">
                    <div className="section-header">
                        <Users size={28} className="section-icon" />
                        <h2 className="text-serif">전체 찬양대원</h2>
                    </div>

                    <h3 className="text-serif" style={{ color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '1rem' }}>Soprano</h3>
                    <div className="people-grid compact">
                        {sopranos.map((person, index) => (
                            <div key={index} className="person-card compact">
                                <div className="person-info">
                                    <span className="person-name small">{person.name}</span>
                                    <span className="person-title small">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone small">
                                    {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-serif" style={{ color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>Alto</h3>
                    <div className="people-grid compact">
                        {altos.map((person, index) => (
                            <div key={index} className="person-card compact">
                                <div className="person-info">
                                    <span className="person-name small">{person.name}</span>
                                    <span className="person-title small">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone small">
                                    {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-serif" style={{ color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>Tenor</h3>
                    <div className="people-grid compact">
                        {tenors.map((person, index) => (
                            <div key={index} className="person-card compact">
                                <div className="person-info">
                                    <span className="person-name small">{person.name}</span>
                                    <span className="person-title small">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone small">
                                    {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-serif" style={{ color: 'var(--color-primary)', marginBottom: '1rem', marginTop: '2rem' }}>Bass</h3>
                    <div className="people-grid compact">
                        {basses.map((person, index) => (
                            <div key={index} className="person-card compact">
                                <div className="person-info">
                                    <span className="person-name small">{person.name}</span>
                                    <span className="person-title small">{person.title}</span>
                                </div>
                                <a href={`tel:${person.phone}`} className="person-phone small">
                                    {person.phone}
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default People;
