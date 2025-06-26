
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Play, History, Download, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QueryResult {
  columns: string[];
  rows: any[][];
  execution_time: number;
  row_count: number;
}

interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  execution_time: number;
  success: boolean;
}

const SQLRunner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);

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

    try {
      const startTime = Date.now();
      const response = await fetch('/api/admin/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(data.error || 'Query execution failed');
      }

      setResult({
        ...data,
        execution_time: executionTime
      });

      // Add to history
      const historyEntry: QueryHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        execution_time: executionTime,
        success: true
      };
      setQueryHistory(prev => [historyEntry, ...prev.slice(0, 9)]);

      toast({
        title: "Success",
        description: `Query executed successfully in ${executionTime}ms`
      });

    } catch (error: any) {
      setError(error.message);
      
      // Add failed query to history
      const historyEntry: QueryHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        execution_time: 0,
        success: false
      };
      setQueryHistory(prev => [historyEntry, ...prev.slice(0, 9)]);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const exportResults = () => {
    if (!result) return;

    const csvContent = [
      result.columns.join(','),
      ...result.rows.map(row => 
        row.map(cell => `"${String(cell || '')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_results_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const loadQueryFromHistory = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  const commonQueries = [
    {
      name: "Show all tables",
      query: "SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    },
    {
      name: "Show table columns",
      query: "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'your_table_name';"
    },
    {
      name: "Show database size",
      query: "SELECT pg_size_pretty(pg_database_size(current_database())) as database_size;"
    },
    {
      name: "Show table sizes",
      query: "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
    }
  ];

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
        
        <h1 className="text-3xl font-bold">SQL Query Runner</h1>
        <p className="text-muted-foreground">
          Execute custom SQL queries against your PostgreSQL database
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Query Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
                className="min-h-[200px] font-mono"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={executeQuery}
                  disabled={isExecuting || !query.trim()}
                >
                  {isExecuting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Query
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setQuery('')}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Query Results</CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{result.row_count} rows</span>
                    <span>•</span>
                    <span>{result.execution_time}ms</span>
                    <Button size="sm" variant="outline" onClick={exportResults}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96">
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
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className="max-w-xs truncate">
                              {String(cell || '')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {commonQueries.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => setQuery(item.query)}
                >
                  {item.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Query History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queryHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">No queries executed yet</p>
              ) : (
                <div className="space-y-2">
                  {queryHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 border rounded cursor-pointer hover:bg-muted"
                      onClick={() => loadQueryFromHistory(item.query)}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-xs ${item.success ? 'text-green-600' : 'text-red-600'}`}>
                          {item.success ? 'SUCCESS' : 'ERROR'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm font-mono truncate mt-1">
                        {item.query}
                      </p>
                      {item.success && (
                        <span className="text-xs text-muted-foreground">
                          {item.execution_time}ms
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SQLRunner;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Download, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QueryResult {
  columns: string[];
  rows: any[][];
  row_count: number;
  execution_time?: number;
  message?: string;
}

interface QueryHistory {
  query: string;
  timestamp: Date;
  success: boolean;
  row_count?: number;
  execution_time?: number;
  error?: string;
}

const SQLRunner = () => {
  const [query, setQuery] = useState('SELECT * FROM students LIMIT 10;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QueryHistory[]>([]);

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/admin/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        setResult({ ...data, execution_time: executionTime });
        setHistory(prev => [
          {
            query,
            timestamp: new Date(),
            success: true,
            row_count: data.row_count,
            execution_time: executionTime
          },
          ...prev.slice(0, 9) // Keep last 10 queries
        ]);
      } else {
        setError(data.error);
        setHistory(prev => [
          {
            query,
            timestamp: new Date(),
            success: false,
            error: data.error,
            execution_time: executionTime
          },
          ...prev.slice(0, 9)
        ]);
      }
    } catch (err) {
      const executionTime = Date.now() - startTime;
      const errorMessage = 'Network error or server unavailable';
      setError(errorMessage);
      setHistory(prev => [
        {
          query,
          timestamp: new Date(),
          success: false,
          error: errorMessage,
          execution_time: executionTime
        },
        ...prev.slice(0, 9)
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!result || !result.rows.length) return;

    const csv = [
      result.columns.join(','),
      ...result.rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exampleQueries = [
    'SELECT * FROM students LIMIT 10;',
    'SELECT COUNT(*) as total_students FROM students;',
    'SELECT * FROM classes WHERE created_at >= CURRENT_DATE - INTERVAL \'30 days\';',
    'SELECT students.ho_ten, classes.ten_lop FROM students JOIN enrollments ON students.id = enrollments.student_id JOIN classes ON enrollments.class_id = classes.id;',
    'SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = \'public\' ORDER BY table_name, ordinal_position;'
  ];

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
            <h1 className="text-2xl font-bold">SQL Query Runner</h1>
          </div>
          <p className="text-muted-foreground">Execute custom SQL queries against your database</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Query Editor
                <div className="flex gap-2">
                  <Button onClick={executeQuery} disabled={loading || !query.trim()}>
                    <Play className="w-4 h-4 mr-2" />
                    {loading ? 'Executing...' : 'Execute'}
                  </Button>
                  {result && result.rows.length > 0 && (
                    <Button variant="outline" onClick={exportResults}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your SQL query here..."
                className="min-h-32 font-mono"
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    executeQuery();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Press Ctrl+Enter to execute. Only SELECT queries are allowed for safety.
              </p>
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
                <div className="flex items-center justify-between">
                  <CardTitle>Query Results</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {result.row_count} rows
                    </Badge>
                    {result.execution_time && (
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {result.execution_time}ms
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.rows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          {result.columns.map((column, index) => (
                            <th key={index} className="text-left p-2 font-medium">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b hover:bg-muted/50">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="p-2">
                                <div className="max-w-xs truncate" title={cell?.toString()}>
                                  {cell?.toString() || '—'}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {result.message || 'Query executed successfully with no results.'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Queries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {exampleQueries.map((exampleQuery, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-2 whitespace-normal"
                  onClick={() => setQuery(exampleQuery)}
                >
                  <code className="text-xs">{exampleQuery}</code>
                </Button>
              ))}
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Query History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => setQuery(item.query)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={item.success ? 'default' : 'destructive'}>
                        {item.success ? 'Success' : 'Error'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.execution_time}ms
                      </span>
                    </div>
                    <code className="text-xs block truncate">
                      {item.query}
                    </code>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.timestamp.toLocaleTimeString()}
                      {item.success && item.row_count !== undefined && ` • ${item.row_count} rows`}
                    </div>
                    {item.error && (
                      <div className="text-xs text-red-600 mt-1">{item.error}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SQLRunner;
