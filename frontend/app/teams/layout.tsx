import RequireAuth from "@/components/ReuqireAuth";

export default function TeamsLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
