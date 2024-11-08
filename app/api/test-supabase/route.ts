import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabaseClient";

export async function GET() {
  // Test simple : récupérer les données d'une table existante (par exemple, "editable_content")
  const { data, error } = await supabase
    .from("editable_content")
    .select("*")
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json(data, { status: 200 });
  }
}
