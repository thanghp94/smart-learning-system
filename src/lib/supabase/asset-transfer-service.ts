
import { AssetTransfer, Asset } from '../types';
import { fetchAll, fetchById, insert, update, remove, logActivity } from './base-service';
import { supabase } from './client';
import { assetService } from './asset-service';

export const assetTransferService = {
  getAll: () => fetchAll<AssetTransfer>('asset_transfers'),
  getById: (id: string) => fetchById<AssetTransfer>('asset_transfers', id),
  
  create: async (transfer: Partial<AssetTransfer>): Promise<AssetTransfer> => {
    // Validate transfer data
    if (!transfer.asset_id || !transfer.source_type || !transfer.source_id || 
        !transfer.destination_type || !transfer.destination_id || !transfer.quantity) {
      throw new Error('Thiếu thông tin chuyển tài sản');
    }
    
    // Get current asset
    const asset = await assetService.getById(transfer.asset_id);
    if (!asset) {
      throw new Error('Không tìm thấy tài sản');
    }
    
    // Check if there's enough quantity to transfer
    if (asset.so_luong < transfer.quantity) {
      throw new Error(`Không đủ số lượng tài sản "${asset.ten_CSVC}" để chuyển`);
    }
    
    // Begin transaction
    const { data, error } = await supabase.rpc('create_asset_transfer', {
      asset_id_param: transfer.asset_id,
      source_type_param: transfer.source_type,
      source_id_param: transfer.source_id,
      destination_type_param: transfer.destination_type,
      destination_id_param: transfer.destination_id,
      quantity_param: transfer.quantity,
      status_param: transfer.status || 'pending',
      notes_param: transfer.notes || '',
      transfer_date_param: transfer.transfer_date || new Date().toISOString().split('T')[0]
    });
    
    if (error) {
      console.error('Error creating asset transfer:', error);
      throw error;
    }
    
    // Log activity
    await logActivity(
      'Tạo mới', 
      'Chuyển tài sản', 
      `Chuyển ${transfer.quantity} ${asset.ten_CSVC}`, 
      'Hệ thống',
      transfer.status
    );
    
    return data as AssetTransfer;
  },
  
  // Same method but with different name for compatibility
  createTransfer: async (transfer: Partial<AssetTransfer>): Promise<AssetTransfer> => {
    return assetTransferService.create(transfer);
  },
  
  update: async (id: string, updates: Partial<AssetTransfer>): Promise<AssetTransfer> => {
    // If status is being updated to 'completed', update the asset quantities
    if (updates.status === 'completed') {
      const transfer = await fetchById<AssetTransfer>('asset_transfers', id);
      if (!transfer) {
        throw new Error('Không tìm thấy giao dịch chuyển tài sản');
      }
      
      if (transfer.status === 'completed') {
        throw new Error('Giao dịch đã được hoàn thành trước đó');
      }
      
      // Get current asset
      const asset = await assetService.getById(transfer.asset_id);
      if (!asset) {
        throw new Error('Không tìm thấy tài sản');
      }
      
      // Verify still enough quantity
      if (asset.so_luong < transfer.quantity) {
        throw new Error(`Không đủ số lượng tài sản "${asset.ten_CSVC}" để chuyển`);
      }
      
      // Update the asset with reduced quantity
      await assetService.update(transfer.asset_id, {
        so_luong: asset.so_luong - transfer.quantity
      });
      
      // Log activity
      await logActivity(
        'Hoàn thành', 
        'Chuyển tài sản', 
        `Chuyển ${transfer.quantity} ${asset.ten_CSVC}`, 
        'Hệ thống'
      );
    }
    
    return update<AssetTransfer>('asset_transfers', id, updates);
  },
  
  delete: async (id: string): Promise<void> => {
    const transfer = await fetchById<AssetTransfer>('asset_transfers', id);
    if (!transfer) {
      throw new Error('Không tìm thấy giao dịch chuyển tài sản');
    }
    
    // Only allow deleting pending transfers
    if (transfer.status === 'completed') {
      throw new Error('Không thể xóa giao dịch đã hoàn thành');
    }
    
    await remove('asset_transfers', id);
    
    // Log activity
    await logActivity(
      'Xóa', 
      'Chuyển tài sản', 
      `Hủy chuyển tài sản`, 
      'Hệ thống'
    );
  },
  
  // Get transfers by asset
  getByAsset: async (assetId: string): Promise<AssetTransfer[]> => {
    const { data, error } = await supabase
      .from('asset_transfers')
      .select('*')
      .eq('asset_id', assetId);
    
    if (error) {
      console.error('Error fetching transfers by asset:', error);
      throw error;
    }
    
    return data as AssetTransfer[];
  },
  
  // Alternate method name for compatibility
  getTransfersByAssetId: async (assetId: string): Promise<AssetTransfer[]> => {
    return assetTransferService.getByAsset(assetId);
  },
  
  // Get transfers by source
  getBySource: async (sourceType: string, sourceId: string): Promise<AssetTransfer[]> => {
    const { data, error } = await supabase
      .from('asset_transfers')
      .select('*')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);
    
    if (error) {
      console.error('Error fetching transfers by source:', error);
      throw error;
    }
    
    return data as AssetTransfer[];
  },
  
  // Get transfers by destination
  getByDestination: async (destType: string, destId: string): Promise<AssetTransfer[]> => {
    const { data, error } = await supabase
      .from('asset_transfers')
      .select('*')
      .eq('destination_type', destType)
      .eq('destination_id', destId);
    
    if (error) {
      console.error('Error fetching transfers by destination:', error);
      throw error;
    }
    
    return data as AssetTransfer[];
  },
  
  // Approve and process a transfer
  approveTransfer: async (id: string): Promise<AssetTransfer> => {
    return update<AssetTransfer>('asset_transfers', id, { status: 'completed' });
  },
  
  // Reject a transfer
  rejectTransfer: async (id: string, reason: string): Promise<AssetTransfer> => {
    return update<AssetTransfer>('asset_transfers', id, { 
      status: 'rejected', 
      notes: reason 
    });
  }
};
