import '@/styles/globals.css';
import { GlobalNav } from '@/components/GlobalNav';
import { Toaster } from '@/ui/Toast';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:light]">
      <body className="min-h-screen overflow-y-scroll bg-gray-50">
        <GlobalNav />
        <div className="pt-16 lg:pt-24">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
          <Toaster icons={{}} />
        </div>
      </body>
    </html>
  );
}
