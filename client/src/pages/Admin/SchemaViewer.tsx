import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Database, Table as TableIcon, Key, Link, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  foreign_table?: string;
  foreign_column?: string;
}

interface TableSchema {
  table_name: string;
  table_type: string;
  row_count: number;
  table_size: string;
  columns: Column[];
  indexes: Array<{
    index_name: string;
    column_names: string[];
    is_unique: boolean;
    is_primary: boolean;
  }>;
  foreign_keys: Array<{
    constraint_name: string;
    column_name: string;
    foreign_table: string;
    foreign_column: string;
  }>;
}

const SchemaViewer = () => {
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [filteredTables, setFilteredTables] = useState<TableSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchSchema();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredTables(
        tables.filter(table => 
          table.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          table.columns.some(col => 
            col.column_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            col.data_type.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    } else {
      setFilteredTables(tables);
    }
  }, [searchTerm, tables]);

  const fetchSchema = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/schema');
      if (!response.ok) throw new Error('Failed to fetch schema');
      const data = await response.json();
      setTables(data);
      setFilteredTables(data);
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

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const getColumnIcon = (column: Column) => {
    if (column.is_primary_key) {
      return <Key className="h-3 w-3 text-yellow-500" />;
    }
    if (column.is_foreign_key) {
      return <Link className="h-3 w-3 text-blue-500" />;
    }
    return null;
  };

  const getDataTypeBadge = (dataType: string, maxLength?: number | null) => {
    const color = dataType.includes('varchar') || dataType.includes('text') ? 'bg-green-100 text-green-800' :
                  dataType.includes('int') || dataType.includes('numeric') ? 'bg-blue-100 text-blue-800' :
                  dataType.includes('timestamp') || dataType.includes('date') ? 'bg-purple-100 text-purple-800' :
                  dataType.includes('boolean') ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800';

    return (
      <Badge variant="secondary" className={color}>
        {dataType}{maxLength ? `(${maxLength})` : ''}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8" />
          Database Schema Viewer
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore your PostgreSQL database structure and relationships
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tables, columns, or data types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-96"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setExpandedTables(new Set(tables.map(t => t.table_name)))}
            >
              Expand All
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setExpandedTables(new Set())}
            >
              Collapse All
            </Button>
            <Button variant="outline" onClick={fetchSchema}>
              Refresh Schema
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading database schema...</div>
      ) : (
        <div className="space-y-4">
          {filteredTables.map((table) => (
            <Card key={table.table_name}>
              <Collapsible
                open={expandedTables.has(table.table_name)}
                onOpenChange={() => toggleTable(table.table_name)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedTables.has(table.table_name) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <TableIcon className="h-5 w-5" />
                        <div>
                          <CardTitle className="text-left">{table.table_name}</CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{table.table_type}</Badge>
                            <Badge variant="secondary">{table.row_count} rows</Badge>
                            <Badge variant="outline">{table.table_size}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {table.columns.length} columns
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Columns */}
                      <div>
                        <h4 className="font-semibold mb-3">Columns</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Nullable</TableHead>
                              <TableHead>Default</TableHead>
                              <TableHead>Constraints</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {table.columns.map((column) => (
                              <TableRow key={column.column_name}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {getColumnIcon(column)}
                                    {column.column_name}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getDataTypeBadge(column.data_type, column.character_maximum_length)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={column.is_nullable === 'YES' ? 'secondary' : 'destructive'}>
                                    {column.is_nullable === 'YES' ? 'Yes' : 'No'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {column.column_default ? (
                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                      {column.column_default}
                                    </code>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    {column.is_primary_key && (
                                      <Badge variant="default" className="text-xs">PK</Badge>
                                    )}
                                    {column.is_foreign_key && (
                                      <Badge variant="outline" className="text-xs">
                                        FK → {column.foreign_table}.{column.foreign_column}
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Indexes */}
                      {table.indexes.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Indexes</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Index Name</TableHead>
                                <TableHead>Columns</TableHead>
                                <TableHead>Type</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {table.indexes.map((index) => (
                                <TableRow key={index.index_name}>
                                  <TableCell className="font-medium">{index.index_name}</TableCell>
                                  <TableCell>
                                    {index.column_names.map((col, i) => (
                                      <Badge key={i} variant="outline" className="mr-1">
                                        {col}
                                      </Badge>
                                    ))}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      {index.is_primary && (
                                        <Badge variant="default" className="text-xs">Primary</Badge>
                                      )}
                                      {index.is_unique && (
                                        <Badge variant="secondary" className="text-xs">Unique</Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {/* Foreign Keys */}
                      {table.foreign_keys.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Foreign Key Relationships</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Constraint</TableHead>
                                <TableHead>Column</TableHead>
                                <TableHead>References</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {table.foreign_keys.map((fk) => (
                                <TableRow key={fk.constraint_name}>
                                  <TableCell className="font-medium">{fk.constraint_name}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{fk.column_name}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {fk.foreign_table}.{fk.foreign_column}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}

          {filteredTables.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No tables match your search criteria' : 'No tables found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemaViewer;