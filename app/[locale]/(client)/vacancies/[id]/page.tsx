'use client'

import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";
import  VacancyDetailPage  from "../../vacancyDetail/[id]/page";

export default function VacancyDetailWrapper() {
  const params = useParams();
  // const vacancyId = params?.id as string;

  const router = useRouter();

  // const handleNavigate = (page: string) => {
  //   if (page === "vacancies") router.push("/vacancies");
  // };

  return <VacancyDetailPage />;
}
