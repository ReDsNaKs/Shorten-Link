import { supabase } from "@supabase/supabase-js";
import { nanoid } from "nanoid"; // ← importar nanoid

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    const slug = nanoid(6); // ← ID corto de 6 caracteres únicos

    const { error } = await supabase.from("Links").insert([
      {
        url: url,
        slug: slug,
      },
    ]);

    if (error) throw error;

    return res.status(200).json({
      slug: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`,
    });
  } catch (err) {
    console.error("[SHORTEN ERROR]", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
