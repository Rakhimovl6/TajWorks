'use client'

import { useState } from "react";
import { Mail, Lock, Chrome, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import ImageWithFallback from "../../(client)/figma/ImageWithFallback";
import { useRouter } from "next/navigation";
import { logIn } from "../api/logIn/logInApi";
import { useTranslations } from "next-intl";

interface LoginPageProps {
    onNavigate?: (path: string) => void;
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export default function LoginPage({ onNavigate, darkMode, onToggleDarkMode }: LoginPageProps) {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const t = useTranslations('logIn');


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await logIn({ username, password });

            console.log("LOGIN SUCCESS:", res);

            // если приходит токен — сохраняем
            if (res?.access) {
                localStorage.setItem("token", res.access);
            }

            router.push("/");
        } catch (err: any) {
            console.error(err);
            alert("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        router.push("/signUp");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-purple-500/5 py-12 px-4">
            <div className="w-full max-w-6xl">
                <Card className="overflow-hidden">
                    <div className="grid lg:grid-cols-2">

                        {/* Left Side */}
                        <div className="p-8 lg:p-12">
                            <div className="max-w-md mx-auto">

                                <div className="mb-8">
                                    <h1 className="mb-2 text-2xl">{t("1")}</h1>
                                    <p className="text-muted-foreground">
                                        {t("2")}
                                    </p>
                                </div>

                                <form className="space-y-6" onSubmit={handleLogin}>

                                    {/* Username */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t("3")}</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="text"
                                                placeholder={t("4")}
                                                className="pl-10 h-12 rounded-xl bg-input-background"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">{t("5")}</Label>
                                            <button type="button" className="text-primary hover:underline">
                                                {t("14")}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder={t("6")}
                                                className="pl-10 h-12 rounded-xl bg-input-background"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Login Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90"
                                        disabled={loading}
                                    >
                                        {loading ? t("15") : t("7") }
                                    </Button>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-border" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 bg-card text-muted-foreground">
                                                {t("8")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Google Login */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-14 rounded-xl"
                                    >
                                        <Chrome className="mr-2 h-5 w-5" />
                                        {t("9")}
                                    </Button>

                                </form>

                                {/* Sign Up */}
                                <div className="mt-8 text-center">
                                    <p className="text-muted-foreground">
                                        {t("10")}{" "}
                                        <button
                                            onClick={handleSignUp}
                                            className="text-primary hover:underline"
                                        >
                                            {t("11")}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="hidden lg:block relative bg-linear-to-br from-primary to-primary/80 p-12">
                            <div className="h-full flex flex-col justify-center">
                                <div className="mb-8">
                                    <h2 className="text-white mb-4 text-2xl">{t("12")}</h2>
                                    <p className="text-white/80">
                                        {t("13")}
                                    </p>
                                </div>
                                <div className="rounded-2xl overflow-hidden">
                                    <ImageWithFallback
                                        src="https://images.unsplash.com/photo-1724204401208-6349fc373543"
                                        alt="Login illustration"
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </Card>
            </div>
        </div>
    );
}
