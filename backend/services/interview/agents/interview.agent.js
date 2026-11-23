import llm from "../config/llm.js"
import hrInterviewPrompt from "../prompts/hrInterviewPrompt.js"
import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt.js"



export const interviewAgent = async (data) => {

    try {
        const prompt = data.type?.toLowerCase() === "hr" ? hrInterviewPrompt(data) : technicalInterviewPrompt(data)

        const response = await llm.invoke(prompt)

        const content = typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content)
        const cleaned = content
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim()

        const questions = JSON.parse(cleaned)
        if (!Array.isArray(questions) || questions.length !== 6) {
            throw new Error("Interview provider returned invalid questions.")
        }

        const normalized = questions.slice(0, 6).map((item, index) => ({
            question: String(item.question || ""),
            difficulty: ["easy", "medium", "medium", "medium", "hard", "hard"][index],
            timer: Number.isFinite(Number(item.timer)) ? Number(item.timer) : 120,
        })).filter((item) => item.question)

        if (normalized.length !== 6) {
            throw new Error("Interview provider returned incomplete questions.")
        }
        return normalized
    } catch (error) {
        console.log("Interview Agent Parse Error");
        console.log(error);

        const role = data.role || "this role"
        return [
            { question: `Tell us about your experience relevant to ${role}.`, difficulty: "easy", timer: 90 },
            { question: "What are your strongest skills and how have you used them?", difficulty: "easy", timer: 90 },
            { question: `Explain a difficult problem you solved in ${role} work.`, difficulty: "medium", timer: 120 },
            { question: "How do you approach learning a new tool or technology?", difficulty: "medium", timer: 120 },
            { question: `Walk through a real-world ${role} scenario and your solution.`, difficulty: "hard", timer: 180 },
            { question: "What would you improve in your most recent project?", difficulty: "hard", timer: 180 },
        ]
        
    }
}