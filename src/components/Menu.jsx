import { IoMdList } from "react-icons/io";
import { MdLocalFireDepartment } from "react-icons/md";
import { FaQuestion, FaPen } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import style from './Menu.module.css';

function Menu() {
    return(
        <div className={style.menu}>
            <ul className={style.ul}>
                <li className={style.li}><Link to='/' id={style.a}><IoMdList size={18}/> 최신글</Link></li>
                <li className={style.li}><Link to='/best' id={style.a}><MdLocalFireDepartment size={18}/> 실시간</Link></li>
                <li className={style.li}><Link to='/' id={style.a}><FaQuestion/> 질문글</Link></li>
                <li className={style.li}><Link to='/' id={style.a}><RiTeamFill/> 팀빌딩</Link></li>
                <li className={style.li}><Link to='/write' id={style.a}><FaPen/> 글작성</Link></li>
            </ul>
            <hr style={{marginLeft: 50, marginRight: 0}} />
        </div>
    )
}

export default Menu;