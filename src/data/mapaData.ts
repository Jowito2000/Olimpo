export interface Kingdom {
  id: string;
  name: string;
  type: 'palace' | 'polis' | 'region' | 'sanctuary' | 'battle' | 'empire' | 'colony';
  coordinates: [number, number]; // [Longitud, Latitud] - Centro principal para el icono
  anchorPoints?: [number, number][]; // Puntos extra para extender el territorio Voronoi
  color: string;
  description: string;
}

export interface Era {
  id: string;
  name: string;
  period: string;
  introduction: string;
  kingdoms: Kingdom[];
}

// Helpers para generar puntos de anclaje geográficos aproximados y formar regiones orgánicas
const generateCluster = (center: [number, number], radius: number, points: number): [number, number][] => {
  const result: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // Ajuste simple: grados a lat/lon
    result.push([
      center[0] + Math.cos(angle) * radius,
      center[1] + Math.sin(angle) * radius * 0.8 // corrección latitudinal aproximada
    ]);
  }
  return result;
};

// Regiones base
const atica = generateCluster([23.85, 38.0], 0.25, 6);
const laconia = generateCluster([22.5, 36.9], 0.3, 8);
const mesenia = generateCluster([21.9, 37.1], 0.25, 6);
const argolida = generateCluster([22.8, 37.6], 0.25, 6);
const beocia = generateCluster([23.1, 38.3], 0.25, 6);
const tesalia = generateCluster([22.4, 39.5], 0.4, 10);
const macedonia_core = generateCluster([22.6, 40.7], 0.5, 12);
const creta_core = generateCluster([24.9, 35.2], 0.6, 12);
const jonia_coast = [
  [26.8, 38.5], [26.9, 38.3], [27.0, 38.1], 
  [27.1, 37.9], [27.2, 37.7], [27.3, 37.5]
] as [number, number][];
const imperio_persa_coast = [
  [27.5, 39.5], [28.0, 39.0], [28.5, 38.5], [28.0, 38.0], 
  [28.2, 37.5], [28.5, 37.0], [29.0, 36.5]
] as [number, number][];
const magna_grecia = [
  [15.1, 37.1], [15.5, 38.2], [16.6, 39.1], [17.2, 40.4] // Siracusa, Mesina, Crotona, Tarento
] as [number, number][];

export const ERAS_DATA: Era[] = [
  {
    id: 'minoica',
    name: 'Civilización Minoica',
    period: 'c. 3000 – 1450 a.C.',
    introduction: 'La primera civilización avanzada de Europa floreció en la isla de Creta. Gobernados por los legendarios reyes del mar, construyeron enormes palacios sin murallas, basando su poder en el comercio marítimo pacífico por todo el Mediterráneo Oriental.',
    kingdoms: [
      { id: 'cnosos', name: 'Cnosos', type: 'palace', coordinates: [25.163, 35.298], anchorPoints: creta_core, color: '#9D174D', description: 'El corazón de la civilización minoica. Según el mito, aquí gobernó el Rey Minos y se encontraba el célebre Laberinto construido por Dédalo para encerrar al Minotauro.' },
      { id: 'festos', name: 'Festos', type: 'palace', coordinates: [24.814, 35.051], color: '#BE185D', description: 'El segundo palacio más importante, dominando la fértil llanura de Mesara en el sur de Creta. Aquí se halló el misterioso "Disco de Festos", aún sin descifrar.' },
      { id: 'malia', name: 'Malia', type: 'palace', coordinates: [25.463, 35.293], color: '#DB2777', description: 'Un gran palacio minoico en la costa norte, con evidencias de una gran flota y control comercial.' },
      { id: 'zakros', name: 'Zakros', type: 'palace', coordinates: [26.261, 35.097], color: '#F472B6', description: 'Ubicado en el extremo este de Creta, era el puerto principal para comerciar con Egipto y Oriente Próximo.' },
      { id: 'tera', name: 'Acrotiri (Tera)', type: 'polis', coordinates: [25.404, 36.351], color: '#FB7185', description: 'Un sofisticado asentamiento minoico en la isla de Santorini, trágicamente sepultado por una erupción volcánica cataclísmica que inspiró el mito de la Atlántida.' },
      { id: 'micenas-temprana', name: 'Proto-Micénicos', type: 'region', coordinates: [22.756, 37.730], anchorPoints: argolida, color: '#9CA3AF', description: 'En el continente, empezaban a surgir caudillos guerreros (los futuros micénicos) bajo fuerte influencia cultural minoica.' }
    ]
  },
  {
    id: 'micenica',
    name: 'Civilización Micénica',
    period: 'c. 1600 – 1100 a.C.',
    introduction: 'Tras el declive de los minoicos, los griegos del continente (los Aqueos) tomaron el control. Construyeron enormes ciudadelas amuralladas ("muros ciclópeos"). Es la época de la que nacen los mitos heroicos y la Guerra de Troya.',
    kingdoms: [
      { id: 'micenas', name: 'Micenas', type: 'palace', coordinates: [22.756, 37.730], anchorPoints: argolida, color: '#D4AF37', description: 'La capital del líder supremo de los aqueos en la Guerra de Troya, Agamenón. Famosa por su Puerta de los Leones y sus ricas tumbas de oro.' },
      { id: 'tirinto', name: 'Tirinto', type: 'palace', coordinates: [22.800, 37.599], color: '#F59E0B', description: 'Fortaleza aliada de Micenas, con inmensos muros que los antiguos creían construidos por los cíclopes. Mitológicamente vinculada a Heracles.' },
      { id: 'pilos', name: 'Pilos', type: 'palace', coordinates: [21.696, 37.027], anchorPoints: mesenia, color: '#10B981', description: 'El reino del anciano y sabio Néstor. Su palacio fue destruido por el fuego, lo que paradójicamente horneó y preservó sus valiosas tablillas de arcilla con escritura Lineal B.' },
      { id: 'lacedemonia', name: 'Lacedemonia (Esparta)', type: 'palace', coordinates: [22.430, 37.073], anchorPoints: laconia, color: '#EF4444', description: 'El reino de Menelao, esposo de Helena, cuya fuga (o secuestro) con el príncipe troyano Paris desencadenó la mítica Guerra de Troya.' },
      { id: 'tebas-mic', name: 'Tebas', type: 'palace', coordinates: [23.316, 38.323], anchorPoints: beocia, color: '#3B82F6', description: 'Poderoso reino en el centro de Grecia. Escenario del famoso mito de Edipo (quien mató a su padre y casó con su madre) y la guerra de los Siete contra Tebas.' },
      { id: 'atenas-mic', name: 'Atenas', type: 'palace', coordinates: [23.727, 37.983], anchorPoints: atica, color: '#6366F1', description: 'Una ciudadela fortificada en la roca de la Acrópolis, protegida por el mítico héroe Teseo, vencedor del Minotauro.' },
      { id: 'itaca', name: 'Ítaca', type: 'palace', coordinates: [20.669, 38.362], color: '#8B5CF6', description: 'La lejana patria insular de Odiseo (Ulises). Refleja los reinos marítimos periféricos del oeste.' },
      { id: 'ftia', name: 'Ftía', type: 'region', coordinates: [22.500, 39.100], anchorPoints: tesalia, color: '#EAB308', description: 'Tierra natal del mejor guerrero de Grecia, Aquiles, y de sus leales y temibles tropas, los Mirmidones.' },
      { id: 'cnosos-mic', name: 'Cnosos (Micénico)', type: 'palace', coordinates: [25.163, 35.298], color: '#9D174D', description: 'Tras su apogeo minoico, el palacio fue tomado y gobernado por guerreros continentales micénicos.' },
      { id: 'troya', name: 'Troya (Wilusa)', type: 'palace', coordinates: [26.238, 39.957], color: '#451A03', description: 'Una ciudad inmensamente rica que controlaba la entrada al Mar Negro. Su destrucción inspiró la Ilíada de Homero.' },
      { id: 'mileto-mic', name: 'Millawanda (Mileto)', type: 'palace', coordinates: [27.275, 37.530], anchorPoints: jonia_coast, color: '#14B8A6', description: 'Un puesto de avanzada micénico en la costa de la actual Turquía, escenario de fricciones con el poderoso Imperio Hitita.' }
    ]
  },
  {
    id: 'oscura',
    name: 'Edad Oscura',
    period: 'c. 1100 – 800 a.C.',
    introduction: 'Los grandes palacios fueron destruidos. La escritura se olvidó y la población cayó en picado. Sin embargo, no todo fue oscuridad: se introdujo el uso del hierro y se forjaron los cantos orales de Homero.',
    kingdoms: [
      { id: 'atenas-osc', name: 'Atenas', type: 'polis', coordinates: [23.727, 37.983], anchorPoints: atica, color: '#3B82F6', description: 'Sobrevivió mejor al colapso. Se convirtió en refugio y de aquí partió la brillante cerámica "Geométrica" que marca un renacer artístico.' },
      { id: 'lefkandi', name: 'Lefkandi', type: 'region', coordinates: [23.680, 38.410], color: '#D4AF37', description: 'Un asentamiento rico en Eubea que desafió la pobreza de la época, revelando tumbas monumentales y oro comerciado desde Chipre.' },
      { id: 'esparta-osc', name: 'Esparta (Dorios)', type: 'polis', coordinates: [22.430, 37.073], anchorPoints: laconia, color: '#EF4444', description: 'Fundada por los Dorios, un pueblo invasor del norte que se asentó junto al río Eurotas, desplazando a la antigua élite micénica.' },
      { id: 'esmirna', name: 'Esmirna', type: 'polis', coordinates: [27.142, 38.423], color: '#06B6D4', description: 'Un refugio jonio en la costa de Asia Menor, donde comenzaron a formarse fuertes lazos culturales a pesar del caos del continente.' }
    ]
  },
  {
    id: 'arcaica',
    name: 'Época Arcaica',
    period: 'c. 800 – 490 a.C.',
    introduction: 'El renacimiento griego. Nace la "Polis" (Ciudad-Estado), se reintroduce la escritura (alfabeto) y se organizan los Juegos Olímpicos. Hay escasez de tierras, provocando una masiva expansión de colonias por el Mediterráneo.',
    kingdoms: [
      { id: 'esparta-arc', name: 'Esparta', type: 'polis', coordinates: [22.430, 37.073], anchorPoints: [...laconia, ...mesenia], color: '#DC2626', description: 'Conquistó a sus vecinos (Mesenia) esclavizándolos (ilotas). Para mantener el control, la ciudad entera se convirtió en una máquina militar regida por austeridad.' },
      { id: 'corinto-arc', name: 'Corinto', type: 'polis', coordinates: [22.879, 37.906], color: '#4F46E5', description: 'Estratégicamente en el istmo, controlaba el paso del norte al sur y dominaba el mar. Se hizo inmensamente rica y fundó Siracusa.' },
      { id: 'atenas-arc', name: 'Atenas', type: 'polis', coordinates: [23.727, 37.983], anchorPoints: atica, color: '#2563EB', description: 'Unificó toda la península del Ática. Los tiranos y reformadores como Solón sentaron aquí las primeras bases de lo que sería la democracia.' },
      { id: 'mileto-arc', name: 'Mileto', type: 'polis', coordinates: [27.275, 37.530], anchorPoints: jonia_coast, color: '#059669', description: 'La ciudad más intelectual de su tiempo. Aquí nació la filosofía (preguntarse el "por qué" de las cosas sin mitología) con pensadores como Tales de Mileto.' },
      { id: 'efeso-arc', name: 'Éfeso', type: 'polis', coordinates: [27.341, 37.941], color: '#0EA5E9', description: 'Rica ciudad que erigió el gigantesco Templo de Artemisa, atrayendo peregrinos y comerciantes de todo el Egeo y Oriente.' },
      { id: 'olimpia-arc', name: 'Olimpia', type: 'sanctuary', coordinates: [21.630, 37.638], color: '#FACC15', description: 'Santuario panhelénico (de todos los griegos). En el 776 a.C. iniciaron los Juegos Olímpicos, deteniendo las guerras cada 4 años para competir.' },
      { id: 'delfos-arc', name: 'Delfos', type: 'sanctuary', coordinates: [22.501, 38.482], color: '#FACC15', description: 'El centro del mundo griego ("omphalos"). Las polis consultaban al Oráculo de Apolo antes de fundar colonias o ir a la guerra.' },
      { id: 'siracusa', name: 'Siracusa', type: 'colony', coordinates: [15.286, 37.075], anchorPoints: magna_grecia, color: '#F59E0B', description: 'La colonia más poderosa de la "Magna Grecia" (Italia). Se convertiría en un faro cultural y militar en occidente rivalizando con Atenas.' }
    ]
  },
  {
    id: 'medicas',
    name: 'Guerras Médicas',
    period: '490 – 479 a.C.',
    introduction: 'El gigante Imperio Persa intentó absorber a Grecia. Sorprendentemente, ciudades rivales como Esparta y Atenas se unieron para repeler dos invasiones masivas, salvando la civilización occidental.',
    kingdoms: [
      { id: 'imperio-persa', name: 'Imperio Persa (Aqueménida)', type: 'empire', coordinates: [28.5, 38.0], anchorPoints: [...imperio_persa_coast, ...macedonia_core, ...tesalia], color: '#7E22CE', description: 'Bajo Darío y Jerjes, controlaban casi todo el mundo conocido y avanzaron con ejércitos colosales para someter la insolencia griega.' },
      { id: 'atenas-med', name: 'Atenas', type: 'polis', coordinates: [23.727, 37.983], anchorPoints: atica, color: '#1D4ED8', description: 'Líder naval indiscutible de Grecia. Evacuaron su ciudad (que fue quemada) pero engañaron a los persas venciéndoles en el mar.' },
      { id: 'esparta-med', name: 'Esparta', type: 'polis', coordinates: [22.430, 37.073], anchorPoints: [...laconia, ...mesenia], color: '#EF4444', description: 'Comandante en jefe de las fuerzas de tierra griegas, respetada por todos. Sus élites formaban la infantería pesada más letal (hoplitas).' },
      { id: 'maraton', name: 'Batalla de Maratón', type: 'battle', coordinates: [23.978, 38.118], color: '#F87171', description: 'En el 490 a.C., los atenienses, en inferioridad numérica y sin ayuda espartana, lanzaron una carga desesperada y aplastaron a la primera invasión persa.' },
      { id: 'termopilas', name: 'Batalla de las Termópilas', type: 'battle', coordinates: [22.536, 38.796], color: '#F87171', description: 'En el 480 a.C., 300 espartanos bajo el rey Leónidas y otros aliados retuvieron al inmenso ejército persa en un estrecho, sacrificándose en la última resistencia.' },
      { id: 'salamina', name: 'Batalla de Salamina', type: 'battle', coordinates: [23.468, 37.962], color: '#F87171', description: 'Batalla naval donde los ágiles trirremes atenienses emboscaron y destrozaron la inmensa flota de Jerjes, salvando a Grecia.' },
      { id: 'platea', name: 'Batalla de Platea', type: 'battle', coordinates: [23.267, 38.220], color: '#F87171', description: 'En 479 a.C., la infantería aliada, liderada por Esparta, barrió a los restos del ejército persa, expulsándolos de Europa para siempre.' },
      { id: 'mileto-med', name: 'Rebelión Jónica (Mileto)', type: 'polis', coordinates: [27.275, 37.530], color: '#D97706', description: 'Los griegos de Asia estaban bajo dominio persa. Se rebelaron (con leve ayuda de Atenas), lo cual dio a Persia la excusa para invadir Grecia.' }
    ]
  },
  {
    id: 'pentecontecia',
    name: 'La Pentecontecia',
    period: '479 – 431 a.C.',
    introduction: 'Los 50 años de "Paz". Atenas convirtió una liga defensiva en un imperio opresivo, canalizando los tributos hacia su "Edad de Oro" bajo Pericles. Construyeron el Partenón, mientras la tensión con Esparta crecía inevitablemente.',
    kingdoms: [
      { id: 'liga-delos', name: 'Imperio Ateniense (Liga de Delos)', type: 'empire', coordinates: [23.727, 37.983], anchorPoints: [...atica, ...jonia_coast, [25.5, 37.5], [26.0, 38.5]], color: '#1D4ED8', description: 'Control absoluto del mar. Los "aliados" estaban obligados a pagar tributo, lo que financió el teatro, Sócrates, y la reconstrucción de la Acrópolis.' },
      { id: 'liga-peloponeso', name: 'Liga del Peloponeso (Esparta)', type: 'empire', coordinates: [22.430, 37.073], anchorPoints: [...laconia, ...mesenia, ...argolida], color: '#B91C1C', description: 'Bloque terrestre de los espartanos, recelosos de la arrogancia ateniense. Preferían mantener el status quo y apoyaban dictaduras sobre la democracia.' },
      { id: 'tebas-pent', name: 'Tebas', type: 'polis', coordinates: [23.316, 38.323], anchorPoints: beocia, color: '#D97706', description: 'Dominaba la región central de Beocia, odiaba a Atenas por apoyar a polis rebeldes, y apoyó enérgicamente a Esparta.' },
      { id: 'corinto-pent', name: 'Corinto', type: 'polis', coordinates: [22.879, 37.906], color: '#4338CA', description: 'Sintió la amenaza comercial del creciente Imperio Ateniense, y fue quien presionó a Esparta para que declarara la guerra a Atenas.' }
    ]
  },
  {
    id: 'peloponeso',
    name: 'Guerra del Peloponeso',
    period: '431 – 404 a.C.',
    introduction: 'Una guerra mundial a escala griega. Esparta (el elefante terrestre) contra Atenas (la ballena naval). Terminó en desastre mutuo tras casi 30 años de asedios sangrientos, masacres y la humillante rendición final de Atenas.',
    kingdoms: [
      { id: 'atenas-pel', name: 'Atenas y aliados', type: 'empire', coordinates: [23.727, 37.983], anchorPoints: atica, color: '#1D4ED8', description: 'Su estrategia inicial era no luchar en tierra y refugiarse tras sus muros apoyados por sus barcos, pero una plaga letal asoló la ciudad, matando a Pericles.' },
      { id: 'esparta-pel', name: 'Esparta y aliados', type: 'empire', coordinates: [22.430, 37.073], anchorPoints: [...laconia, ...mesenia], color: '#B91C1C', description: 'Asolaban el territorio de Atenas anualmente. Eventualmente se aliaron con sus antiguos enemigos (los Persas) para conseguir oro y construir una flota.' },
      { id: 'esfacteria', name: 'Batalla de Esfacteria', type: 'battle', coordinates: [21.650, 36.920], color: '#F87171', description: 'Un suceso impensable: 120 espartanos se rindieron ante los atenienses y fueron tomados como rehenes, rompiendo el mito de la invencibilidad espartana.' },
      { id: 'siracusa-pel', name: 'Expedición a Siracusa', type: 'battle', coordinates: [15.286, 37.075], color: '#F87171', description: 'Atenas, cegada por la ambición, envió una enorme armada a conquistar Sicilia. Fueron aniquilados, sellando el destino de su imperio.' },
      { id: 'egospotamos', name: 'Batalla de Egospótamos', type: 'battle', coordinates: [26.540, 40.230], color: '#F87171', description: 'La última batalla. La nueva y audaz flota espartana capturó a la flota ateniense por sorpresa en la playa. Atenas, sin comida, se rindió.' }
    ]
  },
  {
    id: 'hegemonias',
    name: 'Hegemonía Espartana y Tebana',
    period: '404 – 338 a.C.',
    introduction: 'Esparta dictó las reglas con crueldad, imponiendo tiranos, lo que causó rebeliones. Luego Tebas, con genios tácticos militares, aplastó a Esparta. Estas peleas agotaron a Grecia y la dejaron lista para ser invadida por el norte.',
    kingdoms: [
      { id: 'esparta-heg', name: 'Esparta', type: 'polis', coordinates: [22.430, 37.073], anchorPoints: laconia, color: '#991B1B', description: 'Impulsó el "Terror Espartano". Su población menguó dramáticamente (escasez de ciudadanos reales) lo que la volvió sumamente frágil frente a un golpe directo.' },
      { id: 'tebas-heg', name: 'Hegemonía Tebana', type: 'empire', coordinates: [23.316, 38.323], anchorPoints: beocia, color: '#D97706', description: 'El general Epaminondas y el famoso "Batallón Sagrado" de Tebas (formado por parejas de amantes homosexules luchando juntos) tomaron el control.' },
      { id: 'leuctra', name: 'Batalla de Leuctra', type: 'battle', coordinates: [23.180, 38.250], color: '#F87171', description: 'El día en 371 a.C. en que Tebas derrotó definitivamente a Esparta en campo abierto, liberó a los ilotas y destruyó su base económica para siempre.' },
      { id: 'atenas-heg', name: 'Atenas', type: 'polis', coordinates: [23.727, 37.983], anchorPoints: atica, color: '#2563EB', description: 'Intentó revivir una segunda y mucho más modesta Liga Naval sin ser opresora, y albergó a pensadores como Platón y Aristóteles.' },
      { id: 'macedonia-heg', name: 'Reino de Macedonia', type: 'region', coordinates: [22.520, 40.760], anchorPoints: macedonia_core, color: '#0369A1', description: 'En el norte árido, un rey brillante llamado Filipo II estaba revolucionando su ejército, creando la falange con sarisas (lanzas gigantes) para conquistar Grecia.' }
    ]
  },
  {
    id: 'macedonia',
    name: 'El Ascenso de Macedonia',
    period: '338 – 323 a.C.',
    introduction: 'Filipo II doblegó a todas las polis y las forzó a unirse. Su hijo, el joven Alejandro Magno, usó este poder combinado para destruir el gigantesco Imperio Persa, llegando hasta la India en solo 10 años.',
    kingdoms: [
      { id: 'imperio-macedonio', name: 'Macedonia (Alejandro Magno)', type: 'empire', coordinates: [22.520, 40.760], anchorPoints: [...macedonia_core, ...tesalia, ...atica, ...beocia, ...laconia], color: '#0369A1', description: 'La capital de un imperio que de repente abarcaba Grecia, Egipto y toda Asia hasta el Indo. Propagó la cultura y lengua griega (Koiné) por el mundo oriental.' },
      { id: 'queronea', name: 'Batalla de Queronea', type: 'battle', coordinates: [22.842, 38.496], color: '#F87171', description: 'En 338 a.C., la caballería de Filipo (liderada por un joven Alejandro de 18 años) destrozó al ejército combinado de Atenas y Tebas, finiquitando la libertad de la polis.' },
      { id: 'granico', name: 'Batalla del Gránico', type: 'battle', coordinates: [27.200, 40.230], color: '#F87171', description: 'La primera victoria de Alejandro al cruzar a Asia. Cargó personalmente y casi muere, pero aplastó la defensa persa inicial.' },
      { id: 'esparta-mac', name: 'Esparta Aislada', type: 'polis', coordinates: [22.430, 37.073], color: '#991B1B', description: 'Fue la única que se negó a unirse a Alejandro. Se volvió irrelevante y miraba impotente cómo el mundo cambiaba sin ella.' }
    ]
  },
  {
    id: 'helenistica',
    name: 'Época Helenística',
    period: '323 – 146 a.C.',
    introduction: 'Alejandro murió joven y sin herederos fuertes. Sus generales (Diádocos) despedazaron el imperio creando gigantescos reinos monárquicos (Egipto Ptolemaico, Imperio Seléucida). Grecia continental quedó reducida a ligas periféricas.',
    kingdoms: [
      { id: 'macedonia-hel', name: 'Reino Antigónida', type: 'region', coordinates: [22.520, 40.760], anchorPoints: [...macedonia_core, ...tesalia], color: '#1E3A8A', description: 'Mantuvieron el control de Grecia usando grandes guarniciones clave en fortalezas conocidas como los "Grilletes de Grecia".' },
      { id: 'liga-aquea', name: 'Liga Aquea', type: 'region', coordinates: [22.083, 38.250], anchorPoints: argolida, color: '#A21CAF', description: 'Un experimento político fascinante: las ciudades del Peloponeso se unieron en un sistema de gobierno representativo federal avanzado.' },
      { id: 'liga-etolia', name: 'Liga Etolia', type: 'region', coordinates: [21.565, 38.577], color: '#15803D', description: 'La contraparte militarista en el norte de Grecia central. Utilizaban la piratería estatal y los saqueos como armas geopolíticas.' },
      { id: 'rodas-hel', name: 'Rodas', type: 'polis', coordinates: [28.227, 36.434], color: '#B45309', description: 'La "Suiza de la antigüedad". República banquera y naval inmensamente rica. Resistió asedios brutales y erigió el Coloso (una maravilla del mundo).' },
      { id: 'pergamo', name: 'Reino de Pérgamo', type: 'region', coordinates: [27.180, 39.122], anchorPoints: jonia_coast, color: '#C2410C', description: 'Reino rico e inteligente en Asia. Construyeron una biblioteca que competía con Alejandría (de ahí viene la palabra pergamino) y se aliaron con la creciente Roma.' },
      { id: 'atenas-hel', name: 'Atenas', type: 'polis', coordinates: [23.727, 37.983], color: '#3B82F6', description: 'Militarmente impotente, sobrevivió como una "ciudad museo" donde los reyes extranjeros ricos pagaban monumentos y la nobleza mandaba a sus hijos a estudiar filosofía.' }
    ]
  },
  {
    id: 'romana',
    name: 'Grecia Romana',
    period: '146 a.C. en adelante',
    introduction: 'Roma, la superpotencia de occidente, cansada de las disputas griegas, aplastó a la Liga Aquea, destruyó Corinto y convirtió Grecia en la provincia de Acaya. Paradójicamente, "la Grecia cautiva, cautivó a su rudo conquistador" exportando su cultura a Roma.',
    kingdoms: [
      { id: 'provincia-macedonia', name: 'Provincia de Macedonia', type: 'region', coordinates: [22.520, 40.760], anchorPoints: [...macedonia_core, ...tesalia], color: '#6B21A8', description: 'Tras la derrota de los reyes antigónidas (Pydna 168 a.C.), Roma desmembró y castigó severamente el territorio antes de anexarlo de forma definitiva.' },
      { id: 'provincia-acaya', name: 'Provincia de Acaya', type: 'region', coordinates: [22.8, 37.9], anchorPoints: [...atica, ...laconia, ...argolida], color: '#7E22CE', description: 'Todo el Peloponeso y el centro de Grecia quedaron bajo un gobernador romano. Siglos de guerras y gloria polis independientes llegaron a su fin absoluto.' },
      { id: 'corinto-rom', name: 'Corinto (Destruida)', type: 'battle', coordinates: [22.879, 37.906], color: '#F87171', description: 'En el 146 a.C., como castigo por rebelarse, Roma arrasó Corinto hasta los cimientos, mató a los hombres y esclavizó a mujeres y niños, enviando un mensaje brutal.' },
      { id: 'delos', name: 'Isla de Delos', type: 'sanctuary', coordinates: [25.267, 37.393], color: '#FACC15', description: 'Roma convirtió la sagrada isla natal de Apolo en un "puerto libre de impuestos", transformándose en el mayor y más trágico mercado de esclavos del mundo antiguo.' }
    ]
  }
];
