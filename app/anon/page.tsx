import { getCurrentUserServer } from "@/lib/auth";

export default async function AnonPage() {
  const user = await getCurrentUserServer();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl font-bold">Anon Send</h1>
      <p className="mt-4 text-lg">Send anonymous messages securely.</p>
    </div>
  );
}
