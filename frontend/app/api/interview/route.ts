import OpenAI from "openai";
import { NextResponse } from "next/server";

type Msg = { role: "user" | "assistant"; content: string };

const SCRIPT = [
  "What does your business do, and roughly how many people work in it?",
  "Where does your money come from? List your main customers or revenue sources and about how much you bring in each month.",
  "What are your biggest monthly costs? Think payroll, raw materials, rent and software.",
  "Do you have loans or other debt? If so, what are the monthly payments?",
  "How much cash do you have on hand today, and how much would you want to keep as a safety cushion?",
  "What worries you most about the next six months: slow sales, supplier prices, a big bill, or something else?",
  "Last one: what decision are you trying to make, and what would help you make it?",
];
const CLOSING = "Thanks, that gives a clear picture. Next, try the What-if page to test a revenue drop or supplier price rise, and the Cash runway page to see how long your cash lasts. Connect an OpenAI key on the server to have the interviewer adapt its questions to your answers.";

export async function POST(request: Request) {
  try {
    const { messages, summary } = (await request.json()) as { messages?: Msg[]; summary?: string };
    if (!Array.isArray(messages) || messages.length > 40 || messages.some((m) => (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string" || m.content.length > 2000)) {
      return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
    }
    const answers = messages.filter((m) => m.role === "user").length;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ mode: "demo", reply: answers < SCRIPT.length ? SCRIPT[answers] : CLOSING, done: answers >= SCRIPT.length });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const done = answers >= 8;
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.4, max_tokens: 350,
      messages: [
        { role: "system", content: `You are Smart Flow's interviewer, helping a small-business owner describe their finances. Ask exactly one short, plain-language question at a time. Cover business basics, revenue sources, main costs (especially raw materials and payroll), debt payments, cash on hand, and biggest worries. Follow up on vague or surprising answers. Estimates are fine. Never ask for account numbers, passwords or personal identifiers. Do not give tax, legal, investment or lending advice.${done ? " The interview is complete: write a short summary (under 120 words) of what you learned, list what is still unknown, and suggest trying the What-if and Cash runway pages." : " After about 8 answers, wrap up."}${summary ? ` Figures from the user's imported statements (averages): ${summary}` : ""}` },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    return NextResponse.json({ mode: "openai", reply: completion.choices[0]?.message?.content ?? "Could you tell me more?", done });
  } catch {
    return NextResponse.json({ error: "Could not reach the interviewer. Check the server configuration." }, { status: 500 });
  }
}
