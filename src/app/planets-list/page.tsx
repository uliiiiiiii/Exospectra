"use client"
import css from "./page.module.css"
import ExospectraLabel from "../components/ExospectraLabel"

const BASE_URL = "/exoplanet?name="

export default function PlanetsList() {
    return (
        <div className={css.container}>
            <div className={css.label}><ExospectraLabel /></div>
            <p>List of Planets We Think Are Worth Taking a Look At:</p>
            <ul>
                <a href={`${BASE_URL}55 Cnc e`}><li>55 Cnc e</li></a>
                <a href={`${BASE_URL}GJ 1132 b`}><li>GJ 1132 b</li></a>
                <a href={`${BASE_URL}HAT-P-12 b`}><li>HAT-P-12 b</li></a>
                <a href={`${BASE_URL}Qatar-1 b`}><li>Qatar-1 b</li></a>
                <a href={`${BASE_URL}WASP-74 b`}><li>WASP-74 b</li></a>
                <a href={`${BASE_URL}Kepler-68 b`}><li>Kepler-68 b</li></a>
                <a href={`${BASE_URL}TrES-3 b`}><li>TrES-3 b</li></a>
                <a href={`${BASE_URL}WASP-10 b`}><li>WASP-10 b</li></a>
            </ul>
        </div>
    )
}