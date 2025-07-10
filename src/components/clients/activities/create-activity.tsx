// create-activity.tsx
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Phone,
  Video,
  ClipboardList,
  Mail,
  Users,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Type,
  LayoutList,
  Paperclip
} from "lucide-react";
import { useState } from "react";

export function CreateActivityModal() {
  const [date, setDate] = useState<Date>();
  const [activityType, setActivityType] = useState("call");
  const [formData, setFormData] = useState({
    title: "",
    activity: "",
    date: "",
    startTime: "09:00",
    endTime: "09:15",
    location: "",
    relatedTo: "",
    assignees: "",
    attendees: "",
    onlineMeetingType: "manual",
    onlineMeetingUrl: "",
    importance: "low",
    description: "",
    attachments: [] as File[],
    sharedWithGuests: false,
    inviteAsBcc: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('https://aems-backend.onrender.com/api/activities', formData);
    } catch (error: any) {
      console.error('Error creating activity:', error.response.data);
    }
  };

  const handleInputChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const handleSelectChange = (key: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckboxChange = (key: string) => (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...fileList],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // Calculate duration in minutes
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;

    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  };

  const duration = calculateDuration();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(newDate, "yyyy-MM-dd"),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        date: "",
      }));
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Create Activity</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 py-4">
          {/* Add the rest of the content here */}
        </div>
         
        <div className="space-y-2">
            <Label htmlFor="title">Add Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleInputChange("title")}
              placeholder="Enter activity title"
              required
            />
          </div>

          <Tabs value={activityType} onValueChange={setActivityType} className="w-full">
            <TabsList className="grid w-full grid-cols-5 gap-4">
              <TabsTrigger value="call" className="data-[state=active]:bg-blue-100">
                <Phone className="h-4 w-4 mr-2" />
                CALL
              </TabsTrigger>
              <TabsTrigger value="meeting" className="data-[state=active]:bg-blue-100">
                <Video className="h-4 w-4 mr-2" />
                MEETING
              </TabsTrigger>
              <TabsTrigger value="task" className="data-[state=active]:bg-blue-100">
                <ClipboardList className="h-4 w-4 mr-2" />
                TASK
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-blue-100">
                <Mail className="h-4 w-4 mr-2" />
                EMAIL
              </TabsTrigger>
              <TabsTrigger value="interview" className="data-[state=active]:bg-blue-100">
                <Users className="h-4 w-4 mr-2" />
                INTERVIEW
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-[2fr,1fr,1fr] gap-4 items-center">

            <div className="relative flex items-center">
              <Input
                id="date"
                type="date"
                placeholder="Select date"
                value={formData.date}
                onChange={handleInputChange("date")}
                className="w-full inline-block"
              />
            </div>


            <Input
              type="time"
              value={formData.startTime}
              onChange={handleInputChange("startTime")}
            />
            <Input
              type="time"
              value={formData.endTime}
              onChange={handleInputChange("endTime")}
            />
            <div className="col-span-3 text-muted-foreground text-sm">
              ({duration} Minutes)
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="share"
              checked={formData.sharedWithGuests}
              onCheckedChange={handleCheckboxChange("sharedWithGuests")}
            />
            <label
              htmlFor="share"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Share with guests
            </label>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={handleInputChange("location")}
              placeholder="Search Location"
            />
          </div>

          <div className="space-y-2">
            <Label>Related to</Label>
            <Input
              value={formData.relatedTo}
              onChange={handleInputChange("relatedTo")}
              placeholder="Client"
            />
          </div>

          <div className="space-y-2">
            <Label>Assignees</Label>
            <Input
              value={formData.assignees}
              onChange={handleInputChange("assignees")}
              placeholder="Enter the email address of assignee"
            />
          </div>

          <div className="space-y-2">
            <Label>Attendees</Label>
            <Input
              value={formData.attendees}
              onChange={handleInputChange("attendees")}
              placeholder="Enter the email address of attendees"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="bcc"
                checked={formData.inviteAsBcc}
                onCheckedChange={handleCheckboxChange("inviteAsBcc")}
              />
              <label
                htmlFor="bcc"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Invite as BCC
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Online meeting type</Label>
            <Select
              value={formData.onlineMeetingType}
              onValueChange={handleSelectChange("onlineMeetingType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Manual URL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual URL</SelectItem>
                <SelectItem value="zoom">Zoom Meeting</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
                <SelectItem value="meet">Google Meet</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter the URL"
              className="mt-2"
              value={formData.onlineMeetingUrl}
              onChange={handleInputChange("onlineMeetingUrl")}
            />
          </div>

          <div className="space-y-2">
            <Label>Importance</Label>
            <Select
              value={formData.importance}
              onValueChange={handleSelectChange("importance")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <div className="border rounded-lg">
              <div className="flex flex-wrap gap-0.5 border-b p-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Underline className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <div className="h-8 w-[1px] bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Link2 className="h-4 w-4" />
                </Button>
                <div className="h-8 w-[1px] bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="h-8 w-[1px] bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <AlignRight className="h-4 w-4" />
                </Button>
                <div className="h-8 w-[1px] bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <div className="h-8 w-[1px] bg-border mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Type className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Add description"
                className="border-0 rounded-none min-h-[200px]"
                value={formData.description}
                onChange={handleInputChange("description")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Paperclip className="h-8 w-8 text-muted-foreground" />
                <div className="relative">
                <Button variant="secondary" className="mt-2">Select Files</Button>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
              <p className="text-sm text-muted-foreground">or drop files here</p>
              <p className="text-xs text-muted-foreground mt-2">
                Supported file types (max 20MB): .doc, .docx, .gif, .jpeg, .jpg, .odt,
.pdf, .png, .rar, .svg, .xls, .xlsx, .zip, .mov, .mp4, .avi, .pptx
              </p>
            </div>
          </div>

          {formData.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
              <ul className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <div className="flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      type="button"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" className="mr-2" type="button">Cancel</Button>
          <Button type="submit">Create Activity</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}  