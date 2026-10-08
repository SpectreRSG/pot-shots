// Color conversions. Pure math: nothing here touches the page.

// Turn a hex code like "#9a1115" into three numbers: red, green, blue (0-255).
export function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}

// RGB is how screens make color. CIELAB ("Lab") is built around how human eyes
// see color, so equal distances in Lab look like equal differences to a person.
// Lab has 3 numbers: L = lightness, a = green-to-red, b = blue-to-yellow.
export function hexToLab(hex) {
  const { r, g, b } = hexToRgb(hex);

  // 1. Undo the screen's brightness curve to get "linear" light (0 to 1).
  const linear = v => {
    v = v / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = linear(r), G = linear(g), B = linear(b);

  // 2. Convert to XYZ (a standard color space), then divide by the white point (D65).
  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const y = (R * 0.2126 + G * 0.7152 + B * 0.0722) / 1.0;
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;

  // 3. Convert XYZ to Lab.
  const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return {
    L: 116 * f(y) - 16,
    a: 500 * (f(x) - f(y)),
    b: 200 * (f(y) - f(z))
  };
}
