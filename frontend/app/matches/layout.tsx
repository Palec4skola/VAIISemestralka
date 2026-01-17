import RequireAuth from "@/components/ReuqireAuth";

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
