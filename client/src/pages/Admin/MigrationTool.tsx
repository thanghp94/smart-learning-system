import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Database, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MigrationResult {
  table: string;
  success: boolean;
  recordCount: number;
  error?: string;
}

interface MigrationStatus {
  supabaseAvailable: boolean;
  postgresAvailable: boolean;
  currentDatabase: string;
  error?: string;
}

const MigrationTool: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [migrationResults, setMigrationResults] = useState<MigrationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const { toast } = useToast();

  const tables = [
    'students', 'employees', 'facilities', 'classes', 'teaching_sessions',
    'enrollments', 'attendances', 'assets', 'tasks', 'files', 'contacts',
    'requests', 'employee_clock_ins', 'evaluations', 'payroll', 'admissions',
    'images', 'finances', 'asset_transfers', 'activities', 'events'
  ];

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    try {
      const response = await fetch('/api/migrate/status');
      const status = await response.json();
      setMigrationStatus(status);
    } catch (error) {
      console.error('Failed to check migration status:', error);
      toast({
        title: "Error",
        description: "Failed to check database status",
        variant: "destructive"
      });
    }
  };

  const migrateTable = async (tableName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/migrate/table/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      setMigrationResults(prev => [...prev.filter(r => r.table !== tableName), result]);
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.success 
          ? `Migrated ${result.recordCount} records from ${tableName}`
          : `Failed to migrate ${tableName}: ${result.error}`,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error(`Failed to migrate ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Migration failed for ${tableName}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const migrateAllTables = async () => {
    setIsLoading(true);
    setMigrationResults([]);
    
    try {
      const response = await fetch('/api/migrate/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const results = await response.json();
      setMigrationResults(results);
      
      const successful = results.filter((r: MigrationResult) => r.success).length;
      const totalRecords = results.reduce((sum: number, r: MigrationResult) => sum + r.recordCount, 0);
      
      toast({
        title: "Migration Complete",
        description: `Migrated ${successful}/${results.length} tables with ${totalRecords} total records`,
        variant: successful === results.length ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Full migration failed:', error);
      toast({
        title: "Error",
        description: "Full migration failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const selectAllTables = () => {
    setSelectedTables(tables);
  };

  const deselectAllTables = () => {
    setSelectedTables([]);
  };

  const migrateSelectedTables = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No Tables Selected",
        description: "Please select tables to migrate",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const results: MigrationResult[] = [];

    for (const tableName of selectedTables) {
      try {
        const response = await fetch(`/api/migrate/table/${tableName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        results.push(result);
        setMigrationResults(prev => [...prev.filter(r => r.table !== tableName), result]);
      } catch (error) {
        console.error(`Failed to migrate ${tableName}:`, error);
        results.push({
          table: tableName,
          success: false,
          recordCount: 0,
          error: 'Network error'
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    const totalRecords = results.reduce((sum, r) => sum + r.recordCount, 0);

    toast({
      title: "Selected Migration Complete",
      description: `Migrated ${successful}/${results.length} selected tables with ${totalRecords} total records`,
      variant: successful === results.length ? "default" : "destructive"
    });

    setIsLoading(false);
  };

  if (!migrationStatus) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin mr-2" />
        Checking database status...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Database Migration Tool</h1>
        <Button onClick={checkMigrationStatus} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Database Status
          </CardTitle>
          <CardDescription>
            Current database configuration and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant={migrationStatus.postgresAvailable ? "default" : "destructive"}>
                {migrationStatus.postgresAvailable ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                PostgreSQL
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={migrationStatus.supabaseAvailable ? "default" : "secondary"}>
                {migrationStatus.supabaseAvailable ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                Supabase
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Current:</span>
              <Badge variant="outline">{migrationStatus.currentDatabase}</Badge>
            </div>
          </div>
          
          {migrationStatus.error && (
            <Alert className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{migrationStatus.error}</AlertDescription>
            </Alert>
          )}

          {!migrationStatus.supabaseAvailable && (
            <Alert className="mt-4">
              <AlertDescription>
                Supabase is not available. Please check your Supabase configuration (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) and ensure your Supabase instance is running.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Migration Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowRight className="w-5 h-5 mr-2" />
            Migration Controls
          </CardTitle>
          <CardDescription>
            Migrate data from PostgreSQL to Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={migrateAllTables}
              disabled={isLoading || !migrationStatus.supabaseAvailable}
              className="flex items-center"
            >
              {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              Migrate All Tables
            </Button>
            <Button 
              onClick={migrateSelectedTables}
              disabled={isLoading || !migrationStatus.supabaseAvailable || selectedTables.length === 0}
              variant="outline"
            >
              Migrate Selected ({selectedTables.length})
            </Button>
            <Button onClick={selectAllTables} variant="outline" size="sm">
              Select All
            </Button>
            <Button onClick={deselectAllTables} variant="outline" size="sm">
              Deselect All
            </Button>
          </div>

          {/* Table Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {tables.map(table => (
              <div
                key={table}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedTables.includes(table)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => toggleTableSelection(table)}
              >
                <div className="text-xs font-medium">{table}</div>
                {migrationResults.find(r => r.table === table) && (
                  <div className="text-xs mt-1">
                    {migrationResults.find(r => r.table === table)?.success ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Migration Results */}
      {migrationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Results</CardTitle>
            <CardDescription>
              Results from the latest migration operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {migrationResults.map(result => (
                <div 
                  key={result.table}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex items-center space-x-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">{result.table}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.recordCount} records
                    </Badge>
                    {result.error && (
                      <span className="text-sm text-red-500">{result.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-muted rounded">
              <div className="text-sm">
                <strong>Summary:</strong> {migrationResults.filter(r => r.success).length}/{migrationResults.length} tables migrated successfully
              </div>
              <div className="text-sm">
                <strong>Total records:</strong> {migrationResults.reduce((sum, r) => sum + r.recordCount, 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MigrationTool;