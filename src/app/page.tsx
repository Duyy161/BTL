"use client";

import { useEffect, useState } from "react";

type Expert = {
  id: string;
  organization: string;
  technologies: string;
  rating: number;
  projectCount: number;
  user: { fullName: string };
};

type Match = {
  id: string;
  score: number;
  reason: string;
  expertProfile: Expert;
};

type Project = {
  id: string;
  title: string;
  problem: string;
  budgetVnd: number;
  deadlineMonths: number;
  kpiTarget: string;
  matchResults: Match[];
};

const defaultForm = {
  title: "AI CSKH cho doanh nghiep SME",
  problem: "Toi muon giam chi phi cham soc khach hang va tu dong tra loi cau hoi lap lai.",
  budgetVnd: 100000000,
  deadlineMonths: 3,
  kpiTarget: "Giam 30% ticket thu cong sau 3 thang",
};

export default function Home() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("Toi muon toi uu CSKH bang AI, hay giup toi lap brief du an.");
  const [chatOutput, setChatOutput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  async function loadData() {
    const [expertsRes, projectsRes] = await Promise.all([fetch("/api/experts"), fetch("/api/projects")]);
    const expertsJson = await expertsRes.json();
    const projectsJson = await projectsRes.json();
    setExperts(expertsJson.experts ?? []);
    setProjects(projectsJson.projects ?? []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Project submission failed.");
      if (data?.project) {
        setProjects((prev) => [data.project, ...prev]);
      } else {
        await loadData();
      }
    } finally {
      setLoading(false);
    }
  }

  async function runChat() {
    setChatLoading(true);
    setChatOutput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await res.json();
      setChatOutput(data.content ?? data.error ?? "Khong co phan hoi.");
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#0b3d2e,_#071126_60%)] text-white">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Broker 4.0 Platform</h1>
        <p className="mt-2 text-sm text-emerald-100">SME Audit - Matching - Project Delivery - ROI</p>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitProject} className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <h2 className="text-xl font-semibold">SME Project Intake</h2>
            <div className="mt-4 space-y-3 text-sm">
              <input className="w-full rounded bg-black/30 p-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="w-full rounded bg-black/30 p-2" rows={4} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
              <input className="w-full rounded bg-black/30 p-2" type="number" value={form.budgetVnd} onChange={(e) => setForm({ ...form, budgetVnd: Number(e.target.value) })} />
              <input className="w-full rounded bg-black/30 p-2" type="number" value={form.deadlineMonths} onChange={(e) => setForm({ ...form, deadlineMonths: Number(e.target.value) })} />
              <input className="w-full rounded bg-black/30 p-2" value={form.kpiTarget} onChange={(e) => setForm({ ...form, kpiTarget: e.target.value })} />
              <button disabled={loading} className="rounded bg-emerald-400 px-4 py-2 font-semibold text-black disabled:opacity-60">
                {loading ? "Dang xu ly..." : "Audit + Matching"}
              </button>
            </div>
          </form>

          <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <h2 className="text-xl font-semibold">AI Consultant Chatbox</h2>
            <textarea className="mt-4 w-full rounded bg-black/30 p-2" rows={4} value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
            <button onClick={runChat} disabled={chatLoading} className="mt-3 rounded bg-cyan-300 px-4 py-2 font-semibold text-black disabled:opacity-60">
              {chatLoading ? "AI dang tu van..." : "Nhan tu van AI"}
            </button>
            <pre className="mt-4 whitespace-pre-wrap rounded bg-black/35 p-3 text-sm text-cyan-100">{chatOutput || "Phan hoi AI se hien thi tai day."}</pre>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
          <h2 className="text-xl font-semibold">Top Experts / Labs</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {experts.map((ex) => (
              <article key={ex.id} className="rounded-lg bg-black/25 p-3">
                <h3 className="font-semibold">{ex.user.fullName}</h3>
                <p className="text-xs text-emerald-100">{ex.organization}</p>
                <p className="mt-2 text-xs">Tech: {ex.technologies}</p>
                <p className="mt-1 text-xs">Rating: {ex.rating} | Projects: {ex.projectCount}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur">
          <h2 className="text-xl font-semibold">Matching Results</h2>
          <div className="mt-4 space-y-4">
            {projects.map((p) => (
              <article key={p.id} className="rounded-lg bg-black/25 p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-emerald-50">{p.problem}</p>
                <p className="mt-1 text-xs">Budget: {p.budgetVnd.toLocaleString("vi-VN")} VND | Timeline: {p.deadlineMonths} thang</p>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  {p.matchResults.map((m) => (
                    <div key={m.id} className="rounded bg-white/10 p-2 text-xs">
                      <p className="font-semibold">{m.expertProfile.user.fullName}</p>
                      <p>Score: {m.score}%</p>
                      <p>{m.reason}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
            {projects.length === 0 && <p className="text-sm text-emerald-100">Chua co du an nao. Hay tao yeu cau SME de xem matching.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
