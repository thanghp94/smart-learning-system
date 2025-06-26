
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
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Edit, Trash2, Plus, ArrowLeft, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TableData {
  table_name: string;
  table_type: string;
  row_count: number;
}

interface ColumnData {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string;
}

const TableManager = () => {
  const { tableName } = useParams();
  const [tables, setTables] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRow, setEditingRow] = useState<any>(null);
  const [newRow, setNewRow] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (tableName) {
      fetchTableData();
      fetchColumns();
    }
  }, [tableName]);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/admin/tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchColumns = async () => {
    if (!tableName) return;
    try {
      const response = await fetch(`/api/admin/table/${tableName}/columns`);
      const data = await response.json();
      setColumns(data);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const fetchTableData = async () => {
    if (!tableName) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/table/${tableName}/data?limit=100`);
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async () => {
    try {
      const response = await fetch(`/api/admin/table/${tableName}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow)
      });
      
      if (response.ok) {
        fetchTableData();
        setNewRow({});
        setShowAddForm(false);
      } else {
        const error = await response.json();
        alert('Error adding row: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding row:', error);
      alert('Error adding row');
    }
  };

  const handleUpdateRow = async (id: string, updatedData: any) => {
    try {
      const response = await fetch(`/api/admin/table/${tableName}/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        fetchTableData();
        setEditingRow(null);
      } else {
        const error = await response.json();
        alert('Error updating row: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating row:', error);
      alert('Error updating row');
    }
  };

  const handleDeleteRow = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/table/${tableName}/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTableData();
      } else {
        const error = await response.json();
        alert('Error deleting row: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting row:', error);
      alert('Error deleting row');
    }
  };

  const exportTableData = () => {
    if (!tableData.length) return;
    
    const csv = [
      columns.map(col => col.column_name).join(','),
      ...tableData.map(row => 
        columns.map(col => {
          const value = row[col.column_name];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value || '';
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTables = tables.filter(table =>
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !tableName) {
    return <div className="p-6">Loading tables...</div>;
  }

  if (!tableName) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Database Tables</h1>
            <p className="text-muted-foreground">Select a table to manage its data</p>
          </div>
          <Link to="/admin">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTables.map((table) => (
            <Card key={table.table_name} className="cursor-pointer hover:shadow-md transition-shadow">
              <Link to={`/admin/table/${table.table_name}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Table className="w-5 h-5 mr-2" />
                      {table.table_name}
                    </CardTitle>
                    <Badge variant="secondary">{table.table_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {table.row_count} records
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/admin/tables">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{tableName}</h1>
          </div>
          <p className="text-muted-foreground">{tableData.length} records</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportTableData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Record</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                {columns.map((column) => (
                  <div key={column.column_name} className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-sm">
                      {column.column_name}
                      {column.is_nullable === 'NO' && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="col-span-3">
                      {column.data_type.includes('text') ? (
                        <Textarea
                          value={newRow[column.column_name] || ''}
                          onChange={(e) => setNewRow({...newRow, [column.column_name]: e.target.value})}
                          placeholder={`Enter ${column.column_name}`}
                        />
                      ) : (
                        <Input
                          type={column.data_type.includes('int') ? 'number' : 'text'}
                          value={newRow[column.column_name] || ''}
                          onChange={(e) => setNewRow({...newRow, [column.column_name]: e.target.value})}
                          placeholder={`Enter ${column.column_name}`}
                        />
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Type: {column.data_type}, Default: {column.column_default || 'None'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRow}>Add Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div>Loading table data...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.column_name} className="text-left p-4 font-medium">
                        {column.column_name}
                        <div className="text-xs text-muted-foreground font-normal">
                          {column.data_type}
                        </div>
                      </th>
                    ))}
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={row.id || index} className="border-b hover:bg-muted/50">
                      {columns.map((column) => (
                        <td key={column.column_name} className="p-4">
                          <div className="max-w-xs truncate" title={row[column.column_name]}>
                            {row[column.column_name]?.toString() || '—'}
                          </div>
                        </td>
                      ))}
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRow(row)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Record</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this record? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRow(row.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {editingRow && (
        <Dialog open={!!editingRow} onOpenChange={() => setEditingRow(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Record</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              {columns.map((column) => (
                <div key={column.column_name} className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">
                    {column.column_name}
                  </Label>
                  <div className="col-span-3">
                    {column.data_type.includes('text') ? (
                      <Textarea
                        value={editingRow[column.column_name] || ''}
                        onChange={(e) => setEditingRow({...editingRow, [column.column_name]: e.target.value})}
                      />
                    ) : (
                      <Input
                        type={column.data_type.includes('int') ? 'number' : 'text'}
                        value={editingRow[column.column_name] || ''}
                        onChange={(e) => setEditingRow({...editingRow, [column.column_name]: e.target.value})}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingRow(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdateRow(editingRow.id, editingRow)}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TableManager;
