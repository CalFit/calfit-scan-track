
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UseFormReturn } from "react-hook-form";
import { QuestionnaireFormData } from './types';

interface CleanBulkOptionsProps {
  form: UseFormReturn<QuestionnaireFormData>;
  visible: boolean;
}

const CleanBulkOptions: React.FC<CleanBulkOptionsProps> = ({ form, visible }) => {
  if (!visible) return null;

  return (
    <div className="bg-calfit-blue/5 p-4 rounded-lg mt-4 border border-calfit-blue/20">
      <h3 className="text-sm font-semibold mb-2 text-calfit-blue">Options pour la prise de muscle</h3>
      
      <FormField
        control={form.control}
        name="highCalorieBulk"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Intensité de surplus calorique</FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                onValueChange={(value) => {
                  field.onChange(value === "high");
                }}
                value={field.value ? "high" : "standard"}
                className="flex justify-start"
              >
                <ToggleGroupItem value="standard" variant="outline" className="px-4">
                  Standard (+200 kcal)
                </ToggleGroupItem>
                <ToggleGroupItem value="high" variant="outline" className="px-4">
                  Intensif (+400 kcal)
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
            <FormDescription>
              Choisissez l'intensité du surplus calorique pour votre prise de masse.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CleanBulkOptions;
