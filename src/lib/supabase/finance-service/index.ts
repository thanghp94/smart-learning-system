
import { financeService as baseFinanceService } from '../finance-service';
import { receiptTemplateService } from './receipt-template-service';

// Create a combined finance service with receipt template methods
export const financeService = {
  ...baseFinanceService,
  ...receiptTemplateService
};

export default financeService;
