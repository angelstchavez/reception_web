import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { APP_NAME } from "@/lib/env";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Control de Acceso | Universidad Popular del Cesar",
    template: "%s | Universidad Popular del Cesar",
  },
  description:
    "Plataforma administrativa institucional para supervisar el control de acceso de la Universidad Popular del Cesar.",
  applicationName: APP_NAME,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className="h-full font-sans antialiased"
    >
      <body className="min-h-full flex flex-col bg-muted">
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
