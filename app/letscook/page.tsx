"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
    .number({
      required_error: "Please enter a number for the item.",
    })
    .multipleOf(0.01, {
      message: "Please only enter up to 2 decimal places.",
    })
    .max(10, {
      message: "Servings must be less than 10.",
    })
    .positive({
      message: "Servings must be greater than 0.",
    }),
  // servings: z
  //   .string()
  //   .regex(/^\d*\.?\d{0,2}$/, {
  //     message: "Please enter a valid number with up to 2 decimal places.",
  //   })
  //   .transform((val) => parseFloat(val))
  //   .refine((val) => val > 0, {
  //     message: "Servings must be greater than 0.",
  //   }),
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
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
  const dialogRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const [allIngredients, setAllIngredients] = React.useState<Ingredient[]>([
    { name: "napa cabbage", dateBought: new Date(2024, 4, 7), servings: 4 },
    {
      name: "enoki mushrooms",
      dateBought: new Date(2024, 4, 7),
      servings: 1,
    },
    { name: "strawberries", dateBought: new Date(2024, 4, 7), servings: 4 },
    { name: "egg", dateBought: new Date(2024, 4, 10), servings: 6 },
    { name: "minced pork", dateBought: new Date(2024, 4, 7), servings: 2 },
    { name: "shrimp", dateBought: new Date(2024, 4, 7), servings: 5 },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // dateBought: new Date(Date.now()).toLocaleDateString("en-US"),
      servings: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newIngredient: Ingredient = {
      name: values.name,
      servings: values.servings,
      dateBought: values.dateBought,
    };
    setAllIngredients([newIngredient, ...allIngredients]);
    form.reset();
  }

  const handleIngSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedRows = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => allIngredients[parseInt(key)]);
    const names = selectedRows.map((row) => row.name);
    setSelectedNames(names);

    if (dialogRef.current) {
      dialogRef.current.click();
    }
  };

  const handleIngDelete = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedIngredients = allIngredients.filter((_, index) => {
      return !rowSelection[index];
    });
    setAllIngredients(updatedIngredients);
    setRowSelection({});
  };

  // const recipeGen = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   router.push(`/somerecipes?ingredients=${selectedNames}`);
  // };

  const GenerateRecipeHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedIngredientNames = selectedNames;
    const queryParams = new URLSearchParams({
      ingredientNames: selectedIngredientNames.join(","),
    });
    const url = `/somerecipes?${queryParams.toString()}`;
    router.push(url);
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
            className="space-y-2 w-8/12 relative"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormDescription className="font-bold text-black">
                    add more ingredients!
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="ingredient" {...field} />
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
                            "w-6/12 pl-3 text-left font-normal w-full",
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
                    <Input
                      placeholder="number of servings"
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const regex = /^\d*\.?\d{0,2}$/;
                        if (regex.test(inputValue) || inputValue === "") {
                          const numberValue =
                            inputValue === ""
                              ? undefined
                              : parseFloat(inputValue);
                          field.onChange(numberValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end align-end mt-0">
              <Button
                className="bg-orange-100 hover:bg-orange-50 border text-black"
                type="submit"
              >
                add
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className={"ingredientsDisplay"}>
        <p className="text-center">
          here are just some ingredients i always have in my fridge but feel
          free to add more!
        </p>
        <ScrollArea className="h-[30vh] rounded-md p-4 max-w-full">
          <div className="container mx-auto py-10 w-full space-y-8">
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
              {selectedNames.length > 0 ? (
                <div>
                  <DialogHeader>
                    <DialogTitle>lets chef it up with these picks</DialogTitle>
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
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button
                        className="mt-4"
                        type="submit"
                        onClick={GenerateRecipeHandler}
                      >
                        yes im sure
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="mb-2">
                      hurry up and decide
                    </DialogTitle>
                    <DialogDescription className="mt-24">
                      dont be indecisive!!
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button>go back and choose</Button>
                    </DialogClose>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
          <Button
            className="bg-orange-500 w-[100px] mr-4"
            type="submit"
            onClick={handleIngDelete}
          >
            delete
          </Button>
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
          width: 100%;
          padding: 0 1rem;
          justify-content: center;
          flex-direction: column;
          position: relative;
        }

        .header {
          padding: 2vh;
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .border {
          border-radius: 9999px;
          min-height: 70vh;
          min-width: 80vh;
        }

        .ingredientsDisplay {
          padding: 2vh;
          min-width: 100%;
          min-height: 35%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .addNew {
          padding: 2%;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ready {
          padding: 2vh;
          width: 70%;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
};

export default LetsCook;
