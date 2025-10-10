"use client";

import * as React from "react";
import { z } from "zod";
import { User, Mail, Phone, Globe, MapPin, Calendar, FileText, Badge as BadgeIcon } from "lucide-react";
import { Toaster, toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TagsInput } from "@/components/tags-input";

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional().default(""),
  skills: z.array(z.string()).default([]),
  resume: z.string().url().optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.union([z.string(), z.date()]).optional(),
  country: z.string().optional(),
  nationality: z.string().optional(),
  willingToRelocate: z.enum(["yes", "no"]).optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  softSkill: z.array(z.string()).default([]),
  technicalSkill: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof Schema>;

const initialData: FormValues = {
  name: "",
  location: "",
  skills: [],
  resume: "",
  status: "Active",
  gender: undefined,
  dateOfBirth: undefined,
  country: "",
  nationality: "",
  willingToRelocate: undefined,
  description: "",
  phone: "",
  email: "",
  softSkill: [],
  technicalSkill: [],
};

export default function ProtectedCandidateFormPage() {
  const [formData, setFormData] = React.useState<FormValues>(initialData);

  const toDateInputValue = (d?: string | Date) => {
    if (!d) return "";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (isNaN(dt.getTime())) return "";
    return dt.toISOString().slice(0, 10);
  };

  const onSubmit = () => {
    // Validate using Zod
    const parsed = Schema.safeParse(formData);
    if (!parsed.success) {
      const firstErr = parsed.error.issues[0];
      toast.error("Validation error", { description: `${firstErr.path.join(".")}: ${firstErr.message}` });
      return;
    }
    // Normalize date string to ISO if needed
    const values = parsed.data;
    let payload = { ...values } as any;
    if (values.dateOfBirth) {
      const d = typeof values.dateOfBirth === "string" ? new Date(values.dateOfBirth) : values.dateOfBirth;
      if (!isNaN(d.getTime())) payload.dateOfBirth = d.toISOString();
    }
    console.log("Submitted Candidate:", payload);
    toast.success("Candidate saved", { description: "Your changes have been saved successfully." });
  };

  const { skills, softSkill, technicalSkill, gender, willingToRelocate, status } = formData;

  return (
    <div className="w-full bg-gradient-to-b from-purple-50 via-sky-50 to-emerald-50">
      <div className="container mx-auto max-w-5xl px-6">
        <Card className="border-primary/10">
          <CardHeader className="border-b">
            <div className="flex items-start justify-center ">
              <div>
                <CardTitle className="text-2xl items-center">Candidate Form</CardTitle>
                <CardDescription>Manage candidate profile details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-10">
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-3">Personal Information</h4>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Phone number"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center gap-2"><Globe className="h-4 w-4" /> Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={formData.country || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="flex items-center gap-2"><BadgeIcon className="h-4 w-4" /> Nationality</Label>
                    <Input
                      id="nationality"
                      placeholder="Nationality"
                      value={formData.nationality || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, nationality: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Resume URL</Label>
                    <Input
                      id="resume"
                      placeholder="https://..."
                      value={formData.resume || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, resume: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={toDateInputValue(formData.dateOfBirth)}
                      onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
                    />
                  </div>


                  <div className="space-y-2">
                    <Label className="block">Gender</Label>
                    <Select
                      value={gender}
                      onValueChange={(v: "male" | "female" | "other") =>
                        setFormData((p) => ({ ...p, gender: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="block">Willing to Relocate</Label>
                    <Select
                      value={willingToRelocate}
                      onValueChange={(v: "yes" | "no") =>
                        setFormData((p) => ({ ...p, willingToRelocate: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </section>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-3">Skills & Summary</h4>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* <div className="space-y-2">
                    <Label>Skills</Label>
                    <TagsInput
                      name="skills"
                      value={skills}
                      onChange={(v) => setFormData((p) => ({ ...p, skills: v }))}
                      placeholder="Type a skill and press Enter"
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label>Soft Skills</Label>
                    <TagsInput
                      name="softSkill"
                      value={softSkill}
                      onChange={(v) => setFormData((p) => ({ ...p, softSkill: v }))}
                      placeholder="Type a soft skill and press Enter"
                    />
                  </div>

                  <div className="space-y-2 ">
                    <Label>Technical Skills</Label>
                    <TagsInput
                      name="technicalSkill"
                      value={technicalSkill}
                      onChange={(v) => setFormData((p) => ({ ...p, technicalSkill: v }))}
                      placeholder="Type a technical skill and press Enter"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={5}
                      placeholder="About the candidate"
                      value={formData.description || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                </section>
              </div>

              <CardFooter className="flex items-center justify-end gap-3 p-0">
                <Button type="button" variant="secondary" onClick={() => setFormData(initialData)}>
                  Reset
                </Button>
                <Button type="button" onClick={onSubmit}>
                  Submit From
                </Button>
              </CardFooter>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors />
    </div>
  );
}
