export default function wavelengthToColor(wavelength: number) {
  //wavelength in nm
  let R, G, B, alpha;
  if (wavelength >= 380 && wavelength < 440) {
    R = (-1 * (wavelength - 440)) / (440 - 380);
    G = 0;
    B = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    R = 0;
    G = (wavelength - 440) / (490 - 440);
    B = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    R = 0;
    G = 1;
    B = (-1 * (wavelength - 510)) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    R = (wavelength - 510) / (580 - 510);
    G = 1;
    B = 0;
  } else if (wavelength >= 580 && wavelength < 645) {
    R = 1;
    G = (-1 * (wavelength - 645)) / (645 - 580);
    B = 0.0;
  } else if (wavelength >= 645 && wavelength <= 808) {
    R = 1;
    G = 0;
    B = 0;
  } else {
    return null;
  }

  // intensty is lower at the edges of the visible spectrum.
  if (wavelength > 780 || wavelength < 380) {
    alpha = 0;
  } else if (wavelength > 700) {
    alpha = (780 - wavelength) / (780 - 700);
  } else if (wavelength < 420) {
    alpha = (wavelength - 380) / (420 - 380);
  } else {
    alpha = 1;
  }

  return [R, G, B, alpha];
}

//source: https://www.scienceprimer.com/javascript-code-convert-light-wavelength-color
