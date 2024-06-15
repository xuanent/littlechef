import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  throw new Error("Missing OpenAI Key");
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const ingredients = await req.json();
  console.log('Received ingredientNames:', ingredients);


  if (!ingredients || ingredients.length === 0) {
    return NextResponse.json({ error: 'No ingredients provided' }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides meal ideas based on ingredients.',
        },
        {
          role: 'user',
          content: `I have the following ingredients: ${ingredients}. Can you suggest 5 meal ideas?`,
        },
      ],
      response_format: { type: "json_object" },

    });

    console.log(completion.choices[0].message.content);

    // const mealIdeas = response.choices[0].message?.content;
    // return NextResponse.json({ mealIdeas });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({ error: 'Failed to generate meal ideas' }, { status: 500 });
  }
}