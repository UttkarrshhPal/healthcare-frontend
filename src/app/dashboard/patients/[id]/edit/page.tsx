'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PatientForm } from '@/components/forms/PatientForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { patientApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
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
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Patient</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm patient={patient} isEdit />
        </CardContent>
      </Card>
    </div>
  );
}