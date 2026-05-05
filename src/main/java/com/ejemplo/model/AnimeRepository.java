package com.ejemplo.model;

import java.util.Collections;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class AnimeRepository {

    private static final Map<String, AnimeSeries> SERIES = buildRepository();

    private AnimeRepository() {
    }

    public static Collection<AnimeSeries> getAllSeries() {
        return SERIES.values();
    }

    public static AnimeSeries getSeries(String slug) {
        return SERIES.get(slug);
    }

    public static AnimeTopic getTopic(String seriesSlug, String topicSlug) {
        AnimeSeries series = getSeries(seriesSlug);
        return series == null ? null : series.findTopic(topicSlug);
    }

    private static Map<String, AnimeSeries> buildRepository() {
        Map<String, AnimeSeries> seriesMap = new LinkedHashMap<>();

        seriesMap.put("one-piece", new AnimeSeries(
            "one-piece",
            "One Piece",
            "Grand Line",
            "Un viaje por piratas, islas imposibles y fuerzas que cambian el equilibrio del mundo.",
            "#f97316",
            "#fb7185",
            List.of(
                topic("frutas", "Frutas", "Poderes extranos que alteran el cuerpo y el combate.",
                    "Las frutas del diablo conceden habilidades unicas a cambio de perder la capacidad de nadar. Dentro de One Piece marcan estilos de pelea, rangos de poder y estrategias enteras de tripulaciones y gobiernos.",
                    "Paramecia, Zoan y Logia organizan casi todas las habilidades conocidas.",
                    "Muchas batallas se ganan por creatividad al usar la fruta, no solo por fuerza bruta.",
                    "Algunas frutas tienen despertares que elevan su alcance a otro nivel."
                ),
                topic("haki", "Haki", "La voluntad convertida en defensa, ataque y percepcion.",
                    "El haki es una energia espiritual que permite sentir presencias, endurecer el cuerpo y hasta imponerse sobre otros con pura determinacion. Es una pieza esencial del combate avanzado en el Nuevo Mundo.",
                    "El haki de observacion anticipa movimientos y emociones.",
                    "El haki de armadura refuerza golpes, armas y defensa.",
                    "El haki del conquistador distingue a personajes con una voluntad extraordinaria."
                ),
                topic("reinos", "Reinos", "Territorios con historia, politica y secretos propios.",
                    "Los reinos de One Piece no son solo escenarios: cada uno tiene problemas internos, linajes, alianzas y formas de gobierno que condicionan el rumbo de la historia. Muchos esconden piezas del gran misterio del siglo vacio.",
                    "Arabasta y Dressrosa muestran como la politica puede romper un pais entero.",
                    "Wano representa una nacion cerrada con identidad y conflicto profundo.",
                    "La relacion entre reinos y Gobierno Mundial define grandes arcos."
                ),
                topic("mares", "Mares", "Rutas y zonas que separan a novatos, leyendas y monstruos.",
                    "One Piece divide el planeta en blues, Red Line y Grand Line. Cada mar tiene su caracter, pero la Grand Line y el Nuevo Mundo concentran el peligro extremo y a los mayores nombres del mundo pirata.",
                    "East Blue suele verse como el punto de partida de los grandes suenos.",
                    "La Grand Line obliga a navegar con log pose y rutas imprevisibles.",
                    "El Nuevo Mundo esta dominado por emperadores y guerras de influencia."
                ),
                topic("tripulacion", "Tripulacion", "Una familia de talentos distintos unidos por un mismo sueno.",
                    "La tripulacion de los Sombrero de Paja funciona porque cada miembro aporta una habilidad clave y una meta personal. Su fortaleza nace tanto de la amistad como de la especializacion de cada rol.",
                    "Luffy lidera por conviccion y libertad mas que por estrategia formal.",
                    "Nami, Sanji, Zoro, Robin o Franky hacen viable la aventura en la practica.",
                    "Cada incorporacion amplifica el alcance emocional y tactico del grupo."
                ),
                topic("sichibukais", "Sichibukais", "Piratas autorizados cuya alianza con el gobierno siempre fue fragil.",
                    "Los Sichibukais fueron corsarios reconocidos por el Gobierno Mundial a cambio de cierta colaboracion. Aunque parecian un sistema de control, casi todos escondian agendas propias que terminaron desestabilizando el orden.",
                    "Mihawk, Crocodile, Doflamingo o Boa Hancock muestran perfiles muy distintos.",
                    "El sistema generaba equilibrio temporal, pero tambien mucho abuso.",
                    "Su desaparicion reconfigura la fuerza militar y politica del mundo."
                ),
                topic("yonkos", "Yonkos", "Los cuatro emperadores que dominan el mar mas feroz.",
                    "Los Yonkos son figuras capaces de cambiar la historia con una sola decision. Controlan territorios, flotas y alianzas enormes, y representan la cima del poder pirata en el Nuevo Mundo.",
                    "Cada emperador impone una cultura y un estilo de dominio diferente.",
                    "Su mera presencia afecta al Gobierno Mundial, a la Marina y a otros piratas.",
                    "Enfrentarse a ellos exige poder, carisma y una ambicion descomunal."
                )
            )
        ));

        seriesMap.put("bleach", new AnimeSeries(
            "bleach",
            "Bleach",
            "Soul Society",
            "Un mundo espiritual atravesado por guerras antiguas, jerarquias y poderes del alma.",
            "#06b6d4",
            "#8b5cf6",
            List.of(
                topic("shinigamis", "Shinigamis", "Protectores del balance entre el mundo humano y las almas.",
                    "Los shinigamis purifican hollows y guian almas a Soul Society. Su estructura militar, sus zanpakuto y su codigo interno hacen de ellos uno de los pilares de Bleach.",
                    "Las divisiones del Gotei 13 reparten funciones y liderazgos.",
                    "La zanpakuto expresa la identidad de su portador.",
                    "Bankai y shikai marcan escalas de poder muy distintas."
                ),
                topic("hollows", "Hollows", "Espiritus corrompidos por el vacio y el deseo.",
                    "Los hollows nacen de almas que pierden el rumbo y son consumidas por la desesperacion. En Bleach funcionan como amenaza constante, pero tambien como pista de una tragedia espiritual mas profunda.",
                    "Las mascaras y agujeros simbolizan su perdida de humanidad.",
                    "Hueco Mundo es el gran territorio asociado a su evolucion.",
                    "Algunos llegan a niveles superiores como adjuchas o vasto lorde."
                ),
                topic("historia", "Historia", "Ichigo entra en una guerra que supera su vida cotidiana.",
                    "La historia de Bleach mezcla crecimiento personal con conflictos entre facciones que arrastran siglos de tension. La entrada de Ichigo rompe el orden, cuestiona jerarquias y conecta mundos que parecian aislados.",
                    "Todo empieza con la transferencia de poderes de Rukia.",
                    "Soul Society, Arrancar y la guerra Quincy elevan el conflicto de forma progresiva.",
                    "La serie combina drama, identidad y herencia espiritual."
                ),
                topic("quincys", "Quincys", "Arqueros espirituales con una doctrina opuesta a los shinigamis.",
                    "Los Quincys destruyen hollows en lugar de purificarlos, y eso altera el equilibrio de almas. Su historia con Soul Society esta marcada por miedo, exterminio y venganza acumulada durante generaciones.",
                    "Reishi y tecnica refinada son claves de su estilo de combate.",
                    "La guerra Quincy revela secretos fundacionales del mundo.",
                    "Yhwach redefine lo que parecia fijo dentro del universo Bleach."
                ),
                topic("villanos", "Villanos", "Mentes calculadoras y amenazas capaces de romper la estructura del mundo.",
                    "Bleach tiene villanos que no solo buscan poder, sino redibujar la realidad a su gusto. Aizen, Yhwach y otros antagonistas destacan por su inteligencia, presencia y capacidad de manipular sistemas enteros.",
                    "Aizen simboliza la rebelion desde dentro del orden establecido.",
                    "Los grandes villanos obligan a los heroes a madurar y unirse.",
                    "La amenaza suele ser ideologica, no solo fisica."
                )
            )
        ));

        seriesMap.put("naruto", new AnimeSeries(
            "naruto",
            "Naruto",
            "Konoha",
            "Un universo ninja donde la herencia, el dolor y la voluntad de cambiar lo deciden todo.",
            "#f59e0b",
            "#ef4444",
            List.of(
                topic("equipo-7", "Equipo 7", "La formacion que impulsa buena parte del relato.",
                    "Naruto, Sasuke y Sakura, guiados por Kakashi, forman el Equipo 7. Su evolucion resume muchos de los temas centrales de la serie: amistad, rivalidad, perdida y crecimiento.",
                    "Cada miembro empieza con carencias emocionales y tecnicas distintas.",
                    "Kakashi actua como puente entre disciplina y afecto.",
                    "La ruptura y reunion del grupo marcan varias etapas clave del anime."
                ),
                topic("ojos", "Ojos", "Dojutsus que alteran percepcion, tecnica y destino.",
                    "Sharingan, Byakugan y Rinnegan son poderes oculares con implicaciones tacticas y simbolicas enormes. En Naruto, ver mejor tambien significa cargar con mas historia y responsabilidad.",
                    "El Sharingan esta ligado al clan Uchiha y a emociones intensas.",
                    "El Byakugan destaca por vision amplia y precision corporal.",
                    "El Rinnegan aparece asociado a figuras capaces de cambiar eras completas."
                ),
                topic("chakra", "Chakra", "La energia esencial detras de cada jutsu.",
                    "El chakra combina energia fisica y espiritual. Su control determina desde tecnicas basicas hasta movimientos legendarios, por lo que dominarlo es una de las bases mas importantes del camino ninja.",
                    "El equilibrio del chakra afecta potencia, precision y resistencia.",
                    "Las naturalezas elementales expanden mucho las posibilidades del combate.",
                    "Muchos personajes se distinguen por usos creativos mas que por cantidad pura."
                ),
                topic("bijus", "Bijus", "Bestias de cola que concentran poder y trauma historico.",
                    "Los bijus son criaturas inmensas ligadas a guerras, miedo y control. La serie los usa para hablar de marginacion, convivencia y de como el poder puede ser tanto una carga como un vinculo.",
                    "Cada bestia tiene identidad y voluntad propia.",
                    "Los jinchuriki viven entre utilidad militar y rechazo social.",
                    "La relacion de Naruto con Kurama cambia el sentido del conflicto."
                ),
                topic("akatsukis", "Akatsukis", "Una organizacion que convierte dolor personal en amenaza global.",
                    "Akatsuki agrupa ninjas con historias marcadas por perdida, guerra y desencanto. Su plan toca a casi todos los clanes y naciones porque busca dominar el mundo mediante los bijus y una paz impuesta.",
                    "Cada miembro posee un estilo reconocible y una motivacion fuerte.",
                    "Pain e Itachi elevan el tono moral y filosofico de la serie.",
                    "Su impacto persiste incluso cuando la organizacion se fractura."
                )
            )
        ));

        seriesMap.put("jujutsu-kaisen", new AnimeSeries(
            "jujutsu-kaisen",
            "Jujutsu Kaisen",
            "Tokyo Jujutsu High",
            "Hechiceria, maldiciones y linajes poderosos en un mundo moderno cargado de tension.",
            "#22c55e",
            "#14b8a6",
            List.of(
                topic("clanes", "Clanes", "Familias que concentran tecnica, prestigio y conflicto.",
                    "Los clanes dentro de Jujutsu Kaisen organizan poder, acceso y expectativas. Tambien sostienen sistemas rigidos que muchos personajes intentan desafiar o derribar.",
                    "Zenin, Gojo y Kamo son referencias fundamentales del orden tradicional.",
                    "Los clanes condicionan el destino de los personajes desde muy jovenes.",
                    "La tension entre herencia y libertad mueve varios arcos."
                ),
                topic("villanos", "Villanos", "Amenazas que juegan con ideologia y caos a gran escala.",
                    "Los villanos de Jujutsu Kaisen no se limitan a destruir: ponen a prueba la legitimidad del sistema de hechiceros y fuerzan decisiones cada vez mas duras. Su fuerza suele venir acompanada de una idea clara del mundo.",
                    "Kenjaku y Sukuna representan peligros de naturaleza distinta.",
                    "Muchos antagonistas explotan grietas previas del sistema.",
                    "El caos que generan afecta tanto a estudiantes como a maestros."
                ),
                topic("estudiantes", "Estudiantes", "La nueva generacion que hereda un mundo roto.",
                    "Los estudiantes de las escuelas de hechiceria cargan con misiones extremas desde muy pronto. Aun asi, la serie encuentra tiempo para mostrar amistades, humor y formas distintas de crecer bajo presion.",
                    "Yuji, Megumi y Nobara marcan el nucleo emocional inicial.",
                    "Cada estudiante aporta una lectura diferente del deber y la empatia.",
                    "Las escuelas funcionan como refugio y campo de batalla al mismo tiempo."
                ),
                topic("maldiciones", "Maldiciones", "Manifestaciones del miedo humano convertidas en monstruo.",
                    "Las maldiciones nacen de emociones negativas acumuladas y pueden ir desde amenazas menores hasta entidades de inteligencia temible. Son la materia prima del conflicto central de la serie.",
                    "El nivel de una maldicion define el tipo de respuesta necesaria.",
                    "Las mas fuertes exhiben personalidad, discurso y estrategia.",
                    "Su existencia refleja lo oscuro que puede producir la sociedad humana."
                ),
                topic("grados", "Grados", "Una escala que ordena misiones, riesgo y capacidad real.",
                    "El sistema de grados permite medir el peligro de hechiceros y maldiciones, aunque la serie demuestra varias veces que la realidad supera cualquier clasificacion formal. Aun asi, sigue siendo una referencia vital dentro del trabajo diario.",
                    "Los grados influyen en asignaciones y expectativas operativas.",
                    "Las diferencias entre catalogacion y realidad crean tension narrativa.",
                    "Subir de grado implica reconocimiento, riesgo y responsabilidad."
                )
            )
        ));

        return Collections.unmodifiableMap(seriesMap);
    }

    private static AnimeTopic topic(
        String slug,
        String title,
        String teaser,
        String overview,
        String highlightOne,
        String highlightTwo,
        String highlightThree
    ) {
        return new AnimeTopic(slug, title, teaser, overview, List.of(highlightOne, highlightTwo, highlightThree));
    }
}
