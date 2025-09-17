import { useState } from "react";
import { supabase } from "../supabaseClient";
import style from './Sign.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from "../components/Modal";

function Sign() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 모달을 위한 변수
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();

  // 로그인 처리 함수
  const handleLogin = async (event) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      alert(error.message);
    } else {
      navigate('/');
    }
  };

  // 회원가입 버튼 클릭 시 호출되는 함수
  const handlePreSignUp = (event) => {
    event.preventDefault();
    if (signupPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    setModalMessage("본인 이메일이 맞습니까!?");
    setShowConfirmation(true);
  };

  // 회원가입 실행 함수
  const handleConfirmSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          nickname: nickname,
        }
      }
    });
    if (error) {
      alert(error.message);
    } else {
      setModalMessage("회원가입 성공!");
      setShowSuccessModal(true);
    }
    setShowConfirmation(false);
  };

  // 확인 카드 닫기 함수
  const handleCancelSignUp = () => {
    setShowConfirmation(false);
  };

  // 성공 모달에서 '홈으로' 버튼 클릭 시 호출되는 함수
  const handleGoToHome = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>로그인</h2>
      <form onSubmit={handleLogin} className={style.form}>
        <div className={style.inputGroup}>
          <label htmlFor="login-email" className={style.label}>이메일</label>
          <input
            id="login-email"
            type="email"
            placeholder="이메일 주소를 입력해주세요"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className={style.input}
            required
          />
        </div>
        <div className={style.inputGroup}>
          <label htmlFor="login-password" className={style.label}>비밀번호</label>
          <input
            id="login-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className={style.input}
            required
          />
        </div>
        <button type="submit" className={style.button}>
          로그인
        </button>
      </form>

      <div className={style.divider}></div>

      <h2 className={style.title}>빠른 회원가입</h2>
      <form onSubmit={handlePreSignUp} className={style.form}>
        <div className={style.inputGroup}>
          <label htmlFor="signup-email" className={style.label}>이메일 (주의: 이메일 오타 나면 세상 무너짐)</label>
          <input
            id="signup-email"
            type="email"
            placeholder="이메일 주소를 입력해주세요"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className={style.input}
            required
          />
        </div>
        <div className={style.inputGroup}>
          <label htmlFor="signup-nickname" className={style.label}>닉네임</label>
          <input
            id="signup-nickname"
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={style.input}
            required
          />
        </div>
        <div className={style.inputGroup}>
          <label htmlFor="signup-password" className={style.label}>비밀번호</label>
          <input
            id="signup-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className={style.input}
            required
          />
        </div>
        <div className={style.inputGroup}>
          <label htmlFor="confirm-password" className={style.label}>비밀번호 확인</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={style.input}
            required
          />
        </div>
        <button type="submit" className={style.button}>
          회원가입
        </button>
      </form>

      {/* 이메일 확인 모달 */}
      {showConfirmation && (
        <Modal
          handleConfirmSignUp={handleConfirmSignUp}
          handleCancelSignUp={handleCancelSignUp}
          modalMessage={modalMessage}
          confirmText="예, 맞습니다."
          cancel={true}
        />
      )}

      {/* 성공 메시지 모달 */}
      {showSuccessModal && (
        <Modal
          handleConfirmSignUp={handleGoToHome}
          handleCancelSignUp={handleCancelSignUp}
          modalMessage={modalMessage}
          confirmText="홈으로"
          cancel={false}
        />
      )}
    </div>
  );
}

export default Sign;
