
import { supabase } from '../client';
import { Finance } from '@/lib/types';
import { format } from 'date-fns';

export const ledgerService = {
  /**
   * Get transactions grouped by month for ledger view
   */
  async getLedgerTransactions() {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('ngay', { ascending: false });
      
      if (error) throw error;
      
      // Process data for ledger format - group by month
      const groupedData = groupTransactionsByMonth(data as Finance[]);
      
      return groupedData;
    } catch (error) {
      console.error('Error fetching ledger transactions:', error);
      throw error;
    }
  },
  
  /**
   * Get ledger data for a specific period
   */
  async getLedgerForPeriod(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .gte('ngay', startDate)
        .lte('ngay', endDate)
        .order('ngay', { ascending: true });
      
      if (error) throw error;
      
      return groupTransactionsByMonth(data as Finance[]);
    } catch (error) {
      console.error('Error fetching ledger for period:', error);
      throw error;
    }
  }
};

/**
 * Helper function to group transactions by month
 */
function groupTransactionsByMonth(finances: Finance[]) {
  const groupedFinances: Record<string, Finance[]> = {};
  
  finances.forEach(finance => {
    if (!finance.ngay) return;
    
    const date = new Date(finance.ngay);
    const monthYear = format(date, 'MM/yyyy');
    
    if (!groupedFinances[monthYear]) {
      groupedFinances[monthYear] = [];
    }
    
    groupedFinances[monthYear].push(finance);
  });
  
  return groupedFinances;
}
