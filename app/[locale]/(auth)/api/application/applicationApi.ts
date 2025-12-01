// src/(auth)/api/application/applicationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface ApplicationResponse {
  id: number;
  status: string;
  message?: string;
}

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://tajwork.softclub.tj/api/',
    prepareHeaders: (headers) => {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('access')
          : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // ✅ Accept application
    acceptApplication: builder.mutation<ApplicationResponse, string>({
      query: (applicationId) => ({
        url: `applications/${applicationId}/accept/`,
        method: 'POST',
      }),
    }),

    // ✅ Reject application
    rejectApplication: builder.mutation<ApplicationResponse, string>({
      query: (applicationId) => ({
        url: `applications/${applicationId}/reject/`,
        method: 'POST',
      }),
    }),

    // ✅ Review application
    reviewApplication: builder.mutation<ApplicationResponse, string>({
      query: (applicationId) => ({
        url: `applications/${applicationId}/review/`,
        method: 'POST',
      }),
    }),

    // Можно добавить GET списка всех заявок, если нужно
    getApplications: builder.query<ApplicationResponse[], void>({
      query: () => `applications/`,
    }),
  }),
})

export const {
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
  useReviewApplicationMutation,
  useGetApplicationsQuery,
} = applicationApi
