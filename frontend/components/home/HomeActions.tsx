import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function HomeActions() {
  const router = useRouter();

  return (
    <>
      <Button
        variant="primary"
        className="me-2"
        onClick={() => router.push("/teams/create")}
      >
        + Create team
      </Button>

      <Button
        variant="outline-secondary"
        onClick={() => router.push("/teams/join")}
      >
        Join team
      </Button>
    </>
  );
}
