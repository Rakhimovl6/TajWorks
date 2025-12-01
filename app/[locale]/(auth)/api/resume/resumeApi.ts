// src/(auth)/api/resume/resumeApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const resumeApi = createApi({
    reducerPath: 'resumeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://tajwork.softclub.tj/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        postResume: builder.mutation({
            query: ({ full_name, file }: { full_name: string; file: File }) => {
                if (!file) throw new Error("No file provided"); // проверка

                const formData = new FormData();
                formData.append("full_name", full_name);
                formData.append("file", file, file.name); // ⚠ обязательно третьим параметром имя файла

                const token = localStorage.getItem("access") || "";

                return {
                    url: "resumes/",
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Content-Type не ставим, fetch сам выставит multipart/form-data
                    },
                };
            },
        }),


    }),
});

export const { usePostResumeMutation } = resumeApi;
