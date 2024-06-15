"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export type Ingredient = {
  name: string;
  dateBought: Date;
  servings: number;
};

export const columns: ColumnDef<Ingredient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "dateBought",
    header: "date bought",
    cell: ({ row }) => {
      const dateObject = row.getValue("dateBought");
      if (dateObject instanceof Date) {
        const formattedDate = dateObject.toLocaleDateString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
        return <div>{formattedDate}</div>;
      }
    },
  },
  {
    accessorKey: "servings",
    header: "servings",
  },
];
