'use client'

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, DollarSign, Building2, Calendar, Eye, Briefcase, Clock, Monitor, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ImageWithFallback from "../../figma/ImageWithFallback";
import { ApplicationModal } from "../../ApplicationModal";
import { VacancyApplyModal } from "../VacancyApplyModal";
import VacanciesPage from "../../vacancies/page";
import { useParams, useRouter } from "next/navigation";
import { Vacancy } from "../../../(auth)/api/types";
import { useGetVacancyByIdQuery } from "../../../(auth)/api/vacancy/vacancyApi";
import { useTranslations } from "next-intl";
import { jwtDecode } from "jwt-decode";

interface VacancyDetailPageProps {
  onNavigate: (page: string, vacancyId?: string) => void;
  vacancyId: string;
}





export default function VacancyDetailPage() {
  const t = useTranslations('VacancyDetail');
  const params = useParams();
  const vacancyId = params.id;
  const router = useRouter();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showVacancyApplyModal, setShowVacancyApplyModal] = useState(false);

  const { data: vacancy, isLoading, isError } = useGetVacancyByIdQuery(Number(vacancyId));

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      try {
        const decoded: any = jwtDecode(access);
        setRole(decoded.role || null);
      } catch (err) {
        console.error("Token decode error:", err);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  if (isError || !vacancy) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">{t("1")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("2")}
          </p>
          <Button onClick={() => router.push("/vacancies")} className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("3")}
          </Button>
        </div>
      </div>
    );
  }



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatSalary = () => {
    if (!vacancy.show_salary) return "Competitive salary";
    return `${vacancy.salary_from.toLocaleString()} - ${vacancy.salary_to.toLocaleString()} ${vacancy.currency}`;
  };

  const vacancyData: any = vacancy;
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("vacancies")}
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("3")}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-7">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <h1 className=" text-3xl text-[20px]">{vacancy.title}</h1>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{vacancy.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{vacancy.employment_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span>{vacancy.work_format}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{vacancy.experience_required}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags & Salary */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b">
                <div className="flex flex-wrap gap-2">

                </div>
                {vacancy.show_salary && (
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <span className="text-primary">{formatSalary()}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{t("4")} {formatDate(vacancy.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{vacancy.views.toLocaleString()} {t("5")}</span>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-8">
              <h2 className="mb-4">{t("6")}</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {vacancy.description}
              </p>
            </Card>

            {/* Responsibilities */}
            <Card className="p-8">
              <h2 className="mb-4">{t("7")}</h2>
              <div className="text-muted-foreground whitespace-pre-line">
                {vacancy.responsibilities}
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-8">
              <h2 className="mb-4">{t("8")}</h2>
              <div className="text-muted-foreground whitespace-pre-line">
                {vacancy.requirements}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">

              {role == 'seeker' && (
                <div>
                  {/* post Resume Card */}
                  <Card className="p-6 mb-6">
                    <h3 className="mb-4">{t("9")}</h3>
                    <Button
                      onClick={() => setShowApplicationModal(true)}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 mb-4"
                    >
                      {t("10")}
                    </Button>
                    <p className="text-muted-foreground text-center">
                      {t("11")}
                    </p>
                  </Card>
                  {/* Apply Card */}
                  <Card className="p-6">
                    <h3 className="mb-2">{t("12")}</h3>
                    <Button onClick={() => setShowVacancyApplyModal(true)} variant="outline" className="w-full rounded-xl">
                      {t("13")}
                    </Button>
                  </Card>
                </div>

              )}

              {/* Job Details */}
              <Card className="p-6">
                <h3 className="mb-4">{t("14")}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground mb-1">{t("15")}</p>
                    <p>{vacancy.employment_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">{t("16")}</p>
                    <p>{vacancy.work_format}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">{t("17")}</p>
                    <p>{vacancy.experience_required}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">{t("18")}</p>
                    <p>{vacancy.location}</p>
                  </div>
                  {vacancy.show_salary && (
                    <div>
                      <p className="text-muted-foreground mb-1">{t("19")}</p>
                      <p>{formatSalary()}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        vacancyId={vacancy.id}
        vacancyTitle={vacancy.title}
        companyName={vacancy.company_name || ""}
      />

      <VacancyApplyModal
        isOpen={showVacancyApplyModal}
        onClose={() => setShowVacancyApplyModal(false)}
        vacancyId={vacancy.id}
        vacancyTitle={vacancy.title}
        companyName={vacancy.company_name || ""}
      />
    </div >
  );
}