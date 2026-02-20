import PageLayout from "@/layout/PageLayout";
import ConnectionsPageContent from "@/components/connections/ConnectionsPage";

export default function ConnectionsPage() {
  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <ConnectionsPageContent />
    </PageLayout>
  );
}
