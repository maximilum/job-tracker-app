"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

export interface JobFormData {
  company: string;
  position: string;
  location?: string;
  status: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string;
  description?: string;
}

interface JobFormProps {
  initialData?: Partial<JobFormData>;
  submitLabel: string;
  isSubmitting?: boolean;
  error?: string;
  onSubmit: (data: JobFormData) => Promise<void> | void;
  onCancel?: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({
  initialData,
  submitLabel,
  isSubmitting = false,
  error,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<JobFormData>(() => ({
    company: initialData?.company || "",
    position: initialData?.position || "",
    location: initialData?.location || "",
    status: initialData?.status || "applied",
    notes: initialData?.notes || "",
    salary: initialData?.salary || "",
    jobUrl: initialData?.jobUrl || "",
    tags: initialData?.tags || "",
    description: initialData?.description || "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 text-xs bg-destructive/10 text-destructive rounded border border-destructive/20">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-start gap-4">
        {/* Company */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
          <label htmlFor="company" className="w-24 shrink-0 text-sm font-medium">
            Company*
          </label>
          <input
            id="company"
            required
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none"
            name="company"
            type="text"
            placeholder="Apple, Google, ..."
          />
        </div>

        {/* Position */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
          <label htmlFor="position" className="w-24 shrink-0 text-sm font-medium">
            Position*
          </label>
          <input
            id="position"
            required
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            name="position"
            type="text"
            className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none"
            placeholder="Software Engineer"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
          <label htmlFor="location" className="w-24 shrink-0 text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            name="location"
            type="text"
            className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none"
            placeholder="Remote, Riyadh, SF..."
          />
        </div>

        {/* Status */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
          <label htmlFor="status" className="w-24 shrink-0 text-sm font-medium">
            Status
          </label>
          <input
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            name="status"
            type="text"
            className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none"
            placeholder="applied, interviewing..."
          />
        </div>

        {/* Salary */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
          <label htmlFor="salary" className="w-24 shrink-0 text-sm font-medium">
            Salary
          </label>
          <input
            id="salary"
            value={formData.salary}
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
            type="text"
            name="salary"
            className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none"
            placeholder="$120k - $140k"
          />
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start">
        <label htmlFor="tags" className="w-24 shrink-0 sm:mt-1 text-sm font-medium">
          Tags
        </label>
        <div className="w-full">
          <input
            id="tags"
            value={formData.tags}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value,
              })
            }
            type="text"
            placeholder="React, Next.js, Frontend"
            name="tags"
            className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Separate tags with commas
          </p>
        </div>
      </div>

      {/* Job URL */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center">
        <label htmlFor="url" className="w-24 shrink-0 text-sm font-medium">
          Job URL
        </label>
        <input
          id="url"
          value={formData.jobUrl}
          onChange={(e) =>
            setFormData({ ...formData, jobUrl: e.target.value })
          }
          type="text"
          name="url"
          className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none"
          placeholder="https://..."
        />
      </div>

      {/* Description */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start">
        <label htmlFor="description" className="w-24 shrink-0 sm:mt-1 text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          name="description"
          className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
          rows={3}
          placeholder="Job requirements, responsibilities..."
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-start">
        <label htmlFor="notes" className="w-24 shrink-0 sm:mt-1 text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          name="notes"
          className="border rounded px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
          rows={2}
          placeholder="Recruiter contact, interview prep..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
