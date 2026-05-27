const tokenize = (value: string) =>
  value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

export function scoreExpertMatch(
  expert: { technologies: string; rating: number; projectCount: number },
  project: { problem: string; budgetVnd: number; deadlineMonths: number },
) {
  const techTokens = tokenize(expert.technologies);
  const problemTokens = tokenize(project.problem);
  const overlap = problemTokens.filter((t) => techTokens.includes(t)).length;
  const relevance = Math.min(40, overlap * 10);
  const quality = Math.min(30, expert.rating * 6);
  const delivery = Math.min(20, expert.projectCount * 1.2);
  const urgencyPenalty = project.deadlineMonths <= 2 && expert.projectCount > 20 ? -4 : 0;
  const budgetFit = project.budgetVnd >= 50000000 ? 10 : 6;
  const raw = relevance + quality + delivery + budgetFit + urgencyPenalty;

  return {
    score: Math.max(50, Math.min(99, Number(raw.toFixed(1)))),
    reason: `Relevance ${relevance}/40, quality ${quality.toFixed(1)}/30, delivery ${delivery.toFixed(1)}/20.`,
  };
}
