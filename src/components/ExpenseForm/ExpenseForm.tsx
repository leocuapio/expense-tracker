// src/components/ExpenseForm/ExpenseForm.tsx
import React, { useState } from 'react';
import './ExpenseForm.css';
import type { ExpenseCategory } from '../ExpenseCard/ExpenseCard';

interface FormErrors {
  description?: string;
  amount?: string;
  category?: string;
  date?: string;
}

// Form data interface
interface ExpenseFormData {
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
}

/**
 * Form component for creating new expense entries with validation
 * @param {Object} props - Component props
 * @param {function} props.onSubmit - Callback function when form is submitted, receives expense data
 */
interface ExpenseFormProps {
  onSubmit: (expenseData: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
  }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  // Form state using controlled components pattern
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });

// UPDATED
const [errors, setErrors] = useState<FormErrors>({});
// UPDATED
// This function validates an expense form and returns whether it's valid
// along with any validation error messages.
const validateExpenseForm = (
  data: ExpenseFormData
): { isValid: boolean; errors: FormErrors } => {
  
  // Create an empty object to hold any validation error messages.
  const validationErrors: FormErrors = {};

  // 1. Check if the description is missing or just whitespace.
  if (!data.description.trim()) {
    validationErrors.description = 'Description is required';
  }

  // 2. Convert the "amount" string into a number.
  const amount = parseFloat(data.amount);

  // 3. Check if the amount is invalid (NaN) or less than/equal to zero.
  if (isNaN(amount) || amount <= 0) {
    validationErrors.amount = 'Amount must be a positive number';
  }

  // 4. Check if a category was not selected.
  if (!data.category) {
    validationErrors.category = 'Category is required';
  }

  // 5. Check if a date was not provided.
  if (!data.date) {
    validationErrors.date = 'Date is required';
  }

  // 6. Return:
  //    - isValid: true if no errors were added, false otherwise
  //    - errors: the object containing any validation messages
  return {
    isValid: Object.keys(validationErrors).length === 0,
    errors: validationErrors
  };
};


  // UPDATED
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    // Destructure the "name" and "value" from the input or select element
    const { name, value } = e.target;
  
    // 1. Update the form data state
    setFormData(prev => ({
      ...prev,        // keep all previous fields the same
      [name]: value   // update just the field that changed
    }));
  
    // 2. Clear error for this field (if it exists)
    // "errors" is an object like { description?: string, amount?: string, ... }
    // "name" comes from the input, but TypeScript only knows it's a string.
    // "name as keyof FormErrors" tells TypeScript: "trust me, this matches a key in FormErrors".
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,          // keep all existing errors
        [name]: undefined // clear error message for the changed field
      }));
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    /// UPDATED: Run the centralized validation function on the form data.
    // This checks each field (description, amount, category, date) 
    // and returns an object with `isValid` (true/false) and `errors` (field-specific error messages).
    const validation = validateExpenseForm(formData);
    
    // UPDATED: If the form is invalid...
    if (!validation.isValid) {
      // ...store the error messages in React state.
      // Each field can then display its own error message in the UI.
      // Example: errors.amount = "Amount must be a positive number"
      setErrors(validation.errors);
      return; // stop submission
    }
    
    // UPDATED: If the form passed validation, clear out any old errors
    // so the UI no longer shows them.
    setErrors({});
    
    // UPDATED: Now that the data is guaranteed valid, safely submit it.
    // - `description.trim()` removes extra whitespace
    // - `parseFloat(formData.amount)` ensures amount is a number
    onSubmit({
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    });
    
    // Reset form back to its initial state so the user has a clean slate.
    // - Clear description/amount
    // - Reset category to default ("Food")
    // - Reset date to today (formatted as YYYY-MM-DD)
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
 };

  return (
    <form className="bg-white rounded-lg p-6 sm:p-4 xs:p-3 mb-8 shadow-sm border border-gray-200" onSubmit={handleSubmit}>
      <h3 className='text-xl fond-bold text-gray-900 mb-5'>Add New Expense</h3>
      <div className="mb-4">
        <label className = "block text-sm font-medium text-gray-700 mb-1.5" htmlFor="description">Description *</label>
       
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What did you spend money on?"
          className={`w-full px-3 py-2.5 rounded-md text-sm sm:text-base bg-white text-gray-700 
            placeholder-gray-400
            border transition-colors duration-200
            focus:outline-none focus:ring-2
            ${errors.description 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-10" 
              : "border-gray-300 hover:border-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 focus:ring-opacity-10"}`}

        />


        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

        <div className="mb-4">
        <label className = "block text-sm font-medium text-gray-700 mb-1.5" htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-3 py-2.5 rounded-md text-sm sm:text-base bg-white text-gray-700 
              placeholder-gray-400
              border transition-colors duration-200
              focus:outline-none focus:ring-2
              ${errors.description 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-10" 
                : "border-gray-300 hover:border-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 focus:ring-opacity-10"}`}
  
          />

          {errors.amount && <span className="text-red-500 text-xs mt-1">{errors.amount}</span>}
        </div>

        <div className="mb-4">
        <label className = "block text-sm font-medium text-gray-700 mb-1.5" htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}

            className={`w-full px-3 py-2.5 rounded-md text-sm sm:text-base bg-white text-gray-700 
              placeholder-gray-400
              border transition-colors duration-200
              focus:outline-none focus:ring-2
              ${errors.description 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-10" 
                : "border-gray-300 hover:border-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 focus:ring-opacity-10"}`}
  
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>

          {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category}</span>}
        </div>

      <div className="mb-4">
      <label className = "block text-sm font-medium text-gray-700 mb-1.5" htmlFor="date">Date *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className={`w-full px-3 py-2.5 rounded-md text-sm sm:text-base bg-white text-gray-700 
            placeholder-gray-400
            border transition-colors duration-200
            focus:outline-none focus:ring-2
            ${errors.description 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-10" 
              : "border-gray-300 hover:border-indigo-600 focus:border-indigo-600 focus:ring-indigo-600 focus:ring-opacity-10"}`}

        />

        {errors.date && <span className="text-red-500 text-xs mt-1">{errors.date}</span>}
      </div>

      <button type="submit" className="px-4 py-2.5 min-w-[80px] rounded-md text-sm font-medium 
             inline-flex items-center justify-center
             border transition-all duration-200
             bg-indigo-600 text-white border-indigo-600
             hover:bg-indigo-700 hover:border-indigo-700 hover:-translate-y-0.5
             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;