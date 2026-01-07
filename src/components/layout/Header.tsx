import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react'; // Optional icon
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (id: string) => {
        if (location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
            window.scrollTo(0, 0);
        }
    };

    const handleHomeClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
            window.scrollTo(0, 0);
        }
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <a href="/" className="logo" onClick={handleLogoClick}>
                    GLORIA
                    <span className="sub-logo">SHINGWANG CHURCH</span>
                </a>

                {/* Mobile Center Home Button */}
                <button className="mobile-home-btn" onClick={handleHomeClick} aria-label="홈으로">
                    <HomeIcon size={20} />
                </button>

                {/* Desktop Nav */}
                <nav className="nav-menu desktop-only">
                    <button onClick={() => handleNavClick('about')}>소개</button>
                    <button onClick={(e) => {
                        e.preventDefault();
                        if (location.pathname !== '/') {
                            navigate('/');
                            setTimeout(() => window.dispatchEvent(new CustomEvent('open-join-modal')), 100);
                        } else {
                            window.dispatchEvent(new CustomEvent('open-join-modal'));
                        }
                    }}>예배안내</button>
                    <button onClick={() => handleNavClick('join')}>대원모집</button>
                    <button onClick={() => navigate('/calendar')}>일정</button>
                    <button onClick={() => navigate('/community')}>커뮤니티</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
