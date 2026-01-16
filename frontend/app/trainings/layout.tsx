import RequireAuth from "@/components/ReuqireAuth";

export default function TrainingsLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}