import { useEffect, useState } from 'react';

export default function hasHydratedCheck () {
    
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);
    
    useEffect(() => {
        setHasHydrated(true);
    }, []);
    
    return hasHydrated;

}