import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchBar({ className }: { className?: string }) {
  return (
    <InputGroup className={cn("rounded-full border-border", className)}>
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
