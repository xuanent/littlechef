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
  const data = await req.json();
  console.log('Received data:', data);
  console.log('Received ingredientNames:', data.ingredientNames);

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'No ingredients provided' }, { status: 400 });
  }
  
  const ingredientsString = data.ingredientNames.join(', ');
  console.log('Formatted ingredients:', ingredientsString);

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
          content: `I have the following ingredients: ${ingredientsString}. Can you suggest 5 meal ideas with 3-4 lines of how to make it? Give me the information directly without any introductory sentences but sound friendly. Each meal idea should be separated by a new line but each meal idea should be given in a continuous line with this format "[index]. [name]: [description]".`,
        },
      ],
    });

    console.log(completion.choices[0].message.content);

    const mealIdeas = completion.choices[0].message.content;
    return NextResponse.json({ mealIdeas });
    
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({ error: 'Failed to generate meal ideas' }, { status: 500 });
  }
}