import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function TestSupabase() {
  const [message, setMessage] = useState("Checking connection...");

  useEffect(() => {
    const test = async () => {
      try {
        // Simple request to check connection
        const { error } = await supabase.from("test_connection").select("*").limit(1);

        if (error) {
          setMessage("❌ Supabase connected but table doesn't exist (this is NORMAL!).");
        } else {
          setMessage("✅ Supabase connected successfully!");
        }
      } catch (err: any) {
        setMessage("❌ Error connecting to Supabase: " + err.message);
      }
    };

    test();
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "20px" }}>
      <h1>Supabase Connection Test</h1>
      <p>{message}</p>
    </div>
  );
}
