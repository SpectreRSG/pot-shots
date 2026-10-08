// Fill the dropdown with the source brand's paints, Base and Layer in their own groups.
// Each option's value is the paint's position in the "paints" list.

const GROUPS = [["base", "Base paints"], ["layer", "Layer paints"]];

export function fillSourcePicker(select, paints) {
  for (const [type, label] of GROUPS) {
    const group = document.createElement("optgroup");
    group.label = label;
    paints.forEach((paint, index) => {
      if (paint.type !== type) return;
      const option = document.createElement("option");
      option.value = index;
      option.textContent = paint.name;
      group.appendChild(option);
    });
    select.appendChild(group);
  }
}
