"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

const Generate: React.FC = () => {
  const [mealIdeas, setMealIdeas] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  const ingredientNamesParam = searchParams.get("ingredientNames");

  useEffect(() => {
    console.log("param", ingredientNamesParam);
    if (ingredientNamesParam) {
      setIngredientNames(ingredientNamesParam.split(","));
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("ingredientNames", ingredientNames); // Log the state

    if (ingredientNames.length > 0) {
      fetchMealIdeas();
    }
  }, [ingredientNames]);

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

  const fetchMealIdeas = async () => {
    console.log("fetchMealIdeas called");
    setLoading(true);
    setError(null);
    setMealIdeas("");

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
      setMealIdeas(data.mealIdeas);
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className={"container"}>
        <header className={"header"}>
          <div className="hello">you chose {joinWithAnd(ingredientNames)}!</div>
          <div className="hello"> let me generate something... </div>
          <div style={{ width: "100%" }}>
            {/* <Image
              src="/images/right.jpg"
              priority
              width={1200}
              height={700}
              alt=""
            /> */}
          </div>
        </header>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Generate Meal Ideas</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {mealIdeas && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Meal Ideas:</h2>
              <p>{mealIdeas}</p>
            </div>
          )}
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
            font-size: 2vh;
            padding: 0.5vh;
          }

          .answer {
            min-width: 100vh;
            display: flex;
            flex-direction: row;
            justify-content: center;
          }
        `}</style>
      </div>
    </Suspense>
  );
};

export default Generate;
