
import { supabase } from './client';
import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Asset, AssetTransfer } from '@/lib/types';

class AssetService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Asset[];
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }

  async getById(id: string) {
    return fetchById<Asset>('assets', id);
  }

  async create(asset: Partial<Asset>) {
    return insert<Asset>('assets', asset);
  }

  async update(id: string, updates: Partial<Asset>) {
    return update<Asset>('assets', id, updates);
  }

  async delete(id: string) {
    return remove('assets', id);
  }

  async getByOwner(ownerType: string, ownerId: string) {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('doi_tuong', ownerType)
        .eq('doi_tuong_id', ownerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Asset[];
    } catch (error) {
      console.error(`Error fetching assets for ${ownerType} ${ownerId}:`, error);
      throw error;
    }
  }

  // Add the missing method
  async getByFacility(facilityId: string) {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('facility_id', facilityId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Asset[];
    } catch (error) {
      console.error(`Error fetching assets for facility ${facilityId}:`, error);
      throw error;
    }
  }

  async getTransfersByAssetId(assetId: string) {
    try {
      const { data, error } = await supabase
        .from('asset_transfers')
        .select('*')
        .eq('asset_id', assetId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AssetTransfer[];
    } catch (error) {
      console.error('Error fetching asset transfers:', error);
      throw error;
    }
  }

  async createTransfer(transfer: Partial<AssetTransfer>) {
    try {
      const { data, error } = await supabase
        .from('asset_transfers')
        .insert(transfer)
        .select()
        .single();
      
      if (error) throw error;
      return data as AssetTransfer;
    } catch (error) {
      console.error('Error creating asset transfer:', error);
      throw error;
    }
  }
}

export const assetService = new AssetService();
