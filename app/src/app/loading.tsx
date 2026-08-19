import { CyberLoader } from "@/components/ui/CyberLoader";

export default function Loading() {
    return (
        <CyberLoader
            fullscreen
            size="lg"
            label="Decrypting Vault Route..."
            subtitle="Establishing secure encryption session..."
            timeoutMs={1200}
        />
    );
}
