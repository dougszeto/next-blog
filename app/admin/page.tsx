import AuthCheck from "@/components/AuthCheck";

export default function AdminPage({}) {
  return (
    <main>
      <AuthCheck>
        <h1>Admin Home</h1>
      </AuthCheck>
    </main>
  );
}
