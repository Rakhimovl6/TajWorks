'use client'
import { useState } from "react";
import { Mail, Lock, User, Briefcase, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import ImageWithFallback from "../../(client)/figma/ImageWithFallback";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations('signUp');


  // состояния формы
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"jobseeker" | "employer">("jobseeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("https://tajwork.softclub.tj/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
          confirm_password: confirmPassword,
          role: role === "jobseeker" ? "seeker" : "employer",
        }),
      });


      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      router.push("/logIn");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message || "Something went wrong");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-purple-500/5 py-12 px-4">
      <div className="w-full max-w-6xl">
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2">

            {/* Left Side */}
            <div className="hidden lg:block relative bg-linear-to-br from-blue-500 to-primary p-12">
              <div className="h-full flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-white mb-4 text-3xl">{t("22")}</h2>
                  <p className="text-white/80">{t("23")}</p>
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1565194637906-8f45f3351a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt={t("1")}
                    className="w-full h-84 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <h1 className="mb-2 text-3xl">{t("1")}</h1>
                  <p className="text-muted-foreground">{t("2")}</p>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form className="space-y-6" onSubmit={handleRegister}>
                  <div className="space-y-2">
                    <Label htmlFor="fullname">{t("3")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="fullname"
                        type="text"
                        placeholder={t("4")}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("5")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("6")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t("7")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("8")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("9")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t("10")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>{t("11")}</Label>
                    <RadioGroup
                      defaultValue="jobseeker"
                      className="space-y-3"
                      value={role}
                      onValueChange={(val: any) => setRole(val)}
                    >
                      <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value="jobseeker" id="jobseeker" />
                        <Label htmlFor="jobseeker" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div>{t("12")}</div>
                            <p className="text-muted-foreground">{t("13")}</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value="employer" id="employer" />
                        <Label htmlFor="employer" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <div>{t("14")}</div>
                            <p className="text-muted-foreground">{t("15")}</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90">
                    {loading ? t("17") : t("16")}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-card text-muted-foreground">{t("18")}</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full h-14 rounded-xl">
                  <Chrome className="mr-2 h-5 w-5" />
                  {t("19")}
                </Button>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    {t("20")}{" "}
                    <button
                      onClick={() => router.push("/logIn")}
                      className="text-primary hover:underline"
                    >
                      {t("21")}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
