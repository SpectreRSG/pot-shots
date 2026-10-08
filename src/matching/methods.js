// The matching methods the user can pick from.
// Each method measures on a different scale, so each gets its own cutoffs:
//   veryClose = under this is "Very close"
//   close     = under this is "Close"
//   max       = farther than this is an obvious mismatch and is hidden

import { labDistance, rgbDistance } from "../color/distance.js";

export const METHODS = {
  lab: { label: "CIELAB", measure: labDistance, veryClose: 5, close: 10, max: 15 },
  rgb: { label: "RGB", measure: rgbDistance, veryClose: 25, close: 45, max: 60 }
};

export const DEFAULT_METHOD = "lab";
