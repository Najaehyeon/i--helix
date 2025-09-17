export const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 1) return '방금전';
    if (hours < 1) return `${minutes}분 전`;
    if (days < 1) return `${hours}시간 전`;
    if (months < 1) return `${days}일 전`;
    if (years < 1) return `${months}달 전`;
    return `${years}년 전`;
}
