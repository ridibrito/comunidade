"use server";

import { simpleChatCompletion } from "@/lib/ai";

export async function askCorujinha(question: string) {
  const prefix = "Você é a Corujinha, IA educacional da Singulari. Responda de forma clara e objetiva.";
  const answer = await simpleChatCompletion(`${prefix}\nPergunta: ${question}`);
  return answer;
}


