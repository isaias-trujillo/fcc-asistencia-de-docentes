import {ReactNode, useEffect, useState} from "react";
import {Particles} from "@/components/magicui/particles.tsx";
import {Toaster} from "sonner";

const MainLayout = ({children}: { children: ReactNode }) => {
    const [colorScheme, setColorScheme] = useState<"dark" | "light">("light");
    const [color, setColor] = useState("#000000");

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        // is dark mode?
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setColorScheme(() => "dark");
            return;
        }
        // the default is light
        setColorScheme(() => "light");
        // watch for changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            setColorScheme(() => event.matches ? "dark" : "light");
        });
        window.matchMedia('(prefers-color-scheme: no-preference)').addEventListener('change', event => {
            setColorScheme(() => event.matches ? "light" : "dark");
        });
    }, []);

    useEffect(() => {
        if (colorScheme === "dark") {
            setColor("#ffffff");
            return;
        }
        setColor("#000000");
    }, [colorScheme]);


    return (
        <div
            className="relative flex min-h-screen flex-col items-center justify-center py-[clamp(1rem,1rem+2vh,2rem)]">
            {children}
            <Particles
                className="absolute inset-0 z-0"
                quantity={200}
                ease={80}
                color={color}
                refresh
            />
            <Toaster richColors={true} position={"bottom-center"}/>
        </div>
    );
};

export default MainLayout;