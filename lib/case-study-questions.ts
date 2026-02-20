export interface Question {
    id: string;
    question: string;
    context: string;
    category: "ux" | "architecture" | "performance" | "impact";
}

export const GENERATOR_QUESTIONS: Question[] = [
    {
        id: "problem",
        question: "What was the core problem you aimed to solve?",
        context: "Focus on the business or user pain point.",
        category: "ux",
    },
    {
        id: "solution",
        question: "How did you solve this problem technically?",
        context: "High-level overview of the architecture and approach.",
        category: "architecture",
    },
    {
        id: "challenges",
        question: "What were the biggest technical challenges you faced?",
        context: "Specific bugs, scaling issues, or integration complexities.",
        category: "performance",
    },
    {
        id: "impact",
        question: "What was the impact of this project?",
        context: "Metrics, user adoption, or efficiency gains.",
        category: "ux",
    },
];
