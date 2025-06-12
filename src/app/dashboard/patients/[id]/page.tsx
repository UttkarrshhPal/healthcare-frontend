'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Phone, Mail, Calendar, Droplet } from 'lucide-react';
import { patientApi } from '@/lib/api';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const patientId = Number(params.id);

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientApi.getById(patientId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {patient.first_name} {patient.last_name}
          </h2>
        </div>
        {(user?.role === 'receptionist' || user?.role === 'doctor') && (
          <Button onClick={() => router.push(`/dashboard/patients/${patientId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Born on {format(new Date(patient.date_of_birth), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Blood Group: {patient.blood_group || 'Not specified'}</span>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="text-sm">{patient.gender}</p>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-sm">{patient.address || 'No address provided'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency & Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Emergency Contact</p>
              <p className="text-sm">{patient.emergency_contact || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Insurance Number</p>
              <p className="text-sm">{patient.insurance_number || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registered By</p>
              <p className="text-sm">{patient.registered_by_user?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated By</p>
              <p className="text-sm">{patient.last_updated_by_user?.name || 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Medical History</p>
              <p className="text-sm text-muted-foreground">
                {patient.medical_history || 'No medical history recorded'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Current Medication</p>
              <p className="text-sm text-muted-foreground">
                {patient.current_medication || 'No current medications'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Allergies</p>
              <p className="text-sm text-muted-foreground">
                {patient.allergies || 'No known allergies'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}