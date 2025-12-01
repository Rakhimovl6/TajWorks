"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { usePostVacancyMutation } from "../../(auth)/api/vacancy/vacancyApi";
import { useRouter } from "next/navigation";
import { VacancyPost } from "../../(auth)/api/types";
import { useTranslations } from "next-intl";

type FormDataType = {
  title: string;
  company: string;
  location: string;
  description: string;
  responsibilities: string;
  requirements: string;
  salary_from: string;
  salary_to: string;
  currency: string;
  show_salary: boolean;
  employment_type: "full_time" | "part_time" | "contract";
  work_format: "remote" | "hybrid" | "on_site";
  experience_required: "no_exp" | "junior" | "mid" | "senior";
  is_active: boolean;
};

export default function PostVacancyPage() {
  let t = useTranslations("PostAJob")
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    company: "",
    location: "",
    description: "",
    responsibilities: "",
    requirements: "",
    salary_from: "",
    salary_to: "",
    currency: "TJS",
    show_salary: true,
    employment_type: "full_time",
    work_format: "on_site",
    experience_required: "no_exp",
    is_active: true,
  });

  const [postVacancy, { isLoading }] = usePostVacancyMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: VacancyPost = { ...formData };

    try {
      await postVacancy(payload).unwrap();
      toast.success("Вакансия успешно опубликована!");
      router.push("vacancies");
    } catch (err) {
      toast.error("Ошибка при создании вакансии");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-20 max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      {/* Заголовок */}
      <div className="space-y-2">
        <Label htmlFor="title">{t("1")} *</Label>
        <Input
          id="title"
           placeholder={`${t("2")}: Senior Frontend Developer`}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* Компания */}
      <div className="space-y-2">
        <Label htmlFor="company">{t("3")} *</Label>
        <Input
          id="company"
          placeholder={`${t("2")}: Softclub`}
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>

      {/* Местоположение */}
      <div className="space-y-2">
        <Label htmlFor="location">{t("4")} *</Label>
        <Input
          id="location"
          placeholder={`${t("2")}: Душанбе`} 
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      {/* Описание */}
      <div className="space-y-2">
        <Label htmlFor="description">{t("5")} *</Label>
        <Textarea
          id="description"
          placeholder={t("6")}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      {/* Обязанности и Требования */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="responsibilities">{t("7")}</Label>
          <Textarea
            id="responsibilities"
            placeholder={t("8")}
            value={formData.responsibilities}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requirements">{t("9")}</Label>
          <Textarea
            id="requirements"
            placeholder={t("10")}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          />
        </div>
      </div>

      {/* Зарплата */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salary_from">{t("11")}</Label>
          <Input
            id="salary_from"
            type="number"
            placeholder="1000"
            value={formData.salary_from}
            onChange={(e) => setFormData({ ...formData, salary_from: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary_to">{t("12")}</Label>
          <Input
            id="salary_to"
            type="number"
            placeholder="2000"
            value={formData.salary_to}
            onChange={(e) => setFormData({ ...formData, salary_to: e.target.value })}
          />
        </div>
      </div>

      {/* Select поля */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("13")}</Label>
          <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
            <SelectTrigger>
              <SelectValue placeholder={t("14")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="TJS">TJS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("15")}</Label>
          <Select
            value={formData.employment_type}
            onValueChange={(v) => setFormData({ ...formData, employment_type: v as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("16")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full-time</SelectItem>
              <SelectItem value="part_time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="fifo">FIFO</SelectItem>
              <SelectItem value="volunteer">Volunteering</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("17")}</Label>
          <Select
            value={formData.work_format}
            onValueChange={(v) => setFormData({ ...formData, work_format: v as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("17")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on_site">On-site</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="shift">Shift work</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("18")}</Label>
          <Select
            value={formData.experience_required}
            onValueChange={(v) => setFormData({ ...formData, experience_required: v as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("19")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_exp">{t("20")}</SelectItem>
              <SelectItem value="1_3">1–3 {t("21")}</SelectItem>
              <SelectItem value="3_6">3–6 {t("22")}</SelectItem>
              <SelectItem value="6_plus">6+ {t("22")}</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-4 mt-4">
        <Button type="submit" disabled={isLoading} className="flex items-center">
          <FileText className="mr-2 h-5 w-5" /> {t("23")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("vacancies")}>
          {t("24")}
        </Button>
      </div>
    </form>
  );
}
