import html2canvas from "html2canvas";

const exportToPng = async () => {
  const sceneContainer = document.querySelector(".scene");
  if (!sceneContainer) {
    console.error("Scene container not found");
    return;
  }

  try {
    const canvas = await html2canvas(sceneContainer as HTMLElement, {
      useCORS: true,
      scale: 2,
      logging: true,
      backgroundColor: "black",
    });

    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "exoplanet-stars.png";
    link.click();
  } catch (error) {
    console.error("Error exporting to PNG:", error);
  }
};

export default exportToPng;
