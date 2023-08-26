var prevSelected = undefined;

[...document.getElementsByClassName(`selections_tile`)].forEach(a => a.addEventListener(`click`, SelectionsTileClick));

function SelectionsTileClick() {
    if (prevSelected != undefined) {
        prevSelected.element.className = prevSelected.class;
    };
    prevSelected = {
        element: this,
        class: this.className
    };
    this.className += ` selections_selected`
    activeSelection = this.innerText.replace(` `, ``);

    ChoicesUpdate(this.innerText.replace(` `, ``));
};
