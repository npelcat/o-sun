import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/supabaseClient";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("supabase-auth-token")?.value;
  if (!token) {
    return NextResponse.redirect("/login");
  }

  // Récupérer l'utilisateur
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.redirect("/login");
  }

  // Récupérer le rôle depuis la base de données
  const { data: roleData, error: roleError } = await supabase
    .from("users") // Nom de la table contenant les rôles
    .select("role")
    .eq("id", user.id)
    .single(); // Récupère une seule ligne

  if (roleError || !roleData || roleData.role !== "admin") {
    return NextResponse.redirect("/login");
  }

  // Si tout est valide, passer à l'étape suivante
  return NextResponse.next();
}
