import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://mozvgbodcknmmmbvplft.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_QUpdX5VFX6VusQTN-MgjTQ_F2XhxKFs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// CONTROLADOR CENTRAL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    cargarConfiguracionGlobal(); // Se ejecuta en todas las páginas (Navbar/Footer)
    lucide.createIcons();

    // Detección inteligente de la página actual
    if (document.getElementById("noticiasGrid")) cargarNoticias();
    if (document.getElementById("proyectosGrid")) cargarProyectos();
    if (document.getElementById("docentesGrid")) cargarDocentes();
    
    // Efecto de Navbar en scroll
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) window.scrollY > 50 ? nav.classList.add('shadow-md', 'bg-white/95') : nav.classList.remove('shadow-md', 'bg-white/95');
    });
});

// ==========================================
// SECCIÓN: CONFIGURACIÓN GLOBAL (Header y Footer)
// ==========================================
async function cargarConfiguracionGlobal() {
    const { data } = await supabase.from("configuracion").select("*").limit(1).single();
    if (data) {
        const heroBg = document.getElementById('heroBackground');
        if(heroBg && data.banner_url) heroBg.style.backgroundImage = `url('${data.banner_url}')`;
        
        const identidad = document.getElementById('identidadGrid');
        if (identidad) {
            identidad.innerHTML = `
                <div class="bg-gray-50 rounded-3xl p-10 border border-gray-100 hover:shadow-xl transition duration-300">
                    <div class="w-12 h-12 bg-sanmarcos-red rounded-full flex items-center justify-center text-white mb-6"><i data-lucide="target"></i></div>
                    <h4 class="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h4>
                    <p class="text-gray-600 leading-relaxed">${data.mision}</p>
                </div>
                <div class="bg-gray-50 rounded-3xl p-10 border border-gray-100 hover:shadow-xl transition duration-300">
                    <div class="w-12 h-12 bg-sanmarcos-gold rounded-full flex items-center justify-center text-white mb-6"><i data-lucide="eye"></i></div>
                    <h4 class="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h4>
                    <p class="text-gray-600 leading-relaxed">${data.vision}</p>
                </div>`;
        }

        if(document.getElementById('txtTelefono')) document.getElementById('txtTelefono').innerText = data.telefono || '-';
        if(document.getElementById('txtCorreo')) document.getElementById('txtCorreo').innerText = data.correo || '-';
        if(document.getElementById('linkFb') && data.facebook_url) document.getElementById('linkFb').href = data.facebook_url;
        if(document.getElementById('linkIg') && data.instagram_url) document.getElementById('linkIg').href = data.instagram_url;
        
        lucide.createIcons();
    }
}

// ==========================================
// SECCIÓN: NOTICIAS
// ==========================================
async function cargarNoticias() {
    const { data } = await supabase.from("noticias").select("*").order("fecha_publicacion", { ascending: false });
    const grid = document.getElementById("noticiasGrid");
    if (!data || data.length === 0) return grid.innerHTML = '<p class="text-gray-500 text-center col-span-3">No hay noticias publicadas.</p>';
    
    grid.innerHTML = "";
    data.forEach(n => {
        grid.innerHTML += `
            <article class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col h-full cursor-pointer hover:-translate-y-2">
                <div class="h-56 overflow-hidden relative">
                    <div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sanmarcos-red shadow-sm">${n.categoria}</div>
                    <img src="${n.imagen1_url || 'https://via.placeholder.com/600'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                </div>
                <div class="p-8 flex flex-col flex-1">
                    <div class="flex items-center text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider"><i data-lucide="calendar" class="w-4 h-4 mr-2"></i> ${n.fecha_publicacion}</div>
                    <h4 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-sanmarcos-red transition">${n.titulo}</h4>
                    <p class="text-gray-600 line-clamp-3 text-sm flex-1 leading-relaxed">${n.contenido}</p>
                </div>
            </article>`;
    });
    lucide.createIcons();
}

// ==========================================
// SECCIÓN: PROYECTOS
// ==========================================
async function cargarProyectos() {

    const grid = document.getElementById("proyectosGrid");

    if (!grid) return;

    try {

        const { data, error } = await supabase
            .from("proyectos")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {

            grid.innerHTML = `
                <p class="text-gray-500 text-center col-span-3">
                    No hay proyectos registrados.
                </p>
            `;

            return;
        }

        grid.innerHTML = "";

        data.forEach(p => {

            let botonesAccion = "";

            // ==========================================
            // DOCUMENTO PDF
            // ==========================================

            if (p.documento_url) {

                botonesAccion += `
                    <a
                        href="${p.documento_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    >
                        <i data-lucide="file-text" class="w-4 h-4 mr-2"></i>
                        Documento PDF
                    </a>
                `;

            }

            // ==========================================
            // ENLACE EXTERNO
            // ==========================================

            if (p.enlace_externo) {

                botonesAccion += `
                    <a
                        href="${p.enlace_externo}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition border border-white/20"
                    >
                        <i data-lucide="external-link" class="w-4 h-4 mr-2"></i>
                        Ver Más
                    </a>
                `;

            }

            // ==========================================
            // TARJETA DEL PROYECTO
            // ==========================================

            grid.innerHTML += `
                <div class="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:border-gray-600 transition duration-300 group">

                    <div class="h-48 overflow-hidden relative">

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>

                        <img
                            src="${p.imagen_url || 'https://via.placeholder.com/600'}"
                            class="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-70"
                            alt="${p.titulo || 'Proyecto académico'}"
                        >

                        <div class="absolute bottom-4 left-4 z-20">
                            <span class="bg-sanmarcos-gold text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                                ${p.escuela || ""}
                            </span>
                        </div>

                    </div>

                    <div class="p-6 flex flex-col">

                        <h4 class="text-xl font-bold text-white mb-2 line-clamp-1">
                            ${p.titulo || ""}
                        </h4>

                        <p class="text-sm text-gray-400 mb-4 font-medium">
                            <i data-lucide="users" class="w-4 h-4 inline mr-1"></i>
                            ${p.autores || ""}
                        </p>

                        <p class="text-sm text-gray-400 line-clamp-2 mb-6 leading-relaxed flex-1">
                            ${p.descripcion || ""}
                        </p>

                        <div class="flex gap-3 flex-wrap">
                            ${botonesAccion}
                        </div>

                    </div>

                </div>
            `;

        });

        lucide.createIcons();

    } catch (error) {

        console.error("Error al cargar proyectos:", error);

        grid.innerHTML = `
            <p class="text-red-400 text-center col-span-3">
                No se pudieron cargar los proyectos. Inténtalo nuevamente.
            </p>
        `;

    }

}
// ==========================================
// SECCIÓN: DOCENTES
// ==========================================
async function cargarDocentes() {
    const { data } = await supabase.from("docentes").select("*").order("created_at", { ascending: false });
    const grid = document.getElementById("docentesGrid");
    if (!data || data.length === 0) return grid.innerHTML = '<p class="text-gray-500 text-center col-span-4">No hay docentes registrados.</p>';
    
    grid.innerHTML = "";
    data.forEach(d => {
        grid.innerHTML += `
            <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1">
                <div class="w-24 h-24 mx-auto rounded-full overflow-hidden mb-5 border-4 border-gray-50 shadow-inner group-hover:border-sanmarcos-red/20 transition">
                    <img src="${d.foto_url || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover">
                </div>
                <p class="text-xs font-bold text-sanmarcos-red uppercase tracking-widest mb-1">${d.grado_academico}</p>
                <h4 class="text-lg font-bold text-gray-900 mb-3">${d.nombre_completo}</h4>
                <div class="inline-block bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 mb-4 w-full"><p class="font-medium">${d.escuelas}</p></div>
            </div>`;
    });
    lucide.createIcons();
}