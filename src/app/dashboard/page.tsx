'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      icon: Users,
      description: 'Registered patients',
    },
    {
      title: 'Active Doctors',
      value: '12',
      icon: UserCheck,
      description: 'Currently available',
    },
        {
      title: 'Appointments Today',
      value: '48',
      icon: Calendar,
      description: 'Scheduled for today',
    },
    {
      title: 'Active Cases',
      value: '89',
      icon: Activity,
      description: 'Currently in treatment',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your healthcare portal
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className='border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className='border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for {user?.role}s</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user?.role === 'receptionist' ? (
              <>
                <Link href="/dashboard/patients/new" className="block p-3 rounded-lg hover:bg-gray-200 bg-gray-100 border border-gray-200">
                  Register New Patient
                </Link>
                
              </>
            ) : (
              <>
                <Link href="/dashboard/patients" className="block p-3 rounded-lg  hover:bg-gray-200 bg-gray-100 border border-gray-200">
                  View Patient Records
                </Link>
                
              </>
            )}
          </CardContent>
        </Card>

        <Card className='border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm">New patient registered</p>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Medical record updated</p>
                <span className="text-xs text-muted-foreground">15 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Appointment scheduled</p>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}