
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/personal-dashboard">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <UserCircle className="h-6 w-6" />
            <span>Personal Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
