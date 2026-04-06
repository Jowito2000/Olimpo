import { TimelineEvent } from '../types';

export const timelineEvents: TimelineEvent[] = [
  // ── ORIGEN ──
  {
    id: 'caos-creacion',
    period: 'El Principio',
    title: 'Surgimiento del Caos',
    description: 'En el origen del universo existía únicamente el Caos (el vacío primordial). De él surgieron elementos básicos como Gea (la Tierra), Tártaro (el abismo), Érebo (la oscuridad) y Eros (la procreación).',
    category: 'origen',
    level: 1
  },
  {
    id: 'noche-erebo',
    period: 'Era Primordial',
    title: 'Descendencia de la Noche',
    description: 'La Noche (Nyx) engendró por sí misma oscuras deidades conceptuales sin padre, como Tánatos (la Muerte), Hipnos (el Sueño), Eris (la Discordia) y las implacables Moiras (el Destino).',
    category: 'origen',
    level: 5
  },
  {
    id: 'urano-gea',
    period: 'Era Primordial',
    title: 'El Reinado de Urano',
    description: 'Gea engendró por sí misma a Urano (el Cielo Estrellado). Juntos gobernaron el naciente cosmos y produjeron a la primera generación: 3 Hecatónquiros, 3 Cíclopes y los doce poderosos Titanes.',
    category: 'origen',
    level: 2
  },

  // ── TITANOMAQUIA ──
  {
    id: 'castracion-urano',
    period: 'Era de los Titanes',
    title: 'Derrocamiento de Urano',
    description: 'Urano despótico encerraba a sus hijos monstruosos. Gea, resentida, le dio a su hijo menor, el titán Cronos, una hoz de pedernal con la cual castró a su padre (de cuya sangre nacieron las Erinias y Afrodita) y tomó el trono del cosmos.',
    category: 'titanomaquia',
    level: 4
  },
  {
    id: 'imperio-cronos',
    period: 'Edad de Oro',
    title: 'El Imperio de Cronos',
    description: 'Bajo el gobierno del Titán Cronos floreció la mítica Edad de Oro humana. Sin embargo, temiendo una profecía de que sería derrocado por un hijo suyo, Cronos comenzó a devorar sistemáticamente a toda la descendencia que tenía con Rea según nacían.',
    category: 'titanomaquia',
    level: 2
  },
  {
    id: 'nacimiento-zeus',
    period: 'Fin de la Edad de Oro',
    title: 'El Nacimiento de Zeus',
    description: 'Rea salvó a su último hijo, Zeus, entregando a Cronos una piedra envuelta en pañales. Zeus fue criado en secreto en una cueva de Creta, amamantado por la cabra Amaltea.',
    category: 'titanomaquia',
    level: 2
  },
  {
    id: 'guerra-titanomaquia',
    period: 'Guerra Divina',
    title: 'La Titanomaquia',
    description: 'Zeus, adulto, obligó a Cronos a vomitar a sus hermanos mayores (Hera, Hades, Poseidón, Deméter, Hestia). Junto a Cíclopes y Hecatónquiros, libraron una guerra apocalíptica de diez años contra los Titanes, ganando el control del universo.',
    category: 'titanomaquia',
    level: 1
  },

  // ── DIOSES Y HUMANOS ──
  {
    id: 'reparto-mundo',
    period: 'Era de los Olímpicos',
    title: 'El Reparto del Mundo',
    description: 'Tras la definitiva victoria contra los titanes, los tres hermanos mayores (Zeus, Poseidón y Hades) se dividieron los dominios del cosmos echándolo a suertes en un yelmo.',
    category: 'dioses',
    level: 2
  },
  {
    id: 'nacimiento-atenea',
    period: 'Era de los Olímpicos',
    title: 'Nacimiento de Atenea',
    description: 'Habiéndose tragado a la diosa Metis por miedo a una profecía, a Zeus le sobrevino un terrible dolor de cabeza. Hefesto le abrió el cráneo de un hachazo y de allí emergió Atenea, completamente adulta, armada y lanzando un grito de guerra.',
    category: 'dioses',
    level: 4
  },
  {
    id: 'nacimiento-apolo',
    period: 'Era de los Olímpicos',
    title: 'Nacimiento de Apolo y Artemisa',
    description: 'Perseguida por los celos y maldiciones de la diosa Hera, la titánide Leto encontró refugio en la árida isla flotante de Delos, donde dio a luz a los inmaculados gemelos arqueros Apolo y Artemisa.',
    category: 'dioses',
    level: 4
  },
  {
    id: 'creacion-hombre',
    period: 'Era de los Mortales',
    title: 'Creación del Hombre',
    description: 'El titán de segunda generación, Prometeo, amigo de los humanos, moldeó a la raza del hombre rudimentario a base de fango puro y arcilla, deambulando por la frágil Tierra.',
    category: 'dioses',
    level: 2
  },
  {
    id: 'robo-fuego',
    period: 'Edad de Plata',
    title: 'El Robo del Fuego',
    description: 'Para proteger a los frágiles humanos, Prometeo engañó a Zeus y subió al Olimpo robando el fuego vivificante de la forja divina para dárselo a la humanidad. Un delito imperdonable a los ojos de Zeus, quien dispuso encadenarlo al Cáucaso.',
    category: 'dioses',
    level: 4
  },
  {
    id: 'caja-pandora',
    period: 'Edad de Plata',
    title: 'Pandora y los Males',
    description: 'Como severa represalia final por el engaño de Prometeo, los dioses diseñaron a Pandora (la primera mujer). Se le entregó un recipiente sellado, el cual ella abrió por curiosidad divina, liberando toda plaga y enfermedad imaginables al mundo.',
    category: 'dioses',
    level: 3
  },
  {
    id: 'desaparicion-persefone',
    period: 'Edad de las Estaciones',
    title: 'El Rapto de Perséfone',
    description: 'Hades secuestró a Perséfone arrastrándola al Inframundo. La tristeza de su madre, Deméter (diosa de la agricultura), secó toda vida en la Tierra creando el invierno, hasta que se logró el acuerdo de que Perséfone dividiera su tiempo en los dos mundos.',
    category: 'dioses',
    level: 4
  },
  {
    id: 'deucalion',
    period: 'El Diluvio',
    title: 'El Diluvio Universal',
    description: 'Disgustado por la degeneración sangrienta de la raza humana (Edad de Bronce), Zeus inundó permanentemente la Tierra entera. Deucalión y Pirra construyeron un arca, salvándose y luego arrojando piedras que mágicamente se convirtieron en nuevos hombres y mujeres.',
    category: 'dioses',
    level: 5
  },
  {
    id: 'fundacion-tebas',
    period: 'Fundaciones Míticas',
    title: 'Cadmo y la Fundación de Tebas',
    description: 'El príncipe fenicio Cadmo, buscando a su hermana robada Europa, fue instruido por el oráculo a seguir una vaca y edificar donde cayera. Allí mató al dragón de Ares, plantó sus dientes, y así nacieron los espartos primigenios fundadores de Tebas.',
    category: 'dioses',
    level: 5
  },
  {
    id: 'castigos-hades',
    period: 'Justicia Divina',
    title: 'Grandes Condenados del Tártaro',
    description: 'Mortales cuya hybris indignó al cielo fueron castigados ejemplarmente: Sísifo fue obligado a empujar empinadamente una roca eternamente; Tántalo a sufrir sed y hambre rodeado de agua retrocediente, e Ixión atado a una rueda llameante giratoria.',
    category: 'dioses',
    level: 5
  },

  // ── HÉROES ──
  {
    id: 'perseo',
    period: 'Edad Heroica Temprana',
    title: 'Perseo y la Gorgona',
    description: 'Para proteger de la deshonra a su madre Dánae, el héroe griego Perseo viaja hasta los confines del mundo valiéndose de reliquias divinas prestadas para decapitar a Medusa y usar su rostro petrificante como arma para rescatar a Andrómeda del Kraken.',
    category: 'heroes',
    level: 3
  },
  {
    id: 'belerofonte',
    period: 'Edad Heroica Temprana',
    title: 'Belerofonte y Pegaso',
    description: 'Tras domar exitosamente con bridas de oro al caballo alado inmortal Pegaso, el héroe Belerofonte abate desde los cielos a la quimera. Alardeando demasiado, intentó eventualmente volar al Olimpo pero Zeus hizo que la montura lo derribara a tierra.',
    category: 'heroes',
    level: 4
  },
  {
    id: 'nacimiento-heracles',
    period: 'Edad Heroica',
    title: 'Nacimiento de Heracles',
    description: 'Zeus engaña y engendra a Heracles (Hércules) en brazos de la reina mortal Alcmena. Desde la mismísima velada de su nacimiento, Hera juraría atormentarlo y complicar enormemente su vida terrenal.',
    category: 'heroes',
    level: 2
  },
  {
    id: 'trabajos-heracles',
    period: 'Edad Heroica',
    title: 'Los Doce Trabajos de Heracles',
    description: 'Afligido severamente por un ataque de locura en el que en un lapsus mató a toda su familia, Heracles servirá servilmente durante 12 años a cuenta del rey Euristeo rindiendo cuentas de monumentales hazañas: matar hidras, cazar jabalíes, limpiar establos insalubres, y hasta sacar al mismísimo monstruo Cerbero de Hades.',
    category: 'heroes',
    level: 3
  },
  {
    id: 'argonautas',
    period: 'Edad Heroica Alta',
    title: 'Aventura de los Argonautas',
    description: 'A bordo de la nave Argo y reclutando a la mejor generación de portentos e hijos de los propios dioses, Jasón navega hacia lo desconocido en la inhóspita Cólquida para conseguir el exótico Vellocino de Oro ayudado decisivamente por la magia de la princesa bárbara Medea.',
    category: 'heroes',
    level: 3
  },
  {
    id: 'teseo-minotauro',
    period: 'Edad Heroica Tardía',
    title: 'Teseo y el Laberinto',
    description: 'El futuro rey, el valiente héroe civilizador Teseo, viaja al oscuro centro del dominio cretense introduciéndose en el siniestro laberinto mortal ayudado por un ovillo de hilo mágico (entregado por la infanta Ariadna) consiguiendo asesinar finalmente al terrorífico Minotauro.',
    category: 'heroes',
    level: 3
  },
  {
    id: 'edipo',
    period: 'Caída de Reyes',
    title: 'Tragedia en Tebas (Edipo Rey)',
    description: 'Empujado funestamente por una sombría profecía oracular imprecisa, el rey de Tebas Edipo intenta huir de su destino de Corinto, asesinando accidentalmente cruzando una vía a su padre biológico e inconscientemente contrayendo un matrimonio incestuoso maldito con su propia madre real Yocasta.',
    category: 'heroes',
    level: 4
  },
  {
    id: 'siete-tebas',
    period: 'Guerra Fratricida',
    title: 'Los Siete Contra Tebas',
    description: 'Tras el espantoso hallazgo exiliatorio y locura de la estirpe heráldica de Edipo, sus dos hijos varones, a regañadientes compartiendo poder, se traicionan acabando liderando siete ejércitos antagónicos bajo asedio mutuivo muriendo espadazos en las mismas siete puertas majestuosas tebanas.',
    category: 'heroes',
    level: 5
  },

  // ── TROYA E ILÍADA ──
  {
    id: 'boda-tetis',
    period: 'Las Semillas de Troya',
    title: 'La Boda de Peleo y la Manzana',
    description: 'A la boda de los padres milagrosos de Aquiles, la vengativa diosa exclúida de la Discordia deja estratégicamente una descarada manzana áurea inscrita "A la Más Hermosa". Atenea, Hera y Afrodita reclamarán inmediatamente su derecho divino al codiciado frutaje iniciando la espiral bélica.',
    category: 'troya',
    level: 5
  },
  {
    id: 'juicio-paris',
    period: 'El Juicio Fatídico',
    title: 'El Juicio de Paris',
    description: 'Las rencorosas deidades acuden al apuesto príncipe de sangre real (aunque secretamente criado como rústico pastor) llamado Paris para sentenciarlas y resolver quién es oficialmente la Más Hermosa de las diosas superiores. Por conveniencia amatoria obvia, elige sorpresivamente a Afrodita a cambio de un desastroso soborno.',
    category: 'troya',
    level: 4
  },
  {
    id: 'rapto-helena',
    period: 'El Casus Belli',
    title: 'El Rapto de Helena de Esparta',
    description: 'Afrodita manipuló perversamente las voluntades facilitando una fuga para que un frénetico Paris rapta amantemente a Helena, esposa del iracundo Menelao, destrozando toda la frágil hospitalidad monárquica de la península peloponesa.',
    category: 'troya',
    level: 3
  },
  {
    id: 'guerra-troya',
    period: 'Guerra Pánica Continental',
    title: 'Comienza la Guerra de Troya',
    description: 'Todos y cada uno de los pequeños y grandes príncipes, acordonados bajo el solemne pacto común anterior de lealtad defensiva a Tindáreo, levantan sus mastodónticas flotas zarpando de modo unánime vengativo hacia la lejana y fuertemente protegida costa troyana.',
    category: 'troya',
    level: 1
  },
  {
    id: 'caida-troya',
    period: 'Diez Años de Sangre',
    title: 'La Caída de la Desgraciada Troya',
    description: 'Muerto prematuramente Aquiles e imponentemente Héctor, el largo asfixiante asedio se rompe solo mediante el cobarde ingenio de infiltración: el famoso e imperecedero Caballo de Madera que introducirá el pavor, la esclavitud generalizada y el fin rotundo del linaje divino troyano.',
    category: 'troya',
    level: 1
  },
  {
    id: 'odisea',
    period: 'Retornos (Nostoi)',
    title: 'La Extensísima Odisea',
    description: 'Odiseo (Ulises) intenta trágicamente navegar desesperante regresando al pedregoso y anhelado hogar de Ítaca ganándose enemistades divinas aterradoras (Poseidón furibundo) sobreviviendo astutamente hechizos de semi-diosas exóticas, monstruosos remolinos y tentaciones sensuales durante infinitos 10 años letales.',
    category: 'troya',
    level: 3
  },
  {
    id: 'eneida',
    period: 'Las Cenizas Prometidas',
    title: 'Eneas y la Fundación Futura',
    description: 'El refugiado troyano Eneas, guiado espiritualmente por su madre la propia Afrodita, escapa providencialmente milagrosamente con vida entre la hecatombe masiva urbana y navega desangrado hasta asentar los cimientos lejanísimos de la prometedora Italia, de donde nacerá muy paulatinamente y a largo recorrido nada más y menos que la poderosa gloria sangrienta del futúro imperio del César (Roma).',
    category: 'troya',
    level: 5
  }
];
