// src/components/ExpenseCard/ExpenseCard.tsx
import React from 'react';
import './ExpenseCard.css';

/*
TYPESCRIPT FEATURE INVENTORY:
Interfaces Found:
1. ExpenseCardProps - defines component contract
2. [Add your findings]

Type Annotations Found:
1. amount: number - ensures currency values are numeric
2. [Add your findings]

Autocomplete Helped:
1. 

Error I Fixed:
1. 
*/

export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Other';

// TypeScript interface defines the structure of props this component expects
// This acts like a contract - any parent component must provide these exact properties
export interface ExpenseCardProps {
  // Required props (must be provided)
  id: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  
  // Optional props (can be provided or not)
  onDelete?: (id: number) => void;    // The ? makes it optional
  highlighted?: boolean;              // Component might be highlighted
  showCategory?: boolean;             // Category display might be hidden
}
/**
 * Displays a single expense item with formatted currency and professional styling
 * @param {Object} props - Component props
 * @param {number} props.id - Unique identifier for the expense entry
 * @param {string} props.description - Human-readable description of the expense
 * @param {number} props.amount - Expense amount in dollars (will be formatted as currency)
 * @param {string} props.category - Expense category for organization and filtering
 * @param {string} props.date - Date when expense occurred (ISO string format)
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  id, 
  description, 
  amount, 
  category, 
  date,
  // Optional props with default values
  highlighted = false,      // Default to false if not provided
  showCategory = true,      // Default to true if not provided
  onDelete                  // Might be undefined
}) => {
  // Format currency for professional display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  // Format date for user-friendly display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }
);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  }
  return (
    <article className={`expense-card ${highlighted} ? 'expense-card--highlighted': ''`}>
      <div className="expense-header">
        <span className="expense-category">{category}</span>
        <time className="expense-date" dateTime={date}>
          {formattedDate}
        </time>
      </div>
      
      <div className="expense-body">
        <h3 className="expense-description">{description}</h3>
        <p className="expense-amount">{formattedAmount}</p>
        {onDelete && (
          <button 
            className="expense-delete" 
            onClick={handleDelete}
            aria-label="Delete expense"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            x
          </button>
        )}
      
      </div>
    </article>
  );
};

export default ExpenseCard;