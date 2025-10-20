import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          firmName="Acme Capital Partners"
          userRole="Compliance Officer"
          userName="Alex Morgan"
        />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold">Main Content Area</h1>
          <p className="text-muted-foreground mt-2">This is where the main application content would appear.</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
