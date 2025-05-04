import './globals.css';


export const metadata = {
  title: "Login App",
  description: "Login with Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
