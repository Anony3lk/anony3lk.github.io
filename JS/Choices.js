let choicesGrid = document.getElementById(`choicesGrid`);

function ChoicesUpdate(selectionName) {
    ChoicesGridClear();
    ChoicesGridPopulate();
    ChoicesHideAll();

    let selection = Selections[selectionName];
    if (selection == undefined) {
        return;
    };

    selection.forEach(sEdict => ChoicesTileUpdate(sEdict));
};


// Grid --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function ChoicesGridPopulate() {
    for (let r = 1; r < 9; r++) {
        for (let c = 1; c < 19; c++) {
            let newTileDiv = document.createElement(`div`);

            newTileDiv.className = `choices_tile`;
            newTileDiv.style[`grid-column`] = `${c}`;
            newTileDiv.style[`grid-row`] = `${r}`;

            newTileDiv.addEventListener(`mouseenter`, ChoicesTileMouseEnter);
            newTileDiv.addEventListener(`mouseleave`, ChoicesTileMouseLeave);
            newTileDiv.addEventListener(`click`, ChoicesTileClick)


            choicesGrid.appendChild(newTileDiv);
        };
    };
}
function ChoicesGridClear() {
    [...choicesGrid.children].forEach(choice => choice.remove());
}
function ChoicesHideAll() {
    [...choicesGrid.children].forEach(choiceTile => choiceTile.className = `choices_tile_hidden`)
}

// Tiles --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function ChoicesTileUpdate(selectionEdict) {
    if (selectionEdict.row == `0`){
        return;
    }
    let thisTile = ChoicesTileFind(selectionEdict)
    thisTile[`edictProperties`] = selectionEdict;

    ChoicesTileIconUpdate(thisTile);

    thisTile.className = `choices_tile`
    if (selectionEdict.alwaysActive == true){
        thisTile.className += " choices_tile_AActive";
    }
    else{
        thisTile.className += ActiveCheck(selectionEdict) ? ` choices_tile_active` : ``;
    }
};

function ChoicesTileMouseEnter(ev) {
    if (!ev.target.className.includes(`choices_tile_hidden`)) {
        EffectsUpdate(ev.target);
    }
    if (!ev.target.className.includes(`choices_tile_AActive`) && !ev.target.className.includes(`choices_tile_hidden`)){
        ChoicesTileIconEffect(ev, false)
    }
}
function ChoicesTileMouseLeave(ev) {
    EffectsClear(ev.target.edictProperties);
    if (!ev.target.className.includes(`choices_tile_hidden`) && !ev.target.className.includes(`choices_tile_AActive`)) {
        ChoicesTileIconEffect(ev, true)
    }
}
function ChoicesTileClick(ev) {
    let clickedTile = ev.target;
    if (clickedTile.className.includes(`choices_tile_hidden`) || clickedTile.className.includes(`choices_tile_AActive`)) {
        return;
    }

    if (clickedTile.className.includes(`choices_tile_active`)) {
        clickedTile.className = `choices_tile`
        
        ActiveRemove(clickedTile.edictProperties);

        CumulativePoof(clickedTile);
    }
    else {
        clickedTile.className += ` choices_tile_active`

        ActiveAdd(clickedTile.edictProperties);

        CumulativePush(clickedTile);
    }
}

function ChoicesTileFind(sEdict) {
    let returnee = undefined;
    [...choicesGrid.children].forEach(tile => {
        if ((tile.style[`gridRowStart`] == sEdict.row) && (tile.style[`gridColumnStart`] == sEdict.col)) {
            returnee = tile;
        };
    });
    return returnee;
};
function ChoicesTileIconUpdate(tile) {
    const tw = 40;
    const th = 40;
    let trow = Math.floor(tile.edictProperties.iconIndex / 16);
    let tcol = tile.edictProperties.iconIndex - (trow * 16);

    tile.style.backgroundImage = `url("./IconSet.png")`
    tile.style.backgroundPosition = `-${tw * tcol}px -${th * trow}px`;
};
function ChoicesTileIconEffect(ev, reverse) {
    let heh = ev.target.style.backgroundPosition.split(`px`)
    heh.pop();
    // for loop incase col and row are equal
    for (let i = 0; i < heh.length; i++){
        heh[i] = heh[i].trim();
    }
    if (reverse) {
        for (let i = 0; i < heh.length; i++){
            heh[i] = `${(parseInt(heh[i]) / 48) * 40}`;
        }    
    }
    else {
        for (let i = 0; i < heh.length; i++){
            heh[i] = `${(parseInt(heh[i]) / 40) * 48}`;
        }    
    }
    ev.target.style.backgroundPosition = `${heh[0]}px ${heh[1]}px`
}