import { CyberLoader } from "@/components/ui/CyberLoader";

export default function ProfileLoading() {
    return (
        <CyberLoader
            fullscreen
            size="lg"
            label="Loading Developer Profile..."
            subtitle="Fetching user repository badges & stats..."
            timeoutMs={1200}
        />
    );
}
