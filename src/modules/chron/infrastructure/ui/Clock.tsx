'use client';
import { SlidingNumber } from '@/components/motion-primitives/sliding-number';
import { useEffect } from 'react';
import useChron from "@/modules/chron/infrastructure/directus/useChron.ts";

const Clock = () => {
    const {sync, synced,tick, chron} = useChron();

    useEffect(() => {
        if (!synced) {
            sync();
        }
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [synced]);

    return (
        <div className='flex items-center gap-0.5 font-mono text-[clamp(1rem,1rem+2vh,4rem)]'>
            <SlidingNumber value={chron().time.hours} padStart={true}/>
            <span className='text-zinc-500'>:</span>
            <SlidingNumber value={chron().time.minutes} padStart={true} />
            <span className='text-zinc-500'>:</span>
            <SlidingNumber value={chron().time.seconds} padStart={true} />
        </div>
    );
};

export default Clock;