'use client'

import { useState } from "react";
import { X, Upload, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { usePostResumeMutation } from "../(auth)/api/resume/resumeApi";
import { useTranslations } from "next-intl";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancyId: string;
  vacancyTitle: string;
  companyName: string;
}

export function ApplicationModal({
  isOpen,
  onClose,
  vacancyId,
  vacancyTitle,
  companyName,
}: ApplicationModalProps) {
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", cover_letter: "" });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let t = useTranslations("ApplicationModal")

  const [postResume] = usePostResumeMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setResumeFile(file);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name) {
      toast.error("Full name is required");
      return;
    }

    if (!resumeFile) {
      toast.error("Please attach your resume file");
      return;
    }

    setIsSubmitting(true);

    try {
      await postResume({ full_name: formData.full_name, file: resumeFile }).unwrap();
      toast.success("Resume uploaded successfully!");
      setFormData({ full_name: "", email: "", phone: "", cover_letter: "" });
      setResumeFile(null);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ full_name: "", email: "", phone: "", cover_letter: "" });
      setResumeFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("1")} {vacancyTitle}</DialogTitle>
          <p className="text-muted-foreground">{companyName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">
              {t("2")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Optional fields */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@example.com"
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover_letter">{t("3")}</Label>
            <Textarea
              id="cover_letter"
              value={formData.cover_letter}
              onChange={e => setFormData({ ...formData, cover_letter: e.target.value })}
              placeholder={t("11")}
              className="min-h-[120px] rounded-xl resize-none"
              rows={6}
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume">{t("4")} <span className="text-red-500">*</span></Label>
            <div className="border-2 border-dashed rounded-xl p-6 hover:border-primary transition-colors">
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume" className="flex flex-col items-center gap-2 cursor-pointer">
                {resumeFile ? (
                  <div className="flex items-center gap-3 text-primary">
                    <FileText className="h-8 w-8" />
                    <div>
                      <p>{resumeFile.name}</p>
                      <p className="text-muted-foreground">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <p>{t("5")}</p>
                      <p className="text-muted-foreground">{t("6")}</p>
                    </div>
                  </>
                )}
              </label>
            </div>
            {resumeFile && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setResumeFile(null)}
                className="rounded-full"
              >
                <X className="mr-2 h-4 w-4" />
                {t("7")}
              </Button>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1 h-12 rounded-xl">
              {t("8")}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90">
              {isSubmitting ? t("10") : t("9")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
