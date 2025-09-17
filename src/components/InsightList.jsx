import style from './InsightList.module.css';
import { formatTimeAgo } from './formatTimeAgo';

function InsightList(props) {
    return (
        <div className={style.main}>
            <ol className={style.ul}>
                {props.insights.map((insight) => (
                    <li key={insight.id}>
                        <p style={{marginBottom: 0}}>
                            <a href={insight.content_url} className={style.li}>{insight.title}</a>
                        </p>
                        <p id={style.sub}>{insight.like} 좋아요 | {formatTimeAgo(insight.created_at)} | 댓글 {insight.comment} | by {insight.author}</p>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default InsightList;