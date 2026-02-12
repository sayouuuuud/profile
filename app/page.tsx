import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { ExecutiveBrief } from "@/components/landing/executive-brief";
import { SkillsSection } from "@/components/landing/skills-section";
import { OperationsSection } from "@/components/landing/operations-section";
import { CertificatesSection } from "@/components/landing/certificates-section";
import { EducationSection } from "@/components/landing/education-section";
import { ArsenalSection } from "@/components/landing/arsenal-section";
import { ContactSection, Footer } from "@/components/landing/contact-footer";

async function safeQuery(queryFn: () => Promise<{ data: any; error: any }>) {
  try {
    const { data, error } = await queryFn();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function Page() {
  let supabase: Awaited<ReturnType<typeof createClient>> | null = null;

  try {
    supabase = await createClient();
  } catch {
    // Supabase not configured - render with defaults
  }

  let siteSettings = null;
  let metrics: any[] = [];
  let executiveBrief = null;
  let skillCategories: any[] = [];
  let skills: any[] = [];
  let operations: any[] = [];
  let certificates: any[] = [];
  let education: any[] = [];
  let arsenal: any[] = [];
  let socialLinks: any[] = [];

  if (supabase) {
    const results = await Promise.all([
      safeQuery(() => supabase!.from("site_settings").select("*").limit(1).single()),
      safeQuery(() => supabase!.from("metrics").select("*").order("sort_order")),
      safeQuery(() => supabase!.from("executive_brief").select("*").limit(1).single()),
      safeQuery(() => supabase!.from("skill_categories").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(() => supabase!.from("skills").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(() => supabase!.from("operations").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(() => supabase!.from("certificates").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(() => supabase!.from("education").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(() => supabase!.from("arsenal").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(() => supabase!.from("social_links").select("*").order("sort_order").eq("is_visible", true)),
    ]);

    siteSettings = results[0];
    metrics = results[1] || [];
    executiveBrief = results[2];
    skillCategories = results[3] || [];
    skills = results[4] || [];
    operations = results[5] || [];
    certificates = results[6] || [];
    education = results[7] || [];
    arsenal = results[8] || [];
    socialLinks = results[9] || [];
  }

  const categoriesWithSkills = skillCategories.map((cat: any) => ({
    ...cat,
    skills: skills.filter((s: any) => s.category_id === cat.id),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection settings={siteSettings} />
        <MetricsSection metrics={metrics} />
        <ExecutiveBrief brief={executiveBrief} />
        <SkillsSection categories={categoriesWithSkills} />
        <OperationsSection operations={operations} />
        <CertificatesSection certificates={certificates} />
        <EducationSection education={education} />
        <ArsenalSection arsenal={arsenal} />
        <ContactSection socials={socialLinks} />
        <Footer />
      </main>
    </div>
  );
}
