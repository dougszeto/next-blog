import Link from "next/link";
import Loader from "@/components/Loader";
import Navbar from "@/components/NavBar";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Loader show={true} />
      <Link prefetch={false} href="/dougsgrubs">
        Doug&apos;s profile
      </Link>
    </main>
  );
}
