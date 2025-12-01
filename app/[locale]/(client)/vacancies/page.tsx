'use client'

import { useEffect, useState } from "react";
import { Search, MapPin, Filter, Clock, BookmarkPlus, Check, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import ImageWithFallback from "../figma/ImageWithFallback";
import { useFavoriteVacancyMutation, useGetVacancyQuery } from "../../(auth)/api/vacancy/vacancyApi";
import { useRouter } from "next/navigation";
import SearchFilters from "./filters";
import { useMemo } from "react";
import { log } from "console";
import { useTranslations } from "next-intl";
import { jwtDecode } from "jwt-decode";

// Тип компании
interface Company {
  id: number;
  name: string;
  logo: string;
  description?: string;
  website?: string;
}

// Интерфейс вакансии, который используем в компоненте
interface Vacancy {
  id: number;
  title: string;
  company: Company;
  location: string;
  description: string;
  responsibilities: string;
  requirements: string;
  salary_from: string;
  salary_to: string;
  currency: string;
  show_salary: boolean;
  employment_type: string;
  work_format: string;
  experience_required: string;
  is_active: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  author: string;
  salary_display: string;
  remote: boolean;
  tags?: string[]
}

interface VacanciesPageProps {
  onNavigate: (page: string, vacancyId?: string) => void;
}

export default function VacanciesPage({ onNavigate }: VacanciesPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const t = useTranslations('Vacancies');
  const router = useRouter();

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


  // Получаем данные с API
  const { data, isLoading } = useGetVacancyQuery();
  console.log(data);

  const [favoriteVacancy] = useFavoriteVacancyMutation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleFavorite = async (vacancyId: number, vacancyTitle: string) => {
    try {
      await favoriteVacancy(vacancyId).unwrap();
      setToastMessage(`"${vacancyTitle}" added to favorites!`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err: any) {
      // Попробуем получить сообщение из разных мест
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        JSON.stringify(err) || // если всё пустое, покажем как строку
        "Unknown error";

      console.error("Failed to favorite vacancy:", errorMessage);

      setToastMessage(`Failed to add "${vacancyTitle}"`);
      setTimeout(() => setToastMessage(null), 2500);
    }


  };


  // Преобразуем API-данные в формат Vacancy[]
  const vacancies: Vacancy[] = useMemo(() =>
    (data || []).map((v: any) => ({
      id: v.id,
      title: v.title,
      company: v.company,
      location: v.location,
      description: v.description,
      responsibilities: v.responsibilities,
      requirements: v.requirements,
      salary_from: v.salary_from,
      salary_to: v.salary_to,
      currency: v.currency,
      show_salary: v.show_salary,
      employment_type: v.employment_type,
      work_format: v.work_format,
      experience_required: v.experience_required,
      is_active: v.is_active,
      views: v.views,
      created_at: v.created_at,
      updated_at: v.updated_at,
      author: v.author,
      salary_display: `${v.salary_from} – ${v.salary_to} ${v.currency}`,
      remote: v.work_format === "on_site" ? false : true,
    })),
    [data]
  );


  // Внутри VacanciesPage
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>(vacancies);

  const handleSearch = (filters: any) => {
    const {
      searchText,
      location,
      category,
      level,
      type,
      salaryFilters,
      workTypeFilters,
      jobTypeFilters,
    } = filters;

    const newFiltered = vacancies.filter((v) => {
      // По ключевому слову
      if (searchText && !v.title.toLowerCase().includes(searchText.toLowerCase())) return false;

      // По локации
      if (location && !v.location.toLowerCase().includes(location.toLowerCase())) return false;

      // По категории (tags)
      if (category && category !== "all" && !v.tags?.includes(category)) return false;

      // По уровню опыта
      if (level && level !== "all" && v.experience_required !== level) return false;

      // По типу работы (remote/onsite/hybrid)
      if (type && type !== "all") {
        if (type === "remote" && !v.remote) return false;
        if (type === "onsite" && v.work_format !== "on_site") return false;
        if (type === "hybrid" && v.work_format !== "hybrid") return false;
      }

      // По зарплате
      if (salaryFilters.length > 0) {
        const salary = parseFloat(v.salary_from);
        const matchSalary = salaryFilters.some((range: string) => {
          if (range === "0 - 1000 TJS") return salary >= 0 && salary <= 1000;
          if (range === "1000 - 2000 TJS") return salary > 1000 && salary <= 2000;
          if (range === "2000+ TJS") return salary > 2000;
          return false;
        });
        if (!matchSalary) return false;
      }

      // По Work Type
      if (workTypeFilters.length > 0) {
        const workMatch = workTypeFilters.some((wt: string) => {
          if (wt === "Remote") return v.remote;
          if (wt === "On-site") return v.work_format === "on_site" && !v.remote;
          if (wt === "Hybrid") return v.work_format === "hybrid";
          return false;
        });
        if (!workMatch) return false;
      }

      // По Job Type
      if (jobTypeFilters.length > 0) {
        const jobMatch = jobTypeFilters.some((jt: string) => {
          if (jt === "Full-time") return v.employment_type === "full_time";
          if (jt === "Part-time") return v.employment_type === "part_time";
          if (jt === "Contract") return v.employment_type === "contract";
          return false;
        });
        if (!jobMatch) return false;
      }

      return true;
    });

    setFilteredVacancies(newFiltered);
  };


  useEffect(() => {
    setFilteredVacancies(vacancies);
  }, [vacancies]);

  const [sort, setSort] = useState("latest");


  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">{t("1")}</h1>
          <p className="text-muted-foreground">
            {t("2")} {vacancies.length} {t("3")}
          </p>
        </div>

        <SearchFilters onSearch={handleSearch} />


        {/* Sort */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {t("27")} {filteredVacancies.length} {t("28")}
          </p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder={t("29")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">{t("29")}</SelectItem>
              <SelectItem value="popular">{t("30")}</SelectItem>
              <SelectItem value="salary-high">{t("31")}</SelectItem>
              <SelectItem value="salary-low">{t("32")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vacancies Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {filteredVacancies.map((vacancy) => (
            <Card
              key={vacancy.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer"

            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">

                  <div>
                    <h3 className="mb-1 mt-2 text-2xl">{vacancy.title}</h3>
                  </div>
                </div>
                {role == 'seeker' && (
                  <Button
                    onClick={() => {
                      if (vacancy.id && vacancy.title) {
                        handleFavorite(vacancy.id, vacancy.title);
                      } else {
                        console.warn("Vacancy ID or title missing", vacancy);
                      }
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    <BookmarkPlus className="h-5 w-5" />
                  </Button>
                )}






                <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{vacancy.location}</span>
                </div>
                <Badge variant="secondary">{vacancy.employment_type}</Badge>
                <Badge variant="outline">{vacancy.experience_required}</Badge>
                {vacancy.remote && (
                  <Badge className="bg-green-500 hover:bg-green-600">Remote</Badge>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <p className="text-primary ">{vacancy.salary_display}</p>
              </div>


              <div className="flex flex-wrap gap-2 mb-4">
                {vacancy.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(vacancy.created_at).toLocaleDateString()}</span>
                </div>
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/vacancies/${vacancy.id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}


        </div>
      </div>
      {toastMessage && (

        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-slide-in ${toastMessage?.startsWith("Failed") ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {toastMessage?.startsWith("Failed") ? (
            <X className="w-5 h-5" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          <span>{toastMessage}</span>
        </div>


      )}
    </div>
  );
}
