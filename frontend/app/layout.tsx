import '@/styles/globals.css';
import { GlobalNav } from '@/components/GlobalNav';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:light]">
      <body className="h-screen overflow-y-scroll pb-36">
        <GlobalNav />
        <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20">
          <div className="p-3.5 lg:p-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
