import { Constellation } from "@/types/constellation";
import { useState } from "react";
import css from "./constellationMenu.module.css";

const colorNumToCSS = (colorNum: number) =>
    "#" + colorNum.toString(16).padStart(6, "0");

export default function ConstellationsMenu({
    constellations,
    updateConstellations,
    addConstellations,
    deleteConstellations,
    startEditing,
    stopEditing,
    getFreeID,
    onClose,
}: {
    constellations: Constellation[];
    updateConstellations: Function;
    addConstellations: Function;
    deleteConstellations: Function;
    startEditing: Function;
    stopEditing: Function;
    getFreeID: Function;
    onClose: Function;
}) {
    const [showColorSelection, setShowColorSelection] = useState(false);

    const colorOptions = [
        0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff, 0xff8c00,
        0xffffff,
    ];

    return (
        <div className={css.mainMenuContainer}>
            <div className={css.menuHeader}>
                <div className={css.menuTitle}>Constellation Menu</div>
                <button
                    className={css.closeButton}
                    onClick={() => {
                        onClose();
                    }}
                >
                    &times;
                </button>
            </div>
            <div className={css.constellationsContainer}>
                {constellations.map((constellation, index) => (
                    <div key={index} className={css.constellationItem}>
                        <div
                            className={css.constellationContent}
                            style={{
                                height:
                                    constellation.isEditing &&
                                        showColorSelection
                                        ? "100px"
                                        : "60px",
                                borderColor: constellation.isShown
                                    ? colorNumToCSS(constellation.color)
                                    : "gray",
                            }}
                        >
                            <div className={css.constellationHeader}>
                                <div>
                                    {constellation.isEditing ? (
                                        <input
                                            type="text"
                                            value={constellation.name}
                                            onChange={(e) =>
                                                updateConstellations(
                                                    constellation.id,
                                                    {
                                                        name: e.target.value,
                                                    }
                                                )
                                            }
                                            className={css.nameInput}
                                            maxLength={20}
                                        />
                                    ) : (
                                        <p style={{ paddingLeft: "4px" }}>
                                            {" "}
                                            {constellation.name}
                                        </p>
                                    )}
                                </div>
                                <div className={css.buttonGroup}>
                                    {constellation.isEditing && (
                                        <CustomSmallButton
                                            text={""}
                                            backgroundColor={colorNumToCSS(
                                                constellation.color
                                            )}
                                            onClick={() => {
                                                setShowColorSelection(
                                                    !showColorSelection
                                                );
                                            }}
                                        />
                                    )}
                                    <CustomSmallButton
                                        text={
                                            constellation.isEditing ? "✓" : "🖋"
                                        }
                                        backgroundColor={
                                            constellation.isShown
                                                ? constellation.isEditing
                                                    ? "green"
                                                    : "#6600CC"
                                                : "grey"
                                        }
                                        onClick={() => {
                                            if (constellation.isShown)
                                                if (constellation.isEditing) {
                                                    stopEditing();
                                                    setShowColorSelection(
                                                        false
                                                    );
                                                } else startEditing(index);
                                        }}
                                    />
                                </div>
                            </div>
                            {showColorSelection && constellation.isEditing && (
                                <div className={css.colorPalette}>
                                    {colorOptions.map((color) => (
                                        <div
                                            key={color}
                                            className={css.colorOption}
                                            style={{
                                                backgroundColor:
                                                    colorNumToCSS(color),
                                            }}
                                            onClick={() => {
                                                const updatedConnections =
                                                    constellation.connections.map(
                                                        (connection) => ({
                                                            ...connection,
                                                            color: color,
                                                        })
                                                    );
                                                updateConstellations(
                                                    constellation.id,
                                                    {
                                                        color: color,
                                                        connections:
                                                            updatedConnections,
                                                    }
                                                );
                                                setShowColorSelection(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={css.actionsContainer}>
                            <CustomSmallButton
                                text={"👁"}
                                backgroundColor={
                                    constellation.isShown ? "#0066FF" : "grey"
                                }
                                onClick={() => {
                                    if (constellation.isEditing) stopEditing();
                                    updateConstellations(constellation.id, {
                                        isShown: !constellation.isShown,
                                    });
                                }}
                            />
                            <CustomSmallButton
                                text={"×"}
                                backgroundColor={"#ff0000"}
                                onClick={() =>
                                    deleteConstellations(constellation.id)
                                }
                            />
                        </div>
                    </div>
                ))}
                <button
                    className={css.addButton}
                    onClick={() => {
                        addConstellations({
                            name: "Name",
                            connections: [],
                            color: 0xff0000,
                            isShown: true,
                            id: getFreeID(),
                        });
                    }}
                >
                    +
                </button>
            </div>
        </div>
    );
}

function CustomSmallButton({
    text,
    backgroundColor,
    onClick,
    disabled = false,
}: {
    text: string;
    backgroundColor: string;
    onClick: Function;
    disabled?: boolean;
}) {
    return (
        <button
            className={css.smallButton}
            style={{ backgroundColor }}
            onClick={() => onClick()}
            disabled={disabled}
        >
            {text}
        </button>
    );
}
