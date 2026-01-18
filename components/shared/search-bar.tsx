import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function SearchBar({ className }: { className?: string }) {
  return (
    <InputGroup
      className={cn(
        "rounded-full border-border shadow-xl shadow-muted dark:shadow-black/50",
        className,
      )}
    >
      <InputGroupInput
        placeholder="Search our shop & discover something new #myplantstory"
        className="ml-4"
      />

      <InputGroupAddon align="inline-end">
        <Button variant={"ghost"} size={"icon"} className="rounded-full">
          <Search />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
