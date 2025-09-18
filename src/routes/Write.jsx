import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from 'react-router-dom';
import style from './Write.module.css';
import Modal from "../components/Modal";

function Write() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [contentURL, setContentURL] = useState('');

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
            } else {
                navigate('/sign');
            }
        };
        checkUser();
    }, [navigate]);

    const handlePrePost = (event) => {
        event.preventDefault();
        setModalMessage('인사이트를 공유하시겠습니까?');
        setShowConfirmation(true);
    }

    const handleCancelSignUp = () => {
        setShowConfirmation(false);
    };

    const handleConfirmSignUp = async (event) => {
        event.preventDefault();
        const { error } = await supabase
            .from('insight')
            .insert({
                title: title,
                content_url: contentURL,
                author: user.user_metadata.nickname,
            });
        if (error) {
            alert("글 작성 오류" + error.message);
        } else {
            navigate('/');
        }
    }

    return (
        <div className={style.container}>
            {user ? (
                <div>
                    <h2>인사이트 공유</h2>
                    <form onSubmit={handlePrePost} className={style.form}>
                        <label className={style.label}>제목</label>
                        <input
                            className={style.inputTitle}
                            placeholder="제목을 입력해주세요."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <label className={style.label}>URL</label>
                        <input
                            type="URL"
                            className={style.inputURL}
                            placeholder="공유할 인사이트의 URL을 입력해주세요."
                            value={contentURL}
                            onChange={(e) => setContentURL(e.target.value)}
                            required
                        />
                        <button type="submit" className={style.button}>공유하기</button>
                    </form>
                </div>
            ) : (
                <h1>로그인 페이지로...</h1>
            )}

            {showConfirmation && (
                <Modal
                    handleConfirmSignUp={handleConfirmSignUp}
                    handleCancelSignUp={handleCancelSignUp}
                    modalMessage={modalMessage}
                    confirmText="공유하기"
                    cancel={true}
                />
            )}
        </div>
    );
}

export default Write;