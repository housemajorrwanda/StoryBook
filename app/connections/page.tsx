import UnderDevelopment from "@/components/shared/UnderDevelopment";
import PageLayout from "@/layout/PageLayout";

export default function ConnectionsPage() {
  return (
    <PageLayout showBackgroundEffects={true} variant="default">
      <div className="min-h-screen bg-[#fafafa]">
        <UnderDevelopment
          title="Connections"
          subtitle="Connect with survivors, families, and communities. This feature is coming soon to help you build meaningful relationships and share experiences."
          showBackButton={true}
        />
      </div>
    </PageLayout>
  );
}
