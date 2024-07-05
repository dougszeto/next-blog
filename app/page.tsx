import Link from "next/link";
import Loader from "@/components/Loader";
export default function Home() {
  return (
    <main>
      <Loader show={true} />
      <Link prefetch={false} href="/dougsgrubs">
        Doug&apos;s profile
      </Link>
    </main>
  );
}
