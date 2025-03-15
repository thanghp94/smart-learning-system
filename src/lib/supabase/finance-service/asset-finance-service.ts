
import { supabase } from '../client';
import { Finance } from '@/lib/types';

export const assetFinanceService = {
  // Get finances related to an asset
  async getByAsset(assetId: string): Promise<Finance[]> {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('loai_doi_tuong', 'asset')
        .eq('doi_tuong_id', assetId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Finance[];
    } catch (error) {
      console.error(`Error fetching finances for asset with ID ${assetId}:`, error);
      throw error;
    }
  },
  
  // Create a finance record for an asset
  async createForAsset(
    assetId: string, 
    financeData: Partial<Finance>
  ): Promise<Finance> {
    try {
      // Get asset details first
      const { data: asset, error: assetError } = await supabase
        .from('assets')
        .select('*, facilities:facility_id(ten_co_so)')
        .eq('id', assetId)
        .single();
      
      if (assetError) throw assetError;
      
      // Prepare the finance record with asset data
      const financeRecord: Partial<Finance> = {
        ...financeData,
        loai_doi_tuong: 'asset',
        doi_tuong_id: assetId,
        dien_giai: financeData.dien_giai || `${financeData.loai_thu_chi === 'thu' ? 'Thu' : 'Chi'} - ${financeData.loai_giao_dich || ''} - ${asset.ten_csvc} ${asset.loai ? `(${asset.loai})` : ''}`.trim(),
      };
      
      // Create the finance record
      const { data, error } = await supabase
        .from('finances')
        .insert(financeRecord)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error creating finance for asset with ID ${assetId}:`, error);
      throw error;
    }
  }
};
