import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-primary-600 text-white text-center py-4 text-xs text-primary-100">
        SpecialtyRx Navigator — For licensed Healthcare Providers only. Always verify information with the manufacturer.
      </footer>
    </div>
  );
}
