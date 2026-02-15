import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { ExecutiveBrief } from "@/components/landing/executive-brief";
import { FeaturedCaseStudies } from "@/components/landing/featured-case-studies";
import { ProductPhilosophy } from "@/components/landing/product-philosophy";
import { ProcessSection } from "@/components/landing/process-section";
import { OperationsSection } from "@/components/landing/operations-section";
import { CredentialsSection } from "@/components/landing/credentials-section";
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
  let operations: any[] = [];
  let certificates: any[] = [];
  let education: any[] = [];
  let socialLinks: any[] = [];
  let caseStudies: any[] = [];
  let landingSections: any[] = [];

  if (supabase) {
    const results = await Promise.all([
      safeQuery(async () => await supabase!.from("site_settings").select("*").limit(1).single()),
      safeQuery(async () => await supabase!.from("metrics").select("*").order("sort_order")),
      safeQuery(async () => await supabase!.from("executive_brief").select("*").limit(1).single()),
      safeQuery(async () => await supabase!.from("operations").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(async () => await supabase!.from("certificates").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(async () => await supabase!.from("education").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(async () => await supabase!.from("social_links").select("*").order("sort_order").eq("is_visible", true)),
      safeQuery(async () => await supabase!.from("case_studies").select("*").eq("is_visible", true).order("sort_order").limit(3)),
      safeQuery(async () => await supabase!.from("landing_sections").select("*").in("section_key", ["product_philosophy", "process"])),
    ]);

    siteSettings = results[0];
    metrics = results[1] || [];
    executiveBrief = results[2];
    operations = results[3] || [];
    certificates = results[4] || [];
    education = results[5] || [];
    socialLinks = results[6] || [];
    caseStudies = results[7] || [];
    landingSections = results[8] || [];
  }

  const philosophyData = landingSections.find((s: any) => s.section_key === "product_philosophy")?.content;
  const processData = landingSections.find((s: any) => s.section_key === "process")?.content;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Vertical column lines (blackbox.ai style) */}
      <div className="vertical-lines" aria-hidden="true">
        <div className="vertical-lines-inner">
          <div />
          <div />
          <div />
        </div>
      </div>

      <Header />
      <main className="relative z-10">
        <HeroSection settings={siteSettings} />
        <div className="hr-divider" aria-hidden="true" />
        <MetricsSection metrics={metrics} />
        <div className="hr-divider" aria-hidden="true" />
        <ExecutiveBrief brief={executiveBrief} />
        <div className="hr-divider" aria-hidden="true" />
        <FeaturedCaseStudies studies={caseStudies} />
        <div className="hr-divider" aria-hidden="true" />
        <ProductPhilosophy principles={philosophyData?.principles} quote={philosophyData?.quote} />
        <div className="hr-divider" aria-hidden="true" />
        <ProcessSection steps={processData?.steps} />
        <div className="hr-divider" aria-hidden="true" />
        <OperationsSection operations={operations} />
        <div className="hr-divider" aria-hidden="true" />
        <CredentialsSection certificates={certificates} education={education} />
        <div className="hr-divider" aria-hidden="true" />
        <ContactSection socials={socialLinks} />
      </main>
      <Footer />
    </div>
  );
}
