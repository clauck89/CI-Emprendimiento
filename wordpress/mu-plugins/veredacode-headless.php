<?php
/**
 * Plugin Name: VeredaCode Headless CMS
 * Description: Registra los tipos de contenido (Rutas/Cursos y Módulos), campos personalizados, CORS y API REST compacta de bajo consumo de datos para la plataforma educativa VeredaCode (ODS 4).
 * Version: 1.0.0
 * Author: Equipo VeredaCode
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * 1. Registro de Custom Post Types (Cursos/Rutas y Módulos)
 */
add_action('init', function () {
    register_post_type('vc_curso', [
        'labels' => [
            'name'               => 'Rutas y Cursos',
            'singular_name'      => 'Ruta / Curso',
            'add_new'            => 'Añadir Ruta',
            'add_new_item'       => 'Añadir Nueva Ruta Educativa',
            'edit_item'          => 'Editar Ruta',
            'all_items'          => 'Todas las Rutas',
            'menu_name'          => 'Rutas VeredaCode',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'rest_base'     => 'cursos',
        'menu_icon'     => 'dashicons-welcome-learn-more',
        'supports'      => ['title', 'editor', 'excerpt', 'custom-fields'],
        'has_archive'   => false,
        'rewrite'       => ['slug' => 'cursos'],
    ]);

    register_post_type('vc_modulo', [
        'labels' => [
            'name'               => 'Módulos',
            'singular_name'      => 'Módulo',
            'add_new'            => 'Añadir Módulo',
            'add_new_item'       => 'Añadir Nuevo Módulo',
            'edit_item'          => 'Editar Módulo',
            'all_items'          => 'Todos los Módulos',
            'menu_name'          => 'Módulos',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'rest_base'     => 'modulos',
        'menu_icon'     => 'dashicons-book-alt',
        'supports'      => ['title', 'editor', 'excerpt', 'custom-fields'],
        'has_archive'   => false,
        'rewrite'       => ['slug' => 'modulos'],
    ]);

    // Metadatos expuestos en REST para Cursos
    $curso_meta = [
        '_vc_ruta_numero'     => 'integer',
        '_vc_nivel'           => 'string',
        '_vc_etiqueta'        => 'string',
        '_vc_duracion'        => 'string',
        '_vc_peso_kb'         => 'integer',
        '_vc_requisitos'      => 'string',
        '_vc_objetivos'       => 'string',
        '_vc_repo_url'        => 'string',
        '_vc_tipo_practica'   => 'string',
    ];

    foreach ($curso_meta as $key => $type) {
        register_post_meta('vc_curso', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }

    // Metadatos expuestos en REST para Módulos
    $modulo_meta = [
        '_vc_curso_slug'       => 'string',
        '_vc_orden'            => 'integer',
        '_vc_duracion_min'     => 'integer',
        '_vc_resumen'          => 'string',
        '_vc_objetivo'         => 'string',
        '_vc_codigo_ejemplo'   => 'string',
        '_vc_lenguaje_codigo'  => 'string',
        '_vc_tipo_laboratorio' => 'string',
        '_vc_ejercicio_papel'  => 'string',
        '_vc_repo_url'         => 'string',
    ];

    foreach ($modulo_meta as $key => $type) {
        register_post_meta('vc_modulo', $key, [
            'type'         => $type,
            'single'       => true,
            'show_in_rest' => true,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
});

/**
 * 2. Encabezados CORS para consumo desacoplado desde el Frontend PWA Vue 3
 */
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = get_http_origin();
        header('Access-Control-Allow-Origin: ' . ($origin ? esc_url_raw($origin) : '*'));
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Vary: Origin');
        return $value;
    });
}, 15);

/**
 * 3. Endpoints REST compactos (bajo consumo de ancho de banda): /wp-json/veredacode/v1/
 */
add_action('rest_api_init', function () {
    register_rest_route('veredacode/v1', '/health', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $cursos = wp_count_posts('vc_curso');
            $modulos = wp_count_posts('vc_modulo');

            return rest_ensure_response([
                'status'      => 'ok',
                'service'     => 'VeredaCode Headless WordPress API',
                'version'     => '1.0.0',
                'cursos'      => isset($cursos->publish) ? (int) $cursos->publish : 0,
                'modulos'     => isset($modulos->publish) ? (int) $modulos->publish : 0,
                'timestamp'   => gmdate('c'),
            ]);
        },
    ]);

    register_rest_route('veredacode/v1', '/rutas', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'veredacode_rest_get_rutas',
    ]);

    register_rest_route('veredacode/v1', '/rutas/(?P<slug>[a-zA-Z0-9_-]+)', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'veredacode_rest_get_ruta_by_slug',
    ]);
});

/**
 * Formatea un módulo en estructura JSON compacta.
 */
function veredacode_format_modulo(WP_Post $post): array {
    return [
        'id'              => $post->ID,
        'slug'            => $post->post_name,
        'titulo'          => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
        'orden'           => (int) get_post_meta($post->ID, '_vc_orden', true) ?: 1,
        'duracionMin'     => (int) get_post_meta($post->ID, '_vc_duracion_min', true) ?: 20,
        'resumen'         => (string) get_post_meta($post->ID, '_vc_resumen', true) ?: wp_strip_all_tags($post->post_excerpt),
        'objetivo'        => (string) get_post_meta($post->ID, '_vc_objetivo', true),
        'contenidoHtml'   => apply_filters('the_content', $post->post_content),
        'codigoEjemplo'   => (string) get_post_meta($post->ID, '_vc_codigo_ejemplo', true),
        'lenguajeCodigo'  => (string) get_post_meta($post->ID, '_vc_lenguaje_codigo', true) ?: 'text',
        'tipoLaboratorio' => (string) get_post_meta($post->ID, '_vc_tipo_laboratorio', true) ?: 'none',
        'ejercicioPapel'  => (string) get_post_meta($post->ID, '_vc_ejercicio_papel', true),
        'repoUrl'         => (string) get_post_meta($post->ID, '_vc_repo_url', true),
    ];
}

/**
 * Formatea una ruta educativa con sus módulos ordenados.
 */
function veredacode_format_curso(WP_Post $post): array {
    $modulos_posts = get_posts([
        'post_type'      => 'vc_modulo',
        'post_status'    => 'publish',
        'posts_per_page' => 50,
        'meta_key'       => '_vc_curso_slug',
        'meta_value'     => $post->post_name,
    ]);

    $modulos = array_map('veredacode_format_modulo', $modulos_posts);
    usort($modulos, function ($a, $b) {
        return $a['orden'] <=> $b['orden'];
    });

    $objetivos_raw = (string) get_post_meta($post->ID, '_vc_objetivos', true);
    $objetivos = array_values(array_filter(array_map('trim', explode("\n", $objetivos_raw))));

    return [
        'id'           => $post->ID,
        'slug'         => $post->post_name,
        'rutaNumero'   => (int) get_post_meta($post->ID, '_vc_ruta_numero', true) ?: 1,
        'titulo'       => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
        'descripcion'  => wp_strip_all_tags($post->post_excerpt ?: $post->post_content),
        'nivel'        => (string) get_post_meta($post->ID, '_vc_nivel', true) ?: 'Inicial',
        'etiqueta'     => (string) get_post_meta($post->ID, '_vc_etiqueta', true) ?: 'Ruta educativa',
        'duracion'     => (string) get_post_meta($post->ID, '_vc_duracion', true) ?: '4 horas',
        'pesoKb'       => (int) get_post_meta($post->ID, '_vc_peso_kb', true) ?: 45,
        'requisitos'   => (string) get_post_meta($post->ID, '_vc_requisitos', true) ?: 'Ninguno',
        'tipoPractica' => (string) get_post_meta($post->ID, '_vc_tipo_practica', true) ?: 'texto',
        'repoUrl'      => (string) get_post_meta($post->ID, '_vc_repo_url', true),
        'objetivos'    => $objetivos,
        'modulos'      => $modulos,
    ];
}

function veredacode_rest_get_rutas(): WP_REST_Response {
    $cursos_posts = get_posts([
        'post_type'      => 'vc_curso',
        'post_status'    => 'publish',
        'posts_per_page' => 20,
    ]);

    $rutas = array_map('veredacode_format_curso', $cursos_posts);
    usort($rutas, function ($a, $b) {
        return $a['rutaNumero'] <=> $b['rutaNumero'];
    });

    $response = rest_ensure_response([
        'source'    => 'wordpress-headless',
        'count'     => count($rutas),
        'rutas'     => $rutas,
        'updatedAt' => gmdate('c'),
    ]);
    $response->header('Cache-Control', 'public, max-age=120');

    return $response;
}

function veredacode_rest_get_ruta_by_slug(WP_REST_Request $request) {
    $slug = sanitize_title($request->get_param('slug'));
    $posts = get_posts([
        'name'           => $slug,
        'post_type'      => 'vc_curso',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
    ]);

    if (empty($posts)) {
        return new WP_Error('veredacode_not_found', 'Ruta educativa no encontrada.', ['status' => 404]);
    }

    $response = rest_ensure_response([
        'source' => 'wordpress-headless',
        'ruta'   => veredacode_format_curso($posts[0]),
    ]);
    $response->header('Cache-Control', 'public, max-age=120');

    return $response;
}

/**
 * 4. Metaboxes sencillos en wp-admin para docentes y administradores de contenido
 */
add_action('add_meta_boxes', function () {
    add_meta_box(
        'vc_curso_meta_box',
        'Detalles de la Ruta VeredaCode',
        'veredacode_render_curso_metabox',
        'vc_curso',
        'normal',
        'high'
    );

    add_meta_box(
        'vc_modulo_meta_box',
        'Configuración del Módulo y Laboratorio',
        'veredacode_render_modulo_metabox',
        'vc_modulo',
        'normal',
        'high'
    );
});

function veredacode_render_curso_metabox(WP_Post $post): void {
    wp_nonce_field('vc_save_meta', 'vc_meta_nonce');
    $fields = [
        '_vc_ruta_numero'   => ['Número de ruta (1, 2, 3...)', 'number'],
        '_vc_nivel'         => ['Nivel (Ej: Inicial, Piloto Intermedio, Práctico)', 'text'],
        '_vc_etiqueta'      => ['Etiqueta destacada (Ej: Curso Piloto)', 'text'],
        '_vc_duracion'      => ['Duración estimada (Ej: 4 horas)', 'text'],
        '_vc_peso_kb'       => ['Peso estimado en KB (bajo consumo)', 'number'],
        '_vc_requisitos'    => ['Requisitos previos', 'text'],
        '_vc_tipo_practica' => ['Tipo de práctica (bloques | web-sandbox | python-rural)', 'text'],
        '_vc_repo_url'      => ['URL de repositorio de código (opcional)', 'url'],
    ];

    echo '<table class="form-table">';
    foreach ($fields as $key => [$label, $type]) {
        $val = get_post_meta($post->ID, $key, true);
        echo '<tr><th><label for="' . esc_attr($key) . '">' . esc_html($label) . '</label></th>';
        echo '<td><input type="' . esc_attr($type) . '" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($val) . '" class="regular-text" /></td></tr>';
    }
    $objetivos = get_post_meta($post->ID, '_vc_objetivos', true);
    echo '<tr><th><label for="_vc_objetivos">Objetivos (uno por línea)</label></th>';
    echo '<td><textarea id="_vc_objetivos" name="_vc_objetivos" rows="4" class="large-text">' . esc_textarea($objetivos) . '</textarea></td></tr>';
    echo '</table>';
}

function veredacode_render_modulo_metabox(WP_Post $post): void {
    wp_nonce_field('vc_save_meta', 'vc_meta_nonce');
    $fields = [
        '_vc_curso_slug'       => ['Slug de la Ruta padre', 'text'],
        '_vc_orden'            => ['Orden del módulo (1, 2, 3...)', 'number'],
        '_vc_duracion_min'     => ['Duración en minutos', 'number'],
        '_vc_resumen'          => ['Resumen corto', 'text'],
        '_vc_objetivo'         => ['Objetivo de aprendizaje', 'text'],
        '_vc_lenguaje_codigo'  => ['Lenguaje de código (html | css | javascript | python | text)', 'text'],
        '_vc_tipo_laboratorio' => ['Tipo de laboratorio (bloques | web-sandbox | python-cosecha | python-inventario | none)', 'text'],
        '_vc_repo_url'         => ['URL del repositorio de práctica (opcional)', 'url'],
    ];

    echo '<table class="form-table">';
    foreach ($fields as $key => [$label, $type]) {
        $val = get_post_meta($post->ID, $key, true);
        echo '<tr><th><label for="' . esc_attr($key) . '">' . esc_html($label) . '</label></th>';
        echo '<td><input type="' . esc_attr($type) . '" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($val) . '" class="regular-text" /></td></tr>';
    }
    $codigo = get_post_meta($post->ID, '_vc_codigo_ejemplo', true);
    echo '<tr><th><label for="_vc_codigo_ejemplo">Código de ejemplo</label></th>';
    echo '<td><textarea id="_vc_codigo_ejemplo" name="_vc_codigo_ejemplo" rows="6" class="large-text code">' . esc_textarea($codigo) . '</textarea></td></tr>';

    $papel = get_post_meta($post->ID, '_vc_ejercicio_papel', true);
    echo '<tr><th><label for="_vc_ejercicio_papel">Actividad práctica sin conexión / en papel</label></th>';
    echo '<td><textarea id="_vc_ejercicio_papel" name="_vc_ejercicio_papel" rows="3" class="large-text">' . esc_textarea($papel) . '</textarea></td></tr>';
    echo '</table>';
}

add_action('save_post', function (int $post_id) {
    if (!isset($_POST['vc_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['vc_meta_nonce'])), 'vc_save_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $text_keys = [
        '_vc_nivel', '_vc_etiqueta', '_vc_duracion', '_vc_requisitos', '_vc_tipo_practica',
        '_vc_curso_slug', '_vc_resumen', '_vc_objetivo', '_vc_lenguaje_codigo', '_vc_tipo_laboratorio',
    ];
    foreach ($text_keys as $key) {
        if (isset($_POST[$key])) {
            update_post_meta($post_id, $key, sanitize_text_field(wp_unslash($_POST[$key])));
        }
    }

    $int_keys = ['_vc_ruta_numero', '_vc_peso_kb', '_vc_orden', '_vc_duracion_min'];
    foreach ($int_keys as $key) {
        if (isset($_POST[$key])) {
            update_post_meta($post_id, $key, absint($_POST[$key]));
        }
    }

    if (isset($_POST['_vc_repo_url'])) {
        update_post_meta($post_id, '_vc_repo_url', esc_url_raw(wp_unslash($_POST['_vc_repo_url'])));
    }
    if (isset($_POST['_vc_objetivos'])) {
        update_post_meta($post_id, '_vc_objetivos', sanitize_textarea_field(wp_unslash($_POST['_vc_objetivos'])));
    }
    if (isset($_POST['_vc_ejercicio_papel'])) {
        update_post_meta($post_id, '_vc_ejercicio_papel', sanitize_textarea_field(wp_unslash($_POST['_vc_ejercicio_papel'])));
    }
    if (isset($_POST['_vc_codigo_ejemplo'])) {
        // Preservamos el código tal cual (espacios, HTML, etiquetas) pero eliminando slashes de WP
        update_post_meta($post_id, '_vc_codigo_ejemplo', wp_unslash($_POST['_vc_codigo_ejemplo']));
    }
});

/**
 * 5. Herramienta de inicialización en wp-admin (Herramientas -> VeredaCode Seed)
 * Permite poblar las 3 rutas base con un solo clic para pruebas y despliegue inicial.
 */
add_action('admin_menu', function () {
    add_management_page(
        'VeredaCode CMS',
        'VeredaCode CMS',
        'manage_options',
        'veredacode-seed',
        'veredacode_render_seed_page'
    );
});

function veredacode_render_seed_page(): void {
    $mensaje = '';
    if (isset($_POST['vc_run_seed']) && check_admin_referer('vc_seed_action')) {
        $creados = veredacode_seed_default_curriculum();
        $mensaje = sprintf('Proceso completado. Se crearon %d elementos nuevos en WordPress.', $creados);
    }
    ?>
    <div class="wrap">
        <h1>VeredaCode — Headless CMS (ODS 4)</h1>
        <p>Desde aquí puedes cargar el catálogo inicial de las <strong>3 rutas progresivas de VeredaCode</strong> directamente en la base de datos MySQL para exponerlas por <code>/wp-json/veredacode/v1/rutas</code>.</p>
        <?php if ($mensaje) : ?>
            <div class="notice notice-success"><p><?php echo esc_html($mensaje); ?></p></div>
        <?php endif; ?>
        <form method="post">
            <?php wp_nonce_field('vc_seed_action'); ?>
            <p><button type="submit" name="vc_run_seed" class="button button-primary">Cargar las 3 Rutas Iniciales de VeredaCode</button></p>
        </form>
        <hr />
        <h2>Endpoints REST activos</h2>
        <ul>
            <li><code>/wp-json/veredacode/v1/health</code> — Estado del CMS</li>
            <li><code>/wp-json/veredacode/v1/rutas</code> — Catálogo completo con módulos embebidos</li>
            <li><code>/wp-json/wp/v2/cursos</code> — API nativa de rutas</li>
            <li><code>/wp-json/wp/v2/modulos</code> — API nativa de módulos</li>
        </ul>
    </div>
    <?php
}

function veredacode_seed_default_curriculum(): int {
    $creados = 0;

    $rutas = [
        [
            'slug'         => 'alfabetizacion-digital-pensamiento-computacional',
            'titulo'       => 'Alfabetización digital y pensamiento computacional',
            'descripcion'  => 'Puerta de entrada práctica para estudiantes sin experiencia previa y docentes: dominio del computador y el celular, seguridad digital, lógica y algoritmos en papel y por bloques.',
            'ruta_numero'  => 1,
            'nivel'        => 'Ruta 1 · Inicial',
            'etiqueta'     => 'Puerta de entrada',
            'duracion'     => '3 horas',
            'peso_kb'      => 38,
            'requisitos'   => 'Ninguno. Ideal para estudiantes desde cero y docentes.',
            'tipo_practica'=> 'bloques',
            'objetivos'    => "Manejar archivos, teclado y herramientas básicas en celular y computador\nNavegar con seguridad evitando engaños y protegiendo contraseñas\nResolver problemas paso a paso con algoritmos en papel y por bloques",
            'modulos'      => [
                [
                    'slug'        => 'computador-y-celular-para-estudiar',
                    'titulo'      => 'El computador y el celular como herramientas de estudio',
                    'orden'       => 1,
                    'duracion'    => 25,
                    'resumen'     => 'Organización de carpetas, atajos esenciales de teclado y uso eficiente sin gastar datos móviles.',
                    'objetivo'    => 'Organizar proyectos escolares localmente y navegar la plataforma usando solo teclado.',
                    'contenido'   => '<p>No necesitas un equipo costoso para empezar en tecnología. Tanto un computador escolar como un teléfono básico permiten aprender programación si sabes organizar tus archivos y aprovechar el modo sin conexión.</p><ul><li><strong>Atajos clave:</strong> <code>Tab</code> para moverte entre botones, <code>Enter</code> para activar, <code>Ctrl + C</code> y <code>Ctrl + V</code> para copiar y pegar.</li><li><strong>Carpetas claras:</strong> Usa nombres sin espacios ni tildes (por ejemplo, <code>mi_proyecto_web</code>) para evitar errores al programar.</li></ul>',
                    'lenguaje'    => 'text',
                    'codigo'      => "veredacode-practicas/\n├── ruta-1-logica/\n│   └── receta-algoritmo.txt\n├── ruta-2-mi-web/\n│   └── index.html\n└── ruta-3-python/\n    └── costos_cosecha.py",
                    'lab'         => 'none',
                    'papel'       => 'En tu cuaderno, dibuja el árbol de carpetas para guardar tus tareas de este mes y anota 5 atajos de teclado que puedas practicar hoy.',
                ],
                [
                    'slug'        => 'uso-seguro-de-internet',
                    'titulo'      => 'Uso seguro de internet y ciudadanía digital',
                    'orden'       => 2,
                    'duracion'    => 25,
                    'resumen'     => 'Cómo crear contraseñas fuertes, identificar enlaces falsos (phishing) y verificar información.',
                    'objetivo'    => 'Aplicar reglas prácticas de seguridad digital en celulares compartidos y redes comunitarias.',
                    'contenido'   => '<p>En colegios y centros comunitarios es común compartir computadores o redes Wi-Fi. Proteger tu identidad digital es tan importante como saber programar.</p><ul><li><strong>Frases clave:</strong> Mejor una frase fácil de recordar como <code>CafeVerde#Vereda2026</code> que una fecha de nacimiento.</li><li><strong>Verifica enlaces:</strong> Antes de ingresar datos, revisa que la dirección sea oficial y nunca compartas códigos recibidos por SMS.</li></ul>',
                    'lenguaje'    => 'text',
                    'codigo'      => "Lista de chequeo de seguridad:\n[x] Cerrar sesión en equipos compartidos\n[x] Usar frases de 12+ caracteres\n[x] Desconfiar de premios urgentes por WhatsApp\n[x] Verificar fuentes antes de reenviar noticias",
                    'lab'         => 'none',
                    'papel'       => 'Crea un método propio (sin anotar tu clave real) para construir contraseñas seguras usando una frase de tu región, un número y un símbolo.',
                ],
                [
                    'slug'        => 'logica-y-algoritmos-por-bloques',
                    'titulo'      => 'Lógica y algoritmos: en papel y por bloques',
                    'orden'       => 3,
                    'duracion'    => 35,
                    'resumen'     => 'Descomposición de problemas en pasos precisos con ejercicios desconectados y simulador por bloques.',
                    'objetivo'    => 'Diseñar y depurar una secuencia de instrucciones lógica paso a paso.',
                    'contenido'   => '<p>Un <strong>algoritmo</strong> es una secuencia finita y ordenada de pasos sin ambigüedades para resolver un problema. Antes de escribir código en un lenguaje formal, entrenamos el pensamiento lógico.</p><p>Prueba el laboratorio de bloques incluido en esta lección: programa al robot recolector para llegar hasta la semilla esquivando los obstáculos de la parcela.</p>',
                    'lenguaje'    => 'text',
                    'codigo'      => "INICIO\n  1. Avanzar 2 casillas\n  2. Girar a la derecha\n  3. Avanzar 2 casillas\n  4. Recoger semilla\nFIN",
                    'lab'         => 'bloques',
                    'papel'       => 'Escribe en papel las instrucciones exactas para preparar un café o llegar de tu casa a la escuela. Pídele a un compañero que las siga al pie de la letra para detectar pasos faltantes.',
                ],
            ],
        ],
        [
            'slug'         => 'desarrollo-web-desde-cero',
            'titulo'       => 'Desarrollo web desde cero (HTML, CSS y JavaScript)',
            'descripcion'  => 'Curso inicial del piloto VeredaCode. Practica directo en el navegador sin instalar programas y construye tu propia página web accesible y liviana.',
            'ruta_numero'  => 2,
            'nivel'        => 'Ruta 2 · Piloto Inicial',
            'etiqueta'     => 'Recomendada para iniciar el piloto',
            'duracion'     => '5 horas',
            'peso_kb'      => 52,
            'requisitos'   => 'Manejo básico de navegador y teclado (Ruta 1 recomendada).',
            'tipo_practica'=> 'web-sandbox',
            'objetivos'    => "Estructurar páginas web con HTML semántico y accesible (WCAG)\nDiseñar estilos modernos y modo oscuro adaptable con CSS\nAgregar interactividad básica con JavaScript y descargar tu propia página web",
            'modulos'      => [
                [
                    'slug'        => 'html-semantico-y-accesible',
                    'titulo'      => 'Estructura web con HTML semántico y accesible',
                    'orden'       => 1,
                    'duracion'    => 35,
                    'resumen'     => 'Etiquetas esenciales (header, main, section, h1-h3, enlaces) para construir sitios claros y livianos.',
                    'objetivo'    => 'Crear la estructura base de una página informativa respetando la jerarquía de encabezados.',
                    'contenido'   => '<p><strong>HTML</strong> es el esqueleto de toda página web. Usar etiquetas semánticas (<code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>) hace que tu página cargue rápido y pueda ser leída por lectores de pantalla.</p><p>Edita el código en el laboratorio interactivo y observa el resultado en tiempo real sin consumir datos adicionales.</p>',
                    'lenguaje'    => 'html',
                    'codigo'      => "<header>\n  <h1>Huerta Escolar La Esperanza</h1>\n  <p>Productos frescos cultivados por estudiantes.</p>\n</header>\n<main>\n  <section>\n    <h2>Cosecha de la semana</h2>\n    <ul>\n      <li>Lechuga orgánica</li>\n      <li>Cilantro fresco</li>\n      <li>Tomate chonto</li>\n    </ul>\n  </section>\n</main>",
                    'lab'         => 'web-sandbox',
                    'papel'       => 'Dibuja en una hoja el boceto de una página para un emprendimiento o proyecto de tu vereda, señalando dónde irían el encabezado, el contenido principal y el pie de página.',
                ],
                [
                    'slug'        => 'css-modo-oscuro-y-diseno-adaptable',
                    'titulo'      => 'Diseño visual con CSS, contraste y modo oscuro',
                    'orden'       => 2,
                    'duracion'    => 40,
                    'resumen'     => 'Colores accesibles, tipografía legible y cajas flexibles (Flexbox) que se adaptan a celulares.',
                    'objetivo'    => 'Aplicar una paleta oscura de alto contraste y tarjetas ordenadas con Flexbox.',
                    'contenido'   => '<p>Con <strong>CSS</strong> controlamos la apariencia sin depender de imágenes pesadas. Un buen contraste entre fondo y texto cuida la vista y cumple las pautas <strong>WCAG</strong>.</p>',
                    'lenguaje'    => 'css',
                    'codigo'      => "body {\n  background: #0f1720;\n  color: #f4f1ea;\n  font-family: system-ui, sans-serif;\n  padding: 1.25rem;\n}\n.tarjeta {\n  background: #1a2430;\n  border: 1px solid #2e4054;\n  border-left: 4px solid #e59a3c;\n  border-radius: 10px;\n  padding: 1rem;\n}",
                    'lab'         => 'web-sandbox',
                    'papel'       => 'Elige una combinación de 3 colores (fondo, texto y acento) e identifica por qué facilita la lectura bajo poca luz o en pantallas pequeñas.',
                ],
                [
                    'slug'        => 'javascript-basico-tu-pagina-propia',
                    'titulo'      => 'Interactividad con JavaScript y tu propia página web',
                    'orden'       => 3,
                    'duracion'    => 45,
                    'resumen'     => 'Eventos de botón, actualización del DOM y descarga de tu proyecto HTML terminado.',
                    'objetivo'    => 'Dar vida a un botón interactivo y exportar tu propia página web lista para compartir.',
                    'contenido'   => '<p><strong>JavaScript</strong> permite responder a las acciones del usuario directamente en el navegador, exactamente como funciona VeredaCode. Al terminar, pulsa <strong>Descargar mi página (.html)</strong> en el laboratorio para guardar tu creación.</p>',
                    'lenguaje'    => 'javascript',
                    'codigo'      => "const boton = document.getElementById('btn-saludo');\nconst salida = document.getElementById('mensaje');\nlet visitas = 0;\n\nboton.addEventListener('click', () => {\n  visitas += 1;\n  salida.textContent = `¡Gracias por apoyar nuestro proyecto! Clics: \${visitas}`;\n});",
                    'lab'         => 'web-sandbox',
                    'papel'       => 'Anota 3 acciones interactivas que harían más útil tu página web comunitaria (por ejemplo: calcular pedidos, mostrar horarios o filtrar productos).',
                ],
            ],
        ],
        [
            'slug'         => 'introduccion-programacion-python',
            'titulo'       => 'Introducción a la programación con Python',
            'descripcion'  => 'Variables, condicionales, ciclos y proyectos útiles para tu entorno: calcula costos de una cosecha y construye un inventario rural con repositorios de código.',
            'ruta_numero'  => 3,
            'nivel'        => 'Ruta 3 · Práctico',
            'etiqueta'     => 'Proyectos reales y repositorios',
            'duracion'     => '6 horas',
            'peso_kb'      => 58,
            'requisitos'   => 'Haber completado la Ruta 1 o conocer lógica básica de programación.',
            'tipo_practica'=> 'python-rural',
            'objetivos'    => "Dominar variables, operaciones aritméticas y entrada/salida en Python\nTomar decisiones automáticas con condicionales (if / elif / else)\nAutomatizar inventarios con listas, ciclos for y organizar repositorios de código",
            'modulos'      => [
                [
                    'slug'        => 'variables-y-costos-de-cosecha',
                    'titulo'      => 'Variables y cálculo de costos de una cosecha',
                    'orden'       => 1,
                    'duracion'    => 40,
                    'resumen'     => 'Modela insumos, jornales, kilos recolectados y ganancia neta usando variables en Python.',
                    'objetivo'    => 'Escribir un script en Python que calcule el costo total, ingreso y utilidad de una cosecha.',
                    'contenido'   => '<p>En <strong>Python</strong>, las variables guardan información con nombres claros. Podemos modelar el presupuesto real de una cosecha de café, papa o plátano para saber si el precio de venta cubre los gastos.</p><p>Prueba el simulador paso a paso en esta lección modificando kilos, precio e insumos.</p>',
                    'lenguaje'    => 'python',
                    'codigo'      => "# Calculadora de costos de cosecha - VeredaCode\ncultivo = \"Café pergamino\"\nkilos_cosechados = 180\nprecio_por_kilo = 14500\ncosto_insumos = 620000\ncosto_jornales = 950000\n\ningreso_total = kilos_cosechados * precio_por_kilo\ncosto_total = costo_insumos + costo_jornales\nganancia = ingreso_total - costo_total\n\nprint(f\"Cultivo: {cultivo}\")\nprint(f\"Costo total: \${costo_total:,}\")\nprint(f\"Ganancia neta: \${ganancia:,}\")",
                    'lab'         => 'python-cosecha',
                    'papel'       => 'Anota los costos reales de un producto de tu vereda (semillas, abono, transporte y jornales) y calcula manualmente cuánto debes vender para recuperar la inversión.',
                ],
                [
                    'slug'        => 'condicionales-y-alertas-de-decision',
                    'titulo'      => 'Condicionales (if/else) para tomar decisiones',
                    'orden'       => 2,
                    'duracion'    => 40,
                    'resumen'     => 'Evalúa rentabilidad y genera alertas automáticas cuando un producto tiene bajo stock.',
                    'objetivo'    => 'Utilizar estructuras if, elif y else para clasificar resultados y emitir alertas útiles.',
                    'contenido'   => '<p>Los <strong>condicionales</strong> permiten que un programa tome decisiones según los datos reales: por ejemplo, advertir si una cosecha está en pérdida o si un insumo de la tienda veredal necesita reposición.</p>',
                    'lenguaje'    => 'python',
                    'codigo'      => "margen_porcentaje = (ganancia / ingreso_total) * 100\n\nif ganancia < 0:\n    estado = \"ALERTA: Pérdida económica\"\nelif margen_porcentaje < 20:\n    estado = \"PRECAUCIÓN: Margen ajustado\"\nelse:\n    estado = \"SALUDABLE: Cosecha rentable\"\n\nprint(f\"Margen: {margen_porcentaje:.1f}% -> {estado}\")",
                    'lab'         => 'python-cosecha',
                    'papel'       => 'Escribe en pseudocódigo 3 reglas de decisión para una tienda comunitaria (por ejemplo: cuándo pedir más arroz o cuándo aplicar descuento por compra mayorista).',
                ],
                [
                    'slug'        => 'ciclos-inventario-rural-y-repositorios',
                    'titulo'      => 'Ciclos, listas e inventario rural (con repositorio)',
                    'orden'       => 3,
                    'duracion'    => 50,
                    'resumen'     => 'Recorre una lista de productos con ciclos for, calcula valor total y prepara tu código para GitHub.',
                    'objetivo'    => 'Automatizar el conteo de un inventario local y descargar el proyecto estructurado en Python.',
                    'contenido'   => '<p>Cuando tienes muchos productos, repetir código a mano no escala. Con <strong>listas</strong>, <strong>diccionarios</strong> y ciclos <code>for</code>, Python recorre todo un inventario en milisegundos.</p>',
                    'lenguaje'    => 'python',
                    'codigo'      => "inventario = [\n    {\"producto\": \"Bulto de abono\", \"cantidad\": 4, \"minimo\": 5, \"precio\": 125000},\n    {\"producto\": \"Semilla maíz (kg)\", \"cantidad\": 18, \"minimo\": 10, \"precio\": 12000},\n    {\"producto\": \"Cajas empaque\", \"cantidad\": 9, \"minimo\": 15, \"precio\": 4500},\n]\n\nvalor_total = 0\nfor item in inventario:\n    subtotal = item[\"cantidad\"] * item[\"precio\"]\n    valor_total += subtotal\n    alerta = \" [REPONER]\" if item[\"cantidad\"] < item[\"minimo\"] else \"\"\n    print(f\"{item['producto']}: {item['cantidad']} uds -> \${subtotal:,}{alerta}\")\n\nprint(f\"Valor total inventario: \${valor_total:,}\")",
                    'lab'         => 'python-inventario',
                    'papel'       => 'Haz una lista de 5 artículos de tu hogar, finca o tienda escolar con cantidad actual y cantidad mínima deseada para probarlos en el simulador de inventario.',
                ],
            ],
        ],
    ];

    foreach ($rutas as $ruta) {
        $existing = get_page_by_path($ruta['slug'], OBJECT, 'vc_curso');
        if (!$existing) {
            $curso_id = wp_insert_post([
                'post_type'    => 'vc_curso',
                'post_status'  => 'publish',
                'post_name'    => $ruta['slug'],
                'post_title'   => $ruta['titulo'],
                'post_excerpt' => $ruta['descripcion'],
                'post_content' => $ruta['descripcion'],
            ]);

            if ($curso_id && !is_wp_error($curso_id)) {
                update_post_meta($curso_id, '_vc_ruta_numero', $ruta['ruta_numero']);
                update_post_meta($curso_id, '_vc_nivel', $ruta['nivel']);
                update_post_meta($curso_id, '_vc_etiqueta', $ruta['etiqueta']);
                update_post_meta($curso_id, '_vc_duracion', $ruta['duracion']);
                update_post_meta($curso_id, '_vc_peso_kb', $ruta['peso_kb']);
                update_post_meta($curso_id, '_vc_requisitos', $ruta['requisitos']);
                update_post_meta($curso_id, '_vc_tipo_practica', $ruta['tipo_practica']);
                update_post_meta($curso_id, '_vc_objetivos', $ruta['objetivos']);
                $creados++;
            }
        }

        foreach ($ruta['modulos'] as $mod) {
            $existing_mod = get_page_by_path($mod['slug'], OBJECT, 'vc_modulo');
            if (!$existing_mod) {
                $mod_id = wp_insert_post([
                    'post_type'    => 'vc_modulo',
                    'post_status'  => 'publish',
                    'post_name'    => $mod['slug'],
                    'post_title'   => $mod['titulo'],
                    'post_excerpt' => $mod['resumen'],
                    'post_content' => $mod['contenido'],
                ]);

                if ($mod_id && !is_wp_error($mod_id)) {
                    update_post_meta($mod_id, '_vc_curso_slug', $ruta['slug']);
                    update_post_meta($mod_id, '_vc_orden', $mod['orden']);
                    update_post_meta($mod_id, '_vc_duracion_min', $mod['duracion']);
                    update_post_meta($mod_id, '_vc_resumen', $mod['resumen']);
                    update_post_meta($mod_id, '_vc_objetivo', $mod['objetivo']);
                    update_post_meta($mod_id, '_vc_lenguaje_codigo', $mod['lenguaje']);
                    update_post_meta($mod_id, '_vc_codigo_ejemplo', $mod['codigo']);
                    update_post_meta($mod_id, '_vc_tipo_laboratorio', $mod['lab']);
                    update_post_meta($mod_id, '_vc_ejercicio_papel', $mod['papel']);
                    $creados++;
                }
            }
        }
    }

    return $creados;
}
