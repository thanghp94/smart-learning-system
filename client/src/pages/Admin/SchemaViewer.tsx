
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Database, Table as TableIcon, Key, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TableSchema {
  table_name: string;
  columns: ColumnInfo[];
  constraints: ConstraintInfo[];
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface ConstraintInfo {
  constraint_name: string;
  constraint_type: string;
  column_name: string;
}

const SchemaViewer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [schemas, setSchemas] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSchemaInfo();
  }, []);

  const fetchSchemaInfo = async () => {
    try {
      const response = await fetch('/api/admin/schema');
      if (!response.ok) throw new Error('Failed to fetch schema');
      const data = await response.json();
      setSchemas(data);
    } catch (error) {
      console.error('Error fetching schema:', error);
      toast({
        title: "Error",
        description: "Failed to fetch database schema",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTableSchema = schemas.find(s => s.table_name === selectedTable);

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
        
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8" />
          Database Schema
        </h1>
        <p className="text-muted-foreground">
          View database structure and relationships
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TableIcon className="h-5 w-5" />
              Tables ({schemas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="space-y-2">
                {schemas.map((schema) => (
                  <Button
                    key={schema.table_name}
                    variant={selectedTable === schema.table_name ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedTable(schema.table_name)}
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    {schema.table_name}
                    <Badge variant="secondary" className="ml-auto">
                      {schema.columns.length}
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedTableSchema ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Table: {selectedTableSchema.table_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Columns ({selectedTableSchema.columns.length})</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Nullable</TableHead>
                            <TableHead>Default</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTableSchema.columns.map((column) => (
                            <TableRow key={column.column_name}>
                              <TableCell className="font-medium">
                                {column.column_name}
                                {selectedTableSchema.constraints.some(c => 
                                  c.column_name === column.column_name && c.constraint_type === 'PRIMARY KEY'
                                ) && (
                                  <Key className="h-3 w-3 inline ml-1 text-yellow-500" />
                                )}
                              </TableCell>
                              <TableCell>
                                {column.data_type}
                                {column.character_maximum_length && `(${column.character_maximum_length})`}
                              </TableCell>
                              <TableCell>
                                <Badge variant={column.is_nullable === 'YES' ? 'secondary' : 'destructive'}>
                                  {column.is_nullable === 'YES' ? 'Yes' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {column.column_default || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {selectedTableSchema.constraints.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Constraints ({selectedTableSchema.constraints.length})</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Column</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedTableSchema.constraints.map((constraint, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{constraint.constraint_name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{constraint.constraint_type}</Badge>
                                </TableCell>
                                <TableCell>{constraint.column_name}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/admin/table/${selectedTableSchema.table_name}`)}
                      >
                        View Data
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/admin/table/${selectedTableSchema.table_name}/edit`)}
                      >
                        Edit Table
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a table from the list to view its schema</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaViewer;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Table, Key, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TableSchema {
  table_name: string;
  columns: ColumnInfo[];
  constraints: ConstraintInfo[];
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string;
  character_maximum_length: number;
}

interface ConstraintInfo {
  constraint_name: string;
  constraint_type: string;
  column_name: string;
}

const SchemaViewer = () => {
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await fetch('/api/admin/schema');
      const data = await response.json();
      setSchema(data);
      if (data.length > 0) {
        setSelectedTable(data[0].table_name);
      }
    } catch (error) {
      console.error('Error fetching schema:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedTableData = schema.find(table => table.table_name === selectedTable);

  if (loading) {
    return <div className="p-6">Loading database schema...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Database Schema</h1>
          </div>
          <p className="text-muted-foreground">Explore your database structure and relationships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Tables ({schema.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {schema.map((table) => (
                <button
                  key={table.table_name}
                  onClick={() => setSelectedTable(table.table_name)}
                  className={`w-full text-left p-3 hover:bg-muted/50 border-l-4 transition-colors ${
                    selectedTable === table.table_name
                      ? 'border-primary bg-muted/50'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{table.table_name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {table.columns.length}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {selectedTableData ? (
            <Tabs defaultValue="columns" className="space-y-4">
              <TabsList>
                <TabsTrigger value="columns">Columns</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
              </TabsList>

              <TabsContent value="columns">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Table className="w-5 h-5 mr-2" />
                      {selectedTable} - Columns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left p-3 font-medium">Column Name</th>
                            <th className="text-left p-3 font-medium">Data Type</th>
                            <th className="text-left p-3 font-medium">Nullable</th>
                            <th className="text-left p-3 font-medium">Default</th>
                            <th className="text-left p-3 font-medium">Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTableData.columns.map((column) => (
                            <tr key={column.column_name} className="border-b hover:bg-muted/50">
                              <td className="p-3">
                                <div className="flex items-center">
                                  <span className="font-medium">{column.column_name}</span>
                                  {selectedTableData.constraints.some(
                                    c => c.column_name === column.column_name && c.constraint_type === 'PRIMARY KEY'
                                  ) && (
                                    <Key className="w-4 h-4 ml-2 text-yellow-600" />
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="outline">{column.data_type}</Badge>
                              </td>
                              <td className="p-3">
                                <Badge variant={column.is_nullable === 'YES' ? 'secondary' : 'destructive'}>
                                  {column.is_nullable}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <span className="text-sm text-muted-foreground">
                                  {column.column_default || '—'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="text-sm">
                                  {column.character_maximum_length || '—'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="constraints">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LinkIcon className="w-5 h-5 mr-2" />
                      {selectedTable} - Constraints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTableData.constraints.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b">
                            <tr>
                              <th className="text-left p-3 font-medium">Constraint Name</th>
                              <th className="text-left p-3 font-medium">Type</th>
                              <th className="text-left p-3 font-medium">Column</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTableData.constraints.map((constraint) => (
                              <tr key={constraint.constraint_name} className="border-b hover:bg-muted/50">
                                <td className="p-3 font-medium">{constraint.constraint_name}</td>
                                <td className="p-3">
                                  <Badge variant={
                                    constraint.constraint_type === 'PRIMARY KEY' ? 'default' :
                                    constraint.constraint_type === 'FOREIGN KEY' ? 'secondary' :
                                    'outline'
                                  }>
                                    {constraint.constraint_type}
                                  </Badge>
                                </td>
                                <td className="p-3">{constraint.column_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No constraints found for this table.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Select a table to view its schema details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaViewer;
