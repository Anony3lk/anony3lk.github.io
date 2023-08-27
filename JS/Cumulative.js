const cumulativeSection = document.getElementById(`cumulatives`);
const cumulativeGoldSP = document.getElementsByClassName(`cumulative_GoldSP`)[0];

// Cumulative Section --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function CumulativePush(tile) {
    let notes = tile.edictProperties.notes[0];
    if (tile.edictProperties.notes.length > 1) {
        alert(`wow`);
    }

    if (notes != undefined) {
        notes.forEach(note => {
            if (CumulativeEffectCheck(note.effect)) {
                CumulativeEffectChange(note, false);
            }
            else {
                if (note.color != `C[0]`) {
                    CumulativeEffectAppend(note);
                }
            }
        });
    };
    CumulativeEffectGoldSpUpdate(tile.edictProperties, false);
    CumulativeSort();
};
function CumulativePoof(tile) {
    let notes = tile.edictProperties.notes[0];
    if (tile.edictProperties.notes.length > 1) {
        alert(`wow`);
    }

    if (notes != undefined) {
        notes.forEach(note => {
            if (CumulativeEffectCheck(note.effect)) {
                CumulativeEffectChange(note, true);
            }
        });
    };
    CumulativeEffectGoldSpUpdate(tile.edictProperties, true);
    CumulativeSort();
};
function CumulativeShopping() {
    const shoppEffects = [
        { "color": "C[31]", "iconIndex": "I[10]", "effect": "Corruption", "value": "+1" },
        { "color": "C[11]", "iconIndex": "I[378]", "effect": "Charm", "value": "+1" }
    ];
}

// Cumulative Effects --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function CumulativeEffectAppend(note) {
    let cumulEff = document.createElement(`div`);
    cumulEff.className = `cumulative_effect`;

    let icon = EffectsEffectIconCreator(note);
    icon.className = `cumulative_effect_icon`;

    let value = EffectsEffectValueCreator(note, true);
    value.className = `cumulative_effect_value`;

    cumulEff.appendChild(icon);
    cumulEff.appendChild(value);

    cumulEff.effect = note.effect;
    cumulEff.value = 0;
    cumulEff.pValue = 0;

    if (note.value == undefined) {
        cumulEff.value = undefined;
        cumulEff.pValue = undefined;
    }
    else if (note.value.includes(`%`)) {
        cumulEff.pValue = note.value;
    }
    /* else if (note.value.includes(`⬆`) || note.value.includes(`⬇`)) {
        cumulEff.value = note.value.includes(`⬆`) ? note.value.trim().length : -note.value.trim().length;
    } */
    else {
        cumulEff.value = CumulativeArrowTranslator(note.value);
    }

    cumulativeSection.appendChild(cumulEff);
};

function CumulativeEffectCheck(eff) {
    let alreadyAffected = false;
    [...cumulativeSection.children].forEach(a => {
        if (a.effect == eff) {
            alreadyAffected = true;
        };
    });
    return alreadyAffected;
};
function CumulativeIsEffectInActiveCheck(effElement) {
    let isEffectInActive = false;
    activeEdicts.forEach(aSelections => {
        aSelections.forEach(aEdict => {
            if (aEdict.notes[0] != undefined) {
                aEdict.notes[0].forEach(note => {
                    if (note.effect.trim() == effElement.effect.trim()) {
                        isEffectInActive = true;
                    };
                });
            };
        });
    });
    return isEffectInActive;
}

function CumulativeEffectChange(note, boolMinus) {
    let changeEffect = undefined;
    [...cumulativeSection.children].forEach(child => {
        if (child.effect == note.effect) {
            changeEffect = child;
        }
    });
    // Checks ///////////////////////////////////////////////////////////////////////
    // Accidental Sum proc |/| Effect is not listed in Cumulative
    if (changeEffect == undefined) {
        alert(`changeEffect == undefined`);
        return;
    };
    // See if effect even has a value |/| Primarily check against learning skills and other odd effects 
    /* if (note.value == "" && parseInt(note.value) != 0) {
        CumulativeEffectUpdate(changeEffect, note);
        return;
    } */
    if (note.value == undefined) {
        CumulativeEffectUpdate(changeEffect, note);
        return;
    }
    //////////////////////////////////////////////////////////////////////////////////


    let noteValue = CumulativeArrowTranslator(note.value);

    /* if (typeof noteValue == `number`) {
        if (boolMinus) {
            changeEffect.value = `${parseInt(changeEffect.value) - parseInt(noteValue)}`;
        }
        else {
            changeEffect.value = `${parseInt(changeEffect.value) + parseInt(noteValue)}`;
        }
    } */
    if (noteValue.includes(`%`)) {
        changeEffect.pValue = boolMinus ? parseInt(changeEffect.pValue) - parseInt(noteValue) : parseInt(changeEffect.pValue) + parseInt(noteValue);
    }
    else if (!isNaN(parseInt(noteValue))) {
        if (boolMinus) {
            changeEffect.value = `${parseInt(changeEffect.value) - parseInt(noteValue)}`;
        }
        else {
            changeEffect.value = `${parseInt(changeEffect.value) + parseInt(noteValue)}`;
        }
    }

    CumulativeEffectUpdate(changeEffect, note);
    CumulativeEffectGoldSpUpdate(changeEffect, note);
};
function CumulativeEffectGoldSpUpdate(edictProperties, boolMinus) {
    const pCostGold = document.getElementById(`cumulative_Gold`);
    const pCostSp = document.getElementById(`cumulative_Sp`);

    let costGold = edictProperties.costGold;
    let costSp = edictProperties.costSp;

    if (costGold == undefined || costSp == undefined) {
        return;
    }

    if (boolMinus) {
        pCostGold.innerText = `Gold: ${(parseInt(pCostGold.innerText.replace(`Gold: `, ``).replace(`,`, ``)) - parseInt(costGold)).toLocaleString()}`;
        pCostSp.innerText = `Edict Points: ${(parseInt(pCostSp.innerText.replace(`Edict Points: `, ``).replace(`,`, ``)) - parseInt(costSp).toLocaleString())}`;
    }
    else {
        pCostGold.innerText = `Gold: ${(parseInt(costGold) + parseInt(pCostGold.innerText.replace(`Gold: `, ``).replace(`,`, ``))).toLocaleString()}`;
        pCostSp.innerText = `Edict Points: ${(parseInt(costSp) + parseInt(pCostSp.innerText.replace(`Edict Points: `, ``).replace(`,`, ``))).toLocaleString()}`;
    }
}
function CumulativeEffectUpdate(effectElement, note) {
    if (!CumulativeIsEffectInActiveCheck(effectElement)) {
        effectElement.remove();
        return;
    }

    CumulativeEffectEffectUpdate(effectElement, note);
    CumulativeEffectIconUpdate(effectElement, note);
};
function CumulativeEffectIconUpdate(effectElement, note) {
    let divIcon = effectElement.children[0];
    if (!divIcon.className.includes(`cumulative_effect_icon`)) {
        alert(`CumulativeEffectIconUpdate wrong class`);
        return;
    };
    if (note.effect.toLowerCase().includes(`growth`)) {
        return;
    };
    if (note.effect == `Corruption`) {
        let corrupt = EffectsEffectIconCreator({ "iconIndex": "I[10]", "color": "C[31]" });
        corrupt.className = `cumulative_effect_icon`;
        effectElement.replaceChild(corrupt, divIcon);
        return;
    }

    let value = undefined;
    if ((!isNaN(parseInt(effectElement.value))) && (parseInt(effectElement.value) != 0)) {
        value = parseInt(effectElement.value);
    }
    else if ((!isNaN(parseInt(effectElement.pValue))) && (parseInt(effectElement.pValue) != 0)) {
        value = parseInt(effectElement.pValue);
    }
    else {
        console.log(`IconUpdate both are NaN or 0`);
        return;
    }


    let positiveSign = CumulativeEffectPositiveGetter(note);
    if (positiveSign == 0) {
        console.log(`IconUpdate positiveSign == 0`);
        return;
    }

    let positiveIconIndex = parseInt(note.iconIndex.replace(`I[`, ``).replace(`]`, ``));
    const noteIconIndex = parseInt(note.iconIndex.replace(`I[`, ``).replace(`]`, ``));
    const noteValue = CumulativeArrowTranslator(note.value);

    if (parseInt(noteValue) == 0 || noteValue == "") {
        console.log(`CumulativeEFfectIconUpdate noteValue == 0 || ""`);
        return;
    }
    if (parseInt(noteValue) > 0) {
        positiveIconIndex = positiveSign > 0 ? parseInt(noteIconIndex) : parseInt(noteIconIndex) - 1;
    }
    else {
        positiveIconIndex = positiveSign < 0 ? parseInt(noteIconIndex) : parseInt(noteIconIndex) - 1;
    }

    let newIconIndex = 0;
    let color = `C[0]`;

    if (parseInt(value) > 0) {
        newIconIndex = positiveSign > 0 ? positiveIconIndex : positiveIconIndex + 1;
        color = positiveSign > 0 ? `C[11]` : `C[10]`;
    }
    else {
        newIconIndex = positiveSign < 0 ? positiveIconIndex : positiveIconIndex + 1;
        color = positiveSign < 0 ? `C[11]` : `C[10]`;
    }


    newIconIndex = `I[${newIconIndex}]`;

    let newIcon = EffectsEffectIconCreator({ "iconIndex": newIconIndex, "color": color })
    newIcon.className = `cumulative_effect_icon`;
    effectElement.replaceChild(newIcon, divIcon);
}
function CumulativeEffectEffectUpdate(effectElement, note) {
    let pEffValue = effectElement.children[1];
    if (!pEffValue.className.includes(`cumulative_effect_value`)) {
        alert(`CumulativeEffectEffectUpdate wrong class`);
        return;
    };

    let valuePart = parseInt(effectElement.value);
    let percValuePart = parseInt(effectElement.pValue);


    valuePart = valuePart > 0 ? `+${valuePart}` : `${valuePart}`;
    percValuePart = percValuePart > 0 ? `+${percValuePart}%` : `${percValuePart}%`;

    let wrappedValuePart = `<c style="color:${CumulativeEffectColorGetter(note, valuePart)};">${valuePart}</c>`;
    let wrappedpercValuePart = `<c style="color:${CumulativeEffectColorGetter(note, percValuePart)};">(${percValuePart})</c>`;

    let cEffectText = `${effectElement.effect} ${wrappedValuePart} ${wrappedpercValuePart}`;

    pEffValue.style.color = CumulativeEffectColorGetter(note, valuePart, note.color);

    if (isNaN(parseInt(percValuePart)) || isNaN(parseInt(valuePart))) {
        console.log(`NaN proc`)
        cEffectText = effectElement.effect;
    }
    else if ((parseInt(valuePart) == 0 && parseInt(percValuePart) == 0)) {
        cEffectText = `${effectElement.effect} ${valuePart}`;
    }
    else if (parseInt(valuePart) == 0) {
        cEffectText = `${effectElement.effect} ${percValuePart}`;
        pEffValue.style.color = CumulativeEffectColorGetter(note, percValuePart);
    }
    else if (parseInt(percValuePart) == 0) {
        cEffectText = `${effectElement.effect} ${valuePart}`;
    }

    pEffValue.innerHTML = cEffectText;
}
function CumulativeEffectColorGetter(note, wrapValue, orgColor = `orange`) {
    if (parseInt(wrapValue) == 0) {
        return `lavenderblush`;
    }
    if (note.effect == `Corruption`) {
        return `blueviolet`;
    }
    let color = orgColor;
    let positiveSign = CumulativeEffectPositiveGetter(note);

    if (positiveSign > 0) { // Positive == good
        color = parseInt(wrapValue) > 0 ? `lime` : `#ff1a1a`;
    }
    else if (positiveSign < 0) { // Negative == good
        color = parseInt(wrapValue) < 0 ? `lime` : `#ff1a1a`;
    }
    else {
        console.log(`run through`)
    }

    return color;
};
function CumulativeEffectPositiveGetter(note) {
    let value = CumulativeArrowTranslator(note.value)

    if (parseInt(value) == 0 || value == "") {
        return 0;
    }

    if (parseInt(value) > 0 && ColorTranslator[note.color] == `lime`) {
        return 1;
    }
    else if (parseInt(value) < 0 && ColorTranslator[note.color] == `#ff1a1a`) {
        return 1;
    }

    if (parseInt(value) > 0 && ColorTranslator[note.color] == `#ff1a1a`) {
        return -1;
    }
    else if (parseInt(value) < 0 && ColorTranslator[note.color] == `lime`) {
        return -1;
    }
}

function CumulativeArrowTranslator(arrowValue) {
    if (arrowValue == undefined) {
        return arrowValue;
    }
    if (arrowValue.includes(`⬆`) || arrowValue.includes(`⬇`)) {
        return arrowValue.includes(`⬆`) ? `+${arrowValue.trim().length}` : `-${arrowValue.trim().length}`;
    }
    else {
        return arrowValue;
    }
}
function CumulativeSort() {
    let current = [];
    [...cumulativeSection.children].forEach(a => current.push(a));

    [...cumulativeSection.children].forEach(a => a.remove());

    current.sort(CumulativeSortComparer);

    current.forEach(sorted => cumulativeSection.appendChild(sorted));
};
function CumulativeSortComparer(a, b) {
    const first = [
        "income",
        "expense",
        "order",
        "control"
    ];

    if (first.includes(a.effect.toLowerCase().trim()) && first.includes(b.effect.toLowerCase().trim())) {
        return first.indexOf(a.effect.toLowerCase().trim()) - first.indexOf(b.effect.toLowerCase().trim());
    }
    else if (first.includes(a.effect.toLowerCase().trim())) { // a is in first, not b
        return -1;
    }
    else if (first.includes(b.effect.toLowerCase().trim())) { // b is in first, not a
        return 1;
    }

    if (a.effect > b.effect) {
        return 1;
    }
    if (a.effect < b.effect) {
        return -1;
    }

    return 0;
}
function CumulativeReset() {
    [...cumulativeSection.children].forEach(child => cumulativeSection.removeChild(child));
    cumulativeGoldSP.children[0].innerHTML = `Gold: 0`;
    cumulativeGoldSP.children[1].innerHTML = "Edict Points: 0";

    for (const erm in Selections) {
        Selections[erm].forEach(edict => {
            if (edict.alwaysActive == true) {
                let tampered = {};
                for (const wow in edict) {
                    tampered[wow] = edict[wow]
                }
                tampered.costGold = 0;
                tampered.costSp = 0;

                if (tampered.notes[0] != undefined) {
                    let tamperedNotes = [];
                    tampered.notes[0].forEach(effect => {
                        if (effect.value != undefined) {
                            tamperedNotes.push(effect)
                        };
                    });
                    tampered.notes[0] = tamperedNotes;
                }

                CumulativePush({ "edictProperties": tampered });
                activeEdicts[SelectionsTranslator[erm]].push(edict)
            }
        })
    }
};
