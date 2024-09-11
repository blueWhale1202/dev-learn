import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
    return (
        <Link href="/">
            <Image width={130} height={130} src="/logo.svg" alt="Logo" />
        </Link>
    );
};
