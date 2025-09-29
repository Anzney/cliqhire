import { ProtectedHomeClient } from "@/components/protected/ProtectedHomeClient";

export const dynamic = 'force-dynamic';

export default function Home() {
  return <ProtectedHomeClient />;
}