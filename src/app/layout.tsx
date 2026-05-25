import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const unofficialNotice = 'This is an unofficial fan-made tool for block-based building. It is not affiliated with, endorsed by, sponsored by, or approved by Mojang or Microsoft.';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="global-disclaimer">ⓘ {unofficialNotice}</div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
