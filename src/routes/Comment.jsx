import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { formatTimeAgo } from '../components/formatTimeAgo';
import style from './Comment.module.css';
import { useState, useEffect } from 'react';

function Comment() {
    const { insightId } = useParams();
    const [ insight, setInsight ] = useState([]);
    const [ comments, setComments ] = useState([]);
    const [ commentContent, setCommentContent] = useState();

    const insight_id = parseInt(insightId);

    useEffect(()=> {
        getData();
    }, [insightId]);
    const getData = async () => {
        const { data: insightData } = await supabase
            .from('insight')
            .select()
            .eq('id', insight_id)
            .maybeSingle();
        setInsight(insightData);

        console.log(insightData);

        const { data: commentData} = await supabase
            .from('comments')
            .select()
            .eq('post_id', insight_id)
            .order('created_at', {ascending: false});
        setComments(commentData);
    }

    const onCommentSubmit = async (event) => {
        event.preventDefault();
        const {data: {user}} = await supabase.auth.getUser();

        if(!user) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }

        const { error } = await supabase
            .from('comments')
            .insert({
                content: commentContent,
                user_id: user.id,
                post_id: insight_id,
            });

        if(error) {
            console.error("댓글 작성 중 에러 발생:", error);
        } else {
            const { data: currentInsight, error: selectError } = await supabase
                .from('insight')
                .select('comment') // 'like' 칼럼만 선택
                .eq('id', insightId)
                .single(); // 단일 행을 가져옴

            if (selectError) {
                console.error("데이터 조회 중 오류 발생:", selectError);
                return;
            }

            console.log(currentInsight);
            const newCommentCount = currentInsight.comment + 1;

            const { error: updateError } = await supabase
                .from('insight')
                .update({ comment: newCommentCount })
                .eq('id', insightId);

            if (updateError) {
                console.error("업데이트 중 오류 발생:", updateError);
            }

            // 댓글 작성 성공 후 입력창을 비워줍니다.
            setCommentContent('');
            // 댓글 목록을 다시 불러와 화면을 업데이트합니다.
            getData();
        }
    }


    return (
        <div className={style.container}>
            {insight !==null && insight.title ? (
                <div>
                    <h2>{insight.title}</h2>
                    <p><a href={insight.content_url}>{insight.content_url}</a></p>
                    <form onSubmit={onCommentSubmit}>
                        <textarea
                            className={style.inputComment}
                            placeholder='댓글을 입력하세요'
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            name="text"
                            required
                        />
                        <button type="submit" className={style.button}>작성하기</button>
                    </form>
                    <hr/>
                    <div className={style.commentSection}>
                        {comments && comments.map((comment) => (
                            <div key={comment.id} className={style.commentItem}>
                                <p className={style.commentContent}>{comment.content}</p>
                                <div className={style.commentMeta}>
                                    <span className={style.commentDate}>{formatTimeAgo(comment.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    )
}

export default Comment;