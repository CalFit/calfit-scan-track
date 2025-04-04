
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuestionnaireNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  isLastStep: boolean;
}

const QuestionnaireNavigation: React.FC<QuestionnaireNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep,
  isLastStep,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 0}
        className={cn(
          "flex items-center",
          isMobile ? "text-sm px-3 py-1.5" : ""
        )}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
      </Button>
      
      {currentStep === totalSteps - 1 ? (
        <Button
          type="button"
          onClick={onNextStep}
          className={cn(
            "flex items-center",
            isMobile ? "text-sm px-3 py-1.5" : ""
          )}
        >
          <Save className="mr-1 h-4 w-4" /> Enregistrer tout
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNextStep}
          className={cn(
            "flex items-center",
            isMobile ? "text-sm px-3 py-1.5" : ""
          )}
        >
          {currentStep < totalSteps - 2 ? (
            <>
              Suivant <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Enregistrer <Check className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default QuestionnaireNavigation;
