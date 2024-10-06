import ExospectraLabel from "../ExospectraLabel"
import Image from "next/image"
import css from './styles.module.css'

export default function Loading() {
    return (
        <div className={css.main}>
            <div className={css.labelContainer}>
                <ExospectraLabel />
            </div>
            <div className={css.loaderContainer}>
                <div className={css.loader}>
                    <Image className={css.stars} src='/starsLoader.png' width={318} height={318} alt='stars loader' />
                    <Image className={css.rocket} src='/rocket.png' width={110} height={110} alt='rocket' />
                </div>
            </div>
        </div>
    )
}