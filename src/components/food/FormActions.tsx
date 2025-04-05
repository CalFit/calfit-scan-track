
import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, onSubmit }) => {
  return (
    <div className="pt-4 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="calfit-button-secondary flex-1"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="calfit-button-primary flex-1"
      >
        Ajouter
      </button>
    </div>
  );
};

export default FormActions;
