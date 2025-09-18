import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import InsightList from '../components/InsightList';

function Home() {
    const [insights, setInsights] = useState([]);
    useEffect(() => {
        getInsights();
    }, [insights]);
    async function getInsights() {
        const { data } = await supabase
            .from("insight")
            .select()
            .order("created_at", { ascending: false });
        setInsights(data);
    }
    return (
        <InsightList insights={insights} />
    )
}

export default Home;