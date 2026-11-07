import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotFoundContent } from "@/components/NotFoundContent";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
