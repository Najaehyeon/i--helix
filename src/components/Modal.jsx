import style from "./Modal.module.css";

function Modal(props) {
    return (
        <div className={style.modalOverlay}>
            <div className={style.modalCard}>
                <p className={style.confirmationEmail}>{props.modalMessage}</p>
                <div className={style.buttonGroup}>
                <button onClick={props.handleConfirmSignUp} className={style.confirmButton}>
                    {props.confirmText}
                </button>
                {
                    props.cancel
                        ? (
                            <button onClick={props.handleCancelSignUp} className={style.cancelButton}>
                                취소
                            </button>
                        )
                        : (
                            null
                        )
                }
                </div>
            </div>
        </div>
    )
}

export default Modal;