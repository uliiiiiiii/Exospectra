import css from "./constellationMenu.module.css";

export default function ConstellationMenuButton({ onPress }: { onPress: Function }) {
    return (
        <button
            className={css.menuButton}
            onClick={() => {
                onPress();
            }}
        >
            Constellation Menu
        </button>
    );
}