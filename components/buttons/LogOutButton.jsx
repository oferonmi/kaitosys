"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";

const LogOutButton = () => {
    return(
        <>
            <button
                onClick={ () => signOut({ callbackUrl: "/home",}) }
                className="flex text-gray-200 text-justify bg-kaito-brand-ash-green hover:bg-kaito-brand-ash-green focus:ring-4 focus:ring-teal-300 rounded-lg font-medium text-sm px-5 py-2 mr-2 mb-2 dark:bg-kaito-brand-ash-green dark:hover:bg-kaito-brand-ash-green focus:outline-none dark:focus:ring-teal-800 gap-1"
            >
                Log Out
            </button>
        </>
    );
}

export default LogOutButton;