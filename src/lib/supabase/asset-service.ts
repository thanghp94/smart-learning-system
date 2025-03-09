
import { Asset, AssetTransfer } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { supabase } from './client';

export const assetService = {
  getAll: () => fetchAll<Asset>('assets'),
  getById: (id: string) => fetchById<Asset>('assets', id),
  create: (asset: Partial<Asset>) => insert<Asset>('assets', asset),
  update: (id: string, updates: Partial<Asset>) => update<Asset>('assets', id, updates),
  delete: (id: string) => remove('assets', id),
  getByOwner: async (ownerType: string, ownerId: string): Promise<Asset[]> => {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('doi_tuong', ownerType)
      .eq('doi_tuong_id', ownerId);
    
    if (error) {
      console.error('Error fetching assets by owner:', error);
      throw error;
    }
    
    return data as Asset[];
  },
  // Add the missing method to get transfers by asset ID
  getTransfersByAssetId: async (assetId: string): Promise<AssetTransfer[]> => {
    const { data, error } = await supabase
      .from('asset_transfers')
      .select('*')
      .eq('asset_id', assetId);
    
    if (error) {
      console.error('Error fetching transfers by asset ID:', error);
      throw error;
    }
    
    return data as AssetTransfer[];
  }
};
