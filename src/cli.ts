import inquirer from "inquirer";
import fetch from "node-fetch";
import fs from "fs/promises";

const responses = await inquirer.prompt([{
   type: "list",
   name: "language",
   message: "What language would you like to use?",
   choices: [
      "Java",
      "JavaScript",
      "TypeScript",
      "Python",
      "C++",
      "Kotlin",
      "Swift",
   ]
}, {
   type: "list",
   name: "difficulty",
   message: "What is your level?",
   choices: [
      "Beginner",
      "Intermediate",
      "Advanced",
   ]
}, {
   type: "checkbox",
   name: "topics",
   message: "What kind of questions would you like to work on?",
   choices: [
      "Arrays",
      "Linked lists",
      "Trees",
      "Graphs",
      "Data Structures",
      "Dynamic programming",
      "Math",
      "Bit manipulation",
   ]
}, {
   type: "input",
   name: "duration",
   message: "How long do you plan to work on these skills? (e.g. 4 weeks/3 months)",
}, {
   type: "input",
   name: "perDay",
   message: "How much time do you have each day to work on questions? (e.g. 30 minutes/2 hours)",
}]);

const llmPrompt = `
I am a student who would like to use ${responses.language} to practice these
topics on Leetcode: ${responses.topics.join(", ")}. My skill level is
${responses.beginner}, and I have a total of ${responses.duration} to work on
them. I have ${responses.perDay} to work on questions. Create a plan for me.`;

console.log("One moment while I create a plan (the Wi-fi is really slow, so bear with me)...");

const llmResponse = await fetch("https://api.fixie.ai/api/v1/agents/lexwang/fixie-sidekick-template/conversations", {
   method: "POST",
   body: JSON.stringify({
      message: {
         text: llmPrompt
      }
   }),
   headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmaXhpZS5haS9wcm9kIiwiYXVkIjoiaHR0cHM6Ly9maXhpZS5haSIsInN1YiI6IjY1In0.ukPSG7uwW_nXiGiviuuI8A4qwhxrFhGEwAhVokt3L4U',
   }
});

const responseBody = await llmResponse.text();
const lines = responseBody.split("\n");
const output = JSON.parse(lines[lines.length - 2]);

const { outputPath } = await inquirer.prompt({
   type: "input",
   message: "Where should I write the plan?",
   default: "LeetCode plan.md",
   name: "outputPath"
});

const textOutput = output.turns[1].messages.find((chunk: { kind: string; }) => chunk.kind === "text").content;

await fs.writeFile(outputPath, textOutput);