const scenes = {
  start: {
    title: "Hoofdstuk 1: De Jacht in de Spine",
    text: `Je bent Aran, een jonge boerenjongen uit het dorp Karrendal.

Je woont bij je oom Gerwin en je neef Rovan. Het leven is hard, maar eenvoudig. Op een koude ochtend ga je jagen in de Spine, een gevaarlijk berggebied waar bijna niemand vrijwillig naartoe gaat.

Plots flitst er blauw licht tussen de bomen. In het gras ligt een vreemde, gladde blauwe steen.`,
    choices: [
      {
        text: "Raap de blauwe steen op",
        next: "blueStone",
        effect: { addItem: "Blauwe steen", log: "Je vond een mysterieuze blauwe steen in de Spine." }
      },
      {
        text: "Laat de steen liggen en jaag verder",
        next: "ignoreStone",
        effect: { health: -5, log: "Je probeerde de steen te negeren, maar iets trok je toch terug." }
      }
    ]
  },

  ignoreStone: {
    title: "De steen roept",
    text: `Je loopt verder, maar na enkele minuten voel je een druk in je hoofd.

Alsof iets fluistert zonder woorden.

Je draait je om. De blauwe steen ligt nog altijd tussen de bladeren. Het lijkt alsof hij zacht gloeit.`,
    choices: [
      {
        text: "Neem de steen toch mee",
        next: "blueStone",
        effect: { addItem: "Blauwe steen", bond: 5 }
      }
    ]
  },

  blueStone: {
    title: "Een vreemde vondst",
    text: `Thuis toon je de steen aan oom Gerwin. Hij vertrouwt het niet.

"Dat ding brengt problemen," zegt hij.

Toch hou je de steen verborgen onder je bed. Nachtenlang hoor je zachte tikken. Op een ochtend breekt de schaal open.

Geen steen.

Een draak.`,
    choices: [
      {
        text: "Raak de draak voorzichtig aan",
        next: "dragonBond",
        className: "dragon",
        effect: { bond: 20, magic: 10, removeItem: "Blauwe steen", addItem: "Drakenei-scherven", log: "Uit de steen kwam een draak. Jullie band is geboren." }
      },
      {
        text: "Roep in paniek om hulp",
        next: "panicDragon",
        effect: { bond: -5, health: -5 }
      }
    ]
  },

  panicDragon: {
    title: "Paniek in de schuur",
    text: `Je roept luid. De kleine draak schrikt en kruipt weg tussen het hooi.

Na een tijdje kalmeert ze. Je voelt plots een gedachte die niet van jou is.

Niet bang zijn.

Je beseft dat ze met je praat via gedachten.`,
    choices: [
      {
        text: "Geef haar de naam Azura",
        next: "dragonBond",
        className: "dragon",
        effect: { bond: 15, magic: 5, log: "Je gaf de draak de naam Azura." }
      }
    ]
  },

  dragonBond: {
    title: "Azura",
    text: `De draak groeit razendsnel. Haar schubben zijn blauw als nachtelijk ijs. Je noemt haar Azura.

Jullie kunnen praten via gedachten. Wanneer zij pijn voelt, voel jij het ook. Wanneer jij bang bent, weet zij het.

Je bent geen gewone boerenjongen meer.

Je bent een Drakenrijder.`,
    choices: [
      {
        text: "Train stiekem met Azura buiten het dorp",
        next: "secretTraining",
        className: "dragon",
        effect: { bond: 15, magic: 10, log: "Je trainde stiekem met Azura." }
      },
      {
        text: "Vraag raad aan de oude verhalenverteller Borin",
        next: "borin",
        effect: { magic: 5, log: "Je besloot Borin op te zoeken." }
      }
    ]
  },

  secretTraining: {
    title: "Vleugels in de nacht",
    text: `In het maanlicht oefent Azura met vliegen. Jij leert hoe je haar gedachten kunt voelen.

Maar jullie zijn niet onzichtbaar.

Aan de rand van het bos zie je twee donkere figuren. Hun gezichten zijn verborgen achter lederen maskers.`,
    choices: [
      {
        text: "Vlucht terug naar het dorp",
        next: "razakAttack",
        className: "danger",
        effect: { health: -10 }
      },
      {
        text: "Verstop je en luister",
        next: "spyMasks",
        effect: { magic: -5, log: "Je hoorde dat de Maskers naar de blauwe steen zoeken." }
      }
    ]
  },

  spyMasks: {
    title: "De Maskers",
    text: `De twee figuren sissen tegen elkaar.

"De steen was hier. De koning zal niet wachten."

Je begrijpt dat ze naar Azura zoeken. Als ze haar vinden, is alles verloren.`,
    choices: [
      {
        text: "Waarschuw oom Gerwin",
        next: "razakAttack",
        effect: { bond: 5 }
      }
    ]
  },

  borin: {
    title: "Borin weet te veel",
    text: `Borin, de oude verhalenverteller, kijkt lang naar je wanneer je over Azura vertelt.

"Dan is de wereld gevaarlijker geworden voor jou," zegt hij.

Hij vertelt over Drakenrijders, over de Oude Taal en over koning Malgorn, die alle draken onder zijn macht wil brengen.`,
    choices: [
      {
        text: "Vraag Borin om je magie te leren",
        next: "magicLesson",
        className: "magic",
        effect: { magic: 20, addItem: "Oude-Taal notities" }
      },
      {
        text: "Ga meteen terug naar huis",
        next: "razakAttack",
        effect: { health: 5 }
      }
    ]
  },

  magicLesson: {
    title: "De Oude Taal",
    text: `Borin leert je één woord in de Oude Taal:

"Ljera."

Licht.

Wanneer je het uitspreekt, verschijnt er een zwakke gloed in je hand. Maar magie kost energie. Als je te veel gebruikt, kan je sterven.`,
    choices: [
      {
        text: "Oefen voorzichtig",
        next: "razakAttack",
        className: "magic",
        effect: { magic: 15, health: -5, log: "Je leerde je eerste magie." }
      },
      {
        text: "Stop. Dit is te gevaarlijk.",
        next: "razakAttack",
        effect: { health: 5 }
      }
    ]
  },

  razakAttack: {
    title: "De aanval op Karrendal",
    text: `Die nacht brandt Karrendal.

De gemaskerde dienaren van koning Malgorn vallen je boerderij binnen. Ze zoeken de blauwe steen. Ze vinden je oom Gerwin.

Wanneer je aankomt, is het te laat.

Gerwin is dodelijk gewond.`,
    choices: [
      {
        text: "Zweer wraak en vertrek meteen",
        next: "revengeRoad",
        className: "danger",
        effect: { health: -10, bond: 10, log: "Je zwoer wraak op de Maskers." }
      },
      {
        text: "Begraaf Gerwin en vertrek met Borin",
        next: "borinJourney",
        effect: { health: 10, log: "Je nam afscheid van Gerwin en vertrok met Borin." }
      }
    ]
  },

  revengeRoad: {
    title: "Wraak",
    text: `Je wil de Maskers achtervolgen, maar je bent onervaren. Azura voelt je woede.

Dan verschijnt Borin op de weg.

"Woede is een slecht zwaard," zegt hij. "Maar ik zal je leren hoe je het vasthoudt."`,
    choices: [
      {
        text: "Aanvaard Borin als mentor",
        next: "borinJourney",
        effect: { magic: 10, addItem: "Borin's zwaard" }
      }
    ]
  },

  borinJourney: {
    title: "De reis begint",
    text: `Samen met Borin en Azura reis je door bossen, dorpen en verlaten wegen.

Borin leert je zwaardvechten, sporen lezen en de Oude Taal gebruiken.

Maar de Maskers blijven jullie steeds één stap voor.`,
    choices: [
      {
        text: "Volg het spoor naar de stad Darsen",
        next: "cityDarsen",
        effect: { health: -5 }
      },
      {
        text: "Neem een omweg door de wildernis",
        next: "wildPath",
        effect: { bond: 10, health: -10 }
      }
    ]
  },

  cityDarsen: {
    title: "Darsen",
    text: `In de stad Darsen hoor je geruchten.

Twee gemaskerde ruiters kochten gif, touwen en een ijzeren kooi. Ze zijn naar het zuiden vertrokken.

Borin wordt stil.

"Ze werken niet alleen," zegt hij.`,
    choices: [
      {
        text: "Koop voorraden",
        next: "ambush",
        effect: { addItem: "Geneeskruiden", health: 10 }
      },
      {
        text: "Vertrek onmiddellijk",
        next: "ambush",
        effect: { bond: 5 }
      }
    ]
  },

  wildPath: {
    title: "Door de wildernis",
    text: `De wildernis is zwaar. Regen, honger en kou breken je kracht.

Maar Azura wordt sterker. Voor het eerst draag je haar zadel en vlieg je laag boven de bomen.

Je voelt vrijheid.

Tot een pijl langs je gezicht suist.`,
    choices: [
      {
        text: "Land en vecht",
        next: "ambush",
        className: "danger",
        effect: { health: -10, bond: 10 }
      }
    ]
  },

  ambush: {
    title: "Hinderlaag",
    text: `De Maskers vallen aan.

Borin duwt je opzij wanneer een vergiftigd mes naar je hart vliegt. Het mes raakt hem.

Azura brult. Jij voelt magie in je bloed branden.`,
    choices: [
      {
        text: "Gebruik magie: Ljera!",
        next: "borinDeath",
        className: "magic",
        effect: { magic: -25, health: -10, log: "Je gebruikte magie in gevecht." }
      },
      {
        text: "Val aan met je zwaard",
        next: "borinDeath",
        className: "danger",
        effect: { health: -20 }
      },
      {
        text: "Laat Azura aanvallen",
        next: "borinDeath",
        className: "dragon",
        effect: { bond: 10, health: -5 }
      }
    ]
  },

  borinDeath: {
    title: "Borin's geheim",
    text: `De Maskers vluchten, maar Borin zakt neer.

Met zijn laatste kracht toont hij een litteken op zijn hand. Hetzelfde teken dat jij kreeg toen je Azura aanraakte.

"Ik was ooit ook een Drakenrijder," fluistert hij.

Dan sterft hij.`,
    choices: [
      {
        text: "Neem zijn ring en ga verder",
        next: "meetKael",
        effect: { addItem: "Ring van Borin", magic: 10, log: "Borin was ooit een Drakenrijder." }
      }
    ]
  },

  meetKael: {
    title: "Kael",
    text: `Na Borin's dood reis je alleen met Azura.

Op een avond redt een jonge krijger je van soldaten van Malgorn. Hij heet Kael. Hij vecht goed, praat weinig en verbergt duidelijk iets.

Toch heb je zijn hulp nodig.`,
    choices: [
      {
        text: "Vertrouw Kael voorlopig",
        next: "dreams",
        effect: { health: 10, log: "Kael sloot zich bij je aan." }
      },
      {
        text: "Blijf wantrouwig",
        next: "dreams",
        effect: { bond: 5 }
      }
    ]
  },

  dreams: {
    title: "Dromen van een gevangene",
    text: `Je krijgt steeds dezelfde droom.

Een elfenvrouw zit gevangen in een donkere vesting. Ze noemt zichzelf Lyra. Ze is vergiftigd en roept om hulp.

Azura denkt dat de droom echt is.

Kael kent de vesting.`,
    choices: [
      {
        text: "Red Lyra uit de vesting",
        next: "fortress",
        className: "danger",
        effect: { log: "Je besloot Lyra te redden." }
      },
      {
        text: "Zoek eerst meer informatie",
        next: "infoFirst",
        effect: { magic: 10 }
      }
    ]
  },

  infoFirst: {
    title: "Geheimen",
    text: `Kael vertelt dat de vesting bewaakt wordt door Umbros, een schimachtige magiër die Malgorn dient.

"Als we naar binnen gaan," zegt Kael, "moeten we snel zijn."

Je hebt geen tijd meer. Lyra verzwakt.`,
    choices: [
      {
        text: "Ga naar de vesting",
        next: "fortress",
        className: "danger"
      }
    ]
  },

  fortress: {
    title: "De vesting",
    text: `In de nacht sluipen jij, Kael en Azura naar de vesting.

Binnen vind je Lyra. Ze leeft nog, maar nauwelijks.

Dan verschijnt Umbros.

Zijn ogen gloeien als kolen. Zijn stem klinkt als brekend glas.`,
    choices: [
      {
        text: "Vecht tegen Umbros",
        next: "umbrosFight",
        className: "danger",
        effect: { health: -20 }
      },
      {
        text: "Gebruik magie om hem te verblinden",
        next: "umbrosFight",
        className: "magic",
        effect: { magic: -30, health: -10 }
      },
      {
        text: "Laat Azura de muur openbreken",
        next: "escapeLyra",
        className: "dragon",
        effect: { bond: 15, health: -10 }
      }
    ]
  },

  umbrosFight: {
    title: "Umbros",
    text: `Umbros is sterker dan alles wat je ooit hebt gezien.

Je wint niet echt. Je overleeft alleen.

Kael trekt Lyra op zijn schouder. Azura breekt door het dak. Jullie ontsnappen ternauwernood.`,
    choices: [
      {
        text: "Vlucht met Lyra",
        next: "escapeLyra",
        effect: { addItem: "Vergiftigde Lyra", log: "Je redde Lyra uit de vesting." }
      }
    ]
  },

  escapeLyra: {
    title: "Naar de Varden",
    text: `Lyra is vergiftigd. Ze fluistert één woord:

"Varden."

Een verborgen rebellengroep diep in de bergen van de dwergen. Alleen zij kunnen haar redden.

Maar Malgorns leger zit achter jullie aan.`,
    choices: [
      {
        text: "Vlieg met Azura naar de bergen",
        next: "mountains",
        className: "dragon",
        effect: { bond: 10, health: -15 }
      },
      {
        text: "Reis te voet door de tunnels",
        next: "tunnels",
        effect: { health: -10, magic: 10 }
      }
    ]
  },

  mountains: {
    title: "Boven de bergen",
    text: `De vlucht is ijskoud en gevaarlijk. Pijlen vliegen uit wachttorens omhoog.

Maar Azura is snel.

In de verte zie je de verborgen poorten van de Varden.`,
    choices: [
      {
        text: "Land bij de poorten",
        next: "varden",
        effect: { health: 10 }
      }
    ]
  },

  tunnels: {
    title: "Dwergentunnels",
    text: `De tunnels zijn oud en vol echo's. Kael kent verrassend goed de weg.

Te goed.

Je begint je af te vragen wie hij echt is.`,
    choices: [
      {
        text: "Vraag Kael naar zijn verleden",
        next: "kaelSecret",
        effect: { log: "Je vroeg Kael naar zijn verleden." }
      },
      {
        text: "Blijf focussen op Lyra",
        next: "varden",
        effect: { health: 5 }
      }
    ]
  },

  kaelSecret: {
    title: "Kael's geheim",
    text: `Kael kijkt weg.

"Mijn vader diende Malgorn," zegt hij. "Daarom zullen de Varden mij nooit vertrouwen."

Je begrijpt nu waarom hij vlucht.`,
    choices: [
      {
        text: "Zeg dat afkomst niet alles bepaalt",
        next: "varden",
        effect: { bond: 5, log: "Kael vertrouwde je zijn geheim toe." }
      }
    ]
  },

  varden: {
    title: "De Varden",
    text: `De verborgen stad van de Varden ligt diep in de bergen.

Lyra wordt naar genezers gebracht. Jij wordt naar de leiders geleid.

Sommigen zien jou als hoop.

Anderen zien jou als gevaar.

Een nieuwe Drakenrijder kan de oorlog veranderen.`,
    choices: [
      {
        text: "Spreek moedig tot de leiders",
        next: "proveYourself",
        effect: { magic: 10, bond: 5 }
      },
      {
        text: "Zeg weinig en observeer",
        next: "proveYourself",
        effect: { health: 10 }
      }
    ]
  },

  proveYourself: {
    title: "Bewijs jezelf",
    text: `De leider van de Varden zegt:

"Als je werkelijk een Drakenrijder bent, dan zal je binnenkort moeten vechten."

Hoorns klinken in de diepte.

Malgorns leger heeft de verborgen stad gevonden.`,
    choices: [
      {
        text: "Bereid je voor op de strijd",
        next: "finalBattle",
        className: "danger",
        effect: { addItem: "Varden-harnas", health: 20, magic: 20, log: "De eindstrijd komt eraan." }
      }
    ]
  },

  finalBattle: {
    title: "De Slag onder de Berg",
    text: `Duizenden vijanden stormen door de tunnels.

Dwergen, rebellen en elfen vechten zij aan zij.

Boven het slagveld vliegt Azura. Jij zit op haar rug. Onder je zie je Umbros opnieuw verschijnen.

Dit is je eerste echte gevecht als Drakenrijder.`,
    choices: [
      {
        text: "Val Umbros aan met zwaard en draak",
        next: "endingWarrior",
        className: "dragon",
        effect: { health: -25, bond: 15 }
      },
      {
        text: "Gebruik al je magie tegen Umbros",
        next: "endingMage",
        className: "magic",
        effect: { magic: -50, health: -20 }
      },
      {
        text: "Bescherm de Varden en red levens",
        next: "endingGuardian",
        effect: { bond: 10, health: -10 }
      }
    ]
  },

  endingWarrior: {
    title: "Einde: De jonge krijger",
    text: `Je stort je samen met Azura op Umbros.

Het gevecht is verschrikkelijk. Je raakt gewond, maar je breekt zijn macht. Umbros vlucht de diepte in.

De Varden overleven.

Je bent nog geen meester.

Maar iedereen kent nu je naam.`,
    ending: true
  },

  endingMage: {
    title: "Einde: De prijs van magie",
    text: `Je spreekt woorden in de Oude Taal die je nauwelijks begrijpt.

Licht breekt door de grot. Umbros wordt teruggeslagen, maar de magie vreet aan je kracht.

Je overleeft ternauwernood.

De Varden noemen je een wonder.

Azura noemt je koppig.`,
    ending: true
  },

  endingGuardian: {
    title: "Einde: De beschermer",
    text: `In plaats van roem te zoeken, red je gewonde strijders en bescherm je de poorten.

Daardoor houdt de linie stand.

Umbros verdwijnt, maar de Varden winnen de slag.

Je begrijpt dat een Drakenrijder niet alleen vecht om te doden.

Een Drakenrijder beschermt.`,
    ending: true
  }
};