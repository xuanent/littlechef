"use client";
import React, { useState } from "react";
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
        <div style={{ width: "70%" }}>
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
              yea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <div className="flex justify-center items-center h-full">
                  <Image
                    src="/images/gif.jpg"
                    priority
                    width={150}
                    height={150}
                    alt=""
                  />
                </div>
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
          nah
        </Button>
      </div>

      <style jsx>{`
        .container {
          position: relative;
          padding: 0 1rem;
          justify-content: center;
          align-items: flex-start;
          flex-direction: column;
        }

        .header {
          position: relative;
          padding: 2vh;
          width: 100%;
          height: 70%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hello {
          font-size: 5vw;
          width: 100%;
          padding: 2vw;
          text-align: center;
        }

        .answer {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin-bottom: 5%;
        }
      `}</style>
    </div>
  );
};

export default Home;
