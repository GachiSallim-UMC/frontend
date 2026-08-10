import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { router } from '@/app/router';
import { ApiError, getApiErrorTitle, isUnexpectedApiError } from '@/shared/api';
import { useAlertStore } from '@/shared/store';
import { AlertModal } from '@/shared/components/ui/AlertModal';
import { PushSubscriptionSync } from './PushSubscriptionSync';

const shouldSkipGlobalError = (meta: unknown) =>
  (meta as { skipGlobalError?: boolean } | undefined)?.skipGlobalError === true;

const handleGlobalError = (error: unknown, meta: unknown) => {
  if (shouldSkipGlobalError(meta)) return;
  if (!isUnexpectedApiError(error)) return;

  useAlertStore.getState().showAlert({
    title: getApiErrorTitle(error.statusCode, error.code),
    message: error.message,
  });
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.statusCode > 0 && error.statusCode < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => handleGlobalError(error, query.meta),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => handleGlobalError(error, mutation.meta),
  }),
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
    <PushSubscriptionSync />
    <AlertModal />
  </QueryClientProvider>
);

export default App;
