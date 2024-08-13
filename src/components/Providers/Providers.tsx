'use client';

import { AuthProvider } from "../contexts/AuthProvider";
import { CartProvider } from "../contexts/CartProvider";
import ToastProvider from "../ToastProvider/ToastProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default Providers
