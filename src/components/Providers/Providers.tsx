'use client';

import { AuthProvider } from "../contexts/AuthProvider";
import { BusinessProvider } from "../contexts/BusinessProvider";
import { CartProvider } from "../contexts/CartProvider";
import ToastProvider from "../ToastProvider/ToastProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <BusinessProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BusinessProvider>
  );
}

export default Providers
