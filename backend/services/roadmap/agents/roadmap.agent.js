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

        return {
            ...state,
            roadmap: {
                title: `${state.role} Learning Roadmap`,
                targetPackage: state.targetPackage,
                duration: "12-16 weeks",
                level: "Intermediate",
                modules: [
                    { title: "Programming Fundamentals", duration: "1 week", difficulty: "Easy", description: "Review core language syntax, data structures, debugging, and testing." },
                    { title: "Core Tools and Environment", duration: "1 week", difficulty: "Easy", description: "Set up Git, package managers, terminal workflows, and project tooling." },
                    { title: "Role Foundations", duration: "2 weeks", difficulty: "Medium", description: `Learn the foundational technologies required for a ${state.role}.` },
                    { title: "Applied Projects", duration: "3 weeks", difficulty: "Medium", description: "Build portfolio projects that demonstrate practical role-specific skills." },
                    { title: "Advanced Concepts", duration: "2 weeks", difficulty: "Hard", description: "Study scalable architecture, performance, security, and reliability." },
                    { title: "Interview Preparation", duration: "2 weeks", difficulty: "Hard", description: "Practice role-specific interviews, system design, and behavioral scenarios." },
                    { title: "Testing and Quality", duration: "1 week", difficulty: "Medium", description: "Learn testing strategies, code review, debugging, and quality assurance." },
                    { title: "Career Portfolio", duration: "1 week", difficulty: "Easy", description: "Package projects, documentation, and achievements for job applications." },
                ]
            }
        }
    }
}


export default roadmapAgent