import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

export default function SearchFilters({ onSearch }: { onSearch: (filters: any) => void }) {
  const t = useTranslations('Vacancies');
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [type, setType] = useState("all");
  const [salaryFilters, setSalaryFilters] = useState<string[]>([]);
  const [workTypeFilters, setWorkTypeFilters] = useState<string[]>([]);
  const [jobTypeFilters, setJobTypeFilters] = useState<string[]>([]);

  const handleCheckboxChange = (value: string, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleSearch = () => {
    onSearch({
      searchText,
      location,
      category,
      level,
      type,
      salaryFilters,
      workTypeFilters,
      jobTypeFilters,
    });
  };

  return (
    <Card className="p-6 mb-8">
      {/* Top Row */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("4")}
            className="pl-10 h-12 rounded-xl bg-input-background"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("5")}
            className="pl-10 h-12 rounded-xl bg-input-background"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button className="h-12 rounded-xl bg-primary hover:bg-primary/90" onClick={handleSearch}>
          <Search className="mr-2 h-5 w-5" />
          {t("6")}
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          {t("7")}
        </Button>

        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-[150px] rounded-full">
            <SelectValue placeholder={t("20")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("11")}</SelectItem>
            <SelectItem value="development">{t("12")}</SelectItem>
            <SelectItem value="design">{t("13")}</SelectItem>
            <SelectItem value="marketing">{t("14")}</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setLevel}>
          <SelectTrigger className="w-[150px] rounded-full">
            <SelectValue placeholder={t("21")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("16")}</SelectItem>
            <SelectItem value="junior">{t("17")}</SelectItem>
            <SelectItem value="mid">{t("18")}</SelectItem>
            <SelectItem value="senior">{t("19")}</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setType}>
          <SelectTrigger className="w-[150px] rounded-full">
            <SelectValue placeholder={t("22")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("23")}</SelectItem>
            <SelectItem value="remote">{t("24")}</SelectItem>
            <SelectItem value="hybrid">{t("25")}</SelectItem>
            <SelectItem value="onsite">{t("26")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="mb-4">{t("8")}</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Salary */}
            <div>
              <label className="mb-3 block">{t("9")}</label>
              <div className="space-y-2">
                {["0 - 1000 TJS", "1000 - 2000 TJS", "2000+ TJS"].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <Checkbox
                      checked={salaryFilters.includes(s)}
                      onCheckedChange={() => handleCheckboxChange(s, setSalaryFilters)}
                    />
                    <label htmlFor={s} className="cursor-pointer">{s}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Type */}
            <div>
              <label className="mb-3 block">{t("10")}</label>
              <div className="space-y-2">
                {["Remote", "Hybrid", "On-site"].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <Checkbox
                      checked={workTypeFilters.includes(s)}
                      onCheckedChange={() => handleCheckboxChange(s, setWorkTypeFilters)}
                    />
                    <label htmlFor={s} className="cursor-pointer">{s}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="mb-3 block">{t("11")}</label>
              <div className="space-y-2">
                {["Full-time", "Part-time", "Contract"].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <Checkbox
                      checked={jobTypeFilters.includes(s)}
                      onCheckedChange={() => handleCheckboxChange(s, setJobTypeFilters)}
                    />
                    <label htmlFor={s} className="cursor-pointer">{s}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
