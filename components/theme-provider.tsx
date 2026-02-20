import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

// Helper to convert Hex to HSL
function hexToHSL(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

export async function ThemeProvider() {
  noStore(); // Always fetch fresh theme — bypasses Next.js data cache
  const supabase = await createClient();
  const { data: theme } = await supabase.from("theme_settings").select("*").limit(1).single();

  if (!theme) return null;

  // Map DB columns to CSS variables
  // default fallback is handled by not overriding if value is missing/invalid

  const cssVars: string[] = [];

  if (theme.primary_color) {
    const hsl = hexToHSL(theme.primary_color);
    cssVars.push(`--primary: ${hsl};`);
    cssVars.push(`--ring: ${hsl};`);
    cssVars.push(`--sidebar-primary: ${hsl};`);
  }

  if (theme.accent_color) {
    const hsl = hexToHSL(theme.accent_color);
    cssVars.push(`--accent: ${hsl};`);
  }

  if (theme.background_color) {
    const hsl = hexToHSL(theme.background_color);
    // Only apply to background, card and popover might need to be derived or kept default dark
    // For now let's map background to background
    cssVars.push(`--background: ${hsl};`);
  }

  if (theme.surface_color) {
    const hsl = hexToHSL(theme.surface_color);
    cssVars.push(`--card: ${hsl};`);
    cssVars.push(`--popover: ${hsl};`);
    cssVars.push(`--muted: ${hsl};`);
  }

  if (theme.border_color) {
    const hsl = hexToHSL(theme.border_color);
    cssVars.push(`--border: ${hsl};`);
    cssVars.push(`--input: ${hsl};`);
  }

  if (theme.font_display) {
    cssVars.push(`--font-display: "${theme.font_display}", sans-serif;`);
  }

  if (theme.font_serif) {
    cssVars.push(`--font-serif: "${theme.font_serif}", serif;`);
  }

  if (cssVars.length === 0) return null;

  const fontsToLoad = new Set<string>();
  if (theme.font_display) fontsToLoad.add(theme.font_display.replace(/ /g, "+"));
  if (theme.font_serif) fontsToLoad.add(theme.font_serif.replace(/ /g, "+"));

  const fontImport = fontsToLoad.size > 0
    ? `@import url('https://fonts.googleapis.com/css2?${Array.from(fontsToLoad).map(f => `family=${f}:wght@300;400;500;600;700${f === "Cinzel" ? ";800" : ""}`).join("&")}&display=swap');\n`
    : "";

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        ${fontImport}
        :root {
          ${cssVars.join("\n          ")}
        }
        .dark {
          ${cssVars.join("\n          ")}
        }
      `
    }} />
  );
}
