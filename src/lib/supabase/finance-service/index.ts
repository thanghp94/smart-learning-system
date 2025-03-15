
import { supabase } from '../client';
import { financeService as baseFinanceService } from '../finance-service';
import { receiptTemplateService } from './receipt-template-service';
import { receiptService } from './receipt-service';
import { transactionService } from './transaction-service';
import { ledgerService } from './ledger-service';
import { enrollmentFinanceService } from './enrollment-finance-service';
import { assetFinanceService } from './asset-finance-service';

// Create a combined service with all the methods
export const financeService = {
  ...baseFinanceService,
  ...receiptTemplateService,
  ...receiptService,
  ...transactionService,
  ...ledgerService,
  ...enrollmentFinanceService,
  ...assetFinanceService,
};

export default financeService;
