import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../configs/llm.js";
import roadmapPrompt from "../configs/roadmap.prompt.js";


const roadmapAgent = async (state) => {
    try {
        const resume = state.useResume
            ? {
                skills: state.resume.skills,
                missingSkills: state.resume.missingSkills,
                projects: state.resume.projects,
                experience: state.resume.experience,
                score: state.resume.score,
                suggestedRole: state.resume.suggestedRole,
                recommendations: state.resume.recommendations,
            }
            : null;

        const response = await llm.invoke([
            new SystemMessage(roadmapPrompt),
            new HumanMessage(`
Target Role:
${state.role}

Target Package:
${state.targetPackage}

Resume:
${JSON.stringify(resume, null, 2)}

`)
        ]);

        const content = typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content)
        const jsonText = content
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim()
        const roadmap = JSON.parse(jsonText)
        if (!roadmap.title || !Array.isArray(roadmap.modules) || roadmap.modules.length < 1) {
            throw new Error("Roadmap provider returned invalid data.")
        }

             const capitalize = (value = "") =>
      value.charAt(0).toUpperCase() +
      value.slice(1).toLowerCase();

    roadmap.level = ["Beginner", "Intermediate", "Advanced"].includes(
        capitalize(roadmap.level)
    ) ? capitalize(roadmap.level) : "Intermediate";

    roadmap.targetPackage = String(roadmap.targetPackage || state.targetPackage);
    roadmap.duration = String(roadmap.duration || "12-16 weeks");
    roadmap.title = String(roadmap.title || `${state.role} Learning Roadmap`);
    roadmap.modules = (roadmap.modules || []).slice(0, 15).map((module, index) => {
      const difficulty = capitalize(module.difficulty);
      return {
        title: String(module.title || `Learning Module ${index + 1}`),
        duration: String(module.duration || "1 week"),
        difficulty: ["Easy", "Medium", "Hard"].includes(difficulty) ? difficulty : "Medium",
        description: String(module.description || "Build practical skills through focused study and hands-on practice."),
      }
    });

    if (roadmap.modules.length < 8) {
        throw new Error("Roadmap provider returned too few modules.")
    }

    return {
        ...state,
        roadmap
    }




    } catch (error) {
        console.log("Roadmap Agent Error");
        console.log(error);
        throw error
    }
}


export default roadmapAgent