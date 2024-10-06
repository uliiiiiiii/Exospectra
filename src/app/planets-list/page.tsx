"use client"

import css from "./page.module.css"
import ExospectraLabel from "../components/ExospectraLabel"


const BASE_URL = "/exoplanet?name="

export default function PlanetsList() {
    return (
        <div className={css.container}>
            <ExospectraLabel />
            <h1>List of Planets We Think Are Worth Taking a Look At:</h1>
            <ul>
                <a href={`${BASE_URL}55 Cnc e`}><li>55 Cnc e</li></a>
            </ul>
        </div>
    )
}