"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import loadingGif from "@/public/images/loadinggif.webp";

type GeneratedIdea = {
  index: number;
  name: string;
  description: string;
};

const Generate: React.FC = () => {
  // const [mealIdeas, setMealIdeas] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [calledOnce, setcalledOnce] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  // const ingredientNamesParam = searchParams.get("ingredientNames");
  const [ingredientNamesParam, setIngredientNamesParam] = useState<
    string | null
  >(null);
  const [mealIdeas, setMealIdeas] = useState<GeneratedIdea[]>([]);

  const GetIngredients = () => {
    // setIngredientNamesParam(searchParams.get("ingredientNames"));
    // if (ingredientNamesParam) {
    //   setIngredientNames(ingredientNamesParam.split(","));
    // }
    // return null;
    const searchParams = useSearchParams();
    useEffect(() => {
      const ingredientNamesParam = searchParams.get("ingredientNames");
      if (ingredientNamesParam) {
        setIngredientNames(ingredientNamesParam.split(","));
      }
    }, [searchParams]);

    return null;
  };

  function joinWithAnd(lst: string[]): string {
    if (!lst || lst.length === 0) {
      return "";
    }

    if (lst.length === 1) {
      return lst[0];
    }

    const lastIndex = lst.length - 1;
    return lst.slice(0, lastIndex).join(", ") + " and " + lst[lastIndex];
  }

  useEffect(() => {
    if (ingredientNames.length > 0 && !calledOnce) {
      setcalledOnce(true);
      fetchMealIdeas();
    }
  }, [ingredientNames]);

  function parseMealIdeas(response: string) {
    // Split the response into individual meal ideas
    const mealIdeasArray = response
      .toLowerCase()
      .trim()
      .split("\n")
      .filter((line) => line);

    // Map over each meal idea and extract the index, name, and description
    const parsedMealIdeas = mealIdeasArray
      .map((mealIdea) => {
        const match = mealIdea.match(/^(\d+)\.\s*(.*?):\s*(.*)$/);
        if (match) {
          const [, index, name, description] = match;
          return {
            index: parseInt(index, 10),
            name,
            description,
          };
        }
        return null;
      })
      .filter((item) => item !== null) as GeneratedIdea[];

    return parsedMealIdeas;
  }

  function regenerate() {
    setMealIdeas([]);
    return fetchMealIdeas();
  }

  const fetchMealIdeas = async () => {
    console.log("fetchMealIdeas called");
    setLoading(true);
    setError(null);
    setMealIdeas([]);

    try {
      console.log("Sending ingredientNames:", ingredientNames); // Add this line before the fetch call
      const response = await fetch("/api/generateRecipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredientNames }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate meal ideas");
      }

      const data = await response.json();
      setMealIdeas(parseMealIdeas(data.mealIdeas));
      console.log("the array", mealIdeas);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"container"}>
      <header className={"header"}>
        <Suspense fallback={<div>Loading...</div>}>
          <GetIngredients />
        </Suspense>
        <div className="hello">you chose {joinWithAnd(ingredientNames)}!</div>
      </header>
      <div className="recipe">
        <div
          className="flex flex-col items-center justify-start w-1/3"
          style={{ maxHeight: "100%", overflow: "auto" }}
        >
          <div
            className="image-container"
            style={{
              backgroundImage: 'url("/images/right.jpg")',
              backgroundRepeat: "repeat-y",
              backgroundSize: "100%",
              minHeight: "100%",
              width: "100%",
            }}
          ></div>
        </div>
        <div className="actualRecipe">
          {loading && (
            <div className="flex flex-col items-center justify-start h-3/4">
              <p>gimme a bit... </p>
              <Image
                src={loadingGif}
                alt="Loading..."
                width={300}
                height={300}
              />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {mealIdeas && !loading && (
            <div>
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">
                  here are some meal ideas
                </h1>
              </div>
              <div>
                {mealIdeas.map((mealIdea) => (
                  <div key={mealIdea.index}>
                    <h2 className="text-lg mt-4 font-bold">
                      meal {mealIdea.index}:
                    </h2>
                    <h3 className="font-bold">{mealIdea.name}</h3>
                    <p>{mealIdea.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          className="flex flex-col items-center justify-start w-1/3"
          style={{ maxHeight: "100%", overflow: "auto" }}
        >
          <div
            className="image-container"
            style={{
              backgroundImage: 'url("/images/right.jpg")',
              backgroundRepeat: "repeat-y",
              backgroundSize: "100%",
              minHeight: "100%",
              width: "100%",
            }}
          ></div>
        </div>
      </div>
      {!loading && (
        <div className="ihatetheserecipes">
          <Button
            className="bg-orange-400 hover:bg-orange-300"
            onClick={regenerate}
          >
            nah pls give me better ones
          </Button>
        </div>
      )}

      <style jsx>{`
        .container {
          width: 100%;
          padding: 0 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-bottom: 4vh;
          position: relative;
        }

        .header {
          padding: 2vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .border {
          border-radius: 9999px;
          min-height: 70vh;
          min-width: 80vh;
        }

        .hello {
          font-size: 2vh;
          padding: 0.5vh;
          text-align: center;
        }

        .recipe {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          relative: center;
        }

        .actualRecipe {
          width: 100%;
          padding-left: 5%;
          padding-right: 5%;
        }

        .ihatetheserecipes {
          width: 100%;
          margin-top: 2vw;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
};

export default Generate;
