
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white text-lg mb-4">
              Sheggar Wheels
            </h3>

            <p className="text-sm">
              Peer-to-peer car rental for Addis Ababa. Rent from locals, earn
              from your idle car.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Renters</h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cars" className="hover:text-white">
                  Browse Cars
                </Link>
              </li>

              <li>
                <Link href="/signup" className="hover:text-white">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Owners</h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/owner/cars/new" className="hover:text-white">
                  List Your Car
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>

            <ul className="space-y-2 text-sm">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-sm text-center">
          © {new Date().getFullYear()} Sheggar Wheels.
        </div>
      </div>
    </footer>
  );
}
