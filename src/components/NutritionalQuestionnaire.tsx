import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Slider
} from "@/components/ui/slider"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  age: z.number().min(18, {
    message: "L'âge doit être supérieur à 18 ans.",
  }).max(100, {
    message: "L'âge doit être inférieur à 100 ans.",
  }),
  sex: z.enum(["male", "female"]),
  height: z.number(),
  currentWeight: z.number().min(30, {
    message: "Le poids doit être supérieur à 30 kg.",
  }).max(200, {
    message: "Le poids doit être inférieur à 200 kg.",
  }),
  targetWeight: z.number(),
  goal: z.enum(["weightLoss", "maintenance", "weightGain", "performance", "generalHealth"]),
  activityLevel: z.enum(["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "superActive"]),
  occupation: z.enum(["sedentaryJob", "moderateJob", "physicalJob"]),
  dietaryHabits: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  foodPreferences: z.string().optional(),
  eatingBehavior: z.string().optional(),
})

const NutritionalQuestionnaire = () => {
  const [page, setPage] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 18,
      sex: "male",
      height: 170,
      currentWeight: 70,
      targetWeight: 70,
      goal: "maintenance",
      activityLevel: "sedentary",
      occupation: "sedentaryJob",
      dietaryHabits: "",
      allergies: [],
      foodPreferences: "",
      eatingBehavior: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const renderPage = () => {
    switch (page) {
      case 0:
        return (
          <>
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Âge</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Sexe</FormLabel>
                    <FormDescription>
                      Êtes-vous un homme ou une femme?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-2"
                    >
                      <FormItem className="space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" id="r1" />
                        </FormControl>
                        <FormLabel htmlFor="r1">Homme</FormLabel>
                      </FormItem>
                      <FormItem className="space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" id="r2" />
                        </FormControl>
                        <FormLabel htmlFor="r2">Femme</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taille (cm)</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      max={220}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poids actuel (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderPage()}
          <div className="flex justify-between">
            {page > 0 && (
              <Button variant="secondary" onClick={() => setPage(page - 1)}>
                Précédent</Button>
            )}
            {page < 1 ? (
              <Button variant="secondary" onClick={() => setPage(page + 1)}>
                Suivant
              </Button>
            ) : (
              <Button type="submit">Soumettre</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NutritionalQuestionnaire;
