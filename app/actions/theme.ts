"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveTheme(theme: Record<string, any>) {
    const supabase = await createClient();
    const { id, ...rest } = theme;

    const { error } = await supabase
        .from("theme_settings")
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) throw new Error(error.message);

    // Revalidate the entire layout so ThemeProvider re-fetches from DB
    revalidatePath("/", "layout");

    return { success: true };
}
