// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IGetVacancies, Vacancy, VacancyPost } from '../types'


export const VacancyApi = createApi({
  reducerPath: 'vacancyApi',

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

  tagTypes: ['Vacancy', 'Favorite'],

  endpoints: (builder) => ({

    // GET all vacancies
    getVacancy: builder.query<IGetVacancies[], void>({
      query: () => `vacancies/`,
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response.Vacancy,
      providesTags: ['Vacancy']
    }),

    // GET vacancy by ID
    getVacancyById: builder.query<Vacancy, number>({
      query: (id) => `/vacancies/${id}/`,
    }),

    // POST → add to favorite
    favoriteVacancy: builder.mutation<any, number>({
      query: (vacancyId) => ({
        url: `vacancies/${vacancyId}/favorite/`,
        method: "POST",
        body: { message: "favorite" },
      }),
      invalidatesTags: ["Favorite"],
    }),

    // ❌ DELETE → remove from favorite
    deleteFavorite: builder.mutation<any, number>({
      query: (vacancyId) => ({
        url: `vacancies/${vacancyId}/favorite/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorite"],
    }),

    // GET → user favorites
    getFavorites: builder.query<any[], void>({
      query: () => `favorites/`,
      providesTags: ["Favorite"],
    }),

    // POST → create vacancy
    postVacancy: builder.mutation<any, Partial<VacancyPost>>({
      query: (data) => ({
        url: 'vacancies/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vacancy'],
    }),
    
    // APPLY vacancy
    applyVacancy: builder.mutation<any, { vacancyId: string; cover_letter: string }>({
      query: ({ vacancyId, cover_letter }) => ({
        url: `vacancies/${vacancyId}/apply/`,
        method: 'POST',
        body: { cover_letter }, // тело запроса
      }),
      invalidatesTags: ['Vacancy']
    }),
  }),
});

export const {
  useGetVacancyQuery,
  useGetVacancyByIdQuery,
  useFavoriteVacancyMutation,
  useDeleteFavoriteMutation, 
  useGetFavoritesQuery,
  usePostVacancyMutation,
  useApplyVacancyMutation
} = VacancyApi;
