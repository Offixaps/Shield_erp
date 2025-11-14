
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarTrigger } from './ui/sidebar';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';

export default function AppHeader() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { user, signOutUser } = useAuth();
  const userAvatar = PlaceHolderImages.find(
    (image) => image.id === 'user-avatar-1'
  );

  const handleLogout = async () => {
    await signOutUser();
    router.push('/login');
  };
  
  const getInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.map(n => n[0]).join('');
    }
    return 'U';
  }


  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
         {!isMobile && (
            <Link href="/business-development" className="flex items-center gap-2">
                <Image src="/Shield app logo.svg" alt="SHIELD ERP Logo" width={24} height={24} className="h-6 w-6" />
                <h1 className="text-lg font-semibold">SHIELD ERP</h1>
            </Link>
         )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                {user?.photoURL ? (
                  <AvatarImage
                    src={user.photoURL}
                    alt="User avatar"
                    width={36}
                    height={36}
                  />
                ) : (
                   userAvatar && (
                    <AvatarImage
                        src={userAvatar.imageUrl}
                        alt="User avatar"
                        width={36}
                        height={36}
                        data-ai-hint={userAvatar.imageHint}
                    />
                ))}
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
