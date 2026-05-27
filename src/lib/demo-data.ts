export type DemoExpert = {
  id: string;
  organization: string;
  technologies: string;
  rating: number;
  projectCount: number;
  user: { fullName: string };
};

export const demoExperts: DemoExpert[] = [
  {
    id: "exp-1",
    organization: "HUST AI Lab",
    technologies: "nlp,chatbot,customer-support,automation",
    rating: 4.8,
    projectCount: 22,
    user: { fullName: "Lab NLP HUST" },
  },
  {
    id: "exp-2",
    organization: "VNU Innovation Lab",
    technologies: "computer-vision,quality-control,iot,automation",
    rating: 4.6,
    projectCount: 16,
    user: { fullName: "Computer Vision Team VNU" },
  },
  {
    id: "exp-3",
    organization: "CRM Next JSC",
    technologies: "crm,sales-ops,chatbot,analytics",
    rating: 4.4,
    projectCount: 11,
    user: { fullName: "Startup CRM Next" },
  },
];
