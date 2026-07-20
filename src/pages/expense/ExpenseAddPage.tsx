import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseAddForm, ExpenseDetailCard, Receipt, SettlementPreviewCard } from '@/features/expense';
import { mockExpenses } from '@/features/expense/mocks/expense.mock';
import type { Expense } from '@/features/expense/types/expense.types';

interface ExpenseDetailPageProps {
  title?: string;
}

export const ExpenseAddPage = ({ title: _title }: ExpenseDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = !!id;
  const existingExpense = id ? mockExpenses.find((expense) => expense.id === id) : undefined;

  const [savedExpense, setSavedExpense] = useState<Expense | undefined>(existingExpense);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(isEditMode);

  const handleSave = (newExpense: Expense) => {
    setSavedExpense(newExpense);
    setIsSubmitted(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className='flex flex-col items-center mt-[28px] w-full flex-1 min-h-0 bg-gray-50 pb-12'>
      <div className='flex flex-col w-full items-center px-4'> 
        
        <div className='w-full max-w-[1200px] flex flex-col gap-6'>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full'>
            
            <div className='flex flex-col gap-6 w-full'>
              <ExpenseAddForm 
                initialExpense={existingExpense} 
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>

            <div className='flex flex-col gap-6 w-full'>
              {isSubmitted && savedExpense ? (
                <>
                  <ExpenseDetailCard expense={savedExpense} />
                  <Receipt />
                  <SettlementPreviewCard expense={savedExpense} />
                </>
              ) : (
                <SettlementPreviewCard />
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpenseAddPage;