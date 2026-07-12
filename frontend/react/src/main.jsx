import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// first make hte query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, //cache 30s tak fresh
      gcTime: 5 * 60 * 1000, //5 min tak cache
      retry: 1,
      refetchOnWindowFocus: true
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
