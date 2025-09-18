import style from './InsightList.module.css';
import { formatTimeAgo } from './formatTimeAgo';
import { supabase } from "../supabaseClient";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function InsightList(props) {
    const [insights, setInsights] = useState(props.insights);

    useEffect(() => {
        setInsights(props.insights);
    }, [props.insights]);

    const handleLike = async (insightId) => {
        const {data: {user}} = await supabase.auth.getUser();

        if(!user) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }

        const userId = user.id;

        // 좋아요 상태 확인
        const { data: existingLike, error: checkError} = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', insightId)
            .eq('user_id', userId);
        
        // 데이터가 없는 에러가 발생했을때
        if (checkError && checkError.message !== 'PGRST116') {
            console.log('좋아요 확인 오류:', checkError);
            alert('좋아요 처리 중 오류가 발생했습니다.');
            return;
        }

        // 이미 좋아요를 눌렀을 때
        if (existingLike && existingLike.length > 0) {
            const { error: deleteError } = await supabase
                .from('likes')
                .delete()
                .eq('id', existingLike[0].id);
            
            if (deleteError) {
                console.error("좋아요 취소 오류: ", deleteError);
                alert("좋아요 취소 오류 발생");
                return;
            }

            const { data: currentInsight, error: selectError } = await supabase
                .from('insight')
                .select('like')
                .eq('id', insightId)
                .single();

            if (selectError) {
                console.error("데이터 조회 중 오류 발생:", selectError);
                return;
            }

            const newLikeCount = currentInsight.like - 1;

            const { error: updateError } = await supabase
                .from('insight')
                .update({ like: newLikeCount })
                .eq('id', insightId);

            if (updateError) {
                console.error("업데이트 중 오류 발생:", updateError);
            }

        } else { // 좋아요가 안되어 있을 때, 좋아요 추가
            const { error: insertError } = await supabase
                .from('likes')
                .insert([{
                    post_id: insightId,
                    user_id: userId,
                }]);
            
            if (insertError) {
                console.error("좋아요 추가 시 오류: ", insertError);
                alert('좋아요 추가 중 오류 발생');
                return;
            }

            const { data: currentInsight, error: selectError } = await supabase
                .from('insight')
                .select('like') // 'like' 칼럼만 선택
                .eq('id', insightId)
                .single(); // 단일 행을 가져옴

            if (selectError) {
                console.error("데이터 조회 중 오류 발생:", selectError);
                return;
            }

            const newLikeCount = currentInsight.like + 1;

            const { error: updateError } = await supabase
                .from('insight')
                .update({ like: newLikeCount })
                .eq('id', insightId);

            if (updateError) {
                console.error("업데이트 중 오류 발생:", updateError);
            }
        }
    }

    return (
        <div className={style.main}>
            <ol className={style.ul}>
                {props.insights.map((insight) => (
                    <li key={insight.id}>
                        <p style={{marginBottom: 0}}>
                            <a href={insight.content_url} className={style.li}>{insight.title}</a>
                        </p>
                        <p id={style.sub}>
                            <span 
                                onClick={() => handleLike(insight.id)} 
                                className={style.likeText}>
                                올려 {insight.like}
                            </span> 
                            &nbsp;&nbsp;|&nbsp; {formatTimeAgo(insight.created_at)}
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <span>
                                <Link to={`comment/${insight.id}`} className={style.commentText}>댓글 {insight.comment}</Link>
                            </span>
                            &nbsp;&nbsp;|&nbsp; by {insight.author}
                        </p>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default InsightList;