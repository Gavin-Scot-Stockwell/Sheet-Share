import  { useState, useRef } from 'react';
import { PDFDocument, range, rgb } from 'pdf-lib';
import { defaultCacheSizes } from '@apollo/client/utilities';
import "../../css/5ePC.css"


const mod = (event: number) => {
  return Math.floor((event - 10) / 2);
};

const pro = (event: number) => {
  return Math.floor((event - 1 )/4)+2;
};
// the dice need more types to roll if needed
const rollDamage = (dice: { damage_dice: number; die_amount: number }[], bonus: number, ability: number) => {
  let sum = 0;
  let array = [];
  dice.forEach(({ damage_dice, die_amount }) => {
    for (let i = 0; i < die_amount; i++) {
      const roll = Math.floor(Math.random() * damage_dice) + 1;
      array.push(roll)
      sum += roll;
    }
  });
  sum += bonus + ability;
  console.log(sum);
  array.push(sum)
  return sum;
};

const nameExpand = (title:string) =>{
  
  if( 9 * title.length < 500){
  return 9 * title.length
  } else {
    return 500
  }
  
}



const CharacterForm = () => {





  const [characterName, setCharacterName] = useState('');
  const [race, setRace] = useState('');
  const [clazz, setClazz] = useState('');
  const [background, setBackground] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');

  const [features, setFeatures] = useState<{ name: string; value: string }[]>([]); 

  const [notes, setNotes] = useState<{title:string; value: string; }[]>([])

  //turning carry weight on and off
  const [encumbered, encumberedSet] = useState(true)

  //weight stuff
  const [size, setSize] = useState('Tiny')
  const [carry, setCarry] = useState(7.5)

  //money
  const [cp, cpSet] = useState(0)
  const [sp, spSet] = useState(0)
  const [ep, epSet] = useState(0)
  const [gp, gpSet] = useState(100)
  const [pp, ppSet] = useState(0)

  const [conPP,setConPP] = useState(0)
  const [conGP,setConGP] = useState(0)
  const [conEP,setConEP] = useState(0)
  const [conSP,setConSP] = useState(0)





  type Item = {
    name:string; 
    description:string; 
    weight:number;
    amount:number;
  }

const [items, setItems] = useState<Item[]>([]); // State for dynamic rows

const weight = () => {
  let sum = 0;
  for(let i = 0; i < items.length; i++){

    sum = sum + Number(items[i].weight * items[i].amount)
   
   
    console.log(items[i].amount)
  }
  return sum
}

const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//setting up genetics to then be used for fun
const holdDown = (fun: Function) => {
  fun();//using to do it once

  if (!intervalRef.current) {
    intervalRef.current = setInterval(fun, 100);
  //looping with ref and set Interval
  }
};

const stopHold = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    //check if value isn't null
    //then clears the interval
    //then sets to null to restart later
  }
};

const moneyUp = (highPool:number, lowPool:number, highValue:number, lowValue:number, highFun:Function, lowFun:Function, Mul?:number) => {
if(Mul === undefined){
  Mul = 1;
}
//this is done diff-ly due to 0 negative roll over happening when going too much up
if(lowPool !== 0 && lowPool >= lowValue * Mul) {//check not current state
  lowFun((currentLow: number) => {
    if (currentLow >= lowValue * Mul!) {//checks current low with the mul factor
      const newLow = currentLow - (lowValue * Mul!);//new low 
      
      highFun((currentHigh: number) => currentHigh + (highValue * Mul!));//gets current high
      
      return newLow;//returns new low
    }
    return currentLow;//returns current low
  });
}
//console.log("pp:",highPool," ","gp:",lowPool);


}



const moneyDown = (highPool:number, lowPool:number, highValue:number, lowValue:number, highFun:Function, lowFun:Function, Mul?:number) => {


  if(Mul === undefined){
  Mul = 1;
}

if(highPool !== 0 && highPool >= highValue * Mul) {



highFun((prevHigh: number) => {
  if (prevHigh >= highValue * Mul!) {
    lowFun((prevLow: number) => prevLow + lowValue * Mul!);
    return prevHigh - highValue * Mul!;
  }
  return prevHigh;
  //inside we have a fun running inside the useState
  //it basically makes it so that we are getting updated version of the data when it changes
  //all with doing the same math as before when cal-ing the coin diffrences 
});

}
//console.log("pp:",highPool," ","gp:",lowPool);


}


const coin = (coinType:string, highPool:number, lowPool:number, highValue: number, lowValue: number, highFun:Function, lowFun:Function, conValue?: number, setBulk?:Function) => {
  
  
  return(
    <div className="character-form-container">
       <button onMouseDown={() => holdDown(() => moneyDown(highPool,lowPool,highValue,lowValue,highFun,lowFun))}
        onMouseLeave={stopHold}
        onMouseUp={stopHold}
        >money down</button>
      <button onMouseDown={() => holdDown(() => moneyUp(highPool,lowPool,highValue,lowValue,highFun,lowFun)) }
        onMouseLeave={stopHold}
        onMouseUp={stopHold}
        >money up</button>
  
  {conValue !== undefined && setBulk ?       
  
  <>
    <button onMouseDown={() => holdDown(() => moneyDown(highPool,lowPool,highValue,lowValue,highFun,lowFun, conValue))}
          onMouseLeave={stopHold}
          onMouseUp={stopHold}
          >money down bulk</button>
        <button onMouseDown={() => holdDown(() => moneyUp(highPool,lowPool,highValue,lowValue,highFun,lowFun, conValue))}
          onMouseLeave={stopHold}
          onMouseUp={stopHold}
          >money up bulk</button>
    
            <input
              className="character-form-input"
              type="number"
              min="0"
              value={conValue}
              onChange={(e) => setBulk(Number(e.target.value))}
              /> 
  </>
  : <p></p>}


        <ul>{coinType}:
        <input
            className="character-form-input"
            type="number"
            min="0"
            value={highPool}
            onChange={(e) => highFun(Number(e.target.value))}
            />
        </ul>
    </div>
  )


}




type Dice = {
  damage_dice: number;
  die_amount: number;
};

type Attack = {
  hitOrSave: boolean;
  name: string;
  hit: number;
  save: number;
  damage: number;
  damage_type: string;
  damageType: string;
  abType: number;
  sumDamage: number;
  dice: Dice[];
  pro: number;
  proButton : boolean;
  saveBonus: number;
  description: string;
  spellSlot:string;
  isSpell:boolean;
};

const [attack, setAttack] = useState<Attack[]>([]);

  //Level
  const [playerLv, setPlayerLv] = useState(1);
  //ability scores 
  const [STR, setSTR] = useState(10);
  const [DEX, setDEX] = useState(10);
  const [CON, setCON] = useState(10);
  const [INT, setINT] = useState(10);
  const [WIS, setWIS] = useState(10);
  const [CHA, setCHA] = useState(10);

  //vars for carry and drag/lift/push
  const trueCarry = carry*STR;
  const trueDLP = carry*STR*2;    

  const weightWarning = () => {
    if( weight() > trueCarry){
    return true;
    } 
    return false;
    //when weight is not over it will return false
  }

  //max health
  const [maxHp, setMaxHp] = useState(0)

  //current health
  const [currentHp, setCurrentHp] = useState(0)

  const abMod = [mod(STR), mod(DEX), mod(CON), mod(INT), mod(WIS), mod(CHA), 0];
  
  const ability = (name:string, ability:number, setAbility: (arg:number) => void ) => {
          return(
          <div>
          <label>
          {name}
          <input
            className="character-form-input"
            type="text"
            value={ability}
            onChange={(e) => setAbility(Number(e.target.value))}
            placeholder= {`Enter your ${name} Score`}
          />
        </label>
        <label>
          {name} Modifier
          <input
            className="character-form-input"
            value={ability ? mod(ability) : 0}
            readOnly
            placeholder="Auto-calculated"
          />
        </label>
        </div>
          )
  }
  

//speed
  const [speed, setSpeed] = useState(30);
  const [swim, setSwim] = useState(0);
  const [fly, setFly] = useState(0);
  const [climb, setClimb] = useState(0);
  const [AC, setAC] = useState(10);
  const [initiative, setInitiative] = useState(mod(DEX));


  const [STRsave, setSTRsave] = useState(false);
  const [DEXsave, setDEXsave] = useState(false);
  const [CONsave, setCONsave] = useState(false);
  const [INTsave, setINTsave] = useState(false);
  const [WISsave, setWISsave] = useState(false);
  const [CHAsave, setCHAsave] = useState(false);

  const save = (name:string, save:boolean, setSave:(arg:boolean) => void, ability:number) => {
         return(
          <label>
          {name} Save
          <input
            type="checkbox"
            checked={save}
            onChange={(e) => setSave(e.target.checked)}
          />
          <span>
            {save ? mod(ability) + pro(playerLv) : mod(ability)}
          </span>
        </label>
         )
  }


  //proficiency in skills
  const [ath, setAth] = useState(false); //  Athletics
  
  const [athE,setAthE] = useState(false); //  Expertise Athletics
  
  // Dexterity skills
  const [acro, setAcro] = useState(false); // Acrobatics
  const [sleh, setSleh] = useState(false); // Sleight of Hand
  const [ste, setSte] = useState(false); // Stealth

  const [acroE, setAcroE] = useState(false); // Expertise Acrobatics 
  const [slehE, setSlehE] = useState(false); // Expertise Sleight of Hand
  const [steE, setSteE] = useState(false); // Expertise Stealth

  // Intelligence skills
  const [arc, setArc] = useState(false); // Arcana
  const [his, setHis] = useState(false); // History
  const [inv, setInv] = useState(false); // Investigation
  const [nat, setNat] = useState(false); // Nature
  const [rel, setRel] = useState(false); // Religion


  const [arcE, setArcE] = useState(false); // Expertise Arcana
  const [hisE, setHisE] = useState(false); // Expertise History
  const [invE, setInvE] = useState(false); // Expertise Investigation
  const [natE, setNatE] = useState(false); // Expertise Nature
  const [relE, setRelE] = useState(false); // Expertise Religion

  // Wisdom skills
  const [ani, setAni] = useState(false); // Animal Handling
  const [ins, setIns] = useState(false); // Insight
  const [med, setMed] = useState(false); // Medicine
  const [per, setPer] = useState(false); // Perception
  const [sur, setSur] = useState(false); // Survival


  const [aniE, setAniE] = useState(false); // Expertise Animal Handling
  const [insE, setInsE] = useState(false); // Expertise Insight 
  const [medE, setMedE] = useState(false); // Expertise Medicine
  const [perE, setPerE] = useState(false); // Expertise Perception
  const [surE, setSurE] = useState(false); // Expertise Survival

  // Charisma skills
  const [dec, setDec] = useState(false); // Deception
  const [intim, setIntim] = useState(false); // Intimidation
  const [perf, setPerf] = useState(false); // Performance
  const [pers, setPers] = useState(false); // Persuasion


  const [decE, setDecE] = useState(false); // Expertise Deception
  const [intimE, setIntimE] = useState(false); // Expertise Intimidation
  const [perfE, setPerfE] = useState(false); // Expertise Performance
  const [persE, setPersE] = useState(false); // Expertise Persuasion
  
  //to hit the pro in the skill, and only show exp when clicked
  const hidPro = (isProficient:boolean, isExpertise:boolean, ability:number) => {
    if(isProficient && !isExpertise) {
    return mod(ability) + pro(playerLv)
    } else if (isExpertise)  {
       return "";
    } 
    return mod(ability)
  }

  const skills = (name:string,isProficient:boolean, setPro: (arg:boolean) => void, ability:number, isExpertise:boolean, setExp: (arg:boolean) => void ) => {
           return(
           <label>
          {name}
          <input 
            type="checkbox"
            checked={isProficient}
            onChange={(e) => setPro(e.target.checked)}
          />
          <span>
            {hidPro(isProficient,isExpertise,ability)}
          </span>
            <input 
            type="checkbox"
            checked={isExpertise}
            onChange={(e) => setExp(e.target.checked)}
          />
          <span>
            {isExpertise ? mod(ability) + pro(playerLv)*2 : ""}
          </span>
        </label>
           )
  }

  const addItemRow = () => {
    setItems([...items, {name:'', description:'', weight:0, amount:1}]); // Add a new empty row
  };
  
  const updateItem = (index:number, key: "name" | "description" | "weight" | "amount", value:string | number) => {
    const updatedItems = [...items];
    // @ts-ignore
    updatedItems[index][key] = value;
    setItems(updatedItems);
  };
  
  const removeItem = (index: number) => {
  if (confirm("Are you sure? This will remove the item from your sheet...")) {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  }
};

    const addFeatureRow = () => {
    setFeatures([...features, { name: '', value: '' }]); 
  };

  const removeFeature = (index: number) => {
  if (confirm("Are you sure? This will remove the feature from your sheet...")) {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  }
};
  //adds new version of the row
  const addNoteRow = () => {
    //the ...notes will be made and the array agrs are fill blank as seen below
    setNotes([...notes, { title:'', value: ''}])
  }

const removeNotes = (index: number) => {
  if (confirm("Are you sure? This will remove the notes from your sheet...")) {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  }
};

  //we need to define stuff here so we can map it out later
  //we define index as a number, and we use key to get both title and value
  //using the UNION oprator to define both of them
  //it being the key being the label part of it.
  //due to both title and value being strings we can just use value once and that be the string being defined here
  //when doing the union thing, it just finds the things then updates it 
  const updateNoteRow = (index: number, key: "title" | "value", value: string) => {
    const updatedNote = [...notes];
    updatedNote[index][key] = value;
    setNotes(updatedNote);
  }

  const updateFeatureRow = (index: number, key:"name" | "value", value: string) => {
    const updatedFeature = [...features];
    updatedFeature[index][key] = value;
    setFeatures(updatedFeature);
  };




const addAttackRow = () => {
  setAttack([
    ...attack,
    {
      hitOrSave: true,
      name: '',
      hit: 0,
      save: 0,
      damage: 0,
      damage_type: '',
      damageType: '',
      abType: 0,
      sumDamage: 0,
      dice: [{ damage_dice: 4, die_amount: 1 }], 
      pro: 0,
      proButton: true,
      saveBonus: 0,
      description: '',
      spellSlot: '',
      isSpell: false,
    },
  ]);
};

  //REVIEW
const updateAttackRow = (
  index: number,
  key: 'hitOrSave' | 'name' | 'hit' | 'save' | 'damage' | 'damage_type' | 
  'damageType' | 'abType' | 'sumDamage' | 'dice' | 'damage_dice' | 'die_amount' 
  | 'pro' | 'proButton' | 'saveBonus' | 'description' | 'spellSlot' |'isSpell',
  value: string | number | boolean | number[]
) => {
  const updateAttack = [...attack];
  // @ts-ignore
  updateAttack[index][key] = value;
  setAttack(updateAttack);
}

  const removeAttack = (index: number) => {
  if (confirm("Are you sure? This will remove the attack or spell from your sheet...")) {
    const updateAttack = [...attack];
    updateAttack.splice(index, 1);
    setAttack(updateAttack);
  }
};

const addDie = (index: number) => {
  const updatedAttack = [...attack];
  updatedAttack[index].dice.push({ damage_dice: 4, die_amount: 1 }); 
  setAttack(updatedAttack);
};


const removeDie = (attackIndex: number, dieIndex: number) => {
  if(confirm("Are you sure? This will remove the die from your sheet...")){
  const updatedAttack = [...attack];
  updatedAttack[attackIndex].dice.splice(dieIndex, 1); 
  setAttack(updatedAttack);  
  }
};


  const createPdf = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Add multiple pages for comprehensive character sheet
      const page1 = pdfDoc.addPage([612, 792]); // Standard letter size
      const page2 = pdfDoc.addPage([612, 792]);

      // Set font size and color
      const fontSize = 10;
      const titleSize = 14;
      const textColor = rgb(0, 0, 0);

      // PAGE 1 - Basic Character Info
      let y = 750;

      // Character Name and Basic Info
      page1.drawText(`D&D 5e Character Sheet`, { x: 50, y, size: titleSize + 2, color: textColor });
      y -= 30;
      page1.drawText(`Character Name: ${characterName}`, { x: 50, y, size: titleSize, color: textColor });
      page1.drawText(`Level: ${playerLv}`, { x: 300, y, size: titleSize, color: textColor });
      y -= 20;
      page1.drawText(`Species: ${race}`, { x: 50, y, size: fontSize, color: textColor });
      page1.drawText(`Class: ${clazz}`, { x: 200, y, size: fontSize, color: textColor });
      page1.drawText(`Size: ${size}`, { x: 350, y, size: fontSize, color: textColor });
      y -= 30;

      // Health
      page1.drawText(`Health: ${currentHp}/${maxHp} HP`, { x: 50, y, size: fontSize, color: textColor });
      page1.drawText(`AC: ${AC}`, { x: 200, y, size: fontSize, color: textColor });
      page1.drawText(`Initiative: ${initiative}`, { x: 280, y, size: fontSize, color: textColor });
      y -= 30;

      // Speed
      page1.drawText(`Speed: ${speed}ft`, { x: 50, y, size: fontSize, color: textColor });
      if (swim > 0) page1.drawText(`Swim: ${swim}ft`, { x: 150, y, size: fontSize, color: textColor });
      if (climb > 0) page1.drawText(`Climb: ${climb}ft`, { x: 220, y, size: fontSize, color: textColor });
      if (fly > 0) page1.drawText(`Fly: ${fly}ft`, { x: 290, y, size: fontSize, color: textColor });
      y -= 30;

      // Money
      page1.drawText(`Money:`, { x: 50, y, size: fontSize + 2, color: textColor });
      y -= 15;
      page1.drawText(`PP: ${pp}  GP: ${gp}  EP: ${ep}  SP: ${sp}  CP: ${cp}`, { x: 50, y, size: fontSize, color: textColor });
      y -= 30;

      // Ability Scores in two columns
      page1.drawText(`Ability Scores`, { x: 50, y, size: fontSize + 2, color: textColor });
      y -= 20;
      
      const abilities = [
        { name: 'Strength', score: STR, mod: mod(STR) },
        { name: 'Dexterity', score: DEX, mod: mod(DEX) },
        { name: 'Constitution', score: CON, mod: mod(CON) },
        { name: 'Intelligence', score: INT, mod: mod(INT) },
        { name: 'Wisdom', score: WIS, mod: mod(WIS) },
        { name: 'Charisma', score: CHA, mod: mod(CHA) }
      ];

      abilities.forEach((ability, index) => {
        const x = index < 3 ? 50 : 250;
        const currentY = y - (index % 3) * 20;
        page1.drawText(`${ability.name}: ${ability.score} (${ability.mod >= 0 ? '+' : ''}${ability.mod})`, 
          { x, y: currentY, size: fontSize, color: textColor });
      });
      y -= 80;

      // Saving Throws
      page1.drawText(`Saving Throws`, { x: 50, y, size: fontSize + 2, color: textColor });
      y -= 15;
      const saves = [
        { name: 'STR', proficient: STRsave, ability: STR },
        { name: 'DEX', proficient: DEXsave, ability: DEX },
        { name: 'CON', proficient: CONsave, ability: CON },
        { name: 'INT', proficient: INTsave, ability: INT },
        { name: 'WIS', proficient: WISsave, ability: WIS },
        { name: 'CHA', proficient: CHAsave, ability: CHA }
      ];

      saves.forEach((save, index) => {
        const value = save.proficient ? mod(save.ability) + pro(playerLv) : mod(save.ability);
        const x = 50 + (index * 80);
        page1.drawText(`${save.name}: ${value >= 0 ? '+' : ''}${value}${save.proficient ? '*' : ''}`, 
          { x, y, size: fontSize, color: textColor });
      });
      y -= 30;

      // Skills in multiple columns
      page1.drawText(`Skills (* = proficient, ** = expertise)`, { x: 50, y, size: fontSize + 2, color: textColor });
      y -= 15;

      const skillsList = [
        { name: 'Athletics', proficient: ath, expertise: athE, ability: STR },
        { name: 'Acrobatics', proficient: acro, expertise: acroE, ability: DEX },
        { name: 'Sleight of Hand', proficient: sleh, expertise: slehE, ability: DEX },
        { name: 'Stealth', proficient: ste, expertise: steE, ability: DEX },
        { name: 'Arcana', proficient: arc, expertise: arcE, ability: INT },
        { name: 'History', proficient: his, expertise: hisE, ability: INT },
        { name: 'Investigation', proficient: inv, expertise: invE, ability: INT },
        { name: 'Nature', proficient: nat, expertise: natE, ability: INT },
        { name: 'Religion', proficient: rel, expertise: relE, ability: INT },
        { name: 'Animal Handling', proficient: ani, expertise: aniE, ability: WIS },
        { name: 'Insight', proficient: ins, expertise: insE, ability: WIS },
        { name: 'Medicine', proficient: med, expertise: medE, ability: WIS },
        { name: 'Perception', proficient: per, expertise: perE, ability: WIS },
        { name: 'Survival', proficient: sur, expertise: surE, ability: WIS },
        { name: 'Deception', proficient: dec, expertise: decE, ability: CHA },
        { name: 'Intimidation', proficient: intim, expertise: intimE, ability: CHA },
        { name: 'Performance', proficient: perf, expertise: perfE, ability: CHA },
        { name: 'Persuasion', proficient: pers, expertise: persE, ability: CHA }
      ];

      skillsList.forEach((skill, index) => {
        let value = mod(skill.ability);
        let marker = '';
        
        if (skill.expertise) {
          value += pro(playerLv) * 2;
          marker = '**';
        } else if (skill.proficient) {
          value += pro(playerLv);
          marker = '*';
        }

        const column = Math.floor(index / 9);
        const row = index % 9;
        const x = 50 + (column * 200);
        const currentY = y - (row * 15);
        
        page1.drawText(`${skill.name}: ${value >= 0 ? '+' : ''}${value}${marker}`, 
          { x, y: currentY, size: fontSize, color: textColor });
      });

      // PAGE 2 - Equipment, Features, Notes, Attacks
      let page2Y = 750;

      // Equipment/Items
      page2.drawText(`Equipment & Items`, { x: 50, y: page2Y, size: fontSize + 2, color: textColor });
      page2Y -= 15;
      
      if (encumbered) {
        const totalWeight = weight();
        const maxWeight = trueCarry;
        page2.drawText(`Carrying: ${totalWeight}/${maxWeight} lbs ${totalWeight > maxWeight ? '(ENCUMBERED!)' : ''}`, 
          { x: 50, y: page2Y, size: fontSize, color: totalWeight > maxWeight ? rgb(1, 0, 0) : textColor });
        page2Y -= 15;
      }

      items.forEach((item, index) => {
        if (page2Y < 50) return; // Don't overflow page
        page2.drawText(`${item.name} (x${item.amount}) - ${item.weight * item.amount} lbs`, 
          { x: 50, y: page2Y, size: fontSize, color: textColor });
        page2Y -= 12;
        if (item.description) {
          page2.drawText(`  ${item.description.substring(0, 60)}${item.description.length > 60 ? '...' : ''}`, 
            { x: 60, y: page2Y, size: fontSize - 1, color: textColor });
          page2Y -= 12;
        }
      });
      page2Y -= 20;

      // Features
      if (features.length > 0 && page2Y > 100) {
        page2.drawText(`Features & Traits`, { x: 50, y: page2Y, size: fontSize + 2, color: textColor });
        page2Y -= 15;
        
        features.forEach((feature, index) => {
          if (page2Y < 50) return;
          page2.drawText(`${feature.name}`, { x: 50, y: page2Y, size: fontSize, color: textColor });
          page2Y -= 12;
          if (feature.value) {
            const description = feature.value.substring(0, 80);
            page2.drawText(`  ${description}${feature.value.length > 80 ? '...' : ''}`, 
              { x: 60, y: page2Y, size: fontSize - 1, color: textColor });
            page2Y -= 12;
          }
        });
        page2Y -= 20;
      }

      // Attacks & Spells
      if (attack.length > 0 && page2Y > 100) {
        page2.drawText(`Attacks & Spells`, { x: 50, y: page2Y, size: fontSize + 2, color: textColor });
        page2Y -= 15;
        
        attack.forEach((att, index) => {
          if (page2Y < 50) return;
          const hitBonus = att.hitOrSave ? 
            att.hit + abMod[att.pro] + (att.proButton ? pro(playerLv) : 0) : 
            null;
          const saveBonus = !att.hitOrSave ? 
            abMod[att.save] + 8 + pro(playerLv) + att.saveBonus : 
            null;
          
          page2.drawText(`${att.name}`, { x: 50, y: page2Y, size: fontSize, color: textColor });
          page2Y -= 12;
          
          if (hitBonus !== null) {
            page2.drawText(`  To Hit: ${hitBonus >= 0 ? '+' : ''}${hitBonus}`, 
              { x: 60, y: page2Y, size: fontSize - 1, color: textColor });
          } else if (saveBonus !== null) {
            page2.drawText(`  Save DC: ${saveBonus}`, 
              { x: 60, y: page2Y, size: fontSize - 1, color: textColor });
          }
          
          const diceText = att.dice.map(d => `${d.die_amount}d${d.damage_dice}`).join(' + ');
          const damageBonus = att.damage + (att.abType < 6 ? abMod[att.abType] : 0);
          page2.drawText(`  Damage: ${diceText} + ${damageBonus}`, 
            { x: 200, y: page2Y, size: fontSize - 1, color: textColor });
          page2Y -= 15;
        });
        page2Y -= 20;
      }

      // Notes
      if (notes.length > 0 && page2Y > 100) {
        page2.drawText(`Notes`, { x: 50, y: page2Y, size: fontSize + 2, color: textColor });
        page2Y -= 15;
        
        notes.forEach((note) => {
          if (page2Y < 50) return;
          page2.drawText(`${note.title}`, { x: 50, y: page2Y, size: fontSize, color: textColor });
          page2Y -= 12;
          if (note.value) {
            const noteText = note.value.substring(0, 80);
            page2.drawText(`  ${noteText}${note.value.length > 80 ? '...' : ''}`, 
              { x: 60, y: page2Y, size: fontSize - 1, color: textColor });
            page2Y -= 12;
          }
        });
      }

      // Background and Description on remaining space
      if (page2Y > 100) {
        if (background) {
          page2.drawText(`Background`, { x: 50, y: page2Y, size: fontSize + 2, color: textColor });
          page2Y -= 15;
          const bgText = background.substring(0, 200);
          page2.drawText(`${bgText}${background.length > 200 ? '...' : ''}`, 
            { x: 50, y: page2Y, size: fontSize, color: textColor });
          page2Y -= 20;
        }
        
        if (characterDescription) {
          page2.drawText(`Description`, { x: 50, y: page2Y, size: fontSize + 2, color: textColor });
          page2Y -= 15;
          const descText = characterDescription.substring(0, 200);
          page2.drawText(`${descText}${characterDescription.length > 200 ? '...' : ''}`, 
            { x: 50, y: page2Y, size: fontSize, color: textColor });
        }
      }

      // Serialize the PDF document
      const pdfBytes = await pdfDoc.save();

      // Trigger download
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${characterName || 'Character'}_Sheet.pdf`;
      link.click();
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  };
  return (
    <div className="character-form-container">

  

      

      
      <h3 className="character-form-title">Create Your D&D 5e Character</h3>

      <div className="character-form-section">
        <label>
          Character Name:
          <input
            className="character-form-input"
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
          />
        </label>
      </div>
      
      <div className="character-form-section">
        <label>
          Species:
          <input
            className="character-form-input"
            type="text"
            value={race}
            onChange={(e) => setRace(e.target.value)}
            placeholder="Enter Species"
          />
        </label>
      </div>

      <div className="character-form-section">
        <label>
          Character Level:
          <input
            className="character-form-input"
            type="text"
            value={playerLv}
            onChange={(e) => setPlayerLv(Number(e.target.value))}
            placeholder="Enter character level "
          />
        </label>
      </div>

      <div className="character-form-section">
        <label>
          Speed:
          <input
            className="character-form-input"
            type="text"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            placeholder="Enter character speed"
          />
        </label>
        ft
      </div>

      <div className="character-form-section">
        <label>
          Swim:
          <input
            className="character-form-input"
            type="text"
            value={swim}
            onChange={(e) => setSwim(Number(e.target.value))}
            placeholder="Enter character swim speed"
          />
        </label>
        ft
      </div>

      <div className="character-form-section">
        <label>
          Climb:
          <input
            className="character-form-input"
            type="text"
            value={climb}
            onChange={(e) => setClimb(Number(e.target.value))}
            placeholder="Enter character climb speed"
          />
        </label>
        ft
      </div>

      <div className="character-form-section">
        <label>
          Fly:
          <input
            className="character-form-input"
            type="text"
            value={fly}
            onChange={(e) => setFly(Number(e.target.value))}
            placeholder="Enter character fly speed"
          />
        </label>
        ft
      </div>

      <div className="character-form-section">
        <label>
          AC:
          <input
            className="character-form-input"
            type="text"
            value={AC}
            onChange={(e) => setAC(Number(e.target.value))}
            placeholder="Enter character Armor Class"
          />
        </label>
      </div>

      <div className="character-form-section">
        <label>
          Initiative:
          <input
            className="character-form-input"
            type="text"
            value={initiative}
            onChange={(e) => setInitiative(Number(e.target.value))}
            placeholder="Enter character Initiative"
          />
        </label>
      </div>

      <div className="character-form-section">
        <label>
          Class:
          <input
            className="character-form-input"
            type="text"
            value={clazz}
            onChange={(e) => {setClazz(e.target.value)} }
            placeholder="Enter Class"
          />
        </label>
      </div>

      <div className="character-form-section">
        <label>
          Size:
                <select id="size"
                  className="character-form-input"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option value={"Tiny"}>Tiny</option>
                  <option value={"Small"}>Small</option>
                  <option value={"Medium"}>Medium</option>
                  <option value={"Large"}>Large</option>
                  <option value={"Huge"}>Huge</option>
                  <option value={"Gargantuan"}>Gargantuan</option>
                </select>
        </label>
      </div>

            <div className="character-form-section">
        <label>{/*using the same var for push lift drag, just need to double values*/}
          Carry:
                <select id="carry"
                  className="character-form-input"
                  value={carry}
                  onChange={(e) => setCarry(Number(e.target.value))}
                >
                  <option value={7.5}>Tiny</option>
                  <option value={15}>Small</option>                  
                  <option value={15}>Medium</option>                 
                  <option value={30}>Large</option>
                  <option value={60}>Huge</option>
                  <option value={120}>Gargantuan</option>
                </select>
        </label>
        <p>Carry Weight: {trueCarry}</p>
        <p>Drag/Lift/Push: {trueDLP}</p>
      </div>

          <p> Money
              {/*pp and gp*/}
     {coin("PP",pp,gp,1,10,ppSet,gpSet,conPP,setConPP)}
              {/*gp and ep*/}
     {coin("GP",gp,ep,1,2,gpSet,epSet,conGP,setConGP)}
              {/*ep to sp*/}
     {coin("EP",ep,sp,1,5,epSet,spSet,conEP,setConEP)}
              {/*sp to cp*/}
     {coin("SP",sp,cp,1,10,spSet,cpSet,conSP,setConSP)}        
              {/*cp*/}
        <ul>CP:   <input
            className="character-form-input"
            type="number"
            min="0"
            value={cp}
            onChange={(e) => cpSet(Number(e.target.value))}
            /></ul>
      </p>
      

      <div className="character-form-section">
        <label>
          Description:
          <textarea
            className="character-form-textarea"
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            placeholder="Enter character description"
          ></textarea>
        </label>
      </div>

      <div className="character-form-section">
        <label>
          Background:
          <textarea
            className="character-form-textarea"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="Enter character background"
          ></textarea>
        </label>
      </div>
<div>
  <label>Notes:
    <button
    onClick={addNoteRow}
    >Add Note</button>{notes.map((notes, index)=>
    <div>
    <div key={index} >
      <input style={{width:`${200 + nameExpand(notes.title)}px`}}
      value={notes.title}
      onChange ={(e)=> updateNoteRow(index, "title", e.target.value)}
      />
    </div>
    <div key={index}>
      <textarea
      value={notes.value}
      onChange={(e)=> updateNoteRow(index, "value", e.target.value)}
      />
    </div>
    <button onClick={()=>removeNotes(index)}>Remove Note /\</button>
    </div>
    )}
  </label>
  
  <div>
    <h1>Health</h1>
  <input
        style={{ width:"100px" }}
        className="character-form-input scrollable-container.attacks-section "
        min="0"
        type="number"
        value={maxHp}
        onChange={ (e) => setMaxHp(Number(e.target.value))}
  />
  /
  <input
        style={{ width:"100px" }}
        className="character-form-input scrollable-container.attacks-section "
        type="number"
        min="0"
        value={currentHp}
        onChange={ (e) => setCurrentHp(Number(e.target.value))}
  />
  
  </div>

</div>
      {/* Ability Scores */}
      <div className="character-form-abilities">
       {ability("Strength", STR, setSTR)}
       {ability("Dexterity", DEX, setDEX)}
       {ability("Constitution", CON, setCON)}
       {ability("Intelligence", INT, setINT)}
       {ability("Wisdom", WIS, setWIS)}
       {ability("Charisma", CHA, setCHA)}
</div>

      {/* Skills */}
      <h1 className="character-form-section-title">Skills</h1>
      <div className="character-form-skills">
        {skills("Athletics",ath,setAth, STR, athE, setAthE)}
        {skills("Acrobatics", acro,setAcro,DEX, acroE,setAcroE)}
        {skills("Sleight of Hand", sleh, setSleh, DEX, slehE, setSlehE)}
        {skills("Stealth", ste, setSte, DEX, steE, setSteE)}
        {skills("Arcana", arc, setArc, INT, arcE, setArcE)}
        {skills("History", his, setHis, INT, hisE, setHisE)}
        {skills("Investigation", inv, setInv, INT, invE, setInvE)}
        {skills("Nature", nat, setNat, INT, natE, setNatE)}
        {skills("Religion", rel, setRel, INT, relE, setRelE)}
        {skills("Animal Handling", ani, setAni, WIS, aniE, setAniE)}
        {skills("Insight", ins, setIns, WIS, insE, setInsE)}
        {skills("Medicine", med, setMed, WIS, medE, setMedE)}
        {skills("Perception", per, setPer, WIS, perE, setPerE)}
        {skills("Survival", sur, setSur, WIS, surE, setSurE)}
        {skills("Deception", dec, setDec, CHA, decE, setDecE)}
        {skills("Intimidation", intim, setIntim, CHA, intimE, setIntimE)}
        {skills("Performance", perf, setPerf, CHA, perfE, setPerfE)}
        {skills("Persuasion", pers, setPers, CHA, persE, setPersE)}
      </div>
   <h1 className="character-form-section-title">Saving Throw</h1>
      <div className="character-form-saves">
        {save("Strength",STRsave,setSTRsave,STR)}
        {save("Dexterity",DEXsave,setDEXsave,DEX)}
        {save("Constitution",CONsave,setCONsave,CON)}
        {save("Intelligence",INTsave,setINTsave,INT)}
        {save("Wisdom",WISsave,setWISsave,WIS)}
        {save("Charisma",CHAsave,setCHAsave,CHA)}
      </div>

      <div className="character-form-section">
        <h1 className="character-form-section-title">Features</h1>
        <button className="character-form-button" onClick={addFeatureRow}> Add Feature</button>
        {features.map((feature, index) =>
        (
          <div key={index} className="character-form-feature-row">
            <div>
              <input
                className="character-form-input"
                value={feature.name}
                onChange ={(e)=> updateFeatureRow(index, "name", e.target.value)}
                placeholder={`Feature Name`}
              />
            </div>
            <div>
              <textarea
                className="character-form-textarea"
                value={feature.value}
                onChange ={(e)=> updateFeatureRow(index, "value", e.target.value)}
                placeholder={`Feature`}
              />
            </div>
            <button onClick={() => removeFeature(index)}>Remove Feature</button>
          </div>
        ))}
      </div>

      <div className="character-form-section">
        <h1 className="character-form-section-title">Attacks And Spells</h1>
        <button className="character-form-button" onClick={addAttackRow}> Add Attack Or Spell</button>
        {attack.map((attack, index) =>
        (
          <div key={index} className="attack-row">
            <button onClick={()=>removeAttack(index)} className="attack-remove-btn">Remove Attack Or Spell</button>
            <input
              className="attack-name-input"
              value={attack.name}
              onChange={(e) => updateAttackRow(index, "name", e.target.value)}
              placeholder="Attack/Spell Name"
            />
            <textarea
              className="attack-description"
              value={attack.description}
              onChange={(e) => updateAttackRow(index, "description", e.target.value)}
              placeholder="Description"
            />
            <div className="attack-spell-toggle-group">
              <label className="attack-spell-toggle-label">
                <input
                  type="checkbox"
                  checked={attack.isSpell}
                  onChange={() => updateAttackRow(index, 'isSpell', !attack.isSpell)}
                />
                Spell Slot?
              </label>
              {attack.isSpell && (
                <select
                  className="attack-spell-slot-select"
                  value={attack.spellSlot}
                  onChange={(e) => updateAttackRow(index, 'spellSlot', e.target.value)}
                >
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                  <option value="4">4th</option>
                  <option value="5">5th</option>
                  <option value="6">6th</option>
                  <option value="7">7th</option>
                  <option value="8">8th</option>
                  <option value="9">9th</option>
                </select>
              )}
            </div>
            <label className="attack-toggle attack-toggle-hit">
              <input
                type="radio"
                name={`hitOrSave-${index}`}
                value="value"
                onChange={() => updateAttackRow(index, "hitOrSave", true)}
              />
              Hit?
            </label>
            <label className="attack-toggle attack-toggle-save">
              <input
                type="radio"
                name={`hitOrSave-${index}`}
                value="value"
                onChange={() => updateAttackRow(index, "hitOrSave", false)}
              />
              Save?
            </label> 
            {attack.hitOrSave ?             
              <div className="attack-hit-block"> 
                <span className="attack-hit-text">Hit</span>
               <p style={{ margin: "2px 0", fontSize: "10px" }}>
                Proficient
                <input
                type = "checkbox"
                value={"value"} 
                checked={attack.proButton}
                onChange={() => updateAttackRow(index, "proButton", !attack.proButton)}
                /></p>
                <select id="hit"
                  className="attack-small-select"
                  value={attack.pro}
                  onChange={(e) => updateAttackRow(index, "pro", Number(e.target.value))}>
                  <option value={0}>STR</option>
                  <option value={1}>DEX</option>
                  <option value={2}>CON</option>
                  <option value={3}>INT</option>
                  <option value={4}>WIS</option>
                  <option value={5}>CHA</option>
                </select>
                <input
                  type="number"
                  className="attack-small-input"
                  value={attack.hit}
                  onChange={(e) => updateAttackRow(index, "hit", Number(e.target.value))}
                  placeholder="Hit" /> 
                <p className="attack-hit-text"> 
                  Hit: {attack.hit + abMod[attack.pro] + (attack.proButton ? pro(playerLv) : 0)}
                </p>
             
              </div>
            : <div className="attack-save-block"> 
                <span className="attack-save-text">Save</span>
                <select id="save"
                  className="attack-small-select"
                  value={attack.save}
                  onChange={(e) => updateAttackRow(index, "save", Number(e.target.value))}>
                  <option value={0}>STR</option>
                  <option value={1}>DEX</option>
                  <option value={2}>CON</option>
                  <option value={3}>INT</option>
                  <option value={4}>WIS</option>
                  <option value={5}>CHA</option>
                </select>
                <input
                  type="number"
                  className="attack-small-input"
                  value={attack.saveBonus}
                  onChange={(e) => updateAttackRow(index, "saveBonus", Number(e.target.value))}
                  placeholder="Save Bonus" /> 
                <p className="attack-save-text">
                  Save {abMod[attack.save]+8+pro(playerLv) + attack.saveBonus}
                </p>
              </div>
            }
           <div className="attack-dice-container">
             <span className="attack-dice-title">Damage Dice</span>
  {attack.dice.map((die, dieIndex) => (
    <div key={dieIndex} className="attack-dice-row">
      <select
        className="attack-dice-select"
        value={die.damage_dice}
        onChange={(e) => {
          const updatedAttack = [attack];
          updatedAttack[index].dice[dieIndex].damage_dice = Number(e.target.value);
          setAttack(updatedAttack);
        }}
      >
        <option value={4}>d4</option>
        <option value={6}>d6</option>
        <option value={8}>d8</option>
        <option value={10}>d10</option>
        <option value={12}>d12</option>
        <option value={20}>d20</option>
      </select>
      <input
        className="attack-dice-amount"
        type="number"
        value={die.die_amount}
        onChange={(e) => {
          const updatedAttack = [attack];
          updatedAttack[index].dice[dieIndex].die_amount = Number(e.target.value);
          setAttack(updatedAttack);
        }}
      />
      <button
        className="attack-die-remove-btn"
        onClick={() =>removeDie(index, dieIndex)}
      >
        Remove Die
      </button>
    </div>
  ))}
</div>
            <button
              className="attack-roll-btn"
              onClick={() =>{
                const damage = rollDamage(attack.dice, attack.damage, abMod[attack.abType])
                updateAttackRow(index, 'sumDamage', damage);
              }}
            >Roll Damage</button>
            <button 
              className="attack-add-die-btn"
              onClick ={() => addDie(index)}
            >Add Die
            </button>
            <span className="attack-damage-total"> 
              {attack.sumDamage > 0 && `Total Damage: ${attack.sumDamage}`}
            </span>
            {/* (Spell slot toggle moved earlier & styled) */}
            <div className="attack-ability-group">
              <span className="attack-ability-label">Ability:</span>
              <select id="abType" 
                className="attack-ability-select"
                value={attack.abType}
                onChange={(e) => updateAttackRow(index, "abType", Number(e.target.value))}>
                <option value={0}>STR</option>
                <option value={1}>DEX</option>
                <option value={2}>CON</option>
                <option value={3}>INT</option>
                <option value={4}>WIS</option>
                <option value={5}>CHA</option>
                <option value={6}>None</option>
              </select>
              <span className="attack-ability-label">Bonus:</span>
              <input id = "bonus"
                className="attack-bonus-input"
                type="number"
                value={attack.damage}
                onChange={(e) => updateAttackRow(index, "damage", Number(e.target.value))} />
              <span className="attack-ability-label">Type:</span>
              <select id="damageType" className="attack-damage-type-select">
                <option defaultValue="fire" >Fire</option>
                <option value="cold" >Cold</option>
                <option value="acid" >Acid</option>
                <option value="lightning" >Lightning</option>
                <option value="thunder">Thunder</option>
                <option value="poison" >Poison</option>
                <option value="slashing">Slashing</option>
                <option value="piercing" >Piercing</option>
                <option value="bludgeoning">Bludgeoning</option>
                <option value="necrotic">Necrotic</option>
                <option value="radiant">Radiant</option>
                <option value="force">Force</option>
                <option value="psychic">Psychic</option>
              </select>     
            </div>
          </div>
        ))}
      </div>

                <p>
                Encumbered {encumbered ? 'on' : 'off'}
                <input
                type = "checkbox"
                value={"value"} 
                checked={encumbered}
                onChange={() => encumberedSet(!encumbered)}
        /></p> 
      <div className="character-form-section">
        <h4 className="character-form-section-title">Items</h4>
        <button className="character-form-button" onClick={addItemRow}>Add Item Row</button>
        {items.map((item, index) => (
          <div key={index}>
            <input
              className="character-form-textarea"
              value={item.name}
              onChange={(e) => updateItem(index, "name" ,e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
            <input
              className="character-form-textarea"
              value={item.amount}
              onChange={(e) => updateItem(index, "amount" ,e.target.value)}
              placeholder={`Weight ${index + 1}`}
            />
         
              <textarea
              className="character-form-textarea"
              value={item.description}
              onChange={(e) => updateItem(index, "description" ,e.target.value)}
              placeholder={`Description ${index + 1}`}
            />
              <input
              className="character-form-textarea"
              value={item.weight}
              onChange={(e) => updateItem(index, "weight" ,e.target.value)}
              placeholder={`Weight ${index + 1}`}
            />
          <p>{item.name} Weighs {item.weight*item.amount} lbs</p>
          <p>amount of {item.name}: {item.amount}</p>
          <button onClick={() => removeItem(index)}>Remove {item.name}?</button>
          </div>
        ))} 

     

      </div>
       

{encumbered ? (
  <>
    <p style={{
      color: weightWarning() ? "red" : "black"
    }}>
      Carrying Capacity {items[0] ? Number(weight()) : ''}lbs / {trueCarry}lbs
    </p>
    {weightWarning() ? (
      <h1 style={{ color: "red" }}>
        Encumbered! Warning! You are carrying too much weight!
      </h1>
    ) : (
      <p></p>
    )}
    <p>Carry Weight: {trueCarry}</p>
  </>
) : (
  <p>Carry Weight: NONE</p>
)}
<p>Drag/Lift/Push: {trueDLP}</p>
      <button className="character-form-button character-form-submit" onClick={createPdf}>Create PDF</button>
    


    </div>
    
  );
};
export default CharacterForm;