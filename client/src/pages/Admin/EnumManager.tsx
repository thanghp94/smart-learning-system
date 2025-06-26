import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Settings, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnumType {
  enum_name: string;
  enum_values: string[];
  tables_using: Array<{
    table_name: string;
    column_name: string;
  }>;
}

const EnumManager = () => {
  const [enumTypes, setEnumTypes] = useState<EnumType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEnum, setEditingEnum] = useState<EnumType | null>(null);
  const [newEnumName, setNewEnumName] = useState('');
  const [newEnumValues, setNewEnumValues] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEnumTypes();
  }, []);

  const fetchEnumTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/enums');
      if (!response.ok) throw new Error('Failed to fetch enum types');
      const data = await response.json();
      setEnumTypes(data);
    } catch (error) {
      console.error('Error fetching enum types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch enum types",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEnumType = async () => {
    if (!newEnumName.trim() || !newEnumValues.trim()) {
      toast({
        title: "Error",
        description: "Please provide enum name and values",
        variant: "destructive"
      });
      return;
    }

    try {
      const values = newEnumValues.split(',').map(v => v.trim()).filter(v => v);
      const response = await fetch('/api/admin/enums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newEnumName.trim(),
          values: values
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create enum type');
      }

      toast({
        title: "Success",
        description: "Enum type created successfully"
      });

      setIsCreateDialogOpen(false);
      setNewEnumName('');
      setNewEnumValues('');
      fetchEnumTypes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addEnumValue = async (enumName: string, newValue: string) => {
    if (!newValue.trim()) return;

    try {
      const response = await fetch(`/api/admin/enums/${enumName}/values`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue.trim() })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add enum value');
      }

      toast({
        title: "Success",
        description: "Enum value added successfully"
      });

      fetchEnumTypes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteEnumValue = async (enumName: string, value: string) => {
    try {
      const response = await fetch(`/api/admin/enums/${enumName}/values/${encodeURIComponent(value)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete enum value');
      }

      toast({
        title: "Success",
        description: "Enum value deleted successfully"
      });

      fetchEnumTypes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteEnumType = async (enumName: string) => {
    try {
      const response = await fetch(`/api/admin/enums/${enumName}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete enum type');
      }

      toast({
        title: "Success",
        description: "Enum type deleted successfully"
      });

      fetchEnumTypes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Enum Type Manager
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage PostgreSQL enum types and their values
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          {enumTypes.length} enum types found
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchEnumTypes}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Enum Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Enum Type</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <label className="text-sm font-medium">Enum Name</label>
                  <Input
                    placeholder="e.g., user_status"
                    value={newEnumName}
                    onChange={(e) => setNewEnumName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Values (comma-separated)</label>
                  <Input
                    placeholder="e.g., active, inactive, pending"
                    value={newEnumValues}
                    onChange={(e) => setNewEnumValues(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createEnumType}>
                  Create Enum
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading enum types...</div>
      ) : (
        <div className="space-y-4">
          {enumTypes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No enum types found in the database</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first enum type to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            enumTypes.map((enumType) => (
              <Card key={enumType.enum_name}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        {enumType.enum_name}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">
                          {enumType.enum_values.length} values
                        </Badge>
                        <Badge variant="outline">
                          Used in {enumType.tables_using.length} tables
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEnum(enumType)}
                      >
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
                            <AlertDialogTitle>Delete Enum Type</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the enum type "{enumType.enum_name}"?
                              This action cannot be undone and may affect tables using this enum.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteEnumType(enumType.enum_name)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Enum Values */}
                    <div>
                      <h4 className="font-semibold mb-2">Values</h4>
                      <div className="flex flex-wrap gap-2">
                        {enumType.enum_values.map((value) => (
                          <Badge
                            key={value}
                            variant="outline"
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => {
                              if (confirm(`Delete enum value "${value}"?`)) {
                                deleteEnumValue(enumType.enum_name, value);
                              }
                            }}
                          >
                            {value}
                            <Trash2 className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newValue = prompt('Enter new enum value:');
                            if (newValue) {
                              addEnumValue(enumType.enum_name, newValue);
                            }
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Value
                        </Button>
                      </div>
                    </div>

                    {/* Tables Using This Enum */}
                    {enumType.tables_using.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Used In Tables</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Table</TableHead>
                              <TableHead>Column</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {enumType.tables_using.map((usage, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {usage.table_name}
                                </TableCell>
                                <TableCell>{usage.column_name}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EnumManager;