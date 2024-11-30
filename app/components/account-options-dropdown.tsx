'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { getUserInitials } from '@/lib/utils';
import { User } from '@prisma/client';
import { deleteCurrentUser } from '@/lib/utils/operations';

interface AccountOptionsDropdownProps {
  user: User;
}

export function AccountOptionsDropdown(
  props: AccountOptionsDropdownProps
): JSX.Element {
  const { user } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Avatar className="mr-2 size-6">
            <AvatarImage src={user?.image ?? ''} alt="User" />
            <AvatarFallback>{getUserInitials(user?.name ?? '')}</AvatarFallback>
          </Avatar>
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem
          onClick={event => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            });
          }}
        >
          <LogOut className="mr-2 size-4" />
          <span>Logout</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={event => {
            event.preventDefault();
            deleteCurrentUser();
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            });
          }}
        >
          <Trash2 className="mr-2 size-4" />
          <span>Delete Account</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
