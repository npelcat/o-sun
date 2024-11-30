import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../utils/supabaseClient";

export async function verifyAuth(req: NextRequest) {
  let token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    token = req.cookies.get("supabase-auth-token")?.value;
  }
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupérer l'utilisateur avec le token
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupérer le rôle depuis la base de données
  const { data: roleData, error: roleError } = await supabase
    .from("users") // Nom de la table contenant les rôles
    .select("role")
    .eq("id", user.id)
    .single(); // Récupère une seule ligne

  if (roleError || !roleData) {
    return NextResponse.json({ error: "Role not found" }, { status: 403 });
  }

  // Vérifier le rôle
  if (roleData.role !== "admin") {
    // Remplace "admin" par le rôle requis
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user; // Ou retourne tout autre objet nécessaire
}
