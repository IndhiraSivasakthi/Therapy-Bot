import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  const cleanedInput = input.toLowerCase();

  let reply = "🧠 I'm here to listen. Please tell me more.";

  if (cleanedInput.includes("sad") || cleanedInput.includes("unhappy") || cleanedInput.includes("depressed") || cleanedInput.includes("upset")) {
    reply = "😔 I'm really sorry you're feeling this way. Want to talk about what’s making you feel down?";
  } else if (cleanedInput.includes("lonely") || cleanedInput.includes("alone") || cleanedInput.includes("isolated")) {
    reply = "🤗 You’re not alone. I’m here with you. Would you like to share more about it?";
  } else if (cleanedInput.includes("anxious") || cleanedInput.includes("nervous") || cleanedInput.includes("worried") || cleanedInput.includes("panic")) {
    reply = "🧘 Take a deep breath. I'm here with you. Want to share what’s making you feel anxious?";
  } else if (cleanedInput.includes("angry") || cleanedInput.includes("mad") || cleanedInput.includes("frustrated")) {
    reply = "😡 It's okay to feel angry sometimes. Want to talk about what triggered it?";
  } else if (cleanedInput.includes("stressed") || cleanedInput.includes("pressure") || cleanedInput.includes("overwhelmed")) {
    reply = "😣 That sounds tough. Want to talk about what’s causing the stress?";
  } else if (cleanedInput.includes("happy") || cleanedInput.includes("excited") || cleanedInput.includes("joyful")) {
    reply = "😊 That's wonderful! I'm so happy to hear that. What's been going well for you?";
  } else if (cleanedInput.includes("tired") || cleanedInput.includes("exhausted") || cleanedInput.includes("sleepy")) {
    reply = "😴 Sounds like you need some rest. Have you been sleeping okay?";
  } else if (cleanedInput.includes("confused") || cleanedInput.includes("lost")) {
    reply = "🤔 It's okay to feel confused. I'm here if you want to talk through it.";
  } else if (cleanedInput.includes("grateful") || cleanedInput.includes("thankful")) {
    reply = "🙏 Gratitude is powerful! What are you feeling grateful for today?";
  } else if (cleanedInput.includes("motivated") || cleanedInput.includes("productive") || cleanedInput.includes("i need motivation")) {
    reply = "💪 That's awesome! Keep that energy going. What's keeping you inspired?";
  } else if (cleanedInput.includes("i need help sleeping") || cleanedInput.includes("can't sleep") || cleanedInput.includes("insomnia")) {
    reply = "🛌 Trouble sleeping is tough. Want to talk about what's keeping you up at night?";
  }

  return res.status(200).json({ reply });
}
