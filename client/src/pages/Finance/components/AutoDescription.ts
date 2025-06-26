
/**
 * Helper utility to auto-generate finance transaction descriptions
 */

export function generateTransactionDescription(
  transactionCategory: string,  // 'thu' or 'chi'
  transactionType: string,      // e.g. 'hoc_phi', 'luong'
  transactionTypeLabel: string, // Human-readable label
  entityName: string            // Name of the entity involved
): string {
  const categoryText = transactionCategory === 'thu' ? 'Thu' : 'Chi';
  
  // If we have all the details, format the full description
  if (transactionCategory && transactionType && entityName) {
    return `${categoryText} ${transactionTypeLabel} ${entityName}`.trim();
  }
  
  // If we're missing the entity name
  if (transactionCategory && transactionType) {
    return `${categoryText} ${transactionTypeLabel}`.trim();
  }
  
  // If we only have the category
  if (transactionCategory) {
    return categoryText;
  }
  
  return '';
}
