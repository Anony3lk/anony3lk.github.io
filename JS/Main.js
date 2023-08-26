const Selections = {
    Personal,
    Training,
    Specialization,
    Shopping,
    FortGanon,
    Research,
    Insurance,
    Level1,
    Level2,
    Level3,
    Level4
};
const SelectionsTranslator = {
    "Personal": 0,
    "Training": 1,
    "Specialization": 2,
    "Shopping": 3,
    "FortGanon": 4,
    "Research": 5,
    "Insurance": 6,
    "Level1": 7,
    "Level2": 8,
    "Level3": 9,
    "Level4": 10
}

var activeEdicts =
    [
        [], // Personal
        [], // Training
        [], // Shopping
        [], // Specialization
        [], // FortGanon
        [], // Research
        [], // Insurance
        [], // Level1
        [], // Level2
        [], // Level3
        [] // Level4
    ];
var activeSelection = undefined;

function ActiveCheck(aObj) {
    return activeEdicts[SelectionsTranslator[activeSelection]].includes(aObj);
}
function ActiveAdd(aObj) {
    if (!ActiveCheck(aObj)) {
        activeEdicts[SelectionsTranslator[activeSelection]].push(aObj)
    }
}
function ActiveRemove(aObj) {
    if (ActiveCheck(aObj)) {
        activeEdicts[SelectionsTranslator[activeSelection]].splice(activeEdicts[SelectionsTranslator[activeSelection]].indexOf(aObj), 1);
    }
}
function Reset(){
    for (let i = 0; i < activeEdicts.length; i++){
        activeEdicts[i] = [];
    }
    [...document.getElementsByClassName(`selections_tile`)][0].click();
    CumulativeReset();
}

document.addEventListener(`DOMContentLoaded`, Reset);
