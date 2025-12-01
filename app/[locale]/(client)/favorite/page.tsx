"use client";

import { useState, useEffect } from "react";
import {
    Heart,
    MapPin,
    Building2,
    Clock,
    Briefcase,
    Trash2,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useGetFavoritesQuery, useDeleteFavoriteMutation } from "../../(auth)/api/vacancy/vacancyApi";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface FavoriteVacancy {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    level: string;
    salary: string;
    remote: boolean;
    category: string;
    tags: string[];
    logo: string;
    postedDate: string;
    savedDate: string;
}

export default function FavoritesPage() {
    const t = useTranslations("Favorite");
    const router = useRouter();
    const { data: favorite, isLoading } = useGetFavoritesQuery();
    
    const [deleteFavorite] = useDeleteFavoriteMutation();
    const [favorites, setFavorites] = useState<FavoriteVacancy[]>([]);

    useEffect(() => {
        if (!favorite) return;

        const mapped = favorite.map((item: any) => {
            const v = item.vacancy;
            return {
                id: String(v.id),
                title: v.title,
                company: v.company,
                location: v.location,
                type: v.employment_type === "full_time" ? "Full-time" : v.employment_type,
                level: v.experience_required === "no_exp" ? t("3") : v.experience_required, // "Без опыта"
                salary: v.salary_display,
                remote: v.work_format === "remote",
                category: v.category || "General",
                tags: (v.requirements || "").split(",").map((t: string) => t.trim()),
                logo:
                    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&q=80&w=400",
                postedDate: new Date(v.created_at).toLocaleDateString("ru-RU"),
                savedDate: item.added_at,
            };
        });

        setFavorites(mapped);
    }, [favorite, t]);

    const handleViewVacancy = (vacancyId: string) => {
        router.push(`/vacancies/${vacancyId}`);
    };

    const handleDeleteFavorite = async (vacancyId: string) => {
        try {
            await deleteFavorite(Number(vacancyId));
            toast.success(t("9")); // "Удалить"

            setFavorites((prev) => prev.filter((v) => v.id !== vacancyId));
        } catch {
            toast.error(t("9")); // можно добавить отдельный ключ для ошибки
        }
    };

    const formatSavedDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    if (isLoading) return <p>{t("14")}</p>; // "Загрузка..."

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-linear-to-br from-primary/5 via-background to-background border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mx-auto mb-6">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-foreground mb-4">{t("1")}</h1>
                        <p className="text-muted-foreground text-lg">
                            {favorites.length > 0
                                ? t("2", {
                                      count: favorites.length,
                                      vacancyText:
                                          favorites.length === 1 ? t("3") : t("4"),
                                  })
                                : t("5")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Favorites Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-6xl mx-auto">
                    {favorites.length === 0 ? (
                        <Card className="p-12 rounded-2xl text-center">
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mx-auto">
                                    <Heart className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <div>
                                    <h2 className="text-foreground mb-2">{t("6")}</h2>
                                    <p className="text-muted-foreground">{t("7")}</p>
                                </div>
                                <Button
                                    onClick={() => router.push("vacancies")}
                                    className="rounded-full bg-primary hover:bg-primary/90"
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    {t("8")}
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {favorites.map((vacancy) => (
                                <Card
                                    key={vacancy.id}
                                    className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h3
                                                        className="text-foreground text-2xl group-hover:text-primary transition-colors"
                                                        onClick={() =>
                                                            handleViewVacancy(vacancy.id)
                                                        }
                                                    >
                                                        {vacancy.title}
                                                    </h3>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDeleteFavorite(vacancy.id)
                                                        }
                                                        className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 shrink-0"
                                                    >
                                                        <Heart className="h-5 w-5 fill-current" />
                                                    </Button>
                                                </div>

                                                <p className="text-muted-foreground flex items-center gap-2">
                                                    <Building2 className="h-4 w-4" />
                                                    {vacancy.company}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {vacancy.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4" />
                                                    {vacancy.type}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Wallet className="h-4 w-4" />
                                                    {vacancy.salary}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {t("11")} {vacancy.postedDate}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary" className="rounded-full">
                                                    {vacancy.level}
                                                </Badge>
                                                {vacancy.remote && (
                                                    <Badge className="rounded-full bg-green-500 hover:bg-green-600">
                                                        {t("12")}
                                                    </Badge>
                                                )}
                                                {vacancy.tags.slice(0, 3).map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="outline"
                                                        className="rounded-full"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <p className="text-sm text-muted-foreground">
                                                    {t("13")}: {formatSavedDate(vacancy.savedDate)}
                                                </p>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDeleteFavorite(vacancy.id)
                                                        }
                                                        className="rounded-full"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        {t("9")}
                                                    </Button>

                                                    <Button
                                                        className="rounded-full bg-primary hover:bg-primary/90"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewVacancy(vacancy.id);
                                                        }}
                                                    >
                                                        {t("10")}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {favorites.length > 0 && (
                        <div className="mt-12 text-center">
                            <Button
                                variant="outline"
                                onClick={() => router.push("vacancies")}
                                className="rounded-full"
                            >
                                <Briefcase className="mr-2 h-4 w-4" />
                                {t("8")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
