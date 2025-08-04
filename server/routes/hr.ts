import type { Express, Request, Response } from "express";
import { getStorage } from "../database/config";
import { pool } from "../database/connection";
import { handleError, handleNotFound } from "./utils";
import { createCrudRoutes } from "./crud";

// Custom employee routes with special handling
export const registerHRRoutes = (app: Express) => {
  // Custom employee routes (with special co_so_id handling)
  app.get('/api/employees', async (req: Request, res: Response) => {
    try {
      const employees = await (await getStorage()).getEmployees();
      res.json(employees);
    } catch (error) {
      handleError(res, error, 'Failed to get employees');
    }
  });

  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const employee = await (await getStorage()).getEmployee(req.params.id);
      if (!employee) {
        return handleNotFound(res, 'Employee');
      }
      res.json(employee);
    } catch (error) {
      handleError(res, error, 'Failed to fetch employee');
    }
  });

  app.post("/api/employees", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      
      // Handle co_so_id array conversion
      let coSoId = data.co_so_id;
      if (Array.isArray(coSoId)) {
        coSoId = coSoId.length > 0 ? coSoId[0] : null;
      } else if (coSoId === '' || coSoId === undefined) {
        coSoId = null;
      }

      const result = await pool.query(
        `INSERT INTO employees (
          ten_nhan_vien, ten_ngan, bo_phan, chuc_vu, so_dien_thoai, 
          email, co_so_id, trang_thai, ngay_sinh, dia_chi, 
          gioi_tinh, ghi_chu, hinh_anh
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *`,
        [
          data.ten_nhan_vien, data.ten_ngan, data.bo_phan, data.chuc_vu,
          data.so_dien_thoai, data.email, coSoId, data.trang_thai,
          data.ngay_sinh, data.dia_chi, data.gioi_tinh, data.ghi_chu,
          data.hinh_anh
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      handleError(res, error, 'Failed to create employee');
    }
  });

  app.put("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      // Handle co_so_id array conversion
      let coSoId = data.co_so_id;
      if (Array.isArray(coSoId)) {
        coSoId = coSoId.length > 0 ? coSoId[0] : null;
      } else if (coSoId === '' || coSoId === undefined) {
        coSoId = null;
      }

      const result = await pool.query(
        `UPDATE employees 
         SET ten_nhan_vien = $1, ten_ngan = $2, bo_phan = $3, chuc_vu = $4, 
             so_dien_thoai = $5, email = $6, co_so_id = $7, trang_thai = $8,
             ngay_sinh = $9, dia_chi = $10, gioi_tinh = $11, ghi_chu = $12,
             hinh_anh = $13, updated_at = CURRENT_TIMESTAMP
         WHERE id = $14 
         RETURNING *`,
        [
          data.ten_nhan_vien, data.ten_ngan, data.bo_phan, data.chuc_vu,
          data.so_dien_thoai, data.email, coSoId, data.trang_thai,
          data.ngay_sinh, data.dia_chi, data.gioi_tinh, data.ghi_chu,
          data.hinh_anh, id
        ]
      );

      if (result.rows.length === 0) {
        return handleNotFound(res, 'Employee');
      }

      res.json(result.rows[0]);
    } catch (error) {
      handleError(res, error, 'Failed to update employee');
    }
  });

  app.delete("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const success = await (await getStorage()).deleteEmployee(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Employee');
      }
      res.json({ success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete employee');
    }
  });

  // Teachers endpoint (filtered employees)
  app.get("/api/teachers", async (req: Request, res: Response) => {
    try {
      const employees = await (await getStorage()).getEmployees();
      const teachers = employees.filter(emp => 
        emp.chuc_vu === 'teacher' || 
        emp.chuc_vu === 'giao_vien' || 
        emp.chuc_vu === 'Giáo viên' ||
        emp.chuc_vu?.toLowerCase().includes('teacher') ||
        emp.chuc_vu?.toLowerCase().includes('giáo viên')
      );
      res.json(teachers);
    } catch (error) {
      handleError(res, error, 'Failed to fetch teachers');
    }
  });

  // Payroll routes
  app.get("/api/payroll", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).getPayroll();
      res.json(payroll);
    } catch (error) {
      handleError(res, error, 'Failed to fetch payroll');
    }
  });

  app.get("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).getPayrollById(req.params.id);
      if (!payroll) {
        return handleNotFound(res, 'Payroll record');
      }
      res.json(payroll);
    } catch (error) {
      handleError(res, error, 'Failed to fetch payroll record');
    }
  });

  app.post("/api/payroll", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).createPayroll(req.body);
      res.status(201).json(payroll);
    } catch (error) {
      handleError(res, error, 'Invalid payroll data', 400);
    }
  });

  app.patch("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      const payroll = await (await getStorage()).updatePayroll(req.params.id, req.body);
      if (!payroll) {
        return handleNotFound(res, 'Payroll record');
      }
      res.json(payroll);
    } catch (error) {
      handleError(res, error, 'Failed to update payroll record');
    }
  });

  app.delete("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      const success = await (await getStorage()).deletePayroll(req.params.id);
      if (!success) {
        return handleNotFound(res, 'Payroll record');
      }
      res.json({ success: true });
    } catch (error) {
      handleError(res, error, 'Failed to delete payroll record');
    }
  });

  // Employee clock-ins routes
  createCrudRoutes(app, 'employee-clock-ins', 'Employee Clock-in', 'EmployeeClockIn');
};
