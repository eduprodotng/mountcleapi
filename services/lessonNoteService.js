import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function waitForRetry(attempt) {
  const delay = Math.min(1000 * 2 ** attempt, 30000); // Exponential backoff
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function generateLessonNoteContent(topic, className, subject) {
  // const messages = [
  //   {
  //     role: "user",
  //     content: `
  //     Generate a detailed lesson note for the following:
  //     - Topic: ${topic}
  //     - Class: ${className}
  //     - Subject: ${subject}

  //     Include:
  //     - Objectives
  //     - Introduction
  //     - Lesson Body with Subtopics
  //     - Conclusion
  //     - Assignments or Questions for Students
  //     `,
  //   },
  // ];

  const messages = [
    {
      role: "user",
      content: `
      Generate a detailed lesson note for the following:
      - Topic: ${topic}
      - Class: ${className}
      - Subject: ${subject}

      Please ensure that each section is fully developed with detailed explanations and examples:
      1. **Objectives:** List specific, measurable objectives that students should achieve by the end of the lesson.
      2. **Introduction:** Provide a thorough introduction to the topic, explaining why it's important for students to learn this subject.
      3. **Lesson Body with Subtopics:** Break down the lesson into several key subtopics. Each subtopic should include:
         - A detailed explanation of the concept.
         - Examples where applicable.
         - A real-world connection or application of the topic.
      4. **Conclusion:** Summarize the key points of the lesson and highlight how students can apply their new knowledge.
      5. **Assignments or Questions for Students:** Provide a set of thought-provoking questions or assignments related to the lesson content.

      Make sure the lesson body includes detailed explanations for each subtopic, real-world examples, and practical exercises where appropriate.
      `,
    },
  ];

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
      });

      const lessonNoteContent = response.choices[0].message.content.trim();
      return lessonNoteContent;
    } catch (error) {
      if (error.status === 429) {
        console.warn("Rate limit exceeded. Retrying...");
        await waitForRetry(attempt);
      } else {
        console.error("Error in generateLessonNoteContent:", error);
        throw new Error("Failed to generate lesson note content");
      }
    }
  }
  throw new Error("Max retries exceeded");
}
