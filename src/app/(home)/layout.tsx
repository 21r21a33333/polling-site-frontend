import ProtectedRoute from "../components/ProtectedRoute";
import Pollheader from "../components/polls/Pollheader";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectedRoute>
        <Pollheader />
        <div style={{ display: "flex", justifyContent: "center" }}>
          {children}
        </div>
      </ProtectedRoute>
    </>
  ); // No layout, no parent layout is inherited.
}
