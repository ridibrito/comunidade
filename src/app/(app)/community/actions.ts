"use server";

import { simpleChatCompletion } from "@/lib/ai";

export async function askMentora(question: string) {
  const answer = await simpleChatCompletion(
    `Você é a Mentora da Singulari. Responda de forma objetiva: ${question}`
  );
  return answer;
}


