"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { patientApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Patient } from "@/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/Spinner";

export default function PatientsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["patients", page],
    queryFn: () => patientApi.getAll(page, 10),
  });

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        await patientApi.search(searchQuery);
      } catch {
        toast.error("Failed to search patients");
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedPatientId) return;
    try {
      await patientApi.delete(selectedPatientId);
      toast.success("Patient deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete patient");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPatientId(null);
    }
  };

  return (
    <div className="space-y-6  min-h-screen p-6 rounded-md">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
        {user?.role === "receptionist" && (
          <Button
            onClick={() => router.push("/dashboard/patients/new")}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        )}
      </div>

      <Card className="bg-gray-50 border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="pl-8 bg-gray-100 border border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <Button
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              <Table className="rounded-md border border-gray-200">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Registered By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.patients?.map((patient: Patient) => (
                    <TableRow
                      key={patient.id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        {format(new Date(patient.date_of_birth), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{patient.blood_group || "-"}</TableCell>
                      <TableCell>
                        {patient.registered_by_user?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white border border-gray-200 shadow-md shadow-gray-100 w-44 rounded-md"
                          >
                            <DropdownMenuItem
                              className="hover:bg-gray-100 text-gray-800 cursor-pointer"
                              onClick={() =>
                                router.push(`/dashboard/patients/${patient.id}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            {(user?.role === "receptionist" ||
                              user?.role === "doctor") && (
                              <DropdownMenuItem
                                className="hover:bg-gray-100 text-gray-800 cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/patients/${patient.id}/edit`
                                  )
                                }
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {user?.role === "receptionist" && (
                              <DropdownMenuItem
                                className="text-red-600 hover:bg-red-50 hover:text-red-400 cursor-pointer"
                                onClick={() => {
                                  setSelectedPatientId(patient.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4 " />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {data?.patients?.length || 0} of {data?.total || 0}{" "}
                  patients
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-100 border border-gray-300 hover:bg-gray-200"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-100 border border-gray-300 hover:bg-gray-200"
                    onClick={() => setPage(page + 1)}
                    disabled={!data?.patients || data.patients.length < 10}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border border-gray-200 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
