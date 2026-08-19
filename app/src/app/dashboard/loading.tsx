import { CyberLoader } from "@/components/ui/CyberLoader";

export default function DashboardLoading() {
    return (
        <CyberLoader
            fullscreen
            size="lg"
            label="Synchronizing Workspace & Vault..."
            subtitle="Decrypting repositories, statistics & activity..."
            timeoutMs={1200}
        />
    );
}
