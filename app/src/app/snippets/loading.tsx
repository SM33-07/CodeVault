import { CyberLoader } from "@/components/ui/CyberLoader";

export default function SnippetsLoading() {
    return (
        <CyberLoader
            fullscreen
            size="lg"
            label="Indexing Snippet Library..."
            subtitle="Decrypting code categories & community collections..."
            timeoutMs={1200}
        />
    );
}
