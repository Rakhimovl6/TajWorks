'use client'

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useApplyVacancyMutation } from "../../(auth)/api/vacancy/vacancyApi";
import { useTranslations } from "next-intl";

interface VacancyApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    vacancyId: string;
    vacancyTitle: string;
    companyName: string;
}

export function VacancyApplyModal({
    isOpen,
    onClose,
    vacancyId,
    vacancyTitle,
    companyName,
}: VacancyApplyModalProps) {
    const [coverLetter, setCoverLetter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applyVacancy] = useApplyVacancyMutation();
    let t = useTranslations("VacancyApplyModal")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!coverLetter.trim()) {
            toast.error("Please write a cover letter");
            return;
        }

        setIsSubmitting(true);

        try {
            await applyVacancy({ vacancyId, cover_letter: coverLetter }).unwrap();
            toast.success("Application sent successfully!");
            setCoverLetter("");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to send application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setCoverLetter("");
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle> {t("1")} {vacancyTitle}</DialogTitle>
                    <p className="text-muted-foreground">{companyName}</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="cover_letter">{t("2")} <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="cover_letter"
                            value={coverLetter}
                            onChange={e => setCoverLetter(e.target.value)}
                            placeholder={t("3")}
                            className="min-h-[120px] rounded-xl resize-none"
                            rows={6}
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 h-12 rounded-xl"
                        >
                            {t("4")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
                        >
                            {isSubmitting ? t("6") : t("5")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
