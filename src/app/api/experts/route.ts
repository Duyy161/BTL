import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoExperts } from "@/lib/demo-data";

export async function GET() {
  try {
    const experts = await prisma.expertProfile.findMany({
      include: { user: true },
      orderBy: [{ rating: "desc" }, { projectCount: "desc" }],
    });
    return NextResponse.json({ experts });
  } catch {
    return NextResponse.json({ experts: demoExperts, fallback: true });
  }
}
