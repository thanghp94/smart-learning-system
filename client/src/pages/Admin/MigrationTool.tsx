import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Database, ArrowRight, AlertTriangle } from 'lucide-react';

interface MigrationResult {
  table: string;
  success: boolean;
  recordCount: number;
  error?: string;
}

interface MigrationResponse {
  success: boolean;
  summary: {
    totalTables: number;
    successfulMigrations: number;
    failedMigrations: number;
    totalRecords: number;
  };
  results: MigrationResult[];
  successful: MigrationResult[];
  failed: MigrationResult[];
}

const MigrationTool: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [migrationResults, setMigrationResults] = useState<MigrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startMigration = async () => {
    setIsRunning(true);
    setError(null);
    setMigrationResults(null);

    try {
      const response = await fetch('/api/admin/migrate-to-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Migration failed: ${response.statusText}`);
      }

      const data: MigrationResponse = await response.json();
      setMigrationResults(data);
      
      if (!data.success) {
        setError(`Migration completed with ${data.failed.length} failures`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Success
      </Badge>
    ) : (
      <Badge variant="destructive">
        Failed
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            PostgreSQL to Supabase Migration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">PostgreSQL</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Supabase</span>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This will migrate all data from your current PostgreSQL database to Supabase. 
                Make sure you have configured your Supabase credentials properly before starting.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={startMigration} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? 'Migrating Data...' : 'Start Migration'}
            </Button>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Migration in progress...</span>
                </div>
                <Progress value={undefined} className="animate-pulse" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {migrationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {migrationResults.summary.totalTables}
                  </div>
                  <div className="text-sm text-gray-600">Total Tables</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {migrationResults.summary.successfulMigrations}
                  </div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {migrationResults.summary.failedMigrations}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {migrationResults.summary.totalRecords.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Records Migrated</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Table Migration Details</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {migrationResults.results.map((result) => (
                    <div
                      key={result.table}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.success)}
                        <span className="font-medium">{result.table}</span>
                        {getStatusBadge(result.success)}
                      </div>
                      <div className="text-right">
                        {result.success ? (
                          <span className="text-sm text-gray-600">
                            {result.recordCount.toLocaleString()} records
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 max-w-xs truncate">
                            {result.error}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failed Migrations Details */}
              {migrationResults.failed.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-red-600">Failed Migrations</h3>
                  <div className="space-y-2">
                    {migrationResults.failed.map((result) => (
                      <Alert key={result.table} variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{result.table}</strong>: {result.error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {migrationResults.success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Migration completed successfully! All {migrationResults.summary.totalRecords.toLocaleString()} records 
                    have been transferred to Supabase. Your application will now use Supabase as the primary database.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MigrationTool;