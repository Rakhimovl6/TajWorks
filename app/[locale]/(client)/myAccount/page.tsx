'use client'
import { useState, useEffect } from "react";
import { User, Application } from "../../(auth)/api/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User as UserIcon,
    Mail,
    CheckCircle,
    XCircle,
    Clock,
    Download
} from "lucide-react";
import { toast } from "sonner";
import {
    useAcceptApplicationMutation,
    useRejectApplicationMutation,
    useReviewApplicationMutation
} from "../../(auth)/api/application/applicationApi";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface MyAccountPageProps {
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
    onNavigate?: (page: string, vacancyId?: string) => void;
}

async function fetchWithRefresh(url: string, options: RequestInit = {}, onNavigate: (page: string) => void) {
    let access = localStorage.getItem("access");
    let refresh = localStorage.getItem("refresh");

    const authHeader = { ...options.headers, "Authorization": `Bearer ${access}` };
    let res = await fetch(url, { ...options, headers: authHeader });

    if (res.status === 401) {
        if (!refresh) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            onNavigate("login");
            throw new Error("Нет refresh-токена");
        }

        const tokenRes = await fetch("https://tajwork.softclub.tj/auth/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh })
        });

        if (!tokenRes.ok) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            onNavigate("login");
            throw new Error("Не удалось обновить токен");
        }

        const data = await tokenRes.json();
        localStorage.setItem("access", data.access);

        const retryHeader = { ...options.headers, "Authorization": `Bearer ${data.access}` };
        res = await fetch(url, { ...options, headers: retryHeader });
    }

    if (!res.ok) throw new Error("Ошибка при получении данных");

    return res.json();
}

export default function MyAccountPage({ darkMode, onToggleDarkMode, onNavigate }: MyAccountPageProps) {
    const t = useTranslations("MyAccount");
    const router = useRouter();

    const handleNavigate = (page: string, vacancyId?: string) => {
        router.push(`/${page}${vacancyId ? `/${vacancyId}` : ""}`);
    };

    const [user, setUser] = useState<User | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const [acceptApplication] = useAcceptApplicationMutation();
    const [rejectApplication] = useRejectApplicationMutation();
    const [reviewApplication] = useReviewApplicationMutation();
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchMyAccount = async () => {
            try {
                const data = await fetchWithRefresh("https://tajwork.softclub.tj/api/my-account/", {}, handleNavigate);
                setUser(data || null);
                setApplications(data.applications || []);
            } catch (err: any) {
                console.error(err);
                toast.error(err.message || t("3")); // "Не удалось загрузить данные"
            } finally {
                setLoading(false);
            }
        };

        fetchMyAccount();
    }, []);

    const handleUpdateStatus = async (appId: string, action: "accept" | "reject" | "review") => {
        try {
            setLoadingIds(prev => [...prev, appId]);

            if (action === "accept") await acceptApplication(appId).unwrap();
            if (action === "reject") await rejectApplication(appId).unwrap();
            if (action === "review") await reviewApplication(appId).unwrap();

            setApplications(prev =>
                prev.map(app =>
                    app.id === appId
                        ? { ...app, status: action === "accept" ? "accepted" : action === "reject" ? "rejected" : "pending", updated_at: new Date().toISOString() }
                        : app
                )
            );

            toast.success(
                action === "accept"
                    ? t("4") // "Заявка принята"
                    : action === "reject"
                        ? t("5") // "Заявка отклонена"
                        : t("6") // "Заявка переведена на рассмотрение"
            );
        } catch (err: any) {
            console.error(err);
            toast.error(t("7")); // "Не удалось обновить статус заявки"
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== appId));
        }
    };

    const getStatusBadge = (status: Application["status"]) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />{t("8")}</Badge>; // "В ожидании"
            case "accepted":
                return <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3" />{t("9")}</Badge>; // "Принято"
            case "rejected":
                return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />{t("10")}</Badge>; // "Отклонено"
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return t("11"); // "неизвестно"
        return new Date(dateString).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) return <div className="text-center py-20">{t("12")}</div>; // "Загрузка данных..."
    if (!user) return <div className="text-center py-20">{t("13")}</div>; // "Не удалось загрузить данные пользователя"

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-foreground mb-2 text-2xl">{t("14")}</h1> {/* "Мой аккаунт" */}
                        <p className="text-muted-foreground">
                            {t("15")} {/* "Управляйте своим профилем и..." */}
                        </p>
                    </div>

                    <Card className="p-8 rounded-2xl">
                        <div className="flex items-start gap-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                                <UserIcon className="h-10 w-10 text-primary" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-foreground mb-1 text-[20px]">{user.username || t("16")}</h2> {/* "Без имени" */}
                                    <Badge variant="secondary" className="rounded-full">
                                        {user.role === "employer" ? t("17") : t("18")} {/* "Работодатель"/"Соискатель" */}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>{user.email}</span>
                                </div>

                                {user.role === "seeker" && user.resume?.file_url && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => window.open(`https://tajwork.softclub.tj${user.resume!.file_url}`, "_blank")}
                                    >
                                        <Download className="h-4 w-4 mr-2" />{t("19")} {/* "Моё резюме" */}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl overflow-hidden">
                        <Tabs defaultValue="all" className="w-full">
                            <div className="border-b px-8 pt-6">
                                <TabsList className="w-full justify-start rounded-lg bg-muted/50">
                                    <TabsTrigger value="all" className="rounded-lg">{t("20")} ({applications.length})</TabsTrigger>
                                    <TabsTrigger value="pending" className="rounded-lg">{t("21")} ({applications.filter(a => a.status === "pending").length})</TabsTrigger>
                                    <TabsTrigger value="accepted" className="rounded-lg">{t("22")} ({applications.filter(a => a.status === "accepted").length})</TabsTrigger>
                                    <TabsTrigger value="rejected" className="rounded-lg">{t("23")} ({applications.filter(a => a.status === "rejected").length})</TabsTrigger>
                                </TabsList>
                            </div>

                            {["all", "pending", "accepted", "rejected"].map(tab => (
                                <TabsContent key={tab} value={tab} className="p-8 space-y-4">
                                    {user.role === "employer" ? (
                                        <div className="space-y-4">
                                            {applications.filter(a => tab === "all" ? true : a.status === tab).map(app => (
                                                <Card key={app.id} className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <div className="font-semibold text-center">{app.resume?.full_name || t("16")}</div>
                                                        <div className="text-sm text-muted-foreground sm:pl-2">{formatDate(app.updated_at)}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(app.status)}
                                                        {app.status === "pending" && (
                                                            <div className="flex justify-center w-full">
                                                                <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleUpdateStatus(app.id, "accept")}
                                                                        disabled={loadingIds.includes(app.id)}
                                                                    >
                                                                        {loadingIds.includes(app.id) ? "..." : t("24")} {/* "Принять" */}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleUpdateStatus(app.id, "reject")}
                                                                        disabled={loadingIds.includes(app.id)}
                                                                    >
                                                                        {loadingIds.includes(app.id) ? "..." : t("25")} {/* "Отклонить" */}
                                                                    </Button>

                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleUpdateStatus(app.id, "review")}
                                                                        disabled={loadingIds.includes(app.id)}
                                                                    >
                                                                        {loadingIds.includes(app.id) ? "..." : t("26")} {/* "На рассмотрение" */}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {applications.filter(a => tab === "all" ? true : a.status === tab).map(app => (
                                                <Card key={app.id} className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <div className="font-semibold">{app.vacancy_title || t("27")}</div> {/* "Без вакансии" */}
                                                        <div className="text-sm text-muted-foreground">{formatDate(app.updated_at)}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(app.status)}
                                                        <Button
                                                            size="sm"
                                                            onClick={() => router.push(`/ru/vacancyDetail/${app.vacancy_id}`)}
                                                        >
                                                            {t("28")} {/* "Перейти к вакансии" */}
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
}
