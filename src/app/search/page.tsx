'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import searchObject from '../utils/searchObject';
import Loading from '../components/loading/loading';

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
            ) : (<Loading progress="Searching for your object... 👀" />
            )}
        </div>
    );
}

export default function SearchResults() {
    return (
        <Suspense fallback={<Loading progress="Retrieving your search... 🔍" />}>
            <Search />
        </Suspense>
    )
}