import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const Header: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <header className="navbar h-20 bg-slate-50 drop-shadow-lg">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case text-teal-500">
          T3 Notes
        </a>
      </div>
      <div className="flex-2 mr-2 gap-6">
        <span className="text-md text-slate-800">
          Logged in as: {sessionData?.user.name}
        </span>
        <button
          onClick={() => void signOut()}
          className="btn-outline btn-accent btn"
        >
          SIGN OUT
        </button>
      </div>
    </header>
  );
};

export default Header;
