import './globals.css';
import { Providers } from '@/app/providers';
import { Header } from '@/components/header';
import { ToastProvider } from '@/components/ui/toaster';

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'AI SaaS Platform',
  description: 'Professional AI tools you can use today.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">     <body>
        <Providers>
          <Header />
          <main className="min-h-screen bg-white">{children}</main>
          <ToastProvider>
            <div />
          </ToastProvider>
        </Providers>
     </body>
    </html>
  );
}
