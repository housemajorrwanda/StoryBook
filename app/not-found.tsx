import { NotFound } from '@/components/shared';

export default function NotFoundPage() {
  return (
    <NotFound 
      title="404 - Page Not Found"
      subtitle="Sorry, the page you are looking for doesn't exist or has been moved."
      showBackButton={true}
    />
  );
}
