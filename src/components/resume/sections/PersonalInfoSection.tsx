import React from "react";
import { PersonalInfo } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoSection: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <User className="h-3.5 w-3.5 text-primary" /> Full Name
          </Label>
          <Input
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="e.g. Alex Johnson"
            className="bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-primary" /> Email Address
          </Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="alex@example.com"
            className="bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
          </Label>
          <Input
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Location
          </Label>
          <Input
            value={data.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="City, Country"
            className="bg-card"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Linkedin className="h-3.5 w-3.5 text-primary" /> LinkedIn URL
          </Label>
          <Input
            value={data.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/username"
            className="bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Github className="h-3.5 w-3.5 text-primary" /> GitHub URL
          </Label>
          <Input
            value={data.github}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="github.com/username"
            className="bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Globe className="h-3.5 w-3.5 text-primary" /> Portfolio Website
          </Label>
          <Input
            value={data.portfolio}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder="https://portfolio.dev"
            className="bg-card"
          />
        </div>
      </div>
    </div>
  );
};
