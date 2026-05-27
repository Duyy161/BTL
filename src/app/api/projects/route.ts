import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { scoreExpertMatch } from "@/lib/matching";
import { demoExperts } from "@/lib/demo-data";

const schema = z.object({
  title: z.string().min(3),
  problem: z.string().min(10),
  budgetVnd: z.number().int().min(10000000),
  deadlineMonths: z.number().int().min(1).max(24),
  kpiTarget: z.string().min(3),
});

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        matchResults: {
          include: {
            expertProfile: { include: { user: true } },
          },
          orderBy: { score: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [], fallback: true });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const payload = schema.parse(body);
  try {
    const sme = await prisma.user.findFirst({ where: { role: "SME" } });
    if (!sme) {
      return NextResponse.json({ error: "Missing SME seed user" }, { status: 500 });
    }

    const project = await prisma.project.create({
      data: {
        ...payload,
        smeId: sme.id,
      },
    });

    const experts = await prisma.expertProfile.findMany();
    const topMatches = experts
      .map((expert) => ({ expert, ...scoreExpertMatch(expert, payload) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    await prisma.matchResult.createMany({
      data: topMatches.map((m) => ({
        projectId: project.id,
        expertProfileId: m.expert.id,
        score: m.score,
        reason: m.reason,
      })),
    });

    const enriched = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        matchResults: {
          include: {
            expertProfile: { include: { user: true } },
          },
          orderBy: { score: "desc" },
        },
      },
    });

    return NextResponse.json({ project: enriched }, { status: 201 });
  } catch {
    const topMatches = demoExperts
      .map((expert) => ({ expert, ...scoreExpertMatch(expert, payload) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((m, index) => ({
        id: `fallback-match-${index + 1}`,
        score: m.score,
        reason: m.reason,
        expertProfile: m.expert,
      }));

    return NextResponse.json(
      {
        project: {
          id: `fallback-${Date.now()}`,
          ...payload,
          matchResults: topMatches,
        },
        fallback: true,
      },
      { status: 201 },
    );
  }
}
