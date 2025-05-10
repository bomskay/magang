// components/LayoutWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/";

  return (
    <>
      {!hideLayout && <Header />}
      <main className={hideLayout ? "" : "flex-grow"}>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
