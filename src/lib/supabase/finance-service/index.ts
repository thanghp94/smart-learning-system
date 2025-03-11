
import { financeService as baseFinanceService } from '../finance-service';
import { receiptTemplateService } from './receipt-template-service';
import { receiptService } from './receipt-service';
import { transactionService } from './transaction-service';

// Create a combined service with all the methods
export const financeService = {
  ...baseFinanceService,
  ...receiptTemplateService,
  ...receiptService,
  ...transactionService,
};

export default financeService;
