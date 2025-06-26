import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Download, History, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number;
  rowCount: number;
}

interface QueryHistory {
  id: string;
  query: string;
  executedAt: Date;
  executionTime: number;
  success: boolean;
  error?: string;
}

const SQLRunner = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const { toast } = useToast();

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/admin/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(data.error || 'Query execution failed');
      }

      setResult({
        columns: data.columns || [],
        rows: data.rows || [],
        executionTime,
        rowCount: data.rows?.length || 0
      });

      // Add to history
      const historyEntry: QueryHistory = {
        id: Date.now().toString(),
        query,
        executedAt: new Date(),
        executionTime,
        success: true
      };
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);

      toast({
        title: "Query executed successfully",
        description: `${data.rows?.length || 0} rows returned in ${executionTime}ms`
      });

    } catch (err: any) {
      const executionTime = Date.now() - startTime;
      setError(err.message);

      // Add to history
      const historyEntry: QueryHistory = {
        id: Date.now().toString(),
        query,
        executedAt: new Date(),
        executionTime,
        success: false,
        error: err.message
      };
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);

      toast({
        title: "Query failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const exportToCSV = () => {
    if (!result || result.rows.length === 0) return;

    const csvContent = [
      result.columns.join(','),
      ...result.rows.map(row => 
        result.columns.map(col => 
          typeof row[col] === 'string' ? `"${row[col]}"` : row[col]
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_result_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadFromHistory = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Play className="h-8 w-8" />
          SQL Query Runner
        </h1>
        <p className="text-muted-foreground mt-2">
          Execute custom SQL queries against your PostgreSQL database
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Query Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your SQL query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[200px] font-mono"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={executeQuery} 
                  disabled={isExecuting || !query.trim()}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isExecuting ? 'Executing...' : 'Execute Query'}
                </Button>
                {result && result.rows.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={exportToCSV}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Query Results</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {result.rowCount} rows
                    </Badge>
                    <Badge variant="outline">
                      {result.executionTime}ms
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.rows.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No rows returned
                  </div>
                ) : (
                  <div className="overflow-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {result.columns.map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.rows.map((row, index) => (
                          <TableRow key={index}>
                            {result.columns.map((column) => (
                              <TableCell key={column}>
                                {row[column] === null ? (
                                  <span className="text-muted-foreground italic">null</span>
                                ) : (
                                  String(row[column])
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Query History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No queries executed yet
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                      onClick={() => loadFromHistory(item.query)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {item.success ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {item.executedAt.toLocaleTimeString()}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.executionTime}ms
                        </Badge>
                      </div>
                      <div className="text-sm font-mono truncate">
                        {item.query}
                      </div>
                      {item.error && (
                        <div className="text-xs text-red-500 mt-1 truncate">
                          {item.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                'SELECT * FROM users LIMIT 10;',
                'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';',
                'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\';',
                'SELECT COUNT(*) FROM students;',
                'EXPLAIN ANALYZE SELECT * FROM employees;'
              ].map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left font-mono text-xs"
                  onClick={() => setQuery(template)}
                >
                  {template}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SQLRunner;