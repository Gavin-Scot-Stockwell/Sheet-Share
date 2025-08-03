import  { useState } from 'react';
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
  const [items, setItems] = useState<string[]>([]); // State for dynamic rows

  const [features, setFeatures] = useState<{ name: string; value: string }[]>([]); 

  const [notes, setNotes] = useState<{title:string; value: string; }[]>([])


  
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
  
  const hidPro = (isProficient:boolean, isExpertise:boolean, ability:number) => {
    if(isProficient && !isExpertise) {
    return mod(ability) + pro(playerLv)
    } else return ""
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
  //adds new version of the row
  const addNoteRow = () => {
    //the ...notes will be made and the array agrs are fill blank as seen below
    setNotes([...notes, { title:'', value: ''}])
  }

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
    },
  ]);
};

  //REVIEW
const updateAttackRow = (
  index: number,
  key: 'hitOrSave' | 'name' | 'hit' | 'save' | 'damage' | 'damage_type' | 'damageType' | 'abType' | 'sumDamage' | 'dice' | 'damage_dice' | 'die_amount',
  value: string | number | boolean | number[]
) => {
  const updateAttack = [...attack];
  // @ts-ignore
  updateAttack[index][key] = value;
  setAttack(updateAttack);
}

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
          Race:
          <input
            className="character-form-input"
            type="text"
            value={race}
            onChange={(e) => setRace(e.target.value)}
            placeholder="Enter race"
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
<div>{/*here1*/}
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
    </div>
    )}
  </label>
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
        (//here1
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
          </div>
        ))}
      </div>

      <div className="character-form-section">
        <h1 className="character-form-section-title">Attacks And Spells</h1>
        <button className="character-form-button" onClick={addAttackRow}> Add Feature</button>
        {attack.map((attack, index) =>
        (
          <div
            key={index}
            className="character-form-attack-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <input
              className="character-form-input"
              style={{ width:"auto" }}
              value={attack.name}
              onChange={(e) => updateAttackRow(index, "name", e.target.value)}
              placeholder="Attack Name"
            />
            Hit?
            <input
              type="radio"
              name={`hitOrSave-${index}`}
              style={{ width: "60px" }}
              value="value"
              onChange={() => updateAttackRow(index, "hitOrSave", true)}
            /> 
            Save?
            <input
              type="radio"
              name={`hitOrSave-${index}`}
              style={{ width: "60px" }}
              value="value"
              onChange={() => updateAttackRow(index, "hitOrSave", false)}
            /> 
            {attack.hitOrSave ?             
              <div>
                Hit
                <input
                  type="number"
                  className="character-form-input"
                  style={{ width: "60px" }}
                  value={attack.hit}
                  onChange={(e) => updateAttackRow(index, "hit", Number(e.target.value))}
                  placeholder="Hit"
                /> 
              </div>
            : <div> Save
                <select id="save"
                  className="character-form-input"
                  value={attack.save}
                  onChange={(e) => updateAttackRow(index, "save", Number(e.target.value))}
                >
                  <option value={0}>STR</option>
                  <option value={1}>DEX</option>
                  <option value={2}>CON</option>
                  <option value={3}>INT</option>
                  <option value={4}>WIS</option>
                  <option value={5}>CHA</option>
                </select>
                <p>Save {abMod[attack.save]+8+pro(playerLv)} {}</p>
              </div>
            }
           <div className="scrollable-container">
  {attack.dice.map((die, dieIndex) => (
    <div key={dieIndex}>
      <select
        className="character-form-input"
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
        style={{ width:"100px" }}
        className="character-form-input scrollable-container.attacks-section "
        type="number"
        value={die.die_amount}
        onChange={(e) => {
          const updatedAttack = [attack];
          updatedAttack[index].dice[dieIndex].die_amount = Number(e.target.value);
          setAttack(updatedAttack);
        }}
      />
      <button
        className="character-form-button"
        onClick={() =>removeDie(index, dieIndex)}
      >
        Remove Die
      </button>
    </div>
  ))}
</div>
            <button
              className="character-form-button"
              onClick={() =>{
                const damage = rollDamage(attack.dice, attack.damage, abMod[attack.abType])
                updateAttackRow(index, 'sumDamage', damage);
              }}
            >Roll Damage</button>
            <button 
              className="character-form-button"
              onClick ={() => addDie(index)}
            >Add Die
            </button>
            <span style={{ marginLeft: '8px' }}> Damage
              {attack.sumDamage > 0 && `Damage: ${attack.sumDamage}`}
            </span>
            Ability 
            <select id="abType" style={{width:"auto"}}
              className="character-form-input"
              value={attack.abType}
              onChange={(e) => updateAttackRow(index, "abType", Number(e.target.value))}
            >
              <option value={0}>STR</option>
              <option value={1}>DEX</option>
              <option value={2}>CON</option>
              <option value={3}>INT</option>
              <option value={4}>WIS</option>
              <option value={5}>CHA</option>
              <option value={6}>None</option>
            </select>
            Damage Bonus
            <input id = "bonus"
              className="character-form-input"
              type="number"
              style={{ width: "80px" }}
              value={attack.damage}
              onChange={(e) => updateAttackRow(index, "damage", Number(e.target.value))}
            />
            Damage Type
            <select style={{width:"auto"}}id="damageType" className="character-form-input">
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
        ))}
      </div>

      <div className="character-form-section">
        <h4 className="character-form-section-title">Items</h4>
        <button className="character-form-button" onClick={addItemRow}>Add Item Row</button>
        {items.map((item, index) => (
          <div key={index}>
            <textarea
              className="character-form-textarea"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button className="character-form-button character-form-submit" onClick={createPdf}>Create PDF</button>
    


    </div>
    
  );
};
export default CharacterForm;