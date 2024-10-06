"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import css from "./page.module.css";
import ExospectraLabel from './components/ExospectraLabel';


export default function Home() {
  const [planetName, setPlanetName] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (planetName.trim()) {
      router.push(`/search?object=${planetName}`);
    } else {
      alert('Please enter a system/star name!');

    }
  };

  return (
    <div className={css.main}>
      <div className={css.about}>ABOUT</div>
      <div className={css.center}>
        <ExospectraLabel />
        <div className={css.starsSymbols}></div>
        <div className={css.headline}>Search for a Planet/Planetary System</div>
        <input
          type="text"
          placeholder="Enter planet/system name"
          value={planetName}
          onChange={(e) => setPlanetName(e.target.value)}
          className={css.searchField}
        />
        <button onClick={handleSearch} className={css.button}>Search</button>
      </div>
      <a href="/planets-list"><div className={css.team}>INTERESTING PLANETS</div></a>
    </div >
  );
}