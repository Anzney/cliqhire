"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { tempCandidateService, CreateTempCandidateRequest } from "@/services/tempCandidateService";

const CreateCandidateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  profileLink: z.string().min(1, "Profile Link is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export type CreateCandidateValues = z.infer<typeof CreateCandidateSchema>;

interface CreateCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineId: string;
  onSubmit?: (values: CreateCandidateValues) => void;
  tempCandidateData?: {
    name?: string;
    email?: string;
    phone?: string;
    profileLink?: string;
  };
}

export function CreateCandidateDialog({ open, onOpenChange, pipelineId, onSubmit, tempCandidateData }: CreateCandidateDialogProps) {
  const form = useForm<CreateCandidateValues>({
    resolver: zodResolver(CreateCandidateSchema),
    defaultValues: {
      name: tempCandidateData?.name || "",
      profileLink: tempCandidateData?.profileLink || "",
      email: tempCandidateData?.email || "",
      phone: tempCandidateData?.phone || "",
    },
  });

  // Reset form when tempCandidateData changes
  React.useEffect(() => {
    if (tempCandidateData) {
      form.reset({
        name: tempCandidateData.name || "",
        profileLink: tempCandidateData.profileLink || "",
        email: tempCandidateData.email || "",
        phone: tempCandidateData.phone || "",
      });
    }
  }, [tempCandidateData, form]);

  const handleSubmit = async (values: CreateCandidateValues) => {
    try {
      console.log('Form values:', values);
      console.log('Pipeline ID:', pipelineId);
      console.log('Pipeline ID type:', typeof pipelineId);
      console.log('Pipeline ID length:', pipelineId?.length);
      
      // Call the API service with pipelineId included
      const requestData = {
        ...values,
        pipelineId: pipelineId,
      };
      console.log('Request data:', requestData);
      
      const result = await tempCandidateService.createTempCandidate(requestData);
      console.log('API response:', result);
      
      // Call the optional onSubmit callback if provided
      if (onSubmit) {
        onSubmit(values);
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error creating temporary candidate:', error);
      // You might want to show an error message to the user here
      alert('Error creating candidate. Please check the console for details.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Candidate</DialogTitle>
          <DialogDescription>Enter candidate details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Link</FormLabel>
                  <FormControl>
                    <Input placeholder="LinkedIn or Profile URL" {...field} />
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
                    <Input placeholder="email@example.com" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


