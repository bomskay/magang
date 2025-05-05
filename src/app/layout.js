import './globals.css';
import LayoutWrapper from '@/components/layoutWrapper';


export const metadata = {
  title: "Login App",
  description: "Login with Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body className="min-h-screen flex flex-col">
    <LayoutWrapper>{children}</LayoutWrapper>
    </body>
  </html>
  );
}
