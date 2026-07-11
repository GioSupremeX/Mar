/**
 * No-op preloader wrapper — renders children immediately.
 * The previous animated preloader was causing stuck loading in the Replit preview iframe.
 * The site content loads fast enough that a preloader isn't needed.
 */
export default function Preloader({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
