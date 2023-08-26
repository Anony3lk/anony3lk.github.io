let effectsSection = document.getElementById(`effects`);
const ColorTranslator = {
    "C[0]": "lavenderblush", // Neutral, During Combat, During Battles, Equip for Whole Day
    "C[1]": "#fa4ea4", // Shopping desire requirements
    "C[10]": "#ff1a1a", // Red/Bad
    "C[11]": "lime", // Good
    "C[31]": "blueviolet" // Corruption
}

function EffectsUpdate(tile) {
    const tileProperties = tile.edictProperties;

    // Edict Name <p> ///////////
    let bold = document.createElement(`b`);
    let para = document.createElement(`p`);
    para.textContent = tileProperties.edict
    para.style[`font-size`] = `24px`
    if (tile.className.includes(`choices_tile_active`) || tile.className.includes(`choices_tile_AActive`)) {
        para.style.color = `white`
    };

    bold.appendChild(para);
    bold.style[`grid-column`] = `2 / 4`;
    bold.style[`grid-row`] = `1`;
    effectsSection.appendChild(bold);

    /////////////////////////////

    let costs = document.createElement(`div`);
    let pGold = document.createElement(`p`);
    let pSp = document.createElement(`p`);

    pGold.style.fontSize = `16px`;
    pSp.style.fontSize = `16px`;
    pGold.style.color = `white`;
    pSp.style.color = `white`;

    costs.style[`grid-column`] = `1`;
    costs.style[`grid-row`] = `1`;

    pGold.innerText = `Gold: ${tileProperties.costGold.toLocaleString("en-US")}`;
    pSp.innerText = `Points: ${tileProperties.costSp.toLocaleString("en-US")}`;
    costs.appendChild(pGold);
    costs.appendChild(pSp);
    effectsSection.appendChild(costs)


    let notes = tileProperties.notes[0];
    if (tileProperties.notes.length > 1) {
        console.log(`\n`)
        console.log(notes)
        console.log(`\n`)
    }

    if (notes != undefined) {
        notes.forEach(edEff => {
            let effDiv = document.createElement(`div`);
            effDiv.className = `effects_effect`;

            let effIcon = EffectsEffectIconCreator(edEff);
            effIcon.className = `effects_effect_icon`;

            let gRow = Math.floor((effectsSection.children.length - 2) / 4);
            let gCol = ((effectsSection.children.length - 2) % 4) == 0 ? 0 : (effectsSection.children.length - 2) % 4;
            gRow += 2;
            gCol += 1;
            effDiv.style[`grid-column`] = `${gCol}`;
            effDiv.style[`grid-row`] = `${gRow}`;

            effDiv.appendChild(effIcon);
            effDiv.appendChild(EffectsEffectValueCreator(edEff));

            effectsSection.appendChild(effDiv);
        });
    };

}
function EffectsEffectValueCreator(effect) {
    let effectP = document.createElement(`p`);
    let effectValue = effect.value == undefined ? "" : CumulativeArrowTranslator(effect.value);
    if (effect.effect.includes("\\")) {
        let replaceValue = "";
        let effectII = effect.effect.substring(effect.effect.indexOf(`\\`), effect.effect.indexOf(`]`) + 1);
        effect.effect = effect.effect.replace(effectII, replaceValue);
    }
    effectP.style.color = ColorTranslator[effect.color];
    effectP.innerText = `${effect.effect} ${effectValue}`

    return effectP;
}
function EffectsEffectIconCreator(effect) {
    let icon = document.createElement(`div`);
    icon.style.border = `1px solid ${ColorTranslator[effect.color]}`
    icon.iconIndex = effect.iconIndex.replace(`[`, "").replace(`]`, "").replace("I", "");
    EffectsIconUpdate(icon);

    return icon;
}

function EffectsClear() {
    [...effectsSection.children].forEach(child => child.remove());
}

function EffectsIconUpdate(div) {
    const tw = 32;
    const th = 32;
    let ty = Math.floor(div.iconIndex / 16);
    let tx = div.iconIndex - (ty * 16);

    let src = `./IconSet.png`;

    let x = tw * tx;
    let y = th * ty;


    div.style.backgroundImage = "url('" + src + "')";
    div.style.backgroundPosition = `-${x}px -${y}px`;
}
