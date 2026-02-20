import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data: studies } = await supabase.from("case_studies").select("*");

for (const cs of studies || []) {
  if (cs.content_blocks && cs.content_blocks.length > 0) {
    console.log(`Skipping ${cs.title} - already has blocks`);
    continue;
  }

  const blocks = [];
  let order = 0;

  for (const card of cs.stat_cards || []) {
    const type = card.type === "donut" ? "stat-donut" : card.type === "progress" ? "stat-progress" : "stat-bars";
    blocks.push({ id: crypto.randomUUID(), type, width: "1/3", sort_order: order++, data: card });
  }

  if ((cs.challenges || []).length > 0) {
    blocks.push({ id: crypto.randomUUID(), type: "challenges-list", width: "1/2", sort_order: order++, data: { items: cs.challenges } });
  }

  if ((cs.solutions || []).length > 0) {
    blocks.push({ id: crypto.randomUUID(), type: "solutions-list", width: "1/2", sort_order: order++, data: { items: cs.solutions } });
  }

  if ((cs.architecture_nodes || []).length > 0) {
    blocks.push({ id: crypto.randomUUID(), type: "architecture-diagram", width: "full", sort_order: order++, data: { nodes: cs.architecture_nodes } });
  }

  for (const snippet of (cs.code_snippets || []).slice(0, 1)) {
    blocks.push({ id: crypto.randomUUID(), type: "code-terminal", width: "1/2", sort_order: order++, data: snippet });
  }

  if (cs.system_report && cs.system_report.version) {
    blocks.push({ id: crypto.randomUUID(), type: "system-report", width: "1/2", sort_order: order++, data: cs.system_report });
  }

  const { error } = await supabase.from("case_studies").update({ content_blocks: blocks }).eq("id", cs.id);
  if (error) {
    console.error(`Error updating ${cs.title}:`, error.message);
  } else {
    console.log(`Migrated ${cs.title}: ${blocks.length} blocks`);
  }
}

console.log("Migration complete!");
