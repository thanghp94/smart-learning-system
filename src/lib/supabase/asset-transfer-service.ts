
import { AssetTransfer } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const assetTransferService = {
  getAll: () => fetchAll<AssetTransfer>('asset_transfers'),
  getById: (id: string) => fetchById<AssetTransfer>('asset_transfers', id),
  create: (transfer: Partial<AssetTransfer>) => insert<AssetTransfer>('asset_transfers', transfer),
  update: (id: string, updates: Partial<AssetTransfer>) => update<AssetTransfer>('asset_transfers', id, updates),
  delete: (id: string) => remove('asset_transfers', id),
  
  transferAsset: async (
    assetId: string, 
    sourceType: string, 
    sourceId: string, 
    destinationType: string, 
    destinationId: string, 
    quantity: number, 
    notes?: string
  ): Promise<AssetTransfer> => {
    // Start a transaction
    const transfer: Partial<AssetTransfer> = {
      asset_id: assetId,
      source_type: sourceType,
      source_id: sourceId,
      destination_type: destinationType,
      destination_id: destinationId,
      quantity: quantity,
      transfer_date: new Date().toISOString(),
      status: 'completed',
      notes: notes,
      created_at: new Date().toISOString()
    };
    
    // Create the transfer record
    const newTransfer = await insert<AssetTransfer>('asset_transfers', transfer);
    
    // Update the asset quantity in the source
    // This would require additional logic based on your business rules
    
    return newTransfer;
  }
};
