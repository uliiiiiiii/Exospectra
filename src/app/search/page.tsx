'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import searchObject from '../utils/searchObject';

function Search() {
    const searchParams = useSearchParams();
    const planetName = searchParams.get('object');
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter()

    useEffect(() => {
        if (planetName) {
            setLoading(true);
            searchObject(planetName).then((data) => {
                setLoading(false);
                if (data) {
                    if (data.type === "exoplanet") {
                        router.push(`/exoplanet?name=${encodeURIComponent(planetName)}`);
                    } else if (data.type === "star") {
                        router.push(`/system?name=${encodeURIComponent(planetName)}`);
                    }
                }
                else {
                    alert("Couldn't find this object. Try searching for something other");
                    router.back()
                }
            })
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div>
            {!planetName ? (
                <h1>No object name provided.</h1>
            ) : (<>
                {loading ? <p>Loading...</p>
                    : <p>Loaded (this page will be used for preloading and calculation of all info which will be used in the ExoplanetSystem or Exoplanet model)</p>}
            </>
            )}
        </div>
    );
}

export default function SearchResults() {
    return (
        <Suspense fallback={<p>Loading search params...</p>}>
            <Search />
        </Suspense>
    )
}