import css from "./constellationMenu.module.css";

export default function ConstellationMenuButton({ onPress }: { onPress: Function }) {
    return (
        <div className={css.buttonArea}>
        <p>Click here to switch to constellation mode</p>
        <div className={css.modeButton} style={{ backgroundImage: "url('/drawIcon.png')" }} onClick={()=> {onPress()}}></div>
    </div>
    );
}