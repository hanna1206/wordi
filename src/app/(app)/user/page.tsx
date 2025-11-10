import { UserSettings } from '@/modules/user-settings/pages/user-profile.page';

// Force dynamic rendering since this page uses cookies for authentication
// for initial loading
export const dynamic = 'force-dynamic';

export default function UserPage() {
  return <UserSettings />;
}
