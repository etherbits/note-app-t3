import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import React from "react";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center  justify-center bg-slate-50">
      <div className="m-auto flex flex-col items-center gap-6 rounded-md bg-slate-100 p-8 text-2xl font-bold text-slate-800 drop-shadow-md">
        <span>Sign in to continue</span>
        <button
          className={"btn-accent btn-block btn"}
          onClick={() => void signIn()}
        >
          SIGN IN
        </button>
      </div>
    </div>
  );
};

export default Home;
