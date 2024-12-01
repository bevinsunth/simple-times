'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { User } from '@prisma/client';
import { deleteCurrentUser } from '@/lib/utils/operations';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface AccountOptionsDropdownProps {
  user: User;
}

export function AccountOptionsDropdown(
  props: AccountOptionsDropdownProps
): JSX.Element {
  const { user } = props;
  const avatar = user && user.image ? user.image : `https://avataaars.io`;
  console.log(user);
  const isTestUser = user.email?.endsWith('@example.com');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-15 w-full justify-start">
          <Avatar className="mr-2">
            <AvatarImage src={avatar} alt="User" />
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
        {!isTestUser && (
          <>
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
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
