let choicesGrid = document.getElementById(`choicesGrid`);

function ChoicesUpdate(selectionName) {
    ChoicesGridClear();
    ChoicesGridPopulate();
    ChoicesHideAll();

    let selection = Selections[selectionName];
    if (selection == undefined) {
        return;
    };

    selection.forEach(sObj => ChoicesTileUpdate(sObj));
};


// Grid --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function ChoicesGridPopulate() {
    for (let r = 1; r < 9; r++) {
        for (let c = 1; c < 19; c++) {
            let appendee = document.createElement(`div`);

            appendee.className = `choices_tile`;
            appendee.style[`grid-column`] = `${c}`;
            appendee.style[`grid-row`] = `${r}`;

            appendee.addEventListener(`mouseenter`, ChoicesTileMouseEnter);
            appendee.addEventListener(`mouseleave`, ChoicesTileMouseLeave);
            appendee.addEventListener(`click`, ChoicesTileClick)


            choicesGrid.appendChild(appendee);
        };
    };
}
function ChoicesGridClear() {
    [...choicesGrid.children].forEach(choice => choice.remove());
}

// Tiles --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function ChoicesTileUpdate(selectionEdictData) {
    if (selectionEdictData.row == `0`){
        return;
    }
    let thisTile = ChoicesTileFind(selectionEdictData)
    thisTile.edictProperties = selectionEdictData;

    ChoicesTileIconUpdate(thisTile);

    thisTile.className = `choices_tile`
    if (selectionEdictData.alwaysActive == true){
        thisTile.className += " choices_tile_AActive";
    }
    else{
        thisTile.className += ActiveCheck(selectionEdictData) ? ` choices_tile_active` : ``;
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
    if (clickedTile.className.includes(`choices_tile_hidden`)) {
        return;
    }
    if(clickedTile.className.includes(`choices_tile_AActive`)){
        return;
    }
    if (clickedTile.className.includes(`choices_tile_active`)) {
        clickedTile.className = `choices_tile`
        
        ActiveRemove(ev.target.edictProperties);

        CumulativePoof(ev.target);
    }
    else {
        clickedTile.className += ` choices_tile_active`

        ActiveAdd(ev.target.edictProperties);

        CumulativePush(ev.target);
    }
}

function ChoicesHideAll() {
    [...choicesGrid.children].forEach(choiceTile => choiceTile.className = `choices_tile_hidden`)
}
function ChoicesTileFind(sObjData) {
    let returnee = undefined;
    [...choicesGrid.children].forEach(tile => {
        if ((tile.style[`grid-row`] == sObjData.row) && (tile.style[`grid-column`] == sObjData.col)) {
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

    let src = `./IconSet.png`;

    let x = tw * tcol;
    let y = th * trow;


    tile.style.backgroundImage = "url('" + src + "')";
    tile.style.backgroundPosition = `-${x}px -${y}px`;
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