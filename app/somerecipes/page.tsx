"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Generate: React.FC = () => {
  return (
    <div className={"container"}>
      <header className={"header"}>
        <div className="hello"> let me generate something... </div>
        <div style={{ width: "100%" }}>
          <Image
            src="/images/right.jpg"
            priority
            width={1200}
            height={700}
            alt=""
          />
        </div>
      </header>

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

export default Generate;
