import { useLayoutEffect, useState } from "react";
import debounce from "../lib/utils/debounce";

export default function useWindowSize() {
    const [windowWidth, setWindowWidth] = useState<number>(
        typeof document !== 'undefined' ?
            document.documentElement.clientWidth :
            0
    );

    // debounse to avoid constant function triggering
    const handleCanvasResize = debounce(() => setWindowWidth(
        typeof document !== 'undefined' ?
            document.documentElement.clientWidth :
            0
    ));

    useLayoutEffect(() => {
        window.addEventListener('resize', handleCanvasResize);
        return () => {
            window.removeEventListener('resize', handleCanvasResize);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return { windowWidth };
}