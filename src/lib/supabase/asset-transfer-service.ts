
import { AssetTransfer } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';
import { assetService } from './asset-service';
import { logActivity } from './base-service';

export const assetTransferService = {
  getAll: () => fetchAll<AssetTransfer>('asset_transfers'),
  getById: (id: string) => fetchById<AssetTransfer>('asset_transfers', id),
  create: async (transfer: Partial<AssetTransfer>) => {
    // Get the asset to be transferred
    const asset = await assetService.getById(transfer.asset_id!);
    
    if (!asset) {
      throw new Error('Asset not found');
    }
    
    // Check if there are enough assets to transfer
    if (asset.so_luong < transfer.quantity!) {
      throw new Error('Not enough assets to transfer');
    }
    
    // Start a transaction
    const { data: newTransfer, error: transferError } = await supabase
      .from('asset_transfers')
      .insert({
        asset_id: transfer.asset_id,
        source_type: transfer.source_type,
        source_id: transfer.source_id,
        destination_type: transfer.destination_type,
        destination_id: transfer.destination_id,
        quantity: transfer.quantity,
        transfer_date: transfer.transfer_date,
        status: transfer.status || 'pending',
        notes: transfer.notes
      })
      .select()
      .single();
    
    if (transferError) {
      console.error('Error creating asset transfer:', transferError);
      throw transferError;
    }
    
    // Update the asset quantity
    await assetService.update(asset.id, {
      so_luong: asset.so_luong - transfer.quantity!
    });
    
    // Log the activity
    await logActivity(
      'Chuyển',
      'CSVC',
      asset.ten_CSVC,
      'Nhân viên system',
      'completed'
    );
    
    return newTransfer as AssetTransfer;
  },
  update: async (id: string, updates: Partial<AssetTransfer>) => {
    const currentTransfer = await fetchById<AssetTransfer>('asset_transfers', id);
    
    if (!currentTransfer) {
      throw new Error('Transfer not found');
    }
    
    // If updating the status to 'completed' and it was 'pending' before
    if (updates.status === 'completed' && currentTransfer.status === 'pending') {
      // Get the asset
      const asset = await assetService.getById(currentTransfer.asset_id);
      
      if (!asset) {
        throw new Error('Asset not found');
      }
      
      // Create a new asset record for the destination if it doesn't exist
      // This is a simplified approach - you might want to check if the asset already exists at the destination
      if (currentTransfer.destination_type === 'facility') {
        // Find if the asset exists at the destination facility
        const { data: existingAssets } = await supabase
          .from('assets')
          .select()
          .eq('ten_CSVC', asset.ten_CSVC)
          .eq('doi_tuong', 'facility')
          .eq('doi_tuong_id', currentTransfer.destination_id);
        
        if (existingAssets && existingAssets.length > 0) {
          // Update existing asset
          await assetService.update(existingAssets[0].id, {
            so_luong: existingAssets[0].so_luong + currentTransfer.quantity
          });
        } else {
          // Create new asset at destination
          await assetService.create({
            ...asset,
            id: undefined, // Remove id to create a new record
            doi_tuong: 'facility',
            doi_tuong_id: currentTransfer.destination_id,
            so_luong: currentTransfer.quantity,
            trang_thai_so_huu: 'owned'
          });
        }
      }
    }
    
    return update<AssetTransfer>('asset_transfers', id, updates);
  },
  delete: (id: string) => remove('asset_transfers', id),
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
  }
};
