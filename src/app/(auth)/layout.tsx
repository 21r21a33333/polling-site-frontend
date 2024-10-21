import Header from "../components/hero/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <Header />
        <div className="container mx-auto">{children}</div>
      </div>
    </div>
  );
}
