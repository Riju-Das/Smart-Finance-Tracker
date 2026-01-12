import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface Category{
  id:string;
  name: string;
}

export async function categorizeTransactions(descriptions:string[], categories: Category[]): Promise<string[]>{
  try{
    const model = genAI.getGenerativeModel({model:"gemini-2.5-flash"});


    const categoryList = categories.map(c=>c.name).join(', ');



    const prompt = `You are a financial transaction categorizer.
    Available categories: ${categoryList}
    Categorize these transaction descriptions. Return ONLY a JSON array of category names (one per transaction, in the same order):
    ${descriptions.map((desc,i)=>`${i + 1}. ${desc}`).join('\n')}
    Rules:
    - Return exact category names from the list
    - If unsure, pick the most logical category
    -One category per transaction
    -Return valid JSON array only
    Example: ["Grocery", "Transportation", "Dining]`;



    const results = await model.generateContent(prompt);

    const response = results.response.text();

    const jsonMatch = response.match(/\[.*\]/s);

    if(!jsonMatch){
      throw new Error('Invalid response format');
    }


    const categoryNames: string[] = JSON.parse(jsonMatch[0]);


    const fallbackCategory = categories.find(c => c.name === "Uncategorized") || categories[0];

    const categoryIds = categoryNames.map(name=>{
      const category = categories.find(cat=>
        cat.name.toLowerCase()===name.toLowerCase());
      return category?.id || fallbackCategory?.id || '';
    })
    return categoryIds;
    
  }

  catch(error){
    console.error('Gemini categorization error:', error);
    return descriptions.map(() => categories[0]?.id || '');
  }

}