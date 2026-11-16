import { createFileRoute, redirect } from "@tanstack/react-router";

// The passcode screen is now shown by the root layout; keep this path working for old links.
export const Route = createFileRoute("/unlock")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
});
