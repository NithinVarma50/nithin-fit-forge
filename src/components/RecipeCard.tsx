import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Ingredient {
  name: string;
  amount: string;
}

interface PreparationStep {
  step: string;
}

interface NutritionInfo {
  protein: string;
  calories: string;
}

interface RecipeSection {
  title: string;
  ingredients: Ingredient[];
  preparationSteps: PreparationStep[];
  nutritionInfo?: NutritionInfo;
}

interface RecipeCardProps {
  title: string;
  description: string;
  sections: RecipeSection[];
  totalNutrition: NutritionInfo;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  description,
  sections,
  totalNutrition
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            
            <div>
              <h4 className="font-medium mb-2">Ingredients:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {section.ingredients.map((ingredient, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Preparation Steps:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                {section.preparationSteps.map((step, idx) => (
                  <li key={idx}>{step.step}</li>
                ))}
              </ol>
            </div>
            
            {section.nutritionInfo && (
              <div>
                <h4 className="font-medium mb-2">Nutrition Information:</h4>
                <p>Protein: {section.nutritionInfo.protein} | Calories: {section.nutritionInfo.calories}</p>
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-2">Total Nutritional Information</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Calories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section, idx) => section.nutritionInfo && (
                <TableRow key={idx}>
                  <TableCell>{section.title}</TableCell>
                  <TableCell>{section.nutritionInfo.protein}</TableCell>
                  <TableCell>{section.nutritionInfo.calories}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell>{totalNutrition.protein}</TableCell>
                <TableCell>{totalNutrition.calories}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;