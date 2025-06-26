
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { Employee, Facility } from '@/lib/types';

interface ClockInRecord {
  id: string;
  employee_id: string;
  clock_in_time: string;
  clock_out_time?: string;
  work_date: string;
  location_lat?: number;
  location_lng?: number;
  facility_id?: string;
  location_verified: boolean;
  notes?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const EmployeeClockIn = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clockInRecords, setClockInRecords] = useState<ClockInRecord[]>([]);
  const [nearbyFacility, setNearbyFacility] = useState<Facility | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
    fetchFacilities();
    fetchTodayClockIns();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhân viên',
        variant: 'destructive',
      });
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/facilities');
      if (!response.ok) throw new Error('Failed to fetch facilities');
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách cơ sở',
        variant: 'destructive',
      });
    }
  };

  const fetchTodayClockIns = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/employee-clock-in?date=${today}`);
      if (!response.ok) throw new Error('Failed to fetch clock-ins');
      const data = await response.json();
      setClockInRecords(data);
    } catch (error) {
      console.error('Error fetching clock-ins:', error);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS không được hỗ trợ trên thiết bị này'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let errorMessage = 'Không thể lấy vị trí hiện tại';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Quyền truy cập vị trí bị từ chối';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Thông tin vị trí không khả dụng';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout khi lấy vị trí';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  const checkLocationAndClockIn = async () => {
    if (!selectedEmployee) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn nhân viên',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);

      // Find employee's assigned facilities
      const employee = employees.find(emp => emp.id === selectedEmployee);
      if (!employee || !employee.co_so_id || employee.co_so_id.length === 0) {
        toast({
          title: 'Lỗi',
          description: 'Nhân viên chưa được phân công cơ sở',
          variant: 'destructive',
        });
        setIsLoadingLocation(false);
        return;
      }

      // Check if employee is within 20m of any assigned facility
      let isWithinRange = false;
      let closestFacility: Facility | null = null;
      let minDistance = Infinity;

      for (const facilityId of employee.co_so_id) {
        const facility = facilities.find(f => f.id === facilityId);
        if (facility && facility.latitude && facility.longitude) {
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            facility.latitude,
            facility.longitude
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestFacility = facility;
          }

          if (distance <= 20) {
            isWithinRange = true;
            break;
          }
        }
      }

      setNearbyFacility(closestFacility);

      if (!isWithinRange) {
        toast({
          title: 'Cảnh báo vị trí',
          description: `Bạn đang cách cơ sở gần nhất ${Math.round(minDistance)}m. Cần ở trong bán kính 20m để chấm công.`,
          variant: 'destructive',
        });
        setIsLoadingLocation(false);
        return;
      }

      // Proceed with clock-in
      await performClockIn(location, closestFacility, true);

    } catch (error) {
      console.error('Location error:', error);
      toast({
        title: 'Lỗi GPS',
        description: error instanceof Error ? error.message : 'Không thể lấy vị trí hiện tại',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const performClockIn = async (location: LocationData, facility: Facility | null, locationVerified: boolean) => {
    setIsSubmitting(true);
    try {
      const clockInData = {
        employee_id: selectedEmployee,
        clock_in_time: new Date().toISOString(),
        work_date: new Date().toISOString().split('T')[0],
        location_lat: location.latitude,
        location_lng: location.longitude,
        facility_id: facility?.id,
        location_verified: locationVerified,
        notes: locationVerified ? 'Vị trí đã được xác thực' : 'Chấm công thủ công - chưa xác thực vị trí'
      };

      const response = await fetch('/api/employee-clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clockInData),
      });

      if (!response.ok) throw new Error('Failed to clock in');

      toast({
        title: 'Thành công',
        description: 'Chấm công thành công!',
        variant: 'default',
      });

      // Reset form and refresh data
      setSelectedEmployee('');
      setCurrentLocation(null);
      setNearbyFacility(null);
      fetchTodayClockIns();

    } catch (error) {
      console.error('Clock-in error:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể chấm công. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmployeeClockInStatus = (employeeId: string) => {
    return clockInRecords.find(record => record.employee_id === employeeId);
  };

  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chấm công nhân viên</h1>
        <Badge variant="outline" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {employees.length} nhân viên
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clock-in Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Chấm công
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Chọn nhân viên</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên để chấm công" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => {
                    const clockInStatus = getEmployeeClockInStatus(employee.id);
                    return (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{employee.ten_nhan_vien}</span>
                          {clockInStatus && (
                            <Badge variant="secondary" className="ml-2">
                              Đã chấm công
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedEmployeeData && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedEmployeeData.ten_nhan_vien}</p>
                <p className="text-sm text-muted-foreground">{selectedEmployeeData.chuc_vu}</p>
                <p className="text-sm text-muted-foreground">{selectedEmployeeData.bo_phan}</p>
              </div>
            )}

            {currentLocation && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Vị trí hiện tại</span>
                </div>
                <p className="text-sm text-green-700">
                  Lat: {currentLocation.latitude.toFixed(6)}, Lng: {currentLocation.longitude.toFixed(6)}
                </p>
                <p className="text-sm text-green-700">
                  Độ chính xác: ±{Math.round(currentLocation.accuracy)}m
                </p>
                {nearbyFacility && (
                  <p className="text-sm text-green-700 mt-1">
                    Cơ sở: {nearbyFacility.ten_co_so}
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={checkLocationAndClockIn}
              disabled={!selectedEmployee || isLoadingLocation || isSubmitting}
              className="w-full"
            >
              {isLoadingLocation && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoadingLocation ? 'Đang lấy vị trí...' : isSubmitting ? 'Đang chấm công...' : 'Chấm công với GPS'}
            </Button>

            <Button
              variant="outline"
              onClick={() => selectedEmployee && performClockIn(
                { latitude: 0, longitude: 0, accuracy: 0 },
                null,
                false
              )}
              disabled={!selectedEmployee || isSubmitting}
              className="w-full"
            >
              Chấm công thủ công (không xác thực vị trí)
            </Button>
          </CardContent>
        </Card>

        {/* Today's Clock-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Chấm công hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clockInRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Chưa có ai chấm công hôm nay
                </p>
              ) : (
                clockInRecords.map((record) => {
                  const employee = employees.find(emp => emp.id === record.employee_id);
                  const facility = facilities.find(f => f.id === record.facility_id);
                  
                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{employee?.ten_nhan_vien || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.clock_in_time).toLocaleTimeString('vi-VN')}
                        </p>
                        {facility && (
                          <p className="text-xs text-muted-foreground">{facility.ten_co_so}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {record.location_verified ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            GPS OK
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Thủ công
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeClockIn;
