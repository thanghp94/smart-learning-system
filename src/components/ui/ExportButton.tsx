
import React, { useState } from 'react';
import { Button } from './button';
import { 
  FileDown, 
  FileText, 
  FileType, 
  FileSpreadsheet, 
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  label?: string;
  onExport?: (format: string, data: any[]) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'export',
  label = 'Xuất',
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const checkData = () => {
    if (!data.length) {
      toast({
        title: 'Không có dữ liệu',
        description: 'Không có dữ liệu để xuất',
        variant: 'default',
      });
      return false;
    }
    return true;
  };

  const exportToCSV = (data: any[]) => {
    try {
      setIsExporting(true);
      
      if (!checkData()) {
        setIsExporting(false);
        return;
      }

      // Convert data to CSV format
      const headers = Object.keys(data[0]).join(',');
      const csvRows = data.map(row => 
        Object.values(row)
          .map(value => {
            if (value === null || value === undefined) return '';
            // Handle strings with commas by wrapping in quotes
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return String(value);
          })
          .join(',')
      );
      
      const csvContent = [headers, ...csvRows].join('\n');
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element to download the CSV
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Xuất thành công',
        description: 'Dữ liệu đã được xuất dưới dạng CSV',
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xuất dữ liệu',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = (data: any[]) => {
    try {
      setIsExporting(true);
      
      if (!checkData()) {
        setIsExporting(false);
        return;
      }

      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      // Generate XLSX file and trigger download
      XLSX.writeFile(wb, `${filename}.xlsx`);

      toast({
        title: 'Xuất thành công',
        description: 'Dữ liệu đã được xuất dưới dạng Excel',
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xuất dữ liệu Excel',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = (data: any[]) => {
    try {
      setIsExporting(true);
      
      if (!checkData()) {
        setIsExporting(false);
        return;
      }

      // Create a new PDF document with landscape orientation
      const doc = new jsPDF({
        orientation: 'landscape', 
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title to PDF
      doc.setFontSize(16);
      doc.text(filename, 14, 15);
      
      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Xuất ngày: ${new Date().toLocaleString('vi-VN')}`, 14, 22);
      
      // Prepare data for autotable
      const headers = Object.keys(data[0]);
      const rows = data.map(row => Object.values(row).map(val => 
        val !== null && val !== undefined ? String(val) : ''
      ));
      
      // Add table to PDF
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 30,
        headStyles: { fillColor: [66, 139, 202] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 30 },
      });
      
      // Save the PDF
      doc.save(`${filename}.pdf`);

      toast({
        title: 'Xuất thành công',
        description: 'Dữ liệu đã được xuất dưới dạng PDF',
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xuất dữ liệu PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToHTML = (data: any[]) => {
    try {
      setIsExporting(true);
      
      if (!checkData()) {
        setIsExporting(false);
        return;
      }

      // Create an HTML table from the data
      const headers = Object.keys(data[0]);
      const htmlHeaders = headers.map(header => `<th>${header}</th>`).join('');
      const htmlRows = data.map(row => {
        const cells = headers.map(header => `<td>${row[header] !== null && row[header] !== undefined ? row[header] : ''}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      
      // Create complete HTML document
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { text-align: center; margin-bottom: 20px; }
            .export-info { text-align: right; margin-bottom: 20px; color: #666; }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <div class="export-info">Exported on: ${new Date().toLocaleString()}</div>
          <table>
            <thead>
              <tr>${htmlHeaders}</tr>
            </thead>
            <tbody>
              ${htmlRows}
            </tbody>
          </table>
        </body>
        </html>
      `;
      
      // Create a Blob with the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Open in a new tab
      window.open(url, '_blank');
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast({
        title: 'Xuất thành công',
        description: 'Dữ liệu đã được xuất dưới dạng HTML',
      });
    } catch (error) {
      console.error('Error exporting to HTML:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xuất dữ liệu',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format, data);
      return;
    }
    
    switch (format) {
      case 'csv':
        exportToCSV(data);
        break;
      case 'excel':
        exportToExcel(data);
        break;
      case 'pdf':
        exportToPDF(data);
        break;
      case 'html':
        exportToHTML(data);
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <FileDown className="h-4 w-4 mr-1" />
          {label}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="h-4 w-4 mr-2" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileType className="h-4 w-4 mr-2" />
          PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('html')}>
          <FileText className="h-4 w-4 mr-2" />
          HTML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
