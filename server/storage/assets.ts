import { eq } from "drizzle-orm";
import { db } from "../db";
import { assets, assetTransfers } from "@shared/schema";
import type { Asset, InsertAsset, AssetTransfers, InsertAssetTransfers } from "@shared/schema";
import crypto from "crypto";

export class AssetStorage {
  async getAssets(): Promise<Asset[]> {
    return await db.select().from(assets);
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    const result = await db.select().from(assets).where(eq(assets.id, id));
    return result[0];
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const id = crypto.randomUUID();
    const assetWithId = { ...asset, id };
    const result = await db.insert(assets).values(assetWithId).returning();
    return result[0];
  }

  async updateAsset(id: string, asset: Partial<InsertAsset>): Promise<Asset | undefined> {
    const result = await db.update(assets).set(asset).where(eq(assets.id, id)).returning();
    return result[0];
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAssetTransfers(): Promise<AssetTransfers[]> {
    return await db.select().from(assetTransfers);
  }

  async getAssetTransfer(id: string): Promise<AssetTransfers | undefined> {
    const result = await db.select().from(assetTransfers).where(eq(assetTransfers.id, id));
    return result[0];
  }

  async createAssetTransfer(transfer: InsertAssetTransfers): Promise<AssetTransfers> {
    const id = crypto.randomUUID();
    const transferWithId = { ...transfer, id };
    const result = await db.insert(assetTransfers).values(transferWithId).returning();
    return result[0];
  }

  async updateAssetTransfer(id: string, transfer: Partial<InsertAssetTransfers>): Promise<AssetTransfers | undefined> {
    const result = await db.update(assetTransfers).set(transfer).where(eq(assetTransfers.id, id)).returning();
    return result[0];
  }

  async deleteAssetTransfer(id: string): Promise<boolean> {
    const result = await db.delete(assetTransfers).where(eq(assetTransfers.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
