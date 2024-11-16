import { NextResponse } from "next/server";
import { supabase } from "../../../../utils/supabaseClient";

// Handler pour les requêtes GET (déjà existant)
export async function GET(
  request: Request,
  { params }: { params: { page: string } }
) {
  const { page } = params;

  // Convertir `page` en entier
  const pageId = parseInt(page, 10); // ou Number(page)

  // Vérifier que `pageId` est un nombre valide
  if (isNaN(pageId)) {
    return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
  }

  // Récupérer toutes les parties pour une page donnée
  const { data, error } = await supabase
    .from("editable_content")
    .select("*")
    .eq("page_id", pageId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data); // Retourne toutes les part pour la page donnée
}

// Handler pour les requêtes PUT (nouveau)
export async function PUT(request: Request) {
  try {
    // Récupérer les données envoyées dans le body
    const { page_id, part, content } = await request.json();

    // Vérifier que les champs nécessaires sont présents
    if (!page_id || !part || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mettre à jour la base de données
    const { data, error } = await supabase
      .from("editable_content")
      .update({ content })
      .eq("page_id", page_id)
      .eq("part", part);

    if (error) {
      console.error("Erreur Supabase :", error);
      throw error;
    }

    return NextResponse.json(
      { message: "Content updated successfully", data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
