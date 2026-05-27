import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const experts = await prisma.expertProfile.findMany({
    include: { user: true },
    orderBy: [{ rating: "desc" }, { projectCount: "desc" }],
  });

  return NextResponse.json({ experts });
}
