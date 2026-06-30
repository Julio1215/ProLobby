const { PDFDocument, PDFName, PDFString } = require('pdf-lib')
const fs = require('fs')
const path = require('path')

const TEMPLATES = {
  DND_5E:           path.join(__dirname, '../../pdf-templates/dnd5e.pdf'),
  TORMENTA_20:      path.join(__dirname, '../../pdf-templates/tormenta20.pdf'),
  ORDEM_PARANORMAL: path.join(__dirname, '../../pdf-templates/ordem_paranormal.pdf'),
  CALL_OF_CTHULHU:  path.join(__dirname, '../../pdf-templates/call_of_cthulhu.pdf'),
}

function forceWidgetFontSize(field, fontSize, fontName = 'Helvetica') {
  field.acroField.getWidgets().forEach((widget) => {
    widget.dict.set(PDFName.of('DA'), PDFString.of(`0 0 0 rg /${fontName} ${fontSize} Tf`))
  })
}

const DEFAULT_TEXT_FONT_SIZE = 9

const PROF_BONUS = [0,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6]
const getProfBonus = (level) => PROF_BONUS[parseInt(level) || 1] || 2
const modCalc = (score) => Math.floor(((parseInt(score) || 10) - 10) / 2)
const modStr  = (score) => { const m = modCalc(score); return m >= 0 ? `+${m}` : `${m}` }

const saveStr = (data, abilKey) => {
  const base = modCalc(data.abilities?.[abilKey])
  const prof  = data.proficiencies?.savingThrows?.[abilKey]
  const total = base + (prof ? getProfBonus(data.info?.level) : 0)
  return total >= 0 ? `+${total}` : `${total}`
}

const getSkillTotal = (data, skillKey, abilKey) => {
  const base = modCalc(data.abilities?.[abilKey])
  const prof  = data.proficiencies?.skills?.[skillKey]
  const pb    = getProfBonus(data.info?.level)
  if (prof === 'expert') return base + pb * 2
  if (prof === 'prof')   return base + pb
  return base
}

const skillStr = (data, skillKey, abilKey) => {
  const t = getSkillTotal(data, skillKey, abilKey)
  return t >= 0 ? `+${t}` : `${t}`
}

const DND5E_MAP = {
  'Campo de Texto0':  (d) => d.info?.characterName       || '',
  'Campo de Texto8':  (d) => d.info?.class               || '',
  'Campo de Texto9':  (d) => d.info?.background          || '',
  'Campo de Texto10': (d) => d.info?.playerName          || '',
  'Campo de Texto13': (d) => d.info?.race                || '',
  'Campo de Texto12': (d) => d.info?.alignment           || '',
  'Campo de Texto11': (d) => String(d.info?.experiencePoints || '0'),
  'Campo de Texto27': (d) => String(d.abilities?.str || 10),
  'Campo de Texto30': (d) => String(d.abilities?.dex || 10),
  'Campo de Texto32': (d) => String(d.abilities?.con || 10),
  'Campo de Texto35': (d) => String(d.abilities?.int || 10),
  'Campo de Texto36': (d) => String(d.abilities?.wis || 10),
  'Campo de Texto38': (d) => String(d.abilities?.cha || 10),
  'Campo de Texto29': (d) => modStr(d.abilities?.str),
  'Campo de Texto33': (d) => modStr(d.abilities?.dex),
  'Campo de Texto31': (d) => modStr(d.abilities?.con),
  'Campo de Texto34': (d) => modStr(d.abilities?.int),
  'Campo de Texto39': (d) => modStr(d.abilities?.wis),
  'Campo de Texto37': (d) => modStr(d.abilities?.cha),
  'Campo de Texto28': (d) => `+${getProfBonus(d.info?.level)}`,
  'Campo de Texto25': (d) => String(d.combat?.armorClass || 10),
  'Campo de Texto23': (d) => modStr(d.abilities?.dex),
  'Campo de Texto24': (d) => String(d.combat?.speed || 30),
  'Campo de Texto42': (d) => String(d.combat?.maxHp || ''),
  'Campo de Texto40': (d) => String(d.combat?.currentHp || ''),
  'Campo de Texto41': (d) => String(d.combat?.tempHp || ''),
  'Campo de Texto44': (d) => String(d.info?.level || 1),
  'Campo de Texto43': (d) => d.combat?.hitDice || '1d8',
  'Campo de Texto60': (d) => saveStr(d, 'str'),
  'Campo de Texto61': (d) => saveStr(d, 'dex'),
  'Campo de Texto62': (d) => saveStr(d, 'con'),
  'Campo de Texto63': (d) => saveStr(d, 'int'),
  'Campo de Texto64': (d) => saveStr(d, 'wis'),
  'Campo de Texto65': (d) => saveStr(d, 'cha'),
  'Caixa de Seleção0': (d) => d.proficiencies?.savingThrows?.str ? 'check' : 'uncheck',
  'Caixa de Seleção1': (d) => d.proficiencies?.savingThrows?.dex ? 'check' : 'uncheck',
  'Caixa de Seleção2': (d) => d.proficiencies?.savingThrows?.con ? 'check' : 'uncheck',
  'Caixa de Seleção3': (d) => d.proficiencies?.savingThrows?.int ? 'check' : 'uncheck',
  'Caixa de Seleção4': (d) => d.proficiencies?.savingThrows?.wis ? 'check' : 'uncheck',
  'Caixa de Seleção5': (d) => d.proficiencies?.savingThrows?.cha ? 'check' : 'uncheck',
  'Campo de Texto66': (d) => skillStr(d, 'acrobatics',    'dex'),
  'Campo de Texto67': (d) => skillStr(d, 'animalHandling','wis'),
  'Campo de Texto68': (d) => skillStr(d, 'athletics',     'str'),
  'Campo de Texto69': (d) => skillStr(d, 'deception',     'cha'),
  'Campo de Texto70': (d) => skillStr(d, 'stealth',       'dex'),
  'Campo de Texto71': (d) => skillStr(d, 'history',       'int'),
  'Campo de Texto72': (d) => skillStr(d, 'intimidation',  'cha'),
  'Campo de Texto73': (d) => skillStr(d, 'investigation', 'int'),
  'Campo de Texto74': (d) => skillStr(d, 'insight',       'wis'),
  'Campo de Texto75': (d) => skillStr(d, 'medicine',      'wis'),
  'Campo de Texto76': (d) => skillStr(d, 'nature',        'int'),
  'Campo de Texto77': (d) => skillStr(d, 'perception',    'wis'),
  'Campo de Texto78': (d) => skillStr(d, 'performance',   'cha'),
  'Campo de Texto79': (d) => skillStr(d, 'persuasion',    'cha'),
  'Campo de Texto80': (d) => skillStr(d, 'religion',      'int'),
  'Campo de Texto81': (d) => skillStr(d, 'sleightOfHand', 'dex'),
  'Campo de Texto82': (d) => skillStr(d, 'arcana',        'int'),
  'Campo de Texto83': (d) => skillStr(d, 'survival',      'wis'),
  'Caixa de Seleção6':  (d) => d.proficiencies?.skills?.acrobatics     ? 'check' : 'uncheck',
  'Caixa de Seleção7':  (d) => d.proficiencies?.skills?.animalHandling ? 'check' : 'uncheck',
  'Caixa de Seleção8':  (d) => d.proficiencies?.skills?.athletics      ? 'check' : 'uncheck',
  'Caixa de Seleção9':  (d) => d.proficiencies?.skills?.deception      ? 'check' : 'uncheck',
  'Caixa de Seleção10': (d) => d.proficiencies?.skills?.stealth        ? 'check' : 'uncheck',
  'Caixa de Seleção11': (d) => d.proficiencies?.skills?.history        ? 'check' : 'uncheck',
  'Caixa de Seleção12': (d) => d.proficiencies?.skills?.intimidation   ? 'check' : 'uncheck',
  'Caixa de Seleção13': (d) => d.proficiencies?.skills?.investigation  ? 'check' : 'uncheck',
  'Caixa de Seleção14': (d) => d.proficiencies?.skills?.insight        ? 'check' : 'uncheck',
  'Caixa de Seleção15': (d) => d.proficiencies?.skills?.medicine       ? 'check' : 'uncheck',
  'Caixa de Seleção16': (d) => d.proficiencies?.skills?.nature         ? 'check' : 'uncheck',
  'Caixa de Seleção17': (d) => d.proficiencies?.skills?.perception     ? 'check' : 'uncheck',
  'Caixa de Seleção18': (d) => d.proficiencies?.skills?.performance    ? 'check' : 'uncheck',
  'Caixa de Seleção19': (d) => d.proficiencies?.skills?.persuasion     ? 'check' : 'uncheck',
  'Caixa de Seleção20': (d) => d.proficiencies?.skills?.religion       ? 'check' : 'uncheck',
  'Caixa de Seleção21': (d) => d.proficiencies?.skills?.sleightOfHand  ? 'check' : 'uncheck',
  'Caixa de Seleção22': (d) => d.proficiencies?.skills?.arcana         ? 'check' : 'uncheck',
  'Caixa de Seleção23': (d) => d.proficiencies?.skills?.survival       ? 'check' : 'uncheck',
  'Campo de Texto54': (d) => String(10 + getSkillTotal(d, 'perception', 'wis')),
  'Campo de Texto45': (d) => d.attacks?.[0]?.name   || '',
  'Campo de Texto48': (d) => d.attacks?.[0]?.bonus  || '',
  'Campo de Texto51': (d) => d.attacks?.[0]?.damage || '',
  'Campo de Texto46': (d) => d.attacks?.[1]?.name   || '',
  'Campo de Texto49': (d) => d.attacks?.[1]?.bonus  || '',
  'Campo de Texto52': (d) => d.attacks?.[1]?.damage || '',
  'Campo de Texto47': (d) => d.attacks?.[2]?.name   || '',
  'Campo de Texto50': (d) => d.attacks?.[2]?.bonus  || '',
  'Campo de Texto53': (d) => d.attacks?.[2]?.damage || '',
  'Campo de Texto1':  (d) => d.personality?.traits  || '',
  'Campo de Texto2':  (d) => d.personality?.ideals  || '',
  'Campo de Texto3':  (d) => d.personality?.bonds   || '',
  'Campo de Texto4':  (d) => d.personality?.flaws   || '',
  'Campo de Texto6':  (d) => d.equipment   || '',
  'Campo de Texto7':  (d) => d.notes       || '',
  'Campo de Texto84': (d) => d.info?.characterName || '',
  'Campo de Texto15': (d) => d.features    || '',
}

const TORMENTA20_MAP = {
  'NOME DO PERSONAGEM': (d) => d.info?.characterName || '',
  'JOGADOR':            (d) => d.info?.playerName    || '',
  'RAÇA':               (d) => d.info?.race          || '',
  'ORIGEM':             (d) => d.info?.background    || '',
  'CLASSE & NÍVEL':     (d) => `${d.info?.class || ''} ${d.info?.level || ''}`.trim(),
  'DIVINDADE':          (d) => d.info?.divinity      || '',
  'Exp':                (d) => String(d.info?.experiencePoints || ''),
  'Desloc':             (d) => String(d.combat?.speed || 9),
  'For':  (d) => String(d.abilities?.str || 10),
  'Des':  (d) => String(d.abilities?.dex || 10),
  'Con':  (d) => String(d.abilities?.con || 10),
  'Int':  (d) => String(d.abilities?.int || 10),
  'Sab':  (d) => String(d.abilities?.wis || 10),
  'Car':  (d) => String(d.abilities?.cha || 10),
  'ModFor': (d) => modStr(d.abilities?.str),
  'ModDes': (d) => modStr(d.abilities?.dex),
  'ModCon': (d) => modStr(d.abilities?.con),
  'ModInt': (d) => modStr(d.abilities?.int),
  'ModSab': (d) => modStr(d.abilities?.wis),
  'ModCar': (d) => modStr(d.abilities?.cha),
  'PVs To':     (d) => String(d.combat?.maxHp     || ''),
  'PVs Atuais': (d) => String(d.combat?.currentHp || ''),
  'PMs To':     (d) => String(d.combat?.maxMp     || ''),
  'PMs Atuais': (d) => String(d.combat?.currentMp || ''),
  'CA':         (d) => String(d.combat?.armorClass || 10),
  'Ataque 1':    (d) => d.attacks?.[0]?.name   || '',
  'Bônus Atq 1': (d) => d.attacks?.[0]?.bonus  || '',
  'Dano 1':      (d) => d.attacks?.[0]?.damage || '',
  'Ataque 2':    (d) => d.attacks?.[1]?.name   || '',
  'Bônus Atq 2': (d) => d.attacks?.[1]?.bonus  || '',
  'Dano 2':      (d) => d.attacks?.[1]?.damage || '',
  'Ataque 3':    (d) => d.attacks?.[2]?.name   || '',
  'Bônus Atq 3': (d) => d.attacks?.[2]?.bonus  || '',
  'Dano 3':      (d) => d.attacks?.[2]?.damage || '',
  'Descrição':        (d) => d.description    || '',
  'HabRaçasOrigem':   (d) => d.racialFeatures || '',
  'HabClassePoderes': (d) => d.classFeatures  || '',
  'Magias':           (d) => d.spells?.list   || '',
  'Anotações':        (d) => d.notes          || '',
}

const ORDEM_MAP = {
  'Personagem': (d) => d.info?.characterName || '',
  'Jogador':    (d) => d.info?.playerName    || '',
  'Origem':     (d) => d.info?.background    || '',
  'Classe':     (d) => d.info?.class         || '',
  'Trilha':     (d) => d.info?.trilha        || '',
  'Nex':        (d) => String(d.info?.nex    || ''),
  'AGI': (d) => String(d.abilities?.agi || 1),
  'For': (d) => String(d.abilities?.for || 1),
  'INT': (d) => String(d.abilities?.int || 1),
  'Pre': (d) => String(d.abilities?.pre || 1),
  'Vig': (d) => String(d.abilities?.vig || 1),
  'PV Ma': (d) => String(d.combat?.maxHp     || ''),
  'PV At': (d) => String(d.combat?.currentHp || ''),
  'PE ma': (d) => String(d.combat?.maxPe     || ''),
  'PE At': (d) => String(d.combat?.currentPe || ''),
  'po':    (d) => String(d.combat?.pePerRound || ''),
  'Defesa': (d) => String(d.combat?.defense  || ''),
  'San ma': (d) => String(d.combat?.maxSanity|| ''),
  'San at': (d) => String(d.combat?.sanity   || ''),
  'Ataque 1': (d) => d.attacks?.[0]?.name   || '',
  'Teste 1':  (d) => d.attacks?.[0]?.bonus  || '',
  'Dano 1':   (d) => d.attacks?.[0]?.damage || '',
  'Ataque 2': (d) => d.attacks?.[1]?.name   || '',
  'Texto33':  (d) => d.appearance   || '',
  'Texto39':  (d) => d.personality  || '',
  'Texto45':  (d) => d.background_text || '',
  'Texto51':  (d) => d.objective    || '',
  'Hab':      (d) => d.features     || '',
}

const CTHULHU_MAP = {
  'Nome':        (d) => d.info?.characterName || '',
  'Jogador (a)': (d) => d.info?.playerName   || '',
  'Ocupação':    (d) => d.info?.occupation   || '',
  'age':         (d) => String(d.info?.age   || ''),
  'Sexo':        (d) => d.info?.gender       || '',
  'Residência':  (d) => d.info?.residence    || '',
  'Nascimento':  (d) => d.info?.birthplace   || '',
  'str':        (d) => String(d.abilities?.str  || ''),
  'str 1/2':    (d) => String(Math.floor((d.abilities?.str  || 0) / 2)),
  'str 1/5':    (d) => String(Math.floor((d.abilities?.str  || 0) / 5)),
  'dex':        (d) => String(d.abilities?.dex  || ''),
  'pow':        (d) => String(d.abilities?.pow  || ''),
  'pow Metade': (d) => String(Math.floor((d.abilities?.pow  || 0) / 2)),
  'pow 1/5':    (d) => String(Math.floor((d.abilities?.pow  || 0) / 5)),
  'con':        (d) => String(d.abilities?.con  || ''),
  'app':        (d) => String(d.abilities?.app  || ''),
  'edu':        (d) => String(d.abilities?.edu  || ''),
  'siz':        (d) => String(d.abilities?.siz  || ''),
  'int':        (d) => String(d.abilities?.int  || ''),
  'int Metade': (d) => String(Math.floor((d.abilities?.int  || 0) / 2)),
  'int 1/5':    (d) => String(Math.floor((d.abilities?.int  || 0) / 5)),
  'MaxHP':      (d) => String(d.combat?.maxHp     || ''),
  'Sanity_Max': (d) => String(d.combat?.maxSanity || ''),
  'LuckTotal':  (d) => String(d.combat?.luck      || ''),
  'DamageBonus': (d) => d.combat?.damageBonus || '',
  'Build':       (d) => d.combat?.build       || '',
  'Dodge':       (d) => d.combat?.dodge       || '',
  'armas12':   (d) => d.attacks?.[0]?.name     || '',
  'regular12': (d) => d.attacks?.[0]?.regular  || '',
  'dificil12': (d) => d.attacks?.[0]?.hard     || '',
  'extremo12': (d) => d.attacks?.[0]?.extreme  || '',
  'dano12':    (d) => d.attacks?.[0]?.damage   || '',
  'armas13':   (d) => d.attacks?.[1]?.name     || '',
  'regular13': (d) => d.attacks?.[1]?.regular  || '',
  'dificil13': (d) => d.attacks?.[1]?.hard     || '',
  'extremo13': (d) => d.attacks?.[1]?.extreme  || '',
  'dano13':    (d) => d.attacks?.[1]?.damage   || '',
  'Texto2':  (d) => d.description         || '',
  'Texto3':  (d) => d.characteristics     || '',
  'Texto6':  (d) => d.ideologies          || '',
  'Texto7':  (d) => d.injuries            || '',
  'Texto8':  (d) => d.significantPeople   || '',
  'Texto9':  (d) => d.phobiasManias       || '',
  'Texto10': (d) => d.importantPlaces     || '',
  'Texto11': (d) => d.arcaneTomes         || '',
  'Texto5':  (d) => d.cherished           || '',
  'Texto4':  (d) => d.strangeEncounters   || '',
  'Texto12': (d) => d.equipment           || '',
  'Texto13': (d) => d.wealth              || '',
  'Texto14': (d) => d.spendingLevel       || '',
  'Texto15': (d) => d.cash                || '',
}

const fillOfficialPdf = async (system, characterData) => {
  const templatePath = TEMPLATES[system]
  if (!templatePath || !fs.existsSync(templatePath)) {
    throw new Error(`Template PDF não encontrado para ${system}`)
  }
  const pdfBytes = fs.readFileSync(templatePath)
  const pdfDoc   = await PDFDocument.load(pdfBytes)
  const form     = pdfDoc.getForm()
  const mappings = { DND_5E: DND5E_MAP, TORMENTA_20: TORMENTA20_MAP, ORDEM_PARANORMAL: ORDEM_MAP, CALL_OF_CTHULHU: CTHULHU_MAP }
  const mapping  = mappings[system]
  if (!mapping) throw new Error(`Mapeamento não implementado para ${system}`)

  const fields = form.getFields()
  for (const field of fields) {
    const fieldName = field.getName()
    const getValue  = mapping[fieldName]
    if (!getValue) continue
    try {
      const value     = getValue(characterData)
      const fieldType = field.constructor.name
      if (fieldType === 'PDFCheckBox') {
        if (value === 'check') field.check(); else field.uncheck()
      } else if (fieldType === 'PDFTextField') {
        forceWidgetFontSize(field, DEFAULT_TEXT_FONT_SIZE)
        field.setText(String(value))
      }
    } catch (e) {
      console.warn(`[PDF] Erro no campo ${fieldName}:`, e.message)
    }
  }
  try { form.updateFieldAppearances() } catch (e) { console.warn('[PDF] updateFieldAppearances falhou:', e.message) }
  return await pdfDoc.save()
}

module.exports = { fillOfficialPdf }
