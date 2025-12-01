'use client'
import Image from "next/image";
import Loading from "./loading";
import { Suspense, useEffect, useMemo, useState } from "react";
import icon from '@/public/TajWorksIcon.png'
import img2 from '@/public/luis-villasmil-mlVbMbxfWI4-unsplash.jpg'
import Link from "next/link";
import { Search, MapPin, Briefcase, Code, Palette, TrendingUp, Users, CheckCircle, Star, BookmarkPlus, Wallet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import ImageWithFallback from "./figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import Preloader from "./preloader";
import { useTranslations } from "next-intl";
import { useFavoriteVacancyMutation, useGetVacancyQuery } from "../(auth)/api/vacancy/vacancyApi";
import { Vacancy } from "../(auth)/api/types";


export default function Home() {
  let router = useRouter()
  const t = useTranslations('HomePage');
  const { data, isLoading } = useGetVacancyQuery();

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

      // ⬇️ ДОБАВЛЯЕМ ЧТО НЕ ХВАТАЕТ ДЛЯ ТИПА Vacancy
      company_id: v.company_id ?? null,
      author_id: v.author_id ?? null,
      tags: v.tags ?? [],

      salary_display: `${v.salary_from} – ${v.salary_to} ${v.currency}`,
      remote: v.work_format !== "on_site",
    })),
    [data]
  );

  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>(vacancies);

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

  useEffect(() => {
    setFilteredVacancies(vacancies);
  }, [vacancies]);

  const categories = [
    { icon: Code, name: "Development", count: 234, color: "bg-blue-500" },
    { icon: Palette, name: "Design", count: 156, color: "bg-purple-500" },
    { icon: TrendingUp, name: "Marketing", count: 189, color: "bg-green-500" },
    { icon: Briefcase, name: "Business", count: 267, color: "bg-orange-500" },
    { icon: Users, name: "HR", count: 98, color: "bg-pink-500" },
    { icon: Search, name: "Sales", count: 143, color: "bg-cyan-500" },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up for free and build your professional profile",
    },
    {
      step: "2",
      title: "Search Jobs",
      description: "Browse thousands of opportunities tailored to your skills",
    },
    {
      step: "3",
      title: "Apply Easily",
      description: "Submit applications with one click using your profile",
    },
    {
      step: "4",
      title: "Get Hired",
      description: "Connect with employers and land your dream job",
    },
  ];

  const testimonials = [
    {
      name: "Farzona Saidova",
      role: "Software Engineer",
      company: "Tcell",
      image:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxzZWFyY2h8MXx8YXNpYW4lMjB3b21hbnxlbnwwfHx8fDE3NjM1OTE0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      text: "TajWorks helped me find my dream job in less than two weeks. The platform is incredibly easy to use, and the job matches were perfect!",
    },
    {
      name: "Behruz Ismoilov",
      role: "Product Designer",
      company: "Alif Bank",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxzZWFyY2h8Mnx8YXNpYW4lMjBtYW58ZW58MHx8fHwxNzYzNTkxNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      text: "As an employer, I quickly found talented professionals. TajWorks made the hiring process so much easier.",
    },
    {
      name: "Manija Rahimova",
      role: "Marketing Director",
      company: "Humans",
      image:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxzZWFyY2h8MXx8YXNpYW4lMjB3b21hbiUyMGZhY2V8ZW58MHx8fHwxNzYzNTkxNTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      text: "The best job platform I've used: clean interface, relevant opportunities, and excellent support. Highly recommended!",
    },
  ];


  const partners = [
    "Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix"
  ];
  return (
    <>

      <Preloader />

      {/* <Suspense fallback={<Loading />}> */}
      <div className="container mt-10 mx-auto px-12 sm:px-16 lg:px-20">
        <div className="sm:flex-row flex flex-col-reverse items-center justify-center">
          <div className="sm:w-[50%] mt-5 sm:mt-0">
            <p className="overflow-hidden whitespace-nowrap sm:text-[50px] h-20 text-[20px] inline-block border-r-2 border-current animate-[typewriter_4s_steps(30,end)_1s_forwards] max-w-full">
              {t("1")}<span className="text-blue-500">{t("2")}</span> {t("3")}
            </p>
            <p className="text-[20px] text-gray-500 sm:w-[95%] p-[20px_0]">{t("4")}
            </p>
            <div className="p-[20px_0] flex flex-col sm:flex-row sm:items-center text-center sm:text-start sm:gap-3 font-semibold w-full">
              <Link href={'/vacancies'} className="bg-blue-500 mb-3 sm:mb-0 hover:bg-blue-400 text-white p-[10px_30px] rounded-3xl">{t("5")}</Link>
              <Link href={'/postAJob'} className="border border-gray-200 hover:bg-gray-100 p-[10px_30px] rounded-3xl">{t("6")}</Link>
            </div>
          </div>
          <div className="sm:w-[50%] flex justify-end">
            <Image className="rounded-md sm:w-[450px]" src={img2} alt='not found' />
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 shadow-lg">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("7")}
                className="pl-10 h-14 rounded-xl bg-input-background"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("8")}
                className="pl-10 h-14 rounded-xl bg-input-background"
              />
            </div>
            <Select>
              <SelectTrigger className="h-14 rounded-xl bg-input-background">
                <SelectValue placeholder={t("9")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">{t("10")}</SelectItem>
                <SelectItem value="design">{t("11")}</SelectItem>
                <SelectItem value="marketing">{t("12")}</SelectItem>
                <SelectItem value="business">{t("13")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full mt-4 h-14 rounded-xl bg-primary hover:bg-primary/90"
            onClick={() => router.push("/vacancies")}
          >
            <Search className="mr-2 h-5 w-5" />
           {t("14")}
          </Button>
        </Card>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="mb-8 text-center text-2xl">{t("15")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.color}`}>
                  <category.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3>{category.name}</h3>
                  <p className="text-muted-foreground">{category.count} jobs</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl">{t("16")}</h2>
          <Button
            variant="outline"
            onClick={() => router.push("/vacancies")}
            className="rounded-full"
          >
           {t("17")}
          </Button>
        </div>
        {/* Vacancies Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {filteredVacancies.slice(0, 3).map((vacancy) => (
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
                <Button
                  onClick={() => {
                    if (vacancy.id && vacancy.title) {
                      handleFavorite(Number(vacancy.id), vacancy.title);
                    } else {
                      console.warn("Vacancy ID or title missing", vacancy);
                    }
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <BookmarkPlus className="h-5 w-5" />
                </Button>





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
                  {t("18")}
                </Button>
              </div>
            </Card>
          ))}


        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl">{t("19")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white mx-auto mb-4" style={{ fontSize: '1.5rem' }}>
                  {item.step}
                </div>
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="mb-12 text-center text-2xl">{t("20")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner}
              className="flex items-center justify-center p-6 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
            >
              <span className="font-semibold text-muted-foreground">{partner}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-linear-to-br from-primary/5 to-purple-500/5 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl">{t("21")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p className="text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* </Suspense> */}
    </>
  )
}
