"use client";

import CareInstructionResponse from "@/lib/schemas/care-instruction.ts/care-instruction-response";
import { ArrowUpDown, ExternalLink, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteCareInstructionDialog } from "./delete-care-instruction-dialog";
import { EditCareInstructionDialog } from "./edit-care-instruction-dialog";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateMiddle } from "@/utils/helpers";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";

function ActionsCell({ row }: { row: Row<CareInstructionResponse> }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`${APP_PATHS.CARE_INSTRUCTIONS_MANAGEMENT}/${row.original.id}`}
          >
            <Button variant={"ghost"} size={"icon"}>
              <ExternalLink />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Details</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setEditOpen(true)}
          >
            <SquarePen />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>

      <EditCareInstructionDialog
        key={row.original.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        careInstruction={row.original}
      />

      <DeleteCareInstructionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        careInstruction={row.original}
      />
    </>
  );
}

export const columns: ColumnDef<CareInstructionResponse>[] = [
  {
    accessorKey: "lightRequirement",
    header: "Light Requirement",
    cell: ({ row }) => {
      const value = row.original.lightRequirement;
      return (
        <span className="truncate max-w-32 block" title={value}>
          {truncateMiddle(value, 16)}
        </span>
      );
    },
  },
  {
    accessorKey: "wateringFrequency",
    header: "Watering Frequency",
    cell: ({ row }) => {
      const value = row.original.wateringFrequency;
      return (
        <span className="truncate max-w-32 block" title={value}>
          {truncateMiddle(value, 16)}
        </span>
      );
    },
  },
  {
    accessorKey: "temperature",
    header: "Temperature",
    cell: ({ row }) => {
      const value = row.original.temperature;
      return (
        <span className="truncate max-w-24 block" title={value}>
          {truncateMiddle(value, 12)}
        </span>
      );
    },
  },
  {
    accessorKey: "soil",
    header: "Soil",
    cell: ({ row }) => {
      const value = row.original.soil;
      return (
        <span className="truncate max-w-24 block" title={value}>
          {truncateMiddle(value, 12)}
        </span>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.original.notes;
      return (
        <span className="truncate max-w-48 block" title={notes}>
          {truncateMiddle(notes, 20)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAtUtc",
    header: ({ column }) => (
      <>
        Created At
        <Button
          variant="ghost"
          size={"icon"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          <ArrowUpDown />
        </Button>
      </>
    ),
    cell: ({ row }) => {
      const dateStr = row.original.createdAtUtc;
      const formatted = new Date(dateStr).toLocaleString("vi-VN", {
        hour12: false,
      });
      return (
        <span className="whitespace-nowrap" title={formatted}>
          {formatted}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
