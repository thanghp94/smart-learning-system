
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TableColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface TableRow {
  [key: string]: any;
}

const TableManager = () => {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);

  useEffect(() => {
    if (tableName) {
      fetchTableData();
      fetchTableColumns();
    }
  }, [tableName]);

  useEffect(() => {
    const filtered = rows.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredRows(filtered);
    setCurrentPage(1);
  }, [rows, searchTerm]);

  const fetchTableColumns = async () => {
    try {
      const response = await fetch(`/api/admin/table/${tableName}/columns`);
      if (!response.ok) throw new Error('Failed to fetch columns');
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error('Error fetching columns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch table columns",
        variant: "destructive"
      });
    }
  };

  const fetchTableData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/table/${tableName}/data`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch table data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRow = async () => {
    try {
      const response = await fetch(`/api/admin/table/${tableName}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRowData)
      });
      
      if (!response.ok) throw new Error('Failed to add row');
      
      toast({
        title: "Success",
        description: "Row added successfully"
      });
      
      setIsAddDialogOpen(false);
      setNewRowData({});
      fetchTableData();
    } catch (error) {
      console.error('Error adding row:', error);
      toast({
        title: "Error",
        description: "Failed to add row",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRow = async (rowId: any, updatedData: Record<string, any>) => {
    try {
      const response = await fetch(`/api/admin/table/${tableName}/update/${rowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) throw new Error('Failed to update row');
      
      toast({
        title: "Success",
        description: "Row updated successfully"
      });
      
      fetchTableData();
    } catch (error) {
      console.error('Error updating row:', error);
      toast({
        title: "Error",
        description: "Failed to update row",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRow = async (rowId: any) => {
    try {
      const response = await fetch(`/api/admin/table/${tableName}/delete/${rowId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete row');
      
      toast({
        title: "Success",
        description: "Row deleted successfully"
      });
      
      fetchTableData();
    } catch (error) {
      console.error('Error deleting row:', error);
      toast({
        title: "Error",
        description: "Failed to delete row",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.column_name);
    const csvContent = [
      headers.join(','),
      ...filteredRows.map(row => 
        headers.map(header => `"${String(row[header] || '')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold">Table: {tableName}</h1>
        <p className="text-muted-foreground">
          {filteredRows.length} rows total
        </p>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Row</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {columns.map((column) => (
                <div key={column.column_name}>
                  <label className="text-sm font-medium">
                    {column.column_name} 
                    <span className="text-muted-foreground">({column.data_type})</span>
                    {column.is_nullable === 'NO' && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    value={newRowData[column.column_name] || ''}
                    onChange={(e) => setNewRowData(prev => ({
                      ...prev,
                      [column.column_name]: e.target.value
                    }))}
                    placeholder={column.column_default || ''}
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRow}>Add Row</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-8">Loading table data...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.column_name}>
                          {column.column_name}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({column.data_type})
                          </span>
                        </TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRows.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={column.column_name} className="max-w-xs truncate">
                            {String(row[column.column_name] || '')}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Row</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this row? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteRow(row.id || Object.values(row)[0])}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredRows.length)} of {filteredRows.length} rows
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableManager;
