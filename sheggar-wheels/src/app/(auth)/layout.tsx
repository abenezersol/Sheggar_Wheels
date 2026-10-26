export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">{children}</div>
  </div>;
}
