import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CreditCard,
  Gem,
  LogOut,
  MapPin,
  Package2,
  Smile,
  UserRound,
} from "lucide-react";

export function AccountDropdown({ className }: { className?: string }) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hover:cursor-pointer">
          <Button
            variant={"outline"}
            className="aspect-square rounded-full shadow-xl shadow-muted dark:shadow-black/50"
          >
            <UserRound className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 z-101 shadow-none rounded-sm"
          align="end"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <div className="flex items-center gap-2 p-2">
            <Button variant={"outline"} className="flex-1">
              Sign Up
            </Button>
            <Button variant={"outline"} className="flex-1">
              Sign In
            </Button>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Orders
              <DropdownMenuShortcut>
                <Package2 />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Address
              <DropdownMenuShortcut>
                <MapPin />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Whishlist
              <DropdownMenuShortcut>
                <Gem />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Payments
              <DropdownMenuShortcut>
                <CreditCard />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>
                <Smile />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>
              <LogOut />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
