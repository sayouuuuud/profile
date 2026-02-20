import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CaseStudyClient } from "@/components/case-study/case-study-client"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("case_studies").select("title, subtitle").eq("slug", slug).single()
    return {
      title: data ? `Case Study: ${data.title}` : "Case Study",
      description: data?.subtitle || "",
    }
  } catch {
    return { title: "Case Study", description: "" }
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let cs: any = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("case_studies").select("*").eq("slug", slug).single()
    cs = data
  } catch {
    return notFound()
  }

  if (!cs) return notFound()

  return <CaseStudyClient cs={cs} />
}
