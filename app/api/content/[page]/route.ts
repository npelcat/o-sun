import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabaseClient";

export async function GET(
  request: Request,
  { params }: { params: { page: string } }
) {
  const { page } = params;

  // Convertir `page` en entier
  const pageId = parseInt(page, 10); // ou Number(page)

  console.log(`Fetching content for page ID: ${pageId}`); // Debugging log

  // Vérifier que `pageId` est un nombre valide
  if (isNaN(pageId)) {
    return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
  }

  // Récupérer toutes les parties pour une page donnée
  const { data, error } = await supabase
    .from("editable_content")
    .select("*")
    .eq("page_id", pageId);
  // .order("part"); // On peut trier par la colonne "part" si tu veux un ordre spécifique

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data); // Retourne toutes les parties pour la page donnée
}
