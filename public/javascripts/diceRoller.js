let dieRoll = 0;
let dieRolls = [];
let bbRolls = [];

let attMod = document.querySelector('#attMod') 
let boons = document.querySelector('#boons');
let banes = document.querySelector('#banes');
let rolls = document.querySelector('#rolls');
let result = document.querySelector('#result');
let dQty = document.querySelector('#dieQty');

if(!attMod.value){
    attMod.value = 0;
}
if(!boons.value){
    boons.value = 0;
}
if(!banes.value){
    banes.value = 0;
}
if(!dQty.value){
    dQty.value = 1;
}

function diceRoller(dieQty, dieNum, n1, n2) {
    let dieRolls = [];
  
    if(dieQty === 1 || dieNum === 20) {
        dieRoll = Math.floor(Math.random()*dieNum+1);
    } else {
            for (let i = 0; i < dieQty; i++) {
                dieRolls.push(Math.floor(Math.random()*dieNum+1))
        }
    }
    
    let bbRolls = [];
    if(dieNum === 20 && n1 > n2) {
        for(let i = 0; i < (n1 - n2); i++) {
            bbRolls.push(Math.floor(Math.random()*6+1))
        }
        rolls.value = `D20: ${dieRoll}(+${attMod.value}), Boons: ${bbRolls.join(', ')}`
        let max = Math.max(...bbRolls)
        result.value = dieRoll + max + parseInt(attMod.value)
    }else if (dieNum === 20 && n2 > n1) {
        for(let i = 0; i < (n2 - n1); i++) {
            bbRolls.push(Math.floor(Math.random()*6+1))
        }
        rolls.value = `D20: ${dieRoll}(+${attMod.value}) Banes: ${bbRolls.join(', ')}`
        let max = Math.max(...bbRolls)
        result.value = dieRoll - max + parseInt(attMod.value)
    } else if(dieNum === 20 && n1 === n2) {
        rolls.value = `D20: ${dieRoll}(+${attMod.value})`
        result.value = dieRoll + parseInt(attMod.value)
    } else if(dieNum !== 20 && dieQty === 1) {
        rolls.value = `D${dieNum}: ${dieRoll}(+${attMod.value})`
        result.value = dieRoll + parseInt(attMod.value)
    } else {
        rolls.value = `D${dieNum}: ${dieRolls.join(', ')}(+${attMod.value})`
        result.value = dieRolls.reduce((a,b) => a + b) + parseInt(attMod.value)
    }
    
}
