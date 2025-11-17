import UnderDevelopment from "@/components/shared/UnderDevelopment";
import PageLayout from "@/layout/PageLayout";

export default function EducationPage() {
  return (

      <PageLayout showBackgroundEffects={true} variant="default">
    
    <div className="min-h-screen bg-[#fafafa]">
      <UnderDevelopment
        title="Education"
        subtitle="Learn about Rwanda's history, the Genocide against the Tutsi, and the importance of remembrance. Educational resources and materials are coming soon."
        showBackButton={true}
      />
    </div>

    </PageLayout>
  );
}

