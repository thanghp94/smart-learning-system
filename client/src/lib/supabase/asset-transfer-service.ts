
import { fetchAll, fetchById, insert, update } from './base-service';

export const assetTransferService = {
  async getAll() {
    return fetchAll('asset-transfers');
  },
  
  async getById(id: string) {
    return fetchById('asset-transfers', id);
  },
  
  async create(assetTransfer: any) {
    return insert('asset-transfers', assetTransfer);
  },
  
  async approveTransfer(id: string) {
    return update('asset-transfers', id, { status: 'completed' });
  },
  
  async rejectTransfer(id: string, reason: string) {
    return update('asset-transfers', id, { 
      status: 'rejected',
      notes: reason 
    });
  }
};
