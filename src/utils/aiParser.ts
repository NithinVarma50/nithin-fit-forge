/**
 * Utility functions for parsing AI-generated text into structured data
 */

export interface StructuredRecipe {
  title: string;
  description: string;
  sections: RecipeSection[];
  totalNutrition: NutritionInfo;
}

export interface RecipeSection {
  title: string;
  ingredients: Ingredient[];
  preparationSteps: PreparationStep[];
  nutritionInfo?: NutritionInfo;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface PreparationStep {
  step: string;
}

export interface NutritionInfo {
  protein: string;
  calories: string;
}

/**
 * Parses AI-generated text into a structured recipe format
 * @param text The AI-generated text to parse
 * @returns A structured recipe object
 */
export function parseRecipeText(text: string): StructuredRecipe {
  // Default structure in case parsing fails
  const defaultRecipe: StructuredRecipe = {
    title: "AI-Generated Recipe",
    description: "A nutritious meal recommendation",
    sections: [
      {
        title: "Main Dish",
        ingredients: [],
        preparationSteps: [],
        nutritionInfo: {
          protein: "0g",
          calories: "0 kcal"
        }
      }
    ],
    totalNutrition: {
      protein: "0g",
      calories: "0 kcal"
    }
  };

  try {
    // Extract title (first line or "Recipe:" section)
    const titleMatch = text.match(/^(.+?)(?:\n|$)/) || text.match(/Recipe:\s*(.+?)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1].trim() : defaultRecipe.title;

    // Extract description (second line or paragraph after title)
    const descLines = text.split('\n').slice(1, 3);
    const description = descLines.join(' ').trim() || defaultRecipe.description;

    // Extract ingredients
    const ingredientsMatch = text.match(/Ingredients:?\s*([\s\S]*?)(?:Instructions|Preparation|Directions|Method|Steps|$)/i);
    const ingredientsText = ingredientsMatch ? ingredientsMatch[1].trim() : "";
    const ingredientLines = ingredientsText.split('\n').filter(line => line.trim() !== '');
    
    const ingredients: Ingredient[] = ingredientLines.map(line => {
      // Try to separate amount from ingredient name
      const match = line.match(/^[-•*]?\s*(?:(\d+[\d\/\s]*(?:g|kg|ml|cups?|tbsp|tsp|oz|pounds?|pieces?|slices?))\s+)?(.+)$/i);
      if (match) {
        return {
          amount: match[1] || "as needed",
          name: match[2].trim()
        };
      }
      return { amount: "as needed", name: line.replace(/^[-•*]\s*/, '').trim() };
    });

    // Extract preparation steps
    const stepsMatch = text.match(/(?:Instructions|Preparation|Directions|Method|Steps):?\s*([\s\S]*?)(?:Nutrition|Notes|Tips|$)/i);
    const stepsText = stepsMatch ? stepsMatch[1].trim() : "";
    const stepLines = stepsText.split('\n').filter(line => line.trim() !== '');
    
    const preparationSteps: PreparationStep[] = stepLines.map(line => ({
      step: line.replace(/^[\d\.\)-]+\s*/, '').trim()
    }));

    // Extract nutrition info - look for patterns with or without asterisks, tildes, and ranges
    const nutritionMatch = text.match(/(?:Nutrition(?:\s*Information)?|Approximate\s*Nutritional\s*Information):?\s*([\s\S]*?)(?:\n\n|$)/i);
    const nutritionText = nutritionMatch ? nutritionMatch[1].trim() : "";
    
    // Enhanced regex to handle ranges (e.g., ~60-65g or 750-800 kcal) and optional asterisks
    const proteinMatch = nutritionText.match(/\*?\*?\s*Protein:?\*?\*?\s*~?(\d+(?:-\d+)?)\s*-?\s*(\d+)?\s*g/i) || 
                         nutritionText.match(/\*?\*?\s*Protein:?\*?\*?\s*~?(\d+[\d\.]*)\s*g/i);
    const caloriesMatch = nutritionText.match(/\*?\*?\s*Calories:?\*?\*?\s*~?(\d+(?:-\d+)?)\s*-?\s*(\d+)?\s*(?:kcal)?/i) || 
                          nutritionText.match(/\*?\*?\s*Calories:?\*?\*?\s*~?(\d+[\d\.]*)\s*(?:kcal)?/i);
    
    // Take the higher value from ranges for bulking goals
    let proteinValue = "0g";
    let caloriesValue = "0 kcal";
    
    if (proteinMatch) {
      const value = proteinMatch[2] ? proteinMatch[2] : proteinMatch[1];
      proteinValue = `${value}g`;
    }
    
    if (caloriesMatch) {
      const value = caloriesMatch[2] ? caloriesMatch[2] : caloriesMatch[1];
      caloriesValue = `${value} kcal`;
    }
    
    const nutritionInfo: NutritionInfo = {
      protein: proteinValue,
      calories: caloriesValue
    };

    // Create the structured recipe
    const mainSection: RecipeSection = {
      title: "Main Dish",
      ingredients,
      preparationSteps,
      nutritionInfo
    };

    return {
      title,
      description,
      sections: [mainSection],
      totalNutrition: nutritionInfo
    };
  } catch (error) {
    console.error("Error parsing recipe text:", error);
    return defaultRecipe;
  }
}

/**
 * Parses AI-generated text into a structured workout format
 * This is a placeholder for future implementation
 */
export function parseWorkoutText(text: string): any {
  // Placeholder for workout parsing logic
  return {
    title: "AI-Generated Workout",
    description: text.split('\n')[0] || "A customized workout plan",
    exercises: []
  };
}

/**
 * Determines the type of AI-generated content and parses it accordingly
 * @param text The AI-generated text to parse
 * @param hint Optional hint about the content type
 * @returns Structured data based on the content type
 */
export function parseAIContent(text: string, hint?: string): any {
  if (!text) return { type: "text", content: "" };
  
  // Determine content type based on text or hint
  if (hint === "recipe" || 
      text.includes("Ingredients:") || 
      text.includes("Instructions:") || 
      text.includes("Preparation:")) {
    return {
      type: "recipe",
      content: parseRecipeText(text)
    };
  } else if (hint === "workout" || 
            text.includes("Exercise:") || 
            text.includes("Sets:") || 
            text.includes("Reps:")) {
    return {
      type: "workout",
      content: parseWorkoutText(text)
    };
  }
  
  // Default to plain text if no specific format is detected
  return {
    type: "text",
    content: text
  };
}