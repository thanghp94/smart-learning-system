export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          created_at: string | null
          id: string
          name: string
          status: string | null
          timestamp: string | null
          type: string
          updated_at: string | null
          username: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
          timestamp?: string | null
          type: string
          updated_at?: string | null
          username: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
          timestamp?: string | null
          type?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      asset_transfers: {
        Row: {
          asset_id: string
          created_at: string | null
          destination_id: string
          destination_type: string
          id: string
          notes: string | null
          quantity: number
          source_id: string
          source_type: string
          status: string | null
          transfer_date: string
          updated_at: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          destination_id: string
          destination_type: string
          id?: string
          notes?: string | null
          quantity: number
          source_id: string
          source_type: string
          status?: string | null
          transfer_date: string
          updated_at?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          destination_id?: string
          destination_type?: string
          id?: string
          notes?: string | null
          quantity?: number
          source_id?: string
          source_type?: string
          status?: string | null
          transfer_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_transfers_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "asset_inventory_by_facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_transfers_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          cau_hinh: string | null
          chat_lieu: string | null
          created_at: string | null
          danh_muc: string | null
          doi_tuong: string | null
          doi_tuong_chuyen: string | null
          doi_tuong_id: string | null
          don_vi: string
          ghi_chu: string | null
          hinh_anh: string | null
          hinh_anh_2: string | null
          id: string
          khu_vuc: string | null
          loai: string | null
          mau: string | null
          mo_ta_1: string | null
          ngay_mua: string | null
          ngay_nhap: string | null
          noi_chuyen_toi: string | null
          noi_mua: string | null
          qr_code: string | null
          size: string | null
          so_luong: number | null
          so_luong_chuyen: number | null
          so_seri: string | null
          so_tien_mua: string | null
          ten_csvc: string
          tg_tao: string | null
          thuong_hieu: string | null
          tinh_trang: string | null
          trang_thai_so_huu: string | null
          trang_thai_so_huu_moi: string | null
          updated_at: string | null
        }
        Insert: {
          cau_hinh?: string | null
          chat_lieu?: string | null
          created_at?: string | null
          danh_muc?: string | null
          doi_tuong?: string | null
          doi_tuong_chuyen?: string | null
          doi_tuong_id?: string | null
          don_vi: string
          ghi_chu?: string | null
          hinh_anh?: string | null
          hinh_anh_2?: string | null
          id?: string
          khu_vuc?: string | null
          loai?: string | null
          mau?: string | null
          mo_ta_1?: string | null
          ngay_mua?: string | null
          ngay_nhap?: string | null
          noi_chuyen_toi?: string | null
          noi_mua?: string | null
          qr_code?: string | null
          size?: string | null
          so_luong?: number | null
          so_luong_chuyen?: number | null
          so_seri?: string | null
          so_tien_mua?: string | null
          ten_csvc: string
          tg_tao?: string | null
          thuong_hieu?: string | null
          tinh_trang?: string | null
          trang_thai_so_huu?: string | null
          trang_thai_so_huu_moi?: string | null
          updated_at?: string | null
        }
        Update: {
          cau_hinh?: string | null
          chat_lieu?: string | null
          created_at?: string | null
          danh_muc?: string | null
          doi_tuong?: string | null
          doi_tuong_chuyen?: string | null
          doi_tuong_id?: string | null
          don_vi?: string
          ghi_chu?: string | null
          hinh_anh?: string | null
          hinh_anh_2?: string | null
          id?: string
          khu_vuc?: string | null
          loai?: string | null
          mau?: string | null
          mo_ta_1?: string | null
          ngay_mua?: string | null
          ngay_nhap?: string | null
          noi_chuyen_toi?: string | null
          noi_mua?: string | null
          qr_code?: string | null
          size?: string | null
          so_luong?: number | null
          so_luong_chuyen?: number | null
          so_seri?: string | null
          so_tien_mua?: string | null
          ten_csvc?: string
          tg_tao?: string | null
          thuong_hieu?: string | null
          tinh_trang?: string | null
          trang_thai_so_huu?: string | null
          trang_thai_so_huu_moi?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      attendances: {
        Row: {
          created_at: string | null
          danh_gia_1: number | null
          danh_gia_2: number | null
          danh_gia_3: number | null
          danh_gia_4: number | null
          enrollment_id: string
          ghi_chu: string | null
          id: string
          status: string
          teaching_session_id: string
          thoi_gian_tre: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          danh_gia_1?: number | null
          danh_gia_2?: number | null
          danh_gia_3?: number | null
          danh_gia_4?: number | null
          enrollment_id: string
          ghi_chu?: string | null
          id?: string
          status?: string
          teaching_session_id: string
          thoi_gian_tre?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          danh_gia_1?: number | null
          danh_gia_2?: number | null
          danh_gia_3?: number | null
          danh_gia_4?: number | null
          enrollment_id?: string
          ghi_chu?: string | null
          id?: string
          status?: string
          teaching_session_id?: string
          thoi_gian_tre?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendances_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_teaching_session_id_fkey"
            columns: ["teaching_session_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_teaching_session_id_fkey"
            columns: ["teaching_session_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_avg_score"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_teaching_session_id_fkey"
            columns: ["teaching_session_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          co_so: string | null
          created_at: string | null
          ct_hoc: string | null
          ghi_chu: string | null
          gv_chinh: string | null
          id: string
          ngay_bat_dau: string | null
          ten_lop: string
          ten_lop_full: string
          tg_tao: string | null
          tinh_trang: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          co_so?: string | null
          created_at?: string | null
          ct_hoc?: string | null
          ghi_chu?: string | null
          gv_chinh?: string | null
          id?: string
          ngay_bat_dau?: string | null
          ten_lop: string
          ten_lop_full: string
          tg_tao?: string | null
          tinh_trang?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          co_so?: string | null
          created_at?: string | null
          ct_hoc?: string | null
          ghi_chu?: string | null
          gv_chinh?: string | null
          id?: string
          ngay_bat_dau?: string | null
          ten_lop?: string
          ten_lop_full?: string
          tg_tao?: string | null
          tinh_trang?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_co_so_fkey"
            columns: ["co_so"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_gv_chinh_fkey"
            columns: ["gv_chinh"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          doi_tuong_id: string | null
          email: string | null
          ghi_chu: string | null
          id: string
          khu_vuc_dang_o: string | null
          link_cv: string | null
          mieu_ta: string | null
          ngay_sinh: string | null
          phan_loai: string | null
          sdt: string | null
          ten_lien_he: string
          trang_thai: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doi_tuong_id?: string | null
          email?: string | null
          ghi_chu?: string | null
          id?: string
          khu_vuc_dang_o?: string | null
          link_cv?: string | null
          mieu_ta?: string | null
          ngay_sinh?: string | null
          phan_loai?: string | null
          sdt?: string | null
          ten_lien_he: string
          trang_thai?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doi_tuong_id?: string | null
          email?: string | null
          ghi_chu?: string | null
          id?: string
          khu_vuc_dang_o?: string | null
          link_cv?: string | null
          mieu_ta?: string | null
          ngay_sinh?: string | null
          phan_loai?: string | null
          sdt?: string | null
          ten_lien_he?: string
          trang_thai?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          bo_phan: string | null
          chuc_danh: string | null
          co_so_id: string[] | null
          created_at: string | null
          dia_chi: string | null
          dien_thoai: string | null
          email: string | null
          ghi_chu: string | null
          gioi_tinh: string | null
          hinh_anh: string | null
          id: string
          ngay_sinh: string | null
          ten_nhan_su: string
          ten_tieng_anh: string | null
          tg_tao: string | null
          tinh_trang_lao_dong: string | null
          updated_at: string | null
        }
        Insert: {
          bo_phan?: string | null
          chuc_danh?: string | null
          co_so_id?: string[] | null
          created_at?: string | null
          dia_chi?: string | null
          dien_thoai?: string | null
          email?: string | null
          ghi_chu?: string | null
          gioi_tinh?: string | null
          hinh_anh?: string | null
          id?: string
          ngay_sinh?: string | null
          ten_nhan_su: string
          ten_tieng_anh?: string | null
          tg_tao?: string | null
          tinh_trang_lao_dong?: string | null
          updated_at?: string | null
        }
        Update: {
          bo_phan?: string | null
          chuc_danh?: string | null
          co_so_id?: string[] | null
          created_at?: string | null
          dia_chi?: string | null
          dien_thoai?: string | null
          email?: string | null
          ghi_chu?: string | null
          gioi_tinh?: string | null
          hinh_anh?: string | null
          id?: string
          ngay_sinh?: string | null
          ten_nhan_su?: string
          ten_tieng_anh?: string | null
          tg_tao?: string | null
          tinh_trang_lao_dong?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          buoi_day_id: string | null
          chon_de_danh_gia: boolean | null
          created_at: string | null
          ghi_chu: string | null
          hoc_sinh_id: string
          id: string
          lop_chi_tiet_id: string
          nhan_xet_tieu_chi_1: string | null
          nhan_xet_tieu_chi_2: string | null
          nhan_xet_tieu_chi_3: string | null
          tinh_trang_diem_danh: string | null
          updated_at: string | null
        }
        Insert: {
          buoi_day_id?: string | null
          chon_de_danh_gia?: boolean | null
          created_at?: string | null
          ghi_chu?: string | null
          hoc_sinh_id: string
          id?: string
          lop_chi_tiet_id: string
          nhan_xet_tieu_chi_1?: string | null
          nhan_xet_tieu_chi_2?: string | null
          nhan_xet_tieu_chi_3?: string | null
          tinh_trang_diem_danh?: string | null
          updated_at?: string | null
        }
        Update: {
          buoi_day_id?: string | null
          chon_de_danh_gia?: boolean | null
          created_at?: string | null
          ghi_chu?: string | null
          hoc_sinh_id?: string
          id?: string
          lop_chi_tiet_id?: string
          nhan_xet_tieu_chi_1?: string | null
          nhan_xet_tieu_chi_2?: string | null
          nhan_xet_tieu_chi_3?: string | null
          tinh_trang_diem_danh?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_buoi_day_id_fkey"
            columns: ["buoi_day_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_buoi_day_id_fkey"
            columns: ["buoi_day_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_avg_score"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_buoi_day_id_fkey"
            columns: ["buoi_day_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_hoc_sinh_id_fkey"
            columns: ["hoc_sinh_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "attendances_with_details"
            referencedColumns: ["lop_id"]
          },
          {
            foreignKeyName: "enrollments_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes_with_student_count"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          created_at: string | null
          doi_tuong: string
          email: string | null
          ghi_chu: string | null
          ghi_danh_id: string | null
          han_hoan_thanh: string | null
          hinh_anh: string | null
          id: string
          ngay_cuoi_dot_danh_gia: string | null
          ngay_dau_dot_danh_gia: string | null
          nhan_xet_chi_tiet_1: string | null
          nhan_xet_chi_tiet_2: string | null
          nhan_xet_chi_tiet_3: string | null
          nhan_xet_chi_tiet_4: string | null
          nhan_xet_chi_tiet_5: string | null
          nhan_xet_chi_tiet_6: string | null
          nhan_xet_chi_tiet_7: string | null
          nhan_xet_chung: string | null
          nhan_xet_cua_cap_tren: string | null
          nhan_xet_tong_hop: string | null
          nhanvien_id: string | null
          pdf_dg_hoc_sinh: string | null
          ten_danh_gia: string
          tg_tao: string | null
          tieu_chi_1: string | null
          tieu_chi_2: string | null
          tieu_chi_3: string | null
          tieu_chi_4: string | null
          tieu_chi_5: string | null
          tieu_chi_6: string | null
          tieu_chi_7: string | null
          trang_thai: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          doi_tuong: string
          email?: string | null
          ghi_chu?: string | null
          ghi_danh_id?: string | null
          han_hoan_thanh?: string | null
          hinh_anh?: string | null
          id?: string
          ngay_cuoi_dot_danh_gia?: string | null
          ngay_dau_dot_danh_gia?: string | null
          nhan_xet_chi_tiet_1?: string | null
          nhan_xet_chi_tiet_2?: string | null
          nhan_xet_chi_tiet_3?: string | null
          nhan_xet_chi_tiet_4?: string | null
          nhan_xet_chi_tiet_5?: string | null
          nhan_xet_chi_tiet_6?: string | null
          nhan_xet_chi_tiet_7?: string | null
          nhan_xet_chung?: string | null
          nhan_xet_cua_cap_tren?: string | null
          nhan_xet_tong_hop?: string | null
          nhanvien_id?: string | null
          pdf_dg_hoc_sinh?: string | null
          ten_danh_gia: string
          tg_tao?: string | null
          tieu_chi_1?: string | null
          tieu_chi_2?: string | null
          tieu_chi_3?: string | null
          tieu_chi_4?: string | null
          tieu_chi_5?: string | null
          tieu_chi_6?: string | null
          tieu_chi_7?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          doi_tuong?: string
          email?: string | null
          ghi_chu?: string | null
          ghi_danh_id?: string | null
          han_hoan_thanh?: string | null
          hinh_anh?: string | null
          id?: string
          ngay_cuoi_dot_danh_gia?: string | null
          ngay_dau_dot_danh_gia?: string | null
          nhan_xet_chi_tiet_1?: string | null
          nhan_xet_chi_tiet_2?: string | null
          nhan_xet_chi_tiet_3?: string | null
          nhan_xet_chi_tiet_4?: string | null
          nhan_xet_chi_tiet_5?: string | null
          nhan_xet_chi_tiet_6?: string | null
          nhan_xet_chi_tiet_7?: string | null
          nhan_xet_chung?: string | null
          nhan_xet_cua_cap_tren?: string | null
          nhan_xet_tong_hop?: string | null
          nhanvien_id?: string | null
          pdf_dg_hoc_sinh?: string | null
          ten_danh_gia?: string
          tg_tao?: string | null
          tieu_chi_1?: string | null
          tieu_chi_2?: string | null
          tieu_chi_3?: string | null
          tieu_chi_4?: string | null
          tieu_chi_5?: string | null
          tieu_chi_6?: string | null
          tieu_chi_7?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_ghi_danh_id_fkey"
            columns: ["ghi_danh_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_ghi_danh_id_fkey"
            columns: ["ghi_danh_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_nhanvien_id_fkey"
            columns: ["nhanvien_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          danh_muc_su_kien: string | null
          dia_diem: string | null
          doi_tuong_id: string | null
          ghi_chu: string | null
          hinh_anh: string | null
          id: string
          loai_su_kien: string
          ngay_bat_dau: string
          nhan_su_phu_trach: string[] | null
          ten_su_kien: string
          tg_tao: string | null
          thoi_gian_bat_dau: string | null
          thoi_gian_ket_thuc: string | null
          trang_thai: string | null
          updated_at: string | null
          vi_tri_tuyen_dung: string | null
        }
        Insert: {
          created_at?: string | null
          danh_muc_su_kien?: string | null
          dia_diem?: string | null
          doi_tuong_id?: string | null
          ghi_chu?: string | null
          hinh_anh?: string | null
          id?: string
          loai_su_kien: string
          ngay_bat_dau: string
          nhan_su_phu_trach?: string[] | null
          ten_su_kien: string
          tg_tao?: string | null
          thoi_gian_bat_dau?: string | null
          thoi_gian_ket_thuc?: string | null
          trang_thai?: string | null
          updated_at?: string | null
          vi_tri_tuyen_dung?: string | null
        }
        Update: {
          created_at?: string | null
          danh_muc_su_kien?: string | null
          dia_diem?: string | null
          doi_tuong_id?: string | null
          ghi_chu?: string | null
          hinh_anh?: string | null
          id?: string
          loai_su_kien?: string
          ngay_bat_dau?: string
          nhan_su_phu_trach?: string[] | null
          ten_su_kien?: string
          tg_tao?: string | null
          thoi_gian_bat_dau?: string | null
          thoi_gian_ket_thuc?: string | null
          trang_thai?: string | null
          updated_at?: string | null
          vi_tri_tuyen_dung?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string | null
          dia_chi_co_so: string | null
          email: string | null
          ghi_chu: string | null
          id: string
          loai_co_so: string
          nguoi_chu: string | null
          nguoi_phu_trach: string | null
          phone: string | null
          ten_co_so: string
          tg_tao: string | null
          trang_thai: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dia_chi_co_so?: string | null
          email?: string | null
          ghi_chu?: string | null
          id?: string
          loai_co_so: string
          nguoi_chu?: string | null
          nguoi_phu_trach?: string | null
          phone?: string | null
          ten_co_so: string
          tg_tao?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dia_chi_co_so?: string | null
          email?: string | null
          ghi_chu?: string | null
          id?: string
          loai_co_so?: string
          nguoi_chu?: string | null
          nguoi_phu_trach?: string | null
          phone?: string | null
          ten_co_so?: string
          tg_tao?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_facilities_employees"
            columns: ["nguoi_phu_trach"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          anh: string | null
          co_so_id: string | null
          created_at: string | null
          csvc_id: string | null
          dien_giai: string | null
          doi_tuong_lien_quan: string
          file1: string | null
          file2: string | null
          ghi_chu: string | null
          han_tai_lieu: string | null
          hoc_sinh_id: string | null
          id: string
          id_tai_lieu: string | null
          lan_ban_hanh: string | null
          lien_he_id: string | null
          ngay_cap: string | null
          nhan_vien_id: string | null
          nhom_tai_lieu: string | null
          ten_doi_tuong: string | null
          ten_tai_lieu: string
          tg_tao: string | null
          tinh_trang_han: string | null
          trang_thai: string | null
          updated_at: string | null
        }
        Insert: {
          anh?: string | null
          co_so_id?: string | null
          created_at?: string | null
          csvc_id?: string | null
          dien_giai?: string | null
          doi_tuong_lien_quan: string
          file1?: string | null
          file2?: string | null
          ghi_chu?: string | null
          han_tai_lieu?: string | null
          hoc_sinh_id?: string | null
          id?: string
          id_tai_lieu?: string | null
          lan_ban_hanh?: string | null
          lien_he_id?: string | null
          ngay_cap?: string | null
          nhan_vien_id?: string | null
          nhom_tai_lieu?: string | null
          ten_doi_tuong?: string | null
          ten_tai_lieu: string
          tg_tao?: string | null
          tinh_trang_han?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Update: {
          anh?: string | null
          co_so_id?: string | null
          created_at?: string | null
          csvc_id?: string | null
          dien_giai?: string | null
          doi_tuong_lien_quan?: string
          file1?: string | null
          file2?: string | null
          ghi_chu?: string | null
          han_tai_lieu?: string | null
          hoc_sinh_id?: string | null
          id?: string
          id_tai_lieu?: string | null
          lan_ban_hanh?: string | null
          lien_he_id?: string | null
          ngay_cap?: string | null
          nhan_vien_id?: string | null
          nhom_tai_lieu?: string | null
          ten_doi_tuong?: string | null
          ten_tai_lieu?: string
          tg_tao?: string | null
          tinh_trang_han?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_co_so_id_fkey"
            columns: ["co_so_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_csvc_id_fkey"
            columns: ["csvc_id"]
            isOneToOne: false
            referencedRelation: "asset_inventory_by_facility"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_csvc_id_fkey"
            columns: ["csvc_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_hoc_sinh_id_fkey"
            columns: ["hoc_sinh_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_lien_he_id_fkey"
            columns: ["lien_he_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_nhan_vien_id_fkey"
            columns: ["nhan_vien_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      finances: {
        Row: {
          bang_chu: string | null
          co_so: string | null
          created_at: string | null
          dien_giai: string | null
          doi_tuong_id: string | null
          don_vi: number | null
          file_hoa_don_thu_tien: string | null
          file_in: string | null
          ghi_chu: string | null
          gia_tien: number | null
          hanh_dong: string | null
          id: string
          kieu_thanh_toan: string | null
          loai_doi_tuong: string | null
          loai_thu_chi: string
          muc: string | null
          net: number | null
          ngay: string | null
          nguoi_tao: string | null
          so_luong: number | null
          ten_phi: string | null
          tg_hoan_thanh: string | null
          tg_in: string | null
          tg_tao: string | null
          thoi_gian_phai_tra: string | null
          tinh_trang: string | null
          ton_quy: number | null
          tong_tien: number
          updated_at: string | null
        }
        Insert: {
          bang_chu?: string | null
          co_so?: string | null
          created_at?: string | null
          dien_giai?: string | null
          doi_tuong_id?: string | null
          don_vi?: number | null
          file_hoa_don_thu_tien?: string | null
          file_in?: string | null
          ghi_chu?: string | null
          gia_tien?: number | null
          hanh_dong?: string | null
          id?: string
          kieu_thanh_toan?: string | null
          loai_doi_tuong?: string | null
          loai_thu_chi: string
          muc?: string | null
          net?: number | null
          ngay?: string | null
          nguoi_tao?: string | null
          so_luong?: number | null
          ten_phi?: string | null
          tg_hoan_thanh?: string | null
          tg_in?: string | null
          tg_tao?: string | null
          thoi_gian_phai_tra?: string | null
          tinh_trang?: string | null
          ton_quy?: number | null
          tong_tien: number
          updated_at?: string | null
        }
        Update: {
          bang_chu?: string | null
          co_so?: string | null
          created_at?: string | null
          dien_giai?: string | null
          doi_tuong_id?: string | null
          don_vi?: number | null
          file_hoa_don_thu_tien?: string | null
          file_in?: string | null
          ghi_chu?: string | null
          gia_tien?: number | null
          hanh_dong?: string | null
          id?: string
          kieu_thanh_toan?: string | null
          loai_doi_tuong?: string | null
          loai_thu_chi?: string
          muc?: string | null
          net?: number | null
          ngay?: string | null
          nguoi_tao?: string | null
          so_luong?: number | null
          ten_phi?: string | null
          tg_hoan_thanh?: string | null
          tg_in?: string | null
          tg_tao?: string | null
          thoi_gian_phai_tra?: string | null
          tinh_trang?: string | null
          ton_quy?: number | null
          tong_tien?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finances_co_so_fkey"
            columns: ["co_so"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finances_nguoi_tao_fkey"
            columns: ["nguoi_tao"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          caption: string | null
          created_at: string | null
          doi_tuong: string
          doi_tuong_id: string
          id: string
          image: string | null
          ten_anh: string | null
          tg_tao: string | null
          updated_at: string | null
          video: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          doi_tuong: string
          doi_tuong_id: string
          id?: string
          image?: string | null
          ten_anh?: string | null
          tg_tao?: string | null
          updated_at?: string | null
          video?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          doi_tuong?: string
          doi_tuong_id?: string
          id?: string
          image?: string | null
          ten_anh?: string | null
          tg_tao?: string | null
          updated_at?: string | null
          video?: string | null
        }
        Relationships: []
      }
      payrolls: {
        Row: {
          bhtn_nv: number | null
          bhxh_dn: number | null
          bhxh_nv: number | null
          bhyt_dn: number | null
          bhyt_nv: number | null
          co_so_id: string | null
          cong_chuan: number | null
          cong_thuc_lam: number | null
          created_at: string | null
          id: string
          luong: number | null
          luong_bh: number | null
          nam: string | null
          ngay: string | null
          nhan_su_id: string
          pc_an_o: number | null
          pc_dthoai: number | null
          pc_tnhiem: number | null
          pc_xang_xe: number | null
          tg_tao: string | null
          thang: string | null
          tong_bh_dn_tra: number | null
          tong_bh_nv: number | null
          tong_chi_dn: number | null
          tong_luong_theo_gio: number | null
          tong_luong_thuc_te: number | null
          tong_luong_tru_bh: number | null
          tong_thu_nhap: number | null
          trang_thai: string | null
          updated_at: string | null
        }
        Insert: {
          bhtn_nv?: number | null
          bhxh_dn?: number | null
          bhxh_nv?: number | null
          bhyt_dn?: number | null
          bhyt_nv?: number | null
          co_so_id?: string | null
          cong_chuan?: number | null
          cong_thuc_lam?: number | null
          created_at?: string | null
          id?: string
          luong?: number | null
          luong_bh?: number | null
          nam?: string | null
          ngay?: string | null
          nhan_su_id: string
          pc_an_o?: number | null
          pc_dthoai?: number | null
          pc_tnhiem?: number | null
          pc_xang_xe?: number | null
          tg_tao?: string | null
          thang?: string | null
          tong_bh_dn_tra?: number | null
          tong_bh_nv?: number | null
          tong_chi_dn?: number | null
          tong_luong_theo_gio?: number | null
          tong_luong_thuc_te?: number | null
          tong_luong_tru_bh?: number | null
          tong_thu_nhap?: number | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Update: {
          bhtn_nv?: number | null
          bhxh_dn?: number | null
          bhxh_nv?: number | null
          bhyt_dn?: number | null
          bhyt_nv?: number | null
          co_so_id?: string | null
          cong_chuan?: number | null
          cong_thuc_lam?: number | null
          created_at?: string | null
          id?: string
          luong?: number | null
          luong_bh?: number | null
          nam?: string | null
          ngay?: string | null
          nhan_su_id?: string
          pc_an_o?: number | null
          pc_dthoai?: number | null
          pc_tnhiem?: number | null
          pc_xang_xe?: number | null
          tg_tao?: string | null
          thang?: string | null
          tong_bh_dn_tra?: number | null
          tong_bh_nv?: number | null
          tong_chi_dn?: number | null
          tong_luong_theo_gio?: number | null
          tong_luong_thuc_te?: number | null
          tong_luong_tru_bh?: number | null
          tong_thu_nhap?: number | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payrolls_co_so_id_fkey"
            columns: ["co_so_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payrolls_nhan_su_id_fkey"
            columns: ["nhan_su_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created_at: string | null
          file: string | null
          ghi_chu: string | null
          id: string
          ly_do: string | null
          muc: string | null
          ngay_bat_dau: string | null
          ngay_de_xuat: string
          ngay_di_lam_lai: string | null
          ngay_ket_thuc: string | null
          nguoi_de_xuat_id: string
          noi_dung: string
          so_luong: number | null
          so_ngay_nghi: number | null
          tg_tao: string | null
          thoi_gian_bat_dau: string | null
          thoi_gian_ket_thuc: string | null
          tong_so: number | null
          trang_thai: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file?: string | null
          ghi_chu?: string | null
          id?: string
          ly_do?: string | null
          muc?: string | null
          ngay_bat_dau?: string | null
          ngay_de_xuat: string
          ngay_di_lam_lai?: string | null
          ngay_ket_thuc?: string | null
          nguoi_de_xuat_id: string
          noi_dung: string
          so_luong?: number | null
          so_ngay_nghi?: number | null
          tg_tao?: string | null
          thoi_gian_bat_dau?: string | null
          thoi_gian_ket_thuc?: string | null
          tong_so?: number | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file?: string | null
          ghi_chu?: string | null
          id?: string
          ly_do?: string | null
          muc?: string | null
          ngay_bat_dau?: string | null
          ngay_de_xuat?: string
          ngay_di_lam_lai?: string | null
          ngay_ket_thuc?: string | null
          nguoi_de_xuat_id?: string
          noi_dung?: string
          so_luong?: number | null
          so_ngay_nghi?: number | null
          tg_tao?: string | null
          thoi_gian_bat_dau?: string | null
          thoi_gian_ket_thuc?: string | null
          tong_so?: number | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_nguoi_de_xuat_id_fkey"
            columns: ["nguoi_de_xuat_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          bai_tap: string | null
          buoi_hoc_so: string
          created_at: string | null
          id: string
          noi_dung_bai_hoc: string
          rep_lesson_plan: string | null
          tg_tao: string | null
          tsi_lesson_plan: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          bai_tap?: string | null
          buoi_hoc_so: string
          created_at?: string | null
          id?: string
          noi_dung_bai_hoc: string
          rep_lesson_plan?: string | null
          tg_tao?: string | null
          tsi_lesson_plan?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          bai_tap?: string | null
          buoi_hoc_so?: string
          created_at?: string | null
          id?: string
          noi_dung_bai_hoc?: string
          rep_lesson_plan?: string | null
          tg_tao?: string | null
          tsi_lesson_plan?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          bo_phan: string | null
          created_at: string | null
          file: string | null
          hang_muc: string | null
          hien_thi: string | null
          id: string
          list_column_show_if: string[] | null
          mo_ta: string | null
          quy_trinh: string | null
          tuy_chon: string | null
          tuy_chon_2: string | null
          updated_at: string | null
          video: string | null
        }
        Insert: {
          bo_phan?: string | null
          created_at?: string | null
          file?: string | null
          hang_muc?: string | null
          hien_thi?: string | null
          id?: string
          list_column_show_if?: string[] | null
          mo_ta?: string | null
          quy_trinh?: string | null
          tuy_chon?: string | null
          tuy_chon_2?: string | null
          updated_at?: string | null
          video?: string | null
        }
        Update: {
          bo_phan?: string | null
          created_at?: string | null
          file?: string | null
          hang_muc?: string | null
          hien_thi?: string | null
          id?: string
          list_column_show_if?: string[] | null
          mo_ta?: string | null
          quy_trinh?: string | null
          tuy_chon?: string | null
          tuy_chon_2?: string | null
          updated_at?: string | null
          video?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          co_so_id: string | null
          created_at: string | null
          ct_hoc: string | null
          dia_chi: string | null
          email_ph1: string | null
          gioi_tinh: string | null
          han_hoc_phi: string | null
          hinh_anh_hoc_sinh: string | null
          id: string
          mo_ta_hs: string | null
          ngay_bat_dau_hoc_phi: string | null
          ngay_sinh: string | null
          parentid: string | null
          parentpassword: string | null
          password: string | null
          sdt_ph1: string | null
          ten_hoc_sinh: string
          ten_ph: string | null
          trang_thai: string | null
          updated_at: string | null
          userid: string | null
        }
        Insert: {
          co_so_id?: string | null
          created_at?: string | null
          ct_hoc?: string | null
          dia_chi?: string | null
          email_ph1?: string | null
          gioi_tinh?: string | null
          han_hoc_phi?: string | null
          hinh_anh_hoc_sinh?: string | null
          id?: string
          mo_ta_hs?: string | null
          ngay_bat_dau_hoc_phi?: string | null
          ngay_sinh?: string | null
          parentid?: string | null
          parentpassword?: string | null
          password?: string | null
          sdt_ph1?: string | null
          ten_hoc_sinh: string
          ten_ph?: string | null
          trang_thai?: string | null
          updated_at?: string | null
          userid?: string | null
        }
        Update: {
          co_so_id?: string | null
          created_at?: string | null
          ct_hoc?: string | null
          dia_chi?: string | null
          email_ph1?: string | null
          gioi_tinh?: string | null
          han_hoc_phi?: string | null
          hinh_anh_hoc_sinh?: string | null
          id?: string
          mo_ta_hs?: string | null
          ngay_bat_dau_hoc_phi?: string | null
          ngay_sinh?: string | null
          parentid?: string | null
          parentpassword?: string | null
          password?: string | null
          sdt_ph1?: string | null
          ten_hoc_sinh?: string
          ten_ph?: string | null
          trang_thai?: string | null
          updated_at?: string | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_co_so_id_fkey"
            columns: ["co_so_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          cap_do: string | null
          created_at: string | null
          dien_giai: string | null
          doi_tuong: string | null
          doi_tuong_id: string | null
          ghi_chu: string | null
          id: string
          loai_viec: string | null
          ngay_den_han: string | null
          ngay_hoan_thanh: string | null
          nguoi_phu_trach: string | null
          ten_viec: string
          tg_tao: string | null
          trang_thai: string | null
          updated_at: string | null
        }
        Insert: {
          cap_do?: string | null
          created_at?: string | null
          dien_giai?: string | null
          doi_tuong?: string | null
          doi_tuong_id?: string | null
          ghi_chu?: string | null
          id?: string
          loai_viec?: string | null
          ngay_den_han?: string | null
          ngay_hoan_thanh?: string | null
          nguoi_phu_trach?: string | null
          ten_viec: string
          tg_tao?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Update: {
          cap_do?: string | null
          created_at?: string | null
          dien_giai?: string | null
          doi_tuong?: string | null
          doi_tuong_id?: string | null
          ghi_chu?: string | null
          id?: string
          loai_viec?: string | null
          ngay_den_han?: string | null
          ngay_hoan_thanh?: string | null
          nguoi_phu_trach?: string | null
          ten_viec?: string
          tg_tao?: string | null
          trang_thai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_nguoi_phu_trach_fkey"
            columns: ["nguoi_phu_trach"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      teaching_sessions: {
        Row: {
          created_at: string | null
          ghi_chu: string | null
          giao_vien: string
          id: string
          loai_bai_hoc: string | null
          lop_chi_tiet_id: string
          ngay_hoc: string
          nhan_xet_1: string | null
          nhan_xet_2: string | null
          nhan_xet_3: string | null
          nhan_xet_4: string | null
          nhan_xet_5: string | null
          nhan_xet_6: string | null
          nhan_xet_chung: string | null
          phong_hoc_id: string | null
          session_id: string
          thoi_gian_bat_dau: string
          thoi_gian_ket_thuc: string
          tro_giang: string | null
          trung_binh: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ghi_chu?: string | null
          giao_vien: string
          id?: string
          loai_bai_hoc?: string | null
          lop_chi_tiet_id: string
          ngay_hoc: string
          nhan_xet_1?: string | null
          nhan_xet_2?: string | null
          nhan_xet_3?: string | null
          nhan_xet_4?: string | null
          nhan_xet_5?: string | null
          nhan_xet_6?: string | null
          nhan_xet_chung?: string | null
          phong_hoc_id?: string | null
          session_id: string
          thoi_gian_bat_dau: string
          thoi_gian_ket_thuc: string
          tro_giang?: string | null
          trung_binh?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ghi_chu?: string | null
          giao_vien?: string
          id?: string
          loai_bai_hoc?: string | null
          lop_chi_tiet_id?: string
          ngay_hoc?: string
          nhan_xet_1?: string | null
          nhan_xet_2?: string | null
          nhan_xet_3?: string | null
          nhan_xet_4?: string | null
          nhan_xet_5?: string | null
          nhan_xet_6?: string | null
          nhan_xet_chung?: string | null
          phong_hoc_id?: string | null
          session_id?: string
          thoi_gian_bat_dau?: string
          thoi_gian_ket_thuc?: string
          tro_giang?: string | null
          trung_binh?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teaching_sessions_giao_vien_fkey"
            columns: ["giao_vien"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "attendances_with_details"
            referencedColumns: ["lop_id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes_with_student_count"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_tro_giang_fkey"
            columns: ["tro_giang"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      asset_inventory_by_facility: {
        Row: {
          cau_hinh: string | null
          chat_lieu: string | null
          created_at: string | null
          danh_muc: string | null
          doi_tuong: string | null
          doi_tuong_chuyen: string | null
          doi_tuong_id: string | null
          don_vi: string | null
          ghi_chu: string | null
          hinh_anh: string | null
          hinh_anh_2: string | null
          id: string | null
          khu_vuc: string | null
          loai: string | null
          mau: string | null
          mo_ta_1: string | null
          ngay_mua: string | null
          ngay_nhap: string | null
          noi_chuyen_toi: string | null
          noi_mua: string | null
          qr_code: string | null
          size: string | null
          so_luong: number | null
          so_luong_chuyen: number | null
          so_seri: string | null
          so_tien_mua: string | null
          ten_co_so: string | null
          ten_csvc: string | null
          tg_tao: string | null
          thuong_hieu: string | null
          tinh_trang: string | null
          trang_thai_so_huu: string | null
          trang_thai_so_huu_moi: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      attendances_with_details: {
        Row: {
          created_at: string | null
          danh_gia_1: number | null
          danh_gia_2: number | null
          danh_gia_3: number | null
          danh_gia_4: number | null
          enrollment_id: string | null
          ghi_chu: string | null
          hoc_sinh_id: string | null
          id: string | null
          lop_id: string | null
          ngay_hoc: string | null
          status: string | null
          teaching_session_id: string | null
          ten_hoc_sinh: string | null
          ten_lop_full: string | null
          thoi_gian_bat_dau: string | null
          thoi_gian_tre: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendances_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_teaching_session_id_fkey"
            columns: ["teaching_session_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_teaching_session_id_fkey"
            columns: ["teaching_session_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_avg_score"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_teaching_session_id_fkey"
            columns: ["teaching_session_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_hoc_sinh_id_fkey"
            columns: ["hoc_sinh_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes_with_student_count: {
        Row: {
          co_so: string | null
          created_at: string | null
          ct_hoc: string | null
          ghi_chu: string | null
          gv_chinh: string | null
          id: string | null
          ngay_bat_dau: string | null
          so_hs: number | null
          ten_lop: string | null
          ten_lop_full: string | null
          tg_tao: string | null
          tinh_trang: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_co_so_fkey"
            columns: ["co_so"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_gv_chinh_fkey"
            columns: ["gv_chinh"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_evaluations: {
        Row: {
          bo_phan: string | null
          chuc_danh: string | null
          created_at: string | null
          doi_tuong: string | null
          email: string | null
          ghi_chu: string | null
          ghi_danh_id: string | null
          han_hoan_thanh: string | null
          hinh_anh: string | null
          id: string | null
          ngay_cuoi_dot_danh_gia: string | null
          ngay_dau_dot_danh_gia: string | null
          nhan_xet_chi_tiet_1: string | null
          nhan_xet_chi_tiet_2: string | null
          nhan_xet_chi_tiet_3: string | null
          nhan_xet_chi_tiet_4: string | null
          nhan_xet_chi_tiet_5: string | null
          nhan_xet_chi_tiet_6: string | null
          nhan_xet_chi_tiet_7: string | null
          nhan_xet_chung: string | null
          nhan_xet_cua_cap_tren: string | null
          nhan_xet_tong_hop: string | null
          nhanvien_id: string | null
          pdf_dg_hoc_sinh: string | null
          ten_danh_gia: string | null
          ten_nhan_su: string | null
          tg_tao: string | null
          tieu_chi_1: string | null
          tieu_chi_2: string | null
          tieu_chi_3: string | null
          tieu_chi_4: string | null
          tieu_chi_5: string | null
          tieu_chi_6: string | null
          tieu_chi_7: string | null
          trang_thai: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_ghi_danh_id_fkey"
            columns: ["ghi_danh_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_ghi_danh_id_fkey"
            columns: ["ghi_danh_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_nhanvien_id_fkey"
            columns: ["nhanvien_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments_with_details: {
        Row: {
          buoi_day_id: string | null
          chon_de_danh_gia: boolean | null
          created_at: string | null
          ct_hoc: string | null
          ghi_chu: string | null
          hoc_sinh_id: string | null
          id: string | null
          lop_chi_tiet_id: string | null
          nhan_xet_tieu_chi_1: string | null
          nhan_xet_tieu_chi_2: string | null
          nhan_xet_tieu_chi_3: string | null
          ten_hoc_sinh: string | null
          ten_lop: string | null
          ten_lop_full: string | null
          tinh_trang_diem_danh: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_buoi_day_id_fkey"
            columns: ["buoi_day_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_buoi_day_id_fkey"
            columns: ["buoi_day_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_avg_score"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_buoi_day_id_fkey"
            columns: ["buoi_day_id"]
            isOneToOne: false
            referencedRelation: "teaching_sessions_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_hoc_sinh_id_fkey"
            columns: ["hoc_sinh_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "attendances_with_details"
            referencedColumns: ["lop_id"]
          },
          {
            foreignKeyName: "enrollments_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes_with_student_count"
            referencedColumns: ["id"]
          },
        ]
      }
      teaching_sessions_with_avg_score: {
        Row: {
          avg_score: number | null
          created_at: string | null
          ghi_chu: string | null
          giao_vien: string | null
          id: string | null
          loai_bai_hoc: string | null
          lop_chi_tiet_id: string | null
          ngay_hoc: string | null
          nhan_xet_1: string | null
          nhan_xet_2: string | null
          nhan_xet_3: string | null
          nhan_xet_4: string | null
          nhan_xet_5: string | null
          nhan_xet_6: string | null
          nhan_xet_chung: string | null
          phong_hoc_id: string | null
          session_id: string | null
          thoi_gian_bat_dau: string | null
          thoi_gian_ket_thuc: string | null
          tro_giang: string | null
          trung_binh: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teaching_sessions_giao_vien_fkey"
            columns: ["giao_vien"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "attendances_with_details"
            referencedColumns: ["lop_id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes_with_student_count"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_tro_giang_fkey"
            columns: ["tro_giang"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      teaching_sessions_with_details: {
        Row: {
          assistant_name: string | null
          class_name: string | null
          created_at: string | null
          ghi_chu: string | null
          giao_vien: string | null
          id: string | null
          lesson_content: string | null
          loai_bai_hoc: string | null
          lop_chi_tiet_id: string | null
          ngay_hoc: string | null
          nhan_xet_1: string | null
          nhan_xet_2: string | null
          nhan_xet_3: string | null
          nhan_xet_4: string | null
          nhan_xet_5: string | null
          nhan_xet_6: string | null
          nhan_xet_chung: string | null
          phong_hoc_id: string | null
          session_id: string | null
          teacher_name: string | null
          thoi_gian_bat_dau: string | null
          thoi_gian_ket_thuc: string | null
          tro_giang: string | null
          trung_binh: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teaching_sessions_giao_vien_fkey"
            columns: ["giao_vien"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "attendances_with_details"
            referencedColumns: ["lop_id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_lop_chi_tiet_id_fkey"
            columns: ["lop_chi_tiet_id"]
            isOneToOne: false
            referencedRelation: "classes_with_student_count"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_sessions_tro_giang_fkey"
            columns: ["tro_giang"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_class: {
        Args: {
          class_data: Json
        }
        Returns: Json
      }
      create_schema_info_function: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_session: {
        Args: {
          session_data: Json
        }
        Returns: Json
      }
      get_schema_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          column_count: number
        }[]
      }
      run_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
