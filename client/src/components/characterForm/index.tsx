import React, { useState } from 'react';
import { PDFDocument, range, rgb } from 'pdf-lib';
import { defaultCacheSizes } from '@apollo/client/utilities';

const mod = (event: number) => {
  return Math.floor((event - 10) / 2);
};

const pro = (event: number) => {
  return Math.floor((event - 1 )/4)+2;
};

const rollDamage = (die:number,amount:number, bonus:number, ability:number) => {
  
    let roll;
    let sum = 0;
    for(let i = 0; i < amount; i++){

    roll = Math.floor(Math.random() * die)+1;
    sum = sum + roll;

  }
  sum = sum + bonus + ability;
  console.log(sum)
  return sum
}


const CharacterForm = () => {
  const [characterName, setCharacterName] = useState('');
  const [race, setRace] = useState('');
  const [clazz, setClazz] = useState('');
  const [background, setBackground] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [items, setItems] = useState<string[]>([]); // State for dynamic rows

  const [features, setFeatures] = useState<{ name: string; value: string }[]>([]); 

  const [attack, setAttack] = useState<{ name: string; hit: number; damage_dice:number; damage:number, damage_type:string, die_amount:number, damageType:string, abType:number}[]>([]); 
  const [sumAttack, setSumAttack] = useState(0)

  //Level
  const [playerLv, setPlayerLv] = useState(1);
  //ability scores 
  const [STR, setSTR] = useState(10);
  const [DEX, setDEX] = useState(10);
  const [CON, setCON] = useState(10);
  const [INT, setINT] = useState(10);
  const [WIS, setWIS] = useState(10);
  const [CHA, setCHA] = useState(10);
  
  const abMod = [mod(STR), mod(DEX), mod(CON), mod(INT), mod(WIS), mod(CHA)];


  //Other
  
//speed
  const [speed, setSpeed] = useState(30);
  const [swim, setSwim] = useState(0);
  const [fly, setFly] = useState(0);
  const [climb, setClimb] = useState(0);
  const [AC, setAC] = useState(10);
  const [initiative, setInitiative] = useState(DEX);


  const [STRsave, setSTRsave] = useState(false);
  const [DEXsave, setDEXsave] = useState(false);
  const [CONsave, setCONsave] = useState(false);
  const [INTsave, setINTsave] = useState(false);
  const [WISsave, setWISsave] = useState(false);
  const [CHAsave, setCHAsave] = useState(false);


  //proficiency in skills
  const [ath, setAth] = useState(false); // Athletics

  // Dexterity skills
  const [acro, setAcro] = useState(false); // Acrobatics
  const [sleh, setSleh] = useState(false); // Sleight of Hand
  const [ste, setSte] = useState(false); // Stealth

  // Intelligence skills
  const [arc, setArc] = useState(false); // Arcana
  const [his, setHis] = useState(false); // History
  const [inv, setInv] = useState(false); // Investigation
  const [nat, setNat] = useState(false); // Nature
  const [rel, setRel] = useState(false); // Religion

  // Wisdom skills
  const [ani, setAni] = useState(false); // Animal Handling
  const [ins, setIns] = useState(false); // Insight
  const [med, setMed] = useState(false); // Medicine
  const [per, setPer] = useState(false); // Perception
  const [sur, setSur] = useState(false); // Survival

  // Charisma skills
  const [dec, setDec] = useState(false); // Deception
  const [intim, setIntim] = useState(false); // Intimidation
  const [perf, setPerf] = useState(false); // Performance
  const [pers, setPers] = useState(false); // Persuasion
  
  const addItemRow = () => {
    setItems([...items, '']); // Add a new empty row
  };

  const updateItem = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
  };

    const addFeatureRow = () => {
    setFeatures([...features, { name: '', value: '' }]); 
  };

  const updateFeatureRow = (index: number, key:"name" | "value", value: string) => {
    const updatedFeature = [...features];
    updatedFeature[index][key] = value;
    setFeatures(updatedFeature);
  

  };
//name: string; hit: number; damage_dice:number; damage:number
    const addAttackRow = () => {
    setAttack([...attack, { name: '', hit: 0, damage_dice: 4, damage: 0, damage_type: '', die_amount: 0, damageType: '', abType:0 }]); 
  };

  //REVIEW
  const updateAttackRow = (
    index: number,
    key: "name" | "hit" | "damage_dice" | "damage" | "damage_type" | "die_amount" | "damageType" | "abType",
    value: string | number
  ) => {
    const updatedAttack = [...attack];
    if (key === "name") {
      updatedAttack[index][key] = value as string;
    } else if (key === "hit") {
      updatedAttack[index][key] = value as number;
    }else if (key === "die_amount") {
      updatedAttack[index][key] = value as number;
    }else if (key === "damage") {
      updatedAttack[index][key] = value as number;
    }else if (key === "damage_type") {
      updatedAttack[index][key] = value as string;
    }else if (key === "damage_dice") {
      updatedAttack[index][key] = value as number;
    }else if (key === "damageType") {
      updatedAttack[index][key] = value as string;
    }else if (key === "abType") {
      updatedAttack[index][key] = value as number;
    }
    
    setAttack(updatedAttack);
  };

  const createPdf = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Add a page to the document
      const page = pdfDoc.addPage([600, 400]);

      // Set font size and color
      const fontSize = 12;
      const textColor = rgb(0, 0, 0);

      // Add character name and description
      page.drawText(`Character Name: ${characterName}`, { x: 50, y: 350, size: fontSize + 2, color: textColor });
          page.drawText(`Level: ${playerLv}`, { x: 100, y: 350, size: fontSize + 2, color: textColor });

      page.drawText(`Description: ${characterDescription}`, { x: 50, y: 330, size: fontSize, color: textColor });
      //Add Ability Scores and Mod
      page.drawText(`Ability Scores`, { x: 100, y: 200, size: fontSize, color: textColor });
      page.drawText(`Strength Score: ${STR} Strength Modifier: ${mod(STR)}`, { x: 100, y: 180, size: fontSize, color: textColor });
      page.drawText(`Dexterity Score: ${DEX} Dexterity Modifier: ${mod(DEX)}`, { x: 100, y: 160, size: fontSize, color: textColor });
      page.drawText(`Constitution Score: ${CON} Constitution Modifier: ${mod(CON)}`, { x: 100, y: 140, size: fontSize, color: textColor });
      page.drawText(`Intelligence Score: ${INT} Intelligence Modifier: ${mod(INT)}`, { x: 100, y: 120, size: fontSize, color: textColor });
      page.drawText(`Wisdom Score: ${WIS} Wisdom Modifier: ${mod(WIS)}`, { x: 100, y: 100, size: fontSize, color: textColor });
      page.drawText(`Charisma Score: ${CHA} Charisma Modifier: ${mod(CHA)}`, { x: 100, y: 80, size: fontSize, color: textColor });
      // Add Skills section
      page.drawText('Skills:', { x: 350, y: 350, size: fontSize + 2, color: textColor });

      const skills = [
        { name: 'Athletics', value: ath ? mod(STR) + pro(playerLv) : mod(STR) },
        { name: 'Acrobatics', value: acro ? mod(DEX) + pro(playerLv) : mod(DEX) },
        { name: 'Sleight of Hand', value: sleh ? mod(DEX) + pro(playerLv) : mod(DEX) },
        { name: 'Stealth', value: ste ? mod(DEX) + pro(playerLv) : mod(DEX) },
        { name: 'Arcana', value: arc ? mod(INT) + pro(playerLv) : mod(INT) },
        { name: 'History', value: his ? mod(INT) + pro(playerLv) : mod(INT) },
        { name: 'Investigation', value: inv ? mod(INT) + pro(playerLv) : mod(INT) },
        { name: 'Nature', value: nat ? mod(INT) + pro(playerLv) : mod(INT) },
        { name: 'Religion', value: rel ? mod(INT) + pro(playerLv) : mod(INT) },
        { name: 'Animal Handling', value: ani ? mod(WIS) + pro(playerLv) : mod(WIS) },
        { name: 'Insight', value: ins ? mod(WIS) + pro(playerLv) : mod(WIS) },
        { name: 'Medicine', value: med ? mod(WIS) + pro(playerLv) : mod(WIS) },
        { name: 'Perception', value: per ? mod(WIS) + pro(playerLv) : mod(WIS) },
        { name: 'Survival', value: sur ? mod(WIS) + pro(playerLv) : mod(WIS) },
        { name: 'Deception', value: dec ? mod(CHA) + pro(playerLv) : mod(CHA) },
        { name: 'Intimidation', value: intim ? mod(CHA) + pro(playerLv) : mod(CHA) },
        { name: 'Performance', value: perf ? mod(CHA) + pro(playerLv) : mod(CHA) },
        { name: 'Persuasion', value: pers ? mod(CHA) + pro(playerLv) : mod(CHA) },
      ];

      let skillY = 330;
      skills.forEach((skill) => {
        page.drawText(`${skill.name}: ${skill.value >= 0 ? '+' : ''}${skill.value}`, {
          x: 350,
          y: skillY,
          size: fontSize,
          color: textColor,
        });
        skillY -= 15;
      });
      // Add items dynamically
      let y = 310; // Start position for items
      items.forEach((item, index) => {
        page.drawText(`Item ${index + 1}: ${item}`, { x: 50, y, size: fontSize, color: textColor });
        y -= 20; // Move down for the next item
      });

      // Serialize the PDF document
      const pdfBytes = await pdfDoc.save();

      // Trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'CharacterSheet.pdf';
      link.click();
    } catch (error) {
      console.error('Error creating PDF:', error);
    }
  };

  return (
    <div>
      <h3>Create Your D&D 5e Character</h3>

      <div>
        <label>
          Character Name:
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
          />
        </label>
      </div>
      
      <div>
        <label>
          Race:
          <input
            type="text"
            value={race}
            onChange={(e) => setRace(e.target.value)}
            placeholder="Enter race"
          />
        </label>
      </div>

        <div>
        <label>
          Character Level:
          <input
            type="text"
            value={playerLv}
            onChange={(e) => setPlayerLv(Number(e.target.value))}
            placeholder="Enter character level "
          />
        </label>
      </div>

      <div>
        <label>
          Speed:
          <input
            type="text"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            placeholder="Enter character speed"
          />
        </label>
        ft
      </div>

      <div>
        <label>
          Swim:
          <input
            type="text"
            value={swim}
            onChange={(e) => setSwim(Number(e.target.value))}
            placeholder="Enter character swim speed"
          />
        </label>
        ft
      </div>

      <div>
        <label>
          Climb:
          <input
            type="text"
            value={climb}
            onChange={(e) => setClimb(Number(e.target.value))}
            placeholder="Enter character climb speed"
          />
        </label>
        ft
      </div>

      <div>
        <label>
          Fly:
          <input
            type="text"
            value={fly}
            onChange={(e) => setFly(Number(e.target.value))}
            placeholder="Enter character fly speed"
          />
        </label>
        ft
      </div>

      <div>
        <label>
          AC:
          <input
            type="text"
            value={AC}
            onChange={(e) => setAC(Number(e.target.value))}
            placeholder="Enter character Armor Class"
          />
        </label>
      </div>

            <div>
        <label>
          Initiative:
          <input
            type="text"
            value={initiative}
            onChange={(e) => setInitiative(Number(e.target.value))}
            placeholder="Enter character Initiative"
          />
        </label>
      </div>



            <div>
        <label>
          Class:
          <input
            type="text"
            value={clazz}
            onChange={(e) => {setClazz(e.target.value)} }
            placeholder="Enter Class"
          />
        </label>
      </div>


      <div>
        <label>
          Description:
          <textarea
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            placeholder="Enter character description"
          ></textarea>
        </label>
      </div>

            <div>
        <label>
          Background:
          <textarea
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="Enter character background"
          ></textarea>
        </label>
      </div>

{/* Ability Scores */}
<div>
  <label>
    Strength
    <input
      type="text"
      value={STR}
      onChange={(e) => setSTR(Number(e.target.value))}
      placeholder="Enter Strength Score"
    />
  </label>
</div>
<div>
  <label>
    Strength Modifier
    <input
      value={STR ? mod(STR) : 0}
      readOnly
      placeholder="Auto-calculated"
    />
  </label>
</div>

<div>
  <label>
    Dexterity
    <input
      type="text"
      value={DEX}
      onChange={(e) => setDEX(Number(e.target.value))}
      placeholder="Enter Dexterity Score"
    />
  </label>
</div>
<div>
  <label>
    Dexterity Modifier
    <input
      value={DEX ? mod(DEX) : 0}
      readOnly
      placeholder="Auto-calculated"
    />
  </label>
</div>

<div>
  <label>
    Constitution
    <input
      type="text"
      value={CON}
      onChange={(e) => setCON(Number(e.target.value))}
      placeholder="Enter Constitution Score"
    />
  </label>
</div>
<div>
  <label>
    Constitution Modifier
    <input
      value={CON ? mod(CON) : 0}
      readOnly
      placeholder="Auto-calculated"
    />
  </label>
</div>

<div>
  <label>
    Intelligence
    <input
      type="text"
      value={INT}
      onChange={(e) => setINT(Number(e.target.value))}
      placeholder="Enter Intelligence Score"
    />
  </label>
</div>
<div>
  <label>
    Intelligence Modifier
    <input
      value={INT ? mod(INT) : 0}
      readOnly
      placeholder="Auto-calculated"
    />
  </label>
</div>

<div>
  <label>
    Wisdom
    <input
      type="text"
      value={WIS}
      onChange={(e) => setWIS(Number(e.target.value))}
      placeholder="Enter Wisdom Score"
    />
  </label>
</div>
<div>
  <label>
    Wisdom Modifier
    <input
      value={WIS ? mod(WIS) : 0}
      readOnly
      placeholder="Auto-calculated"
    />
  </label>
</div>

<div>
  <label>
    Charisma
    <input
      type="text"
      value={CHA}
      onChange={(e) => setCHA(Number(e.target.value))}
      placeholder="Enter Charisma Score"
    />
  </label>
</div>
<div>
  <label>
    Charisma Modifier
    <input
      value={CHA ? mod(CHA) : 0}
      readOnly
      placeholder="Auto-calculated"
    />
  </label>
</div>


{/*Skills*/}
<h1>Skills</h1>
<div>
  <label>
    Athletics
    <input 
      type="checkbox"
      checked={ath}
      onChange={(e) => setAth(e.target.checked)}
    />
    <span>
      {ath ? mod(STR) + pro(playerLv) : mod(STR)}
    </span>
  </label>
</div>

<div>
  <label>
    Acrobatics
    <input
      type="checkbox"
      checked={acro}
      onChange={(e) => setAcro(e.target.checked)}
    />
    <span>
      {acro ? mod(DEX) + pro(playerLv) : mod(DEX)}
    </span>
  </label>
</div>

<div>
  <label>
    Sleight of Hand
    <input
      type="checkbox"
      checked={sleh}
      onChange={(e) => setSleh(e.target.checked)}
    />
    <span>
      {sleh ? mod(DEX) + pro(playerLv) : mod(DEX)}
    </span>
  </label>
</div>

<div>
  <label>
    Stealth
    <input
      type="checkbox"
      checked={ste}
      onChange={(e) => setSte(e.target.checked)}
    />
    <span>
      {ste ? mod(DEX) + pro(playerLv) : mod(DEX)}
    </span>
  </label>
</div>

<div>
  <label>
    Arcana
    <input
      type="checkbox"
      checked={arc}
      onChange={(e) => setArc(e.target.checked)}
    />
    <span>
      {arc ? mod(INT) + pro(playerLv) : mod(INT)}
    </span>
  </label>
</div>

<div>
  <label>
    History
    <input
      type="checkbox"
      checked={his}
      onChange={(e) => setHis(e.target.checked)}
    />
    <span>
      {his ? mod(INT) + pro(playerLv) : mod(INT)}
    </span>
  </label>
</div>

<div>
  <label>
    Investigation
    <input
      type="checkbox"
      checked={inv}
      onChange={(e) => setInv(e.target.checked)}
    />
    <span>
      {inv ? mod(INT) + pro(playerLv) : mod(INT)}
    </span>
  </label>
</div>

<div>
  <label>
    Nature
    <input
      type="checkbox"
      checked={nat}
      onChange={(e) => setNat(e.target.checked)}
    />
    <span>
      {nat ? mod(INT) + pro(playerLv) : mod(INT)}
    </span>
  </label>
</div>

<div>
  <label>
    Religion
    <input
      type="checkbox"
      checked={rel}
      onChange={(e) => setRel(e.target.checked)}
    />
    <span>
      {rel ? mod(INT) + pro(playerLv) : mod(INT)}
    </span>
  </label>
</div>

<div>
  <label>
    Animal Handling
    <input
      type="checkbox"
      checked={ani}
      onChange={(e) => setAni(e.target.checked)}
    />
    <span>
      {ani ? mod(WIS) + pro(playerLv) : mod(WIS)}
    </span>
  </label>
</div>

<div>
  <label>
    Insight
    <input
      type="checkbox"
      checked={ins}
      onChange={(e) => setIns(e.target.checked)}
    />
    <span>
      {ins ? mod(WIS) + pro(playerLv) : mod(WIS)}
    </span>
  </label>
</div>

<div>
  <label>
    Medicine
    <input
      type="checkbox"
      checked={med}
      onChange={(e) => setMed(e.target.checked)}
    />
    <span>
      {med ? mod(WIS) + pro(playerLv) : mod(WIS)}
    </span>
  </label>
</div>

<div>
  <label>
    Perception
    <input
      type="checkbox"
      checked={per}
      onChange={(e) => setPer(e.target.checked)}
    />
    <span>
      {per ? mod(WIS) + pro(playerLv) : mod(WIS)}
    </span>
  </label>
</div>

<div>
  <label>
    Survival
    <input
      type="checkbox"
      checked={sur}
      onChange={(e) => setSur(e.target.checked)}
    />
    <span>
      {sur ? mod(WIS) + pro(playerLv) : mod(WIS)}
    </span>
  </label>
</div>

<div>
  <label>
    Deception
    <input
      type="checkbox"
      checked={dec}
      onChange={(e) => setDec(e.target.checked)}
    />
    <span>
      {dec ? mod(CHA) + pro(playerLv) : mod(CHA)}
    </span>
  </label>
</div>

<div>
  <label>
    Intimidation
    <input
      type="checkbox"
      checked={intim}
      onChange={(e) => setIntim(e.target.checked)}
    />
    <span>
      {intim ? mod(CHA) + pro(playerLv) : mod(CHA)}
    </span>
  </label>
</div>

<div>
  <label>
    Performance
    <input
      type="checkbox"
      checked={perf}
      onChange={(e) => setPerf(e.target.checked)}
    />
    <span>
      {perf ? mod(CHA) + pro(playerLv) : mod(CHA)}
    </span>
  </label>
</div>

<div>
  <label>
    Persuasion
    <input
      type="checkbox"
      checked={pers}
      onChange={(e) => setPers(e.target.checked)}
    />
    <span>
      {pers ? mod(CHA) + pro(playerLv) : mod(CHA)}
    </span>
  </label>
</div>

<h1>Saving Throw</h1>

<div>
  <label>
    Strength Save
    <input
      type="checkbox"
      checked={STRsave}
      onChange={(e) => setSTRsave(e.target.checked)}
    />
    <span>
      {STRsave ? mod(STR) + pro(playerLv) : mod(STR)}
    </span>
  </label>
</div>
<div>
  <label>
    Dexterity Save
    <input
      type="checkbox"
      checked={DEXsave}
      onChange={(e) => setDEXsave(e.target.checked)}
    />
    <span>
      {DEXsave ? mod(DEX) + pro(playerLv) : mod(DEX)}
    </span>
  </label>
</div>
<div>
  <label>
    Constitution Save
    <input
      type="checkbox"
      checked={CONsave}
      onChange={(e) => setCONsave(e.target.checked)}
    />
    <span>
      {CONsave ? mod(CON) + pro(playerLv) : mod(CON)}
    </span>
  </label>
</div>
<div>
  <label>
    Intelligence Save
    <input
      type="checkbox"
      checked={INTsave}
      onChange={(e) => setINTsave(e.target.checked)}
    />
    <span>
      {INTsave ? mod(INT) + pro(playerLv) : mod(INT)}
    </span>
  </label>
</div>
<div>
  <label>
    Wisdom Save
    <input
      type="checkbox"
      checked={WISsave}
      onChange={(e) => setWISsave(e.target.checked)}
    />
    <span>
      {WISsave ? mod(WIS) + pro(playerLv) : mod(WIS)}
    </span>
  </label>
</div>
<div>
  <label>
    Charisma Save
    <input
      type="checkbox"
      checked={CHAsave}
      onChange={(e) => setCHAsave(e.target.checked)}
    />
    <span>
      {CHAsave ? mod(CHA) + pro(playerLv) : mod(CHA)}
    </span>
  </label>
</div>

      <div>
      <h1>Features</h1>
        <button onClick={addFeatureRow}> Add Feature</button>
        {features.map((feature, index) =>
        (
          <div key={index}>
              <div>
                <input
                value={feature.name}
                onChange ={(e)=> updateFeatureRow(index, "name", e.target.value)}
                placeholder={`Feature Name`}
                />
              </div>
              <div>
                <textarea
                value={feature.value}
                onChange ={(e)=> updateFeatureRow(index, "value", e.target.value)}
                placeholder={`Feature`}
                />
              </div>
          </div>
        ))}
      </div>

              <div>
      <h1>Attacks</h1>
        <button onClick={addAttackRow}> Add Feature</button>
        {attack.map((attack, index) =>
        (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <input
              style={{ width: "120px" }}
              value={attack.name}
              onChange={(e) => updateAttackRow(index, "name", e.target.value)}
              placeholder="Attack Name"
            />
            hit
            <input
              type="number"
              style={{ width: "60px" }}
              value={attack.hit}
              onChange={(e) => updateAttackRow(index, "hit", Number(e.target.value))}
              placeholder="Hit"
            />
            <input
              id="die_amount"
              type="number"
              style={{ width: "80px" }}
              value={attack.die_amount}
              onChange={(e) => updateAttackRow(index, "die_amount", Number(e.target.value))}
  
            />

<select id="dieType"
value={attack.damage_dice}
onChange={(e) => updateAttackRow(index, "damage_dice", Number(e.target.value))}
>
  <option defaultValue={4}>d4</option>
  <option value={6}>d6</option>
  <option value={8}>d8</option>
  <option value={10}>d10</option>
  <option value={12}>d12</option>
  <option value={20}>d20</option>
</select>

Ability 
<select id="abType"
value={attack.abType}
onChange={(e) => updateAttackRow(index, "abType", Number(e.target.value))}
>
  <option value={0}>STR</option>
  <option value={1}>DEX</option>
  <option value={2}>CON</option>
  <option value={3}>INT</option>
  <option value={4}>WIS</option>
  <option value={5}>CHA</option>
</select>
            Damage Bonus
            <input id = "bonus"
              type="number"
              style={{ width: "80px" }}
              value={attack.damage}
              onChange={(e) => updateAttackRow(index, "damage", Number(e.target.value))}
             
            />
          Damage Type
<select id="damageType"
>
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

<button onClick={() =>  {const sum = rollDamage(attack.damage_dice, attack.die_amount, attack.damage, abMod[attack.abType])

setSumAttack(sum)

}}>Roll Damage</button>

         <p>Damage {sumAttack}</p>
          </div>
        ))}
      </div>

      <div>
        <h4>Items</h4>
        <button onClick={addItemRow}>Add Item Row</button>
        {items.map((item, index) => (
          <div key={index}>
            <textarea
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button onClick={createPdf}>Create PDF</button>
    </div>
  );
};

export default CharacterForm;