import os
import re
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'''<w:tcMar {nsdecls("w")}>
        <w:top w:w="{top}" w:type="dxa"/>
        <w:bottom w:w="{bottom}" w:type="dxa"/>
        <w:left w:w="{left}" w:type="dxa"/>
        <w:right w:w="{right}" w:type="dxa"/>
    </w:tcMar>''')
    tcPr.append(tcMar)

def create_word_report():
    doc = Document()

    # Configuración de márgenes estándar universitario (2.5 cm / 1 pulgada)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    NAVY = RGBColor(30, 58, 138)         # #1E3A8A
    BLUE = RGBColor(37, 99, 235)         # #2563EB
    DARK_GRAY = RGBColor(30, 41, 59)     # #1E293B
    MUTED_GRAY = RGBColor(100, 116, 139) # #64748B

    # Estilo Normal
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = DARK_GRAY
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # ==========================================
    # 1. PORTADA FORMAL ACADÉMICA
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(30)
    p_inst.paragraph_format.space_after = Pt(6)
    r = p_inst.add_run("FACULTAD DE INGENIERÍA Y CIENCIAS\nESCUELA DE INFORMÁTICA Y TELECOMUNICACIONES\n")
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = NAVY

    doc.add_paragraph().paragraph_format.space_after = Pt(25)

    p_main = doc.add_paragraph()
    p_main.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_main.paragraph_format.space_after = Pt(14)
    r_main = p_main.add_run("SISTEMA WEB DE GESTIÓN DE RESCATE, TRAZABILIDAD Y ADOPCIÓN ANIMAL")
    r_main.font.size = Pt(22)
    r_main.font.bold = True
    r_main.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(35)
    r_sub = p_sub.add_run("INFORME FINAL DE INGENIERÍA DE SOFTWARE\nMETODOLOGÍA DE APRENDIZAJE + SERVICIO (A+S)")
    r_sub.font.size = Pt(13)
    r_sub.font.bold = True
    r_sub.font.color.rgb = BLUE

    # Recuadro institucional en portada
    box = doc.add_table(rows=1, cols=1)
    box.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = box.cell(0, 0)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=200, bottom=200, left=300, right=300)

    cp = cell.paragraphs[0]
    cp.paragraph_format.space_after = Pt(4)
    cp.paragraph_format.line_spacing = 1.3
    
    runs_data = [
        ("Socio Comunitario: ", True), ("Fundación Amor de Cuatro Patas (Talca, Región del Maule)\n", False),
        ("Personalidad Jurídica: ", True), ("N° 284.912 • ", False),
        ("RUT Institucional: ", True), ("65.184.290-K\n", False),
        ("Usuarias Clave: ", True), ("Presidenta de la Fundación y Tesorera de la Fundación\n", False),
        ("Tipo de Proyecto: ", True), ("Proyecto Social A+S • Producto Mínimo Viable local (MVP 1.0)\n", False),
        ("Marco Normativo: ", True), ("Ley N° 21.020 (Tenencia Responsable de Mascotas), Código Penal y D.S. N° 1007", False)
    ]
    for text, is_bold in runs_data:
        r = cp.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(10.5)
        r.bold = is_bold
        if is_bold:
            r.font.color.rgb = NAVY

    doc.add_paragraph().paragraph_format.space_after = Pt(70)

    p_bot = doc.add_paragraph()
    p_bot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_bot = p_bot.add_run("Talca, Región del Maule, Chile\nSeptiembre 2026")
    r_bot.font.size = Pt(11)
    r_bot.font.color.rgb = MUTED_GRAY

    doc.add_page_break()

    # ==========================================
    # 2. ÍNDICE GENERAL (TABLA DE CONTENIDOS)
    # ==========================================
    p_idx_title = doc.add_paragraph()
    p_idx_title.paragraph_format.space_before = Pt(10)
    p_idx_title.paragraph_format.space_after = Pt(14)
    r_idx_title = p_idx_title.add_run("ÍNDICE GENERAL DE CONTENIDOS")
    r_idx_title.font.size = Pt(16)
    r_idx_title.font.bold = True
    r_idx_title.font.color.rgb = NAVY

    indice_items = [
        ("RESUMEN EJECUTIVO (ABSTRACT)", "Pág. 3"),
        ("INTRODUCCIÓN GENERAL DEL PROYECTO", "Pág. 4"),
        ("CAPÍTULO 1: MARCO CONTEXTUAL Y DIAGNÓSTICO SITUACIONAL", "Pág. 5"),
        ("   1.1 Contexto socio-ambiental y fauna urbana en el Maule", "Pág. 5"),
        ("   1.2 Marco jurídico vigente (Ley N° 21.020 y Código Penal)", "Pág. 6"),
        ("   1.3 Perfil institucional de la Fundación Amor de Cuatro Patas", "Pág. 7"),
        ("   1.4 Diagnóstico operacional inicial y análisis FODA", "Pág. 8"),
        ("CAPÍTULO 2: PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN A+S", "Pág. 9"),
        ("   2.1 Formulación de la problemática central (Árbol de causas y efectos)", "Pág. 9"),
        ("   2.2 Fundamentación pedagógica Aprendizaje + Servicio (A+S)", "Pág. 10"),
        ("   2.3 Beneficiarios directos e indirectos de la solución", "Pág. 11"),
        ("CAPÍTULO 3: OBJETIVOS Y ALCANCE DEL PROYECTO", "Pág. 12"),
        ("   3.1 Objetivo General y Objetivos Específicos", "Pág. 12"),
        ("   3.2 Alcance y delimitación técnica del Producto Mínimo Viable (MVP)", "Pág. 13"),
        ("CAPÍTULO 4: INGENIERÍA DE REQUERIMIENTOS DEL SOFTWARE", "Pág. 14"),
        ("   4.1 Matriz de Requerimientos Funcionales (RF-01 al RF-12 con MoSCoW)", "Pág. 14"),
        ("   4.2 Matriz de Requerimientos No Funcionales (RNF-01 al RNF-08)", "Pág. 16"),
        ("CAPÍTULO 5: DISEÑO ARQUITECTÓNICO Y MODELADO DE DATOS", "Pág. 17"),
        ("   5.1 Arquitectura Single Page Application (SPA) desacoplada", "Pág. 17"),
        ("   5.2 Modelo conceptual del ciclo de vida del rescate", "Pág. 18"),
        ("   5.3 Modelo relacional y diccionario de 10 entidades", "Pág. 19"),
        ("   5.4 Sistema de diseño UI/UX (Glassmorphism y hoja membretada)", "Pág. 20"),
        ("CAPÍTULO 6: IMPLEMENTACIÓN Y MÓDULOS DEL SISTEMA", "Pág. 21"),
        ("   6.1 Fichas integrales, trazabilidad y estados operacionales", "Pág. 21"),
        ("   6.2 Protocolo de Triage Clínico (Rojo, Amarillo, Verde) y examen ECOG", "Pág. 22"),
        ("   6.3 Red de hogares temporales y control de cupos", "Pág. 23"),
        ("   6.4 Cuestionario con algoritmo de Scoring (0-100 pts) y seguimiento", "Pág. 24"),
        ("   6.5 Gestión financiera y prorrateo automático de gastos", "Pág. 25"),
        ("   6.6 Borradores locales y generador de afiches Canvas", "Pág. 26"),
        ("   6.7 Visor documental con edición de texto en vivo y exportación PDF", "Pág. 27"),
        ("   6.8 Motor de respaldo JSON offline e informes ejecutivos", "Pág. 28"),
        ("CAPÍTULO 7: GESTIÓN DE CALIDAD Y PLAN DE PRUEBAS (QA)", "Pág. 29"),
        ("   7.1 Matriz de 12 casos de prueba de aceptación (CP-01 a CP-12)", "Pág. 29"),
        ("   7.2 Pruebas de usabilidad, rendimiento y compatibilidad cross-browser", "Pág. 31"),
        ("CAPÍTULO 8: TRANSFERENCIA TECNOLÓGICA Y VALIDACIÓN COMUNITARIA", "Pág. 32"),
        ("   8.1 Capacitación y manual de usuario ilustrado", "Pág. 32"),
        ("   8.2 Estado pendiente de la pauta del socio comunitario", "Pág. 33"),
        ("CAPÍTULO 9: CONCLUSIONES, LECCIONES APRENDIDAS Y TRABAJO FUTURO", "Pág. 34"),
        ("   9.1 Cumplimiento de objetivos y balance del proyecto A+S", "Pág. 34"),
        ("   9.2 Aprendizajes ético-profesionales de ingeniería", "Pág. 35"),
        ("   9.3 Hoja de ruta para versiones futuras (Roadmap Cloud 2.0)", "Pág. 36"),
        ("REFERENCIAS BIBLIOGRÁFICAS Y NORMATIVAS", "Pág. 37"),
        ("ANEXOS DOCUMENTALES E INSTRUMENTOS INSTITUCIONALES", "Pág. 38")
    ]

    # Índice temático sin paginación rígida: evita referencias obsoletas cuando el informe cambia.
    indice_items = [
        ("1. RESUMEN EJECUTIVO", ""),
        ("2. MARCO CONTEXTUAL Y DIAGNÓSTICO SITUACIONAL", ""),
        ("3. PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN A+S", ""),
        ("4. DEFINICIÓN DE OBJETIVOS Y ALCANCE", ""),
        ("5. INGENIERÍA DE REQUERIMIENTOS", ""),
        ("6. DISEÑO ARQUITECTÓNICO Y MODELADO DEL SISTEMA", ""),
        ("7. IMPLEMENTACIÓN DETALLADA DE MÓDULOS", ""),
        ("8. ASEGURAMIENTO DE CALIDAD Y PLAN DE PRUEBAS", ""),
        ("9. TRANSFERENCIA Y VALIDACIÓN COMUNITARIA", ""),
        ("10. CONCLUSIONES Y TRABAJO FUTURO", ""),
        ("11. REFERENCIAS", ""),
        ("12. ANEXOS", "")
    ]

    for item, page in indice_items:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_after = Pt(2)
        p_item.paragraph_format.line_spacing = 1.1
        
        is_main = item.startswith("CAPÍTULO") or item.startswith("RESUMEN") or item.startswith("INTRODUCCIÓN") or item.startswith("REFERENCIAS") or item.startswith("ANEXOS")
        
        r_item = p_item.add_run(item)
        r_item.font.name = 'Calibri'
        r_item.font.size = Pt(10 if not is_main else 10.5)
        r_item.bold = is_main
        if is_main:
            r_item.font.color.rgb = NAVY
        
        if page:
            dots_count = max(5, 75 - len(item))
            r_dots = p_item.add_run(" " + ". " * (dots_count // 2) + " ")
            r_dots.font.color.rgb = RGBColor(203, 213, 225)
            r_page = p_item.add_run(page)
            r_page.font.name = 'Calibri'
            r_page.font.size = Pt(10)
            r_page.bold = is_main
            r_page.font.color.rgb = BLUE if is_main else DARK_GRAY

    doc.add_page_break()

    # ==========================================
    # 3. INTRODUCCIÓN GENERAL FORMAL
    # ==========================================
    p_intro_title = doc.add_paragraph()
    p_intro_title.paragraph_format.space_before = Pt(10)
    p_intro_title.paragraph_format.space_after = Pt(10)
    r_intro_title = p_intro_title.add_run("INTRODUCCIÓN GENERAL DEL PROYECTO")
    r_intro_title.font.size = Pt(16)
    r_intro_title.font.bold = True
    r_intro_title.font.color.rgb = NAVY

    intro_texts = [
        "El avance acelerado de las tecnologías de la información y la ingeniería de software ha demostrado un potencial transformador sin precedentes en la resolución de problemas operacionales y estratégicos en organizaciones de la sociedad civil. En el contexto de las instituciones sin fines de lucro dedicadas al bienestar y rescate animal en Chile, la gestión de datos suele caracterizarse por una marcada precariedad técnica: registros manuales en libretas de campo, carnets sanitarios de cartulina susceptibles de extravío, desarticulación en cadenas de mensajes instantáneos y ausencia de mecanismos analíticos para el control de presupuestos.",
        "La promulgación de la Ley N° 21.020 sobre Tenencia Responsable de Mascotas y Animales de Compañía impuso en el país un estándar legal e institucional sumamente exigente: la obligación de identificar individualmente mediante microchip subcutáneo homologado, certificar intervenciones quirúrgicas de esterilización, mantener planes profilácticos de vacunación y resguardar la seguridad perimetral de los animales entregados en adopción. Sin embargo, para agrupaciones solidarias voluntarias como la Fundación Amor de Cuatro Patas de Talca, cumplir a cabalidad con estos requerimientos con recursos limitados representa una sobrecarga administrativa que con frecuencia desvía horas críticas de atención directa a los animales en riesgo.",
        "Bajo la metodología pedagógica de Aprendizaje + Servicio (A+S), este proyecto de ingeniería de software se articuló con un doble propósito indivisible: en primer lugar, brindar una solución tecnológica formal, rigurosa y sustentable a la Fundación; y en segundo lugar, desarrollar en el equipo de estudiantes competencias disciplinares de análisis de requerimientos con usuarias reales, arquitectura de software, aseguramiento de calidad (QA) y responsabilidad social universitaria.",
        "El presente informe da cuenta de las fases ejecutadas: diagnóstico, requerimientos, modelado, implementación local y pruebas técnicas. Incluye Triage Clínico, calificación de postulantes, flyers Canvas, borradores mediante plantillas locales y gestión documental. La conexión Supabase, la IA remota, el despliegue y la validación comunitaria firmada se mantienen explícitamente como trabajo pendiente."
    ]

    for paragraph_text in intro_texts:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.first_line_indent = Inches(0.3)
        r = p.add_run(paragraph_text)
        r.font.name = 'Calibri'
        r.font.size = Pt(11)

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # ==========================================
    # 4. PROCESAR EL RESTO DE CAPÍTULOS DESDE MARKDOWN
    # ==========================================
    md_path = os.path.join(os.path.dirname(__file__), 'Informe Final del Proyecto.md')
    if not os.path.exists(md_path):
        print("No se encontró Informe Final del Proyecto.md")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_table = False
    table_lines = []

    def flush_table():
        nonlocal in_table, table_lines
        if not table_lines:
            in_table = False
            return

        rows_data = []
        for tl in table_lines:
            clean = tl.strip()
            if clean.startswith('|') and clean.endswith('|'):
                clean = clean[1:-1]
            parts = [c.strip() for c in clean.split('|')]
            if all(set(c).issubset({'-', ':', ' '}) for c in parts):
                continue
            rows_data.append(parts)

        if rows_data:
            num_cols = max(len(r) for r in rows_data)
            table = doc.add_table(rows=len(rows_data), cols=num_cols)
            table.alignment = WD_TABLE_ALIGNMENT.CENTER

            for r_idx, row in enumerate(rows_data):
                for c_idx in range(num_cols):
                    cell_text = row[c_idx] if c_idx < len(row) else ""
                    cell = table.cell(r_idx, c_idx)
                    set_cell_margins(cell, top=120, bottom=120, left=150, right=150)
                    
                    clean_text = cell_text.replace('**', '').replace('*', '').replace('`', '')
                    
                    cell_p = cell.paragraphs[0]
                    cell_p.paragraph_format.space_after = Pt(2)
                    cell_p.paragraph_format.line_spacing = 1.05
                    
                    run = cell_p.add_run(clean_text)
                    run.font.name = 'Calibri'

                    if r_idx == 0:
                        set_cell_background(cell, "1E3A8A")
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
                        run.font.size = Pt(9.5)
                    else:
                        run.font.size = Pt(9.5)
                        if r_idx % 2 == 0:
                            set_cell_background(cell, "F8FAFC")
                        else:
                            set_cell_background(cell, "FFFFFF")

            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        in_table = False
        table_lines = []

    i = 0
    # Buscar inicio del Capítulo 1 (saltando portada y resumen que ya están o van a procesarse)
    while i < len(lines) and not lines[i].startswith('## 1. RESUMEN EJECUTIVO'):
        i += 1

    while i < len(lines):
        line = lines[i].rstrip()

        # Detección de tablas
        if line.strip().startswith('|'):
            in_table = True
            table_lines.append(line)
            i += 1
            continue
        elif in_table:
            flush_table()

        if line.strip() == '---':
            i += 1
            continue

        # Encabezados de Capítulo (## )
        if line.startswith('## '):
            heading_text = line[3:].strip()
            
            # Forzar salto de página antes de cada capítulo principal (a partir del Cap 1)
            if any(heading_text.startswith(f"{num}.") for num in range(2, 13)) or "CONCLUSIONES" in heading_text:
                doc.add_page_break()

            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(heading_text)
            run.font.name = 'Calibri'
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = NAVY
            i += 1
            continue

        # Subsecciones (### )
        if line.startswith('### '):
            heading_text = line[4:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(heading_text)
            run.font.name = 'Calibri'
            run.font.size = Pt(12)
            run.font.bold = True
            run.font.color.rgb = BLUE
            i += 1
            continue

        # Sub-subsecciones (#### )
        if line.startswith('#### '):
            heading_text = line[5:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.keep_with_next = True
            run = p.add_run(heading_text)
            run.font.name = 'Calibri'
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = DARK_GRAY
            i += 1
            continue

        # Diagramas / Bloques de código
        if line.startswith('```'):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                code_lines.append(lines[i].rstrip())
                i += 1
            i += 1

            box = doc.add_table(rows=1, cols=1)
            box.alignment = WD_TABLE_ALIGNMENT.CENTER
            c = box.cell(0, 0)
            set_cell_background(c, "F1F5F9")
            set_cell_margins(c, top=120, bottom=120, left=180, right=180)
            cp = c.paragraphs[0]
            cp.paragraph_format.space_after = Pt(0)
            crun = cp.add_run("\n".join(code_lines))
            crun.font.name = 'Consolas'
            crun.font.size = Pt(8.5)
            crun.font.color.rgb = DARK_GRAY
            doc.add_paragraph().paragraph_format.space_after = Pt(6)
            continue

        # Bloques de cita (> )
        if line.startswith('> '):
            quote_text = line[2:].strip().replace('**', '').replace('*', '')
            box = doc.add_table(rows=1, cols=1)
            box.alignment = WD_TABLE_ALIGNMENT.CENTER
            c = box.cell(0, 0)
            set_cell_background(c, "EFF6FF")
            set_cell_margins(c, top=120, bottom=120, left=200, right=200)
            qp = c.paragraphs[0]
            qp.paragraph_format.space_after = Pt(0)
            qrun = qp.add_run(quote_text)
            qrun.font.name = 'Calibri'
            qrun.font.size = Pt(10.5)
            qrun.font.italic = True
            qrun.font.color.rgb = NAVY
            doc.add_paragraph().paragraph_format.space_after = Pt(6)
            i += 1
            continue

        # Listas con viñetas
        if line.strip().startswith('* ') or line.strip().startswith('- '):
            indent_level = (len(line) - len(line.lstrip())) // 2
            bullet_text = line.strip()[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.left_indent = Inches(0.25 * (indent_level + 1))
            
            parts = re.split(r'(\*\*.*?\*\*)', bullet_text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                else:
                    p.add_run(part)
            i += 1
            continue

        # Listas numeradas
        m_num = re.match(r'^\s*(\d+)\.\s+(.*)', line)
        if m_num:
            num_str = m_num.group(1)
            num_text = m_num.group(2)
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.left_indent = Inches(0.25)
            r_num = p.add_run(f"{num_str}. ")
            r_num.bold = True
            
            parts = re.split(r'(\*\*.*?\*\*)', num_text)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                else:
                    p.add_run(part)
            i += 1
            continue

        # Párrafo normal
        if line.strip():
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(6)
            parts = re.split(r'(\*\*.*?\*\*)', line)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                else:
                    p.add_run(part)
        
        i += 1

    if in_table:
        flush_table()

    # ==========================================
    # 5. GUARDAR ARCHIVO WORD .DOCX
    # ==========================================
    out_docx = os.path.join(os.path.dirname(__file__), 'Informe Final del Proyecto.docx')
    doc.save(out_docx)
    print(f"Informe Word generado con éxito: {out_docx}")

if __name__ == '__main__':
    create_word_report()
