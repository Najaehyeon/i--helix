import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import InsightList from '../components/InsightList';

function Best() {
    const [insights, setInsights] = useState([]);
    useEffect(() => {
        getInsights();
    }, []);
    async function getInsights() {
        const { data } = await supabase
            .from("insight")
            .select()
            .order("like", { ascending: false });
        setInsights(data);
    }
    return (
        <InsightList insights={insights} />
    )
}

export default Best;