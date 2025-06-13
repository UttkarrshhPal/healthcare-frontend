"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { patientApi } from "@/lib/api";
import { Patient } from "@/types";

const patientSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  date_of_birth: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().optional(),
  medical_history: z.string().optional(),
  current_medication: z.string().optional(),
  allergies: z.string().optional(),
  emergency_contact: z.string().optional(),
  blood_group: z.string().optional(),
  insurance_number: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  isEdit?: boolean;
}

export function PatientForm({ patient, isEdit = false }: PatientFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: patient?.first_name || "",
      last_name: patient?.last_name || "",
      email: patient?.email || "",
      phone: patient?.phone || "",
      date_of_birth: patient?.date_of_birth
        ? patient.date_of_birth.split("T")[0]
        : "",
      gender: (patient?.gender as "Male" | "Female" | "Other") || "Male",
      address: patient?.address || "",
      medical_history: patient?.medical_history || "",
      current_medication: patient?.current_medication || "",
      allergies: patient?.allergies || "",
      emergency_contact: patient?.emergency_contact || "",
      blood_group: patient?.blood_group || "",
      insurance_number: patient?.insurance_number || "",
    },
  });

  async function onSubmit(values: PatientFormData) {
    try {
      setIsLoading(true);

      if (isEdit && patient) {
        await patientApi.update(patient.id, values);
        toast.success("Patient updated successfully");
      } else {
        await patientApi.create({
          ...values,
          email: values.email ?? "",
          address: values.address ?? "",
          medical_history: values.medical_history ?? "",
          current_medication: values.current_medication ?? "",
          allergies: values.allergies ?? "",
          emergency_contact: values.emergency_contact ?? "",
          blood_group: values.blood_group ?? "",
          insurance_number: values.insurance_number ?? "",
        });
        toast.success("Patient registered successfully");
      }

      router.push("/dashboard/patients");
    } catch {
      toast.error(
        isEdit ? "Failed to update patient" : "Failed to register patient"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    type="email"
                    {...field}
                    className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1234567890"
                    {...field}
                    className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary">
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergency_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1234567890"
                    {...field}
                    className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter full address"
                  {...field}
                  className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insurance_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="INS-123456"
                  {...field}
                  className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medical_history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Previous medical conditions, surgeries, etc."
                  {...field}
                  className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="current_medication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Medication</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List all current medications"
                  {...field}
                  className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List all known allergies"
                  {...field}
                  className="bg-gray-50 border border-gray-300 focus:ring-primary focus:border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-200"
            onClick={() => router.push("/dashboard/patients")}
          >
            Cancel
          </Button>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Patient"
              : "Register Patient"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
