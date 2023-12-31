import Link from "next/link";
import Image from "next/image";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import {AuthHeader} from "./AuthHeader";
import { UnAuthHeader } from "./UnAuthHeader";
// import Logo from "../public/kaito_app_logo.png";

export const Header = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="flex flex-col border-b-2">
            <header className="bg-gray-100 border-gray-200 w-full items-center space-x-6 rounded-md sticky top-0"> {/*z-20 fixed*/}

                <div className="md:flex md:items-center md:justify-between md:mx-auto">

                    <Link href="/ai_tools" passHref className="px-20 py-1 w-auto h-auto">
                        <div className="flex flex-row">
                            <div>
                                <Image src="/logos/D9E2D5_3E6765/KAITO_logos_transparent.png" alt="App logo" width={115} height={115} />
                            </div>
                            <div className="mt-2">
                                <Image src="/kaitosys_app_logo.png" alt="App logo" width={322} height={112} />
                            </div>
                        </div>
                    </Link>
                    
                    
                    {session ? (
                        <AuthHeader />
                    ):(
                        <UnAuthHeader />
                    )}
                    
                </div>
                
            </header>
        </div>
    );
}