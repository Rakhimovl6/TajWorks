import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { VacancyApi } from '../api/vacancy/vacancyApi'
import { resumeApi } from '../api/resume/resumeApi'
import { applicationApi } from '../api/application/applicationApi'

export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [VacancyApi.reducerPath]: VacancyApi.reducer,
    [resumeApi.reducerPath]: resumeApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(VacancyApi.middleware)
      .concat(resumeApi.middleware)
      .concat(applicationApi.middleware)
})

setupListeners(store.dispatch)
