import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools'; 

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log("Messages are ", messages)

  // TASK 1: Robust Context and System Prompt for CEG Administrative Assistant
  const context = `
    CAMPUS: College of Engineering, Guindy (CEG), Anna University.
    GATES: Main Gate (Sardar Patel Rd) and Kotturpuram Gate.
    TIMINGS: 8:30 AM - 4:30 PM.
    PORTALS: auegov.ac.in (CeGov) for fees/registration.
    HOSTEL: Max 10 days/month mess reduction; requires RC signature.
    EMERGENCY: Health Centre/Ambulance (044-22352257).
  `;

  const systemPrompt = `You are the "CEG Campus Buddy," an expert guide for the College of Engineering Guindy. 
  Provide accurate administrative or campus info using the context, while maintaining a helpful but firm tone.
  Always be crisp and limit your response to exactly 2 sentences at max.
  Following is the context:
  ${context}`;

  const result = streamText({
    model: google('gemini-2.5-flash'), // Note: Ensure you are using a supported version like 'gemini-1.5-flash'
    system: systemPrompt,
    messages: await convertToModelMessages(messages),

    // TODO TASK 2 - Tool Calling
    // tools,            // Uncomment to enable tool calling
    // maxSteps: 5,      // Allow multi-step tool use
  });

  return result.toUIMessageStreamResponse();
}
