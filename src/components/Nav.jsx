import { FaSearch } from 'react-icons/fa';
import style from './Nav.module.css';
import { Link } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { useState, useEffect } from 'react';
import TextType from './TextType';

function Nav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(session !== null);
        };
        getSession();
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(session !== null);
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert('로그아웃 실패: ' + error.message);
        } else {
            alert('로그아웃 되었습니다.');
        }
    };

    return (
        <header className={style.header}>
            <nav className={style.nav}>
                <h2 className={style.title}>
                    <Link to="/" id={style.logo}>
                        <TextType 
                            text={["I--HELIX"]}
                            typingSpeed={75}
                            showCursor={false}
                            textColors={"#ff6600"}
                        />
                    </Link>
                </h2>
                <form className={style.searchContainer}>
                    <input className={style.searchInput} type="text" placeholder="Search..." />
                    <button className={style.searchButton} aria-label="Search">
                        <FaSearch className={style.searchIcon} />
                    </button>
                </form>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className={style.logoutButton}>
                        로그아웃
                    </button>
                ) : (
                    <Link to="/sign" id={style.login}>로그인</Link>
                )}
            </nav>
            <hr style={{ margin: 0 }} />
        </header>
    );
}

export default Nav;