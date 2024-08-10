'use client';

import { AuthProvider } from "../contexts/AuthProvider";
import ToastProvider from "../ToastProvider/ToastProvider";

interface ProvidersProps {
    children: React.ReactNode;
  }
  
function Providers({ children } : ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}

export default Providers
