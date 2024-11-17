import '@/styles/globals.css';
import { Metadata } from 'next';
import { GlobalNav } from '@/components/GlobalNav/GlobalNav';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body className="h-screen overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')] pb-36">
        <GlobalNav />
        <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20">
          <div className="rounded-lg bg-gray-700 p-px shadow-lg shadow-black/20">
            <div className="p-3.5 lg:p-6">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
