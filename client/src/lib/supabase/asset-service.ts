import { fetchAll, fetchById, insert, update, remove } from './base-service';
import { Asset, AssetTransfer } from '@/lib/types';

class AssetService {
  async getAll() {
    return fetchAll<Asset>('assets');
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
      const response = await fetch(`/api/assets?ownerType=${ownerType}&ownerId=${ownerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assets by owner');
      }
      return await response.json() as Asset[];
    } catch (error) {
      console.error(`Error fetching assets for ${ownerType} ${ownerId}:`, error);
      throw error;
    }
  }

  async getTransfersByAssetId(assetId: string) {
    try {
      const response = await fetch(`/api/asset-transfers?assetId=${assetId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch asset transfers');
      }
      return await response.json() as AssetTransfer[];
    } catch (error) {
      console.error('Error fetching asset transfers:', error);
      throw error;
    }
  }

  async createTransfer(transfer: Partial<AssetTransfer>) {
    try {
      const response = await fetch('/api/asset-transfers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transfer),
      });
      if (!response.ok) {
        throw new Error('Failed to create asset transfer');
      }
      return await response.json() as AssetTransfer;
    } catch (error) {
      console.error('Error creating asset transfer:', error);
      throw error;
    }
  }
}

export const assetService = new AssetService();