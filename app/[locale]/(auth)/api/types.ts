
export interface IGetVacancies {
  id: string;                 // ID вакансии
  title: string;              // Название вакансии
  company_id: string;         // ID компании
  author_id: string;          // ID автора
  location: string;           // Город / регион
  description: string;        // Полное описание
  responsibilities: string;   // Обязанности
  requirements: string;       // Требования
  salary_from: number;
  salary_to: number;
  currency: string;
  show_salary: boolean;
  employment_type: "full-time" | "part-time" | "contract";
  work_format: "remote" | "hybrid" | "onsite";
  experience_required: string;
  is_active: boolean;
  views: number;
  created_at: string;         // ISO дата
  updated_at: string;
}

export interface IGetVacanciesResponse {
  requestId: string;
  items: IGetVacancies[];
  count: number;
}

export interface Resume {
  id?: string;              // необязательный, если создаётся новый
  vacancy_id: string;       // ID вакансии, на которую отправляется
  author_id: string;        // ID пользователя, который отправляет
  full_name: string;        // Имя и фамилия
  email: string;            // Почта
  phone?: string;           // Телефон (опционально)
  cover_letter?: string;    // Сопроводительное письмо (опционально)
  resume_file_url?: string; // Ссылка на файл резюме (если загружен)
  created_at?: string;    
  file_url: any  // Дата отправки
}

export interface Vacancy {
  id: string;                 // ID вакансии
  title: string;              // Название вакансии
  company_id: string;         // ID компании
  author_id: string;          // ID автора
  location: string;           // Город / регион
  description: string;        // Полное описание
  responsibilities: string;   // Обязанности
  requirements: string;       // Требования
  salary_from: number;
  salary_to: number;
  currency: string;
  show_salary: boolean;
  employment_type: "full-time" | "part-time" | "contract";
  work_format: "remote" | "hybrid" | "onsite";
  experience_required: string;
  is_active: boolean;
  views: number;
  created_at: string;         // ISO дата
  updated_at: string;         // ISO дата
  // Additional fields for display (from company data)
  company_name?: string;
  company_logo?: string;
  tags?: string[];
  remote: boolean;
  salary_display: any
}
export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  company_name?: string;      // Для работодателей
  phone?: string;
  created_at: string;

}

// Application with status and additional info
export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  company_name?: string;
  phone?: string;
  created_at: string;
  resume?: Resume | null; // ← добавил
}
export interface Application {
  id: string;
  vacancy_id: string;
  vacancy_title: string;
  status: "pending" | "accepted" | "rejected";
  updated_at?: string;
  resume: Resume | null;

}

export interface VacancyPost  {
  title: string;
  company: string;
  location: string;
  description: string;
  responsibilities: string;
  requirements: string;
  salary_from: string; // string, как ждёт API
  salary_to: string;   // string, как ждёт API
  currency: string;
  show_salary: boolean;
  employment_type: "full_time" | "part_time" | "contract";
  work_format: "remote" | "hybrid" | "on_site";
  experience_required: string;
  is_active: boolean;
};
