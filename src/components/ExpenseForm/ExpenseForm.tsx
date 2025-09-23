// src/components/ExpenseForm/ExpenseForm.tsx
import React, { useState } from 'react';
import './ExpenseForm.css';
import type { ExpenseCategory } from '../ExpenseCard/ExpenseCard';
import './ExpenseForm.css';

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
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Add New Expense</h3>
      
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What did you spend money on?"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;