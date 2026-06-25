export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-semibold">Mini Wallet</h1>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
