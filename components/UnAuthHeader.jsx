"use client";
import { usePathname } from 'next/navigation';
import { LogInButton, SignUpButton} from "../components/Buttons"

export const UnAuthHeader = () => {
    const pgPathName = usePathname();

    return (
        <div className="header">
            <nav className="bg-gray-100 w-full items-center space-x-6">

                <div className="md:flex md:items-center md:justify-between md:mx-auto">
                    {/* <div>page path: {pgPathName}</div> */}
                    <div className="flex flex-row px-20">
                        {pgPathName != "/auth/signIn"?(
                            <LogInButton />
                        ):(
                            <></>
                        )}

                        <SignUpButton />
                    </div>    
                </div>
                
            </nav>
        </div>
    );
}