import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            <div className="h-20 w-full md:pl-56 fixed inset-y-0 z-50">
                <Navbar />
            </div>

            <div className="hidden md:flex flex-col h-full w-56 fixed inset-y-0 z-50">
                <Sidebar />
            </div>

            <main className="md:pl-56 pt-20">{children}</main>
        </div>
    );
}