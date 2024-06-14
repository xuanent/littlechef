"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Home: React.FC = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = inputValue;
    setInputValue(""); // Reset input for next time the dialog is opened
    router.push(`/letscook?name=${name}`);
  };

  return (
    <div className={"container"}>
      <header className={"header"}>
        <div style={{ width: "100%" }}>
          <Image
            src="/images/banner.jpg"
            priority
            width={1200}
            height={1200}
            alt=""
          />
        </div>
        <div className="hello"> hi chef! ready to cook? </div>
      </header>
      <div className={"answer"}>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mr-4 bg-orange-100 text-black hover:bg-orange-300">
              Yes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>yay! whats is your name?</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    chef name
                  </Label>
                  <Input
                    id="name"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="(optional)"
                    className="col-span-3 bg-orange-100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="mr-4 bg-orange-100 text-black hover:bg-orange-300"
                  type="submit"
                >
                  lets start!
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button
          className="mr-4 bg-orange-100 text-black hover:bg-orange-300"
          onClick={() => {
            toast({
              title: "ok bye",
              description: "come back when you wanna make something!",
            });
          }}
        >
          No
        </Button>
      </div>

      <style jsx>{`
        .container {
          max-width: 100vh;
          padding: 0 1rem;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
        }

        .header {
          padding: 2vh;
          min-width: 100vh;
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .border {
          border-radius: 9999px;
          min-height: 70vh;
          min-width: 80vh;
        }

        .hello {
          font-size: 5vh;
          padding: 2vh;
        }

        .answer {
          min-width: 100vh;
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
