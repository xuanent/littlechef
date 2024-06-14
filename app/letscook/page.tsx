"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
// import { useSearchParams } from "react-router-dom";
import * as React from "react";
import { Ingredient, columns } from "./columns";
import { DataTable } from "./data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { table } from "console";
import { getRandomValues } from "crypto";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Please enter a name for the item.",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    }),
  dateBought: z.date(),
  servings: z
    .string()
    .regex(/^\d*\.?\d{0,2}$/, {
      message: "Please enter a valid number with up to 2 decimal places.",
    })
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, {
      message: "Servings must be greater than 0.",
    }),
});

function GetName() {
  const searchParams = useSearchParams();
  const name = searchParams?.get("name");
  return (
    <div>
      {name ? (
        <div className="text-5xl py-8">
          {" "}
          hi {name}! what are we working with today?{" "}
        </div>
      ) : (
        <div className="text-5xl py-8">hi! what are we working with today?</div>
      )}
    </div>
  );
}

const LetsCook: React.FC = () => {
  const router = useRouter();
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
  const dialogRef = React.useRef<HTMLButtonElement>(null);

  const [allIngredients, setAllIngredients] = React.useState<Ingredient[]>([
    { name: "Napa Cabbage", dateBought: new Date(2024, 4, 7), servings: 4 },
    {
      name: "Enoki mushrooms",
      dateBought: new Date(2024, 4, 7),
      servings: 4,
    },
    { name: "Strawberries", dateBought: new Date(2024, 4, 7), servings: 4 },
    { name: "Minced pork", dateBought: new Date(2024, 4, 7), servings: 4 },
    { name: "Shrimp", dateBought: new Date(2024, 4, 7), servings: 5 },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // dateBought: new Date(Date.now()).toLocaleDateString("en-US"),
      servings: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const newIngredient: Ingredient = {
      name: values.name,
      servings: values.servings,
      dateBought: values.dateBought,
    };
    setAllIngredients([...allIngredients, newIngredient]);
    form.reset();
  }

  const handleIngSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(rowSelection);
    const selectedRows = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => allIngredients[parseInt(key)]);
    const names = selectedRows.map((row) => row.name);
    setSelectedNames(names);
    console.log(names);

    if (dialogRef.current) {
      dialogRef.current.click();
    }
  };

  const recipeGen = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/somerecipes?name=${selectedNames}`);
  };

  return (
    <div className={"container"}>
      <header className={"header"}>
        <Suspense>
          <GetName />
        </Suspense>
      </header>

      <div className={"addNew"}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-[50vh]"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>add more items</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateBought"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[50vh] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>date bought</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="number of servings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" style={{ marginTop: "2vh" }}>
              Submit
            </Button>
          </form>
        </Form>
      </div>

      <div className={"ingredientsDisplay"}>
        <ScrollArea className="h-[30vh] rounded-md p-4 w-[90vh]">
          <div className="container mx-auto py-10 w-[70vh] space-y-8">
            <DataTable
              columns={columns}
              data={allIngredients}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
        </ScrollArea>
        <div className={"ready"}>
          <Dialog>
            <DialogTrigger asChild>
              <button ref={dialogRef} style={{ display: "none" }}>
                Open Dialog
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>let us chef it up with these picks</DialogTitle>
                <DialogDescription>
                  <ul
                    style={{
                      listStyleType: "disc",
                      paddingLeft: "20px",
                      marginTop: "10px",
                    }}
                  >
                    {selectedNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="submit" onClick={recipeGen}>
                    yes im sure
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            className="bg-orange-500 w-[100px]"
            type="submit"
            onClick={handleIngSubmit}
          >
            lets cook!!
          </Button>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-width: 100vh;
          padding: 0 1rem;
          justify-content: center;
          flex-direction: column;
        }

        .header {
          padding: 2vh;
          min-width: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .border {
          border-radius: 9999px;
          min-height: 70vh;
          min-width: 80vh;
        }

        .ingredientsDisplay {
          padding: 2vh;
          min-width: 100vh;
          min-height: 35vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .addNew {
          padding: 2vh;
          min-width: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ready {
          padding: 2vh;
          width: 90vh;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
};

export default LetsCook;
