import { AccountOptionsDropdown } from '../account-options-dropdown';
import { getLoggedInUser } from '@/lib/utils/user';
import { DashboardNavigation } from '../navigation/dashboard-navigation';

export async function Sidebar(): Promise<JSX.Element> {
  const user = await getLoggedInUser();
  return (
    <div className="sticky top-0 flex max-h-screen flex-col pb-12">
      <div className="grow space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
        </div>
        <DashboardNavigation />
      </div>
      <div className="mt-auto px-3 py-2">
        {user && <AccountOptionsDropdown user={user} />}
      </div>
    </div>
  );
}
