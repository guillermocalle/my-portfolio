import "./globals.css";
import Theme from "@/components/Theme";
import DarkLight from "@/components/DarkLight";

export const metadata = {
  title: "Guillermo Calle | Portfolio",
  description: "Mi nombre es Guillermo, soy Desarrollador Web.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Theme>
          <DarkLight />
          {children}
        </Theme>
      </body>
    </html>
  );
}
