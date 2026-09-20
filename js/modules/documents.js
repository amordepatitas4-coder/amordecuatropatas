/**
 * ==============================================================================
 * PROYECTO: Sistema Web de Gestión — Fundación Amor de Cuatro Patas
 * ARCHIVO: js/modules/documents.js
 * DESCRIPCIÓN: Módulo de Gestión Documental, Visor Integrado y Enlaces (RF-10).
 * 
 * Funcionalidades:
 * 1. Visor interactivo integrado para leer directamente en pantalla los documentos oficiales:
 *    - Formulario Oficial de Solicitud de Adopción (Plantilla Imprimible).
 *    - Contrato de Compromiso de Adopción y Tenencia Responsable (Legal).
 *    - Protocolo Sanitario y Ficha de Ingreso de Rescates.
 * 2. Opción de impresión directa o exportación a PDF para cada documento.
 * 3. Enlace opcional a archivos reales en Google Drive cuando corresponda.
 * ==============================================================================
 */

const DocumentsModule = {
    currentCategory: 'todas',
    currentRelation: 'todas',
    currentDoc: null,
    isEditingContent: false,

    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        // Filtro por categoría documental
        const filterSelect = document.getElementById('doc-filter-categoria');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.render();
            });
        }

        document.getElementById('doc-filter-relation')?.addEventListener('change', event => {
            this.currentRelation = event.target.value;
            this.render();
        });

        document.getElementById('doc-form-relation-type')?.addEventListener('change', event => {
            this.populateRelationRecords(event.target.value);
        });

        // Modal nuevo documento
        const btnNewDoc = document.getElementById('btn-new-document');
        if (btnNewDoc) {
            btnNewDoc.addEventListener('click', () => {
                this.openNewDocumentModal();
            });
        }

        // Formulario nuevo documento
        const formDoc = document.getElementById('form-save-document');
        if (formDoc) {
            formDoc.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveDocument();
            });
        }
    },

    render() {
        const container = document.getElementById('documents-grid-container');
        if (!container) return;

        let docs = window.DB.db.documentos || [];
        if (this.currentCategory !== 'todas') {
            docs = docs.filter(d => d.categoria === this.currentCategory);
        }
        if (this.currentRelation !== 'todas') {
            docs = docs.filter(d => (d.entidad_tipo || 'general') === this.currentRelation);
        }

        if (docs.length === 0) {
            container.innerHTML = `<div class="empty-state-card"><p>No hay documentos registrados en esta categoría.</p></div>`;
            return;
        }

        container.innerHTML = docs.map(doc => {
            const icon = this.getCategoryIcon(doc.categoria);
            const esDriveReal = doc.url && doc.url.startsWith('http') && !doc.url.includes('ejemplo') && !doc.url.includes('formulario_oficial') && !doc.url.includes('contrato_modelo');

            return `
                <div class="card doc-card">
                    <div class="doc-card-header">
                        <span class="doc-icon">${icon}</span>
                        <span class="badge-tag">${this.formatCategoria(doc.categoria)}</span>
                    </div>
                    <h3 class="doc-title">${doc.titulo}</h3>
                    <p class="doc-desc">${doc.descripcion || 'Sin descripción adicional.'}</p>
                    <p class="doc-relation"><strong>Relacionado con:</strong> ${this.getRelationLabel(doc)}</p>
                    <div class="doc-card-footer" style="display:flex; flex-direction:column; gap:0.5rem;">
                        <button class="btn btn-primary btn-sm" style="width:100%; justify-content:center;" onclick="DocumentsModule.viewDocument('${doc.id}')">
                            👁️ Ver y Leer Documento Oficial
                        </button>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="btn btn-secondary btn-sm" style="flex:1; justify-content:center;" onclick="DocumentsModule.editDocument('${doc.id}')" title="Modificar título, descripción o enlace externo">
                                ✏️ Modificar Ficha
                            </button>
                            ${esDriveReal ? `
                                <a href="${doc.url}" target="_blank" class="btn btn-secondary btn-sm" style="flex:1; justify-content:center;">
                                    🔗 Google Drive
                                </a>
                            ` : ''}
                        </div>
                        ${doc.contenido_personalizado ? `
                            <span style="font-size:0.72rem; color:#d97706; text-align:center; font-weight:600;">
                                ✏️ Texto personalizado guardado por la Fundación
                            </span>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    getCategoryIcon(cat) {
        const icons = {
            'formulario': '📝',
            'legal': '⚖️',
            'cotizacion': '📊',
            'comprobante': '🧾',
            'administrativo': '📁'
        };
        return icons[cat] || '📄';
    },

    formatCategoria(cat) {
        const names = {
            'formulario': 'Formulario Oficial',
            'legal': 'Legal / Contrato',
            'cotizacion': 'Cotización / Presupuesto',
            'comprobante': 'Comprobante de Pago',
            'administrativo': 'Administrativo'
        };
        return names[cat] || cat;
    },

    getRelationLabel(doc) {
        const type = doc.entidad_tipo || 'general';
        const id = doc.entidad_id;
        if (type === 'animal') {
            return `Animal · ${window.DB.db.animales.find(a => a.id === id)?.nombre || 'Registro no disponible'}`;
        }
        if (type === 'adopcion') {
            const adoption = window.DB.db.adopciones.find(a => a.id === id);
            const animal = adoption && window.DB.db.animales.find(a => a.id === adoption.animal_id);
            return `Adopción · ${animal?.nombre || 'Registro no disponible'}`;
        }
        if (type === 'gasto') {
            return `Gasto · ${window.DB.db.gastos.find(g => g.id === id)?.concepto || 'Registro no disponible'}`;
        }
        return 'Gestión general';
    },

    populateRelationRecords(type, selectedId = '') {
        const group = document.getElementById('doc-form-relation-record-group');
        const select = document.getElementById('doc-form-relation-id');
        if (!group || !select) return;
        group.hidden = type === 'general';
        let options = [];
        if (type === 'animal') options = window.DB.db.animales.map(a => [a.id, a.nombre]);
        if (type === 'adopcion') options = window.DB.db.adopciones.map(a => {
            const animal = window.DB.db.animales.find(item => item.id === a.animal_id);
            return [a.id, `${animal?.nombre || 'Animal'} · ${a.contrato_folio}`];
        });
        if (type === 'gasto') options = window.DB.db.gastos.map(g => [g.id, `${g.fecha} · ${g.concepto}`]);
        select.innerHTML = options.map(([id, label]) => `<option value="${id}" ${id === selectedId ? 'selected' : ''}>${label}</option>`).join('');
    },

    /**
     * Muestra el documento oficial completo en una ventana modal con estilo de hoja membretada
     */
    viewDocument(docId) {
        const doc = (window.DB.db.documentos || []).find(d => d.id === docId);
        if (!doc) return;

        this.currentDoc = doc;
        this.isEditingContent = false;
        const btnEdit = document.getElementById('btn-toggle-doc-edit');
        if (btnEdit) btnEdit.textContent = '✏️ Editar Texto del Documento';
        const alertBox = document.getElementById('doc-edit-alert-container');
        if (alertBox) {
            alertBox.innerHTML = '';
            alertBox.style.display = 'none';
        }

        const modal = document.getElementById('modal-view-document');
        const modalTitle = document.getElementById('view-doc-modal-title');
        const modalBody = document.getElementById('view-doc-modal-body');

        if (!modal || !modalBody) return;

        modalTitle.textContent = `📄 ${doc.titulo}`;

        // Obtener el contenido oficial formateado
        const contenido = this.getDocumentOfficialContent(doc);

        // Ajustar firmas según tipo de documento
        const firmasHtml = this.getDocumentSignaturesHtml(doc);

        modalBody.innerHTML = `
            <div class="official-sheet-container" id="printable-sheet">
                <!-- Membrete Oficial Institucional -->
                <div class="sheet-header">
                    <div class="sheet-logo-block">
                        <div class="sheet-logo-badge">🐾</div>
                        <div>
                            <h2>FUNDACIÓN AMOR DE CUATRO PATAS</h2>
                            <p>Personalidad Jurídica N° 284.912 • RUT: 65.184.290-K • Talca, Región del Maule, Chile</p>
                            <small>Registro Nacional de Personas Jurídicas Sin Fines de Lucro • Ley N° 21.020 de Tenencia Responsable</small>
                        </div>
                    </div>
                    <div class="sheet-meta-box">
                        <div class="sheet-meta-row"><strong>FOLIO:</strong><span>${doc.id.toUpperCase()}</span></div>
                        <div class="sheet-meta-row"><strong>EMISIÓN:</strong><span>${new Date().toLocaleDateString('es-CL')}</span></div>
                        <div class="sheet-meta-row"><strong>ESTADO:</strong><span class="sheet-status-badge">Plantilla local</span></div>
                        <div class="sheet-meta-category">${this.formatCategoria(doc.categoria)}</div>
                    </div>
                </div>

                <div class="sheet-title-banner">
                    <h3 class="sheet-title">${doc.titulo}</h3>
                    <p class="sheet-subtitle">Instrumento Institucional Homologado para Custodia, Sanidad y Adopción Responsable</p>
                </div>

                <!-- Cuerpo del Documento -->
                <div class="sheet-content">
                    ${contenido}
                </div>

                <!-- Bloque de Firmas y Timbres Oficiales -->
                ${firmasHtml}

                <div class="sheet-footer-note">
                    <p style="margin: 0 0 0.25rem 0;"><strong>FUNDACIÓN AMOR DE CUATRO PATAS — TALCA, CHILE</strong></p>
                    <small>Este documento constituye un instrumento privado oficial emitido conforme al marco regulatorio de la Ley N° 21.020 sobre Tenencia Responsable de Mascotas y Animales de Compañía, Decreto Supremo N° 1007 del Ministerio del Interior y Código Civil de la República de Chile.</small>
                </div>
            </div>
        `;

        modal.classList.add('active');
    },

    /**
     * Genera el bloque de firmas y timbres adecuado a la naturaleza de cada documento
     */
    getDocumentSignaturesHtml(doc) {
        if (doc.id === 'doc-003' || doc.categoria === 'administrativo') {
            return `
                <div class="sheet-signatures-grid">
                    <div class="signature-box">
                        <div class="sig-line"></div>
                        <strong>Médico Veterinario Tratante</strong>
                        <p>N° Reg. COLMEVET: _________________</p>
                        <p style="font-size:0.75rem; color:#64748b;">Firma y Timbre Clínico</p>
                    </div>
                    <div class="signature-box">
                        <div class="sheet-stamp-box">
                            ★ FUNDACIÓN ★<br>
                            AMOR DE CUATRO PATAS<br>
                            <strong>CERTIFICACIÓN CLÍNICA</strong><br>
                            TALCA - CHILE
                        </div>
                        <p style="font-size:0.75rem; color:#64748b; margin-top:0.25rem;">Sello Oficial de Bioseguridad</p>
                    </div>
                    <div class="signature-box">
                        <div class="sig-line"></div>
                        <strong>Dirección Médica / Cuarentenas</strong>
                        <p>Fundación Amor de Cuatro Patas</p>
                        <p style="font-size:0.75rem; color:#64748b;">RUT: 65.184.290-K</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="sheet-signatures-grid">
                <div class="signature-box">
                    <div class="sig-line"></div>
                    <strong>Presidenta de la Fundación</strong>
                    <p>Fundación Amor de Cuatro Patas</p>
                    <p style="font-size:0.75rem; color:#64748b;">RUT: 14.892.410-3</p>
                </div>
                <div class="signature-box">
                    <div class="sheet-stamp-box">
                        ★ FUNDACIÓN ★<br>
                        AMOR DE CUATRO PATAS<br>
                        <strong>DOCUMENTO OFICIAL</strong><br>
                        TALCA - MAULE
                    </div>
                    <div class="sig-line" style="margin-top:0.5rem;"></div>
                    <strong>Encargada de Adopciones</strong>
                    <p style="font-size:0.75rem; color:#64748b;">Validación Socio-Ambiental</p>
                </div>
                <div class="signature-box">
                    <div class="sig-line"></div>
                    <strong>Firma Adoptante / Solicitante</strong>
                    <p>Cédula de Identidad (RUT): ______________</p>
                    <p style="font-size:0.75rem; color:#64748b;">Huella Dactilar Pulgar Derecho [ &nbsp; &nbsp; &nbsp; &nbsp; ]</p>
                </div>
            </div>
        `;
    },

    /**
     * Retorna el texto y estructura legal y clínica exhaustiva de los documentos estándar
     */
    getDocumentOfficialContent(doc) {
        // Si el usuario modificó y guardó un texto personalizado para este documento, cargar su versión personalizada
        if (doc.contenido_personalizado) {
            return doc.contenido_personalizado;
        }

        if (doc.id === 'doc-001' || doc.categoria === 'formulario') {
            return `
                <div class="sheet-callout-legal">
                    <strong>INSTRUCTIVO DE POSTULACIÓN A ADOPCIÓN RESPONSABLE (LEY N° 21.020):</strong><br>
                    El presente formulario tiene como propósito evaluar objetivamente la idoneidad socio-ambiental y el compromiso ético-económico del hogar postulante. Los animales tutelados por la Fundación provienen de situaciones de alto riesgo, maltrato o abandono, por lo que su entrega se reserva a entornos seguros, definitivos y amorosos. La información suministrada tiene carácter de declaración jurada confidencial.
                </div>

                <div class="sheet-section-title">I. INDIVIDUALIZACIÓN DEL POSTULANTE Y GRUPO FAMILIAR</div>
                <table class="sheet-table">
                    <tr>
                        <td style="width: 50%;"><strong>Nombre Completo:</strong> <span class="sheet-fill-line" style="width: 70%;"></span></td>
                        <td style="width: 50%;"><strong>RUT / Cédula:</strong> <span class="sheet-fill-line" style="width: 60%;"></span></td>
                    </tr>
                    <tr>
                        <td><strong>Fecha de Nacimiento:</strong> ____ / ____ / ________ &nbsp; (Edad: ____ años)</td>
                        <td><strong>Profesión u Ocupación:</strong> <span class="sheet-fill-line" style="width: 55%;"></span></td>
                    </tr>
                    <tr>
                        <td><strong>Teléfono Móvil Principal:</strong> +56 9 <span class="sheet-fill-line" style="width: 50%;"></span></td>
                        <td><strong>Correo Electrónico:</strong> <span class="sheet-fill-line" style="width: 60%;"></span></td>
                    </tr>
                    <tr>
                        <td colspan="2"><strong>Dirección Particular:</strong> <span class="sheet-fill-line" style="width: 80%;"></span></td>
                    </tr>
                    <tr>
                        <td><strong>Villa / Población / Condominio:</strong> <span class="sheet-fill-line" style="width: 45%;"></span></td>
                        <td><strong>Comuna y Región:</strong> Talca / Región del Maule [ &nbsp; ] Otra: ____________</td>
                    </tr>
                </table>

                <p style="margin: 0.75rem 0 0.25rem 0; font-weight: 600;">Composición del Grupo Familiar Conviviente en el Hogar:</p>
                <table class="sheet-table">
                    <thead>
                        <tr>
                            <th>Nombre del Conviviente</th>
                            <th>Parentesco</th>
                            <th>Edad</th>
                            <th>¿De acuerdo con adoptar?</th>
                            <th>¿Presenta alergia / asma?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1. ___________________________</td><td>_________________</td><td>____</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>[ &nbsp; ] No &nbsp; [ &nbsp; ] Sí</td></tr>
                        <tr><td>2. ___________________________</td><td>_________________</td><td>____</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>[ &nbsp; ] No &nbsp; [ &nbsp; ] Sí</td></tr>
                        <tr><td>3. ___________________________</td><td>_________________</td><td>____</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>[ &nbsp; ] No &nbsp; [ &nbsp; ] Sí</td></tr>
                        <tr><td>4. ___________________________</td><td>_________________</td><td>____</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>[ &nbsp; ] No &nbsp; [ &nbsp; ] Sí</td></tr>
                    </tbody>
                </table>

                <div class="sheet-section-title">II. CARACTERÍSTICAS DEL INMUEBLE Y CONDICIONES DE SEGURIDAD FÍSICA</div>
                <ol class="sheet-questions-list" style="padding-left: 1.25rem;">
                    <li><strong>Tipo de Inmueble:</strong> [ &nbsp; ] Casa aislada &nbsp;&nbsp; [ &nbsp; ] Casa pareada &nbsp;&nbsp; [ &nbsp; ] Departamento en altura (Piso: ____) &nbsp;&nbsp; [ &nbsp; ] Parcela / Sitio rural</li>
                    <li><strong>Tenencia de la Propiedad:</strong> [ &nbsp; ] Propietario(a) &nbsp;&nbsp; [ &nbsp; ] Arrendatario(a). <em>En caso de arriendo, ¿cuenta con cláusula expresa en el contrato que autorice la tenencia de mascotas según la Ley N° 21.442 de Copropiedad Inmobiliaria?</em> [ &nbsp; ] Sí &nbsp;&nbsp; [ &nbsp; ] En trámite de autorización escrita.</li>
                    <li><strong>Cierre Perimetral y Seguridad en Patios:</strong> ¿Cuenta con panderetas o rejas de al menos 1.80 metros de altura, sin forados ni rejas con separación que permitan el escape hacia la vía pública? [ &nbsp; ] Sí, perímetro 100% seguro &nbsp;&nbsp; [ &nbsp; ] Requiere adecuaciones previas a la entrega.</li>
                    <li><strong>Mallas de Seguridad en Ventanas y Terrazas (Excluyente para departamentos y pisos altos):</strong> ¿Tiene instaladas mallas monofilamento de seguridad certificadas para prevenir caídas y escapes? [ &nbsp; ] Sí, instaladas &nbsp;&nbsp; [ &nbsp; ] Compromiso de instalarlas antes de recibir a la mascota.</li>
                    <li><strong>Espacio de Descanso y Rutina:</strong> ¿Dónde dormirá el animal? [ &nbsp; ] Al interior de la casa como integrante del hogar &nbsp;&nbsp; [ &nbsp; ] En patio cubierto con caseta térmica aislada. <em>(Nota: Se prohíbe terminantemente mantener animales encadenados, en techos o sin abrigo).</em></li>
                </ol>

                <div class="sheet-section-title">III. HISTORIAL DE TENENCIA Y MASCOTAS ACTUALES</div>
                <p>Indique las mascotas que conviven actualmente en su domicilio:</p>
                <table class="sheet-table">
                    <thead>
                        <tr>
                            <th>Especie / Nombre</th>
                            <th>Edad</th>
                            <th>¿Esterilizado(a)?</th>
                            <th>Vacunas al Día</th>
                            <th>N° Microchip (15 dígitos)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1. _______________________</td><td>____ años</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>_____________________________</td></tr>
                        <tr><td>2. _______________________</td><td>____ años</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>_____________________________</td></tr>
                        <tr><td>3. _______________________</td><td>____ años</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>[ &nbsp; ] Sí &nbsp; [ &nbsp; ] No</td><td>_____________________________</td></tr>
                    </tbody>
                </table>
                <p>¿Qué ocurrió con las mascotas que tuvo durante los últimos 10 años que ya no están con usted? (causas de defunción, longevidad o motivos de extravío):<br>
                <span class="sheet-fill-line" style="width: 100%;"></span><br>
                <span class="sheet-fill-line" style="width: 100%;"></span></p>

                <div class="sheet-section-title">IV. DINÁMICA DE CONVIVENCIA, PASEOS Y SOLVENCIA ECONÓMICA</div>
                <ol class="sheet-questions-list" start="6" style="padding-left: 1.25rem;">
                    <li><strong>Horas de Soledad Diaria:</strong> ¿Cuántas horas al día permanecerá sola la mascota por motivos laborales o académicos? [ &nbsp; ] 0 a 4 horas &nbsp;&nbsp; [ &nbsp; ] 4 a 8 horas &nbsp;&nbsp; [ &nbsp; ] Más de 8 horas. ¿Quién acudirá a asistirla en su ausencia?: _____________________________________</li>
                    <li><strong>Rutina de Ejercicio y Bienestar:</strong> En caso de caninos, ¿se compromete a otorgarle paseos diarios (mínimo 2 al día) provisto siempre de collar/arnés y correa de seguridad, sin soltarlo en la vía pública? [ &nbsp; ] Sí. En caso de felinos, ¿asume el compromiso de mantenerlo 100% como gato de interior ("Indoor") sin salidas a techos o exteriores? [ &nbsp; ] Sí, gato indoor.</li>
                    <li><strong>Presupuesto y Solvencia Veterinaria:</strong> ¿Cuenta con solvencia económica para proveerle alimento seco de calidad balanceada ($30.000 a $60.000 mensuales) y un fondo de contingencia para emergencias médicas veterinarias ante accidentes o enfermedades agudas? [ &nbsp; ] Sí, asumo plenamente la responsabilidad financiera.</li>
                    <li><strong>Plan Vacacional o Mudanzas:</strong> En caso de viajes, vacaciones o mudanza de ciudad, ¿qué medidas tiene previstas para garantizar la continuidad del cuidado? [ &nbsp; ] Viaja con el grupo familiar &nbsp;&nbsp; [ &nbsp; ] Cuidado en domicilio por familiar directo &nbsp;&nbsp; [ &nbsp; ] Hotel canino / guardería con acreditación sanitaria.</li>
                </ol>

                <div class="sheet-section-title">V. DECLARACIÓN JURADA SIMPLE Y CONSENTIMIENTO INFORMADO</div>
                <div class="sheet-callout-legal">
                    Yo, individualizado(a) en la Sección I, declaro bajo fe de juramento que la información consignada en esta postulación es veraz, íntegra y fidedigna. Declaro no haber sido condenado(a) ni encontrarme formalizado(a) por delitos de maltrato o abandono animal tipificados en el Artículo 291 bis y ter del Código Penal. Autorizo de manera voluntaria a la Comisión de Adopciones de la Fundación Amor de Cuatro Patas a realizar una inspección socio-ambiental a mi domicilio (presencial o telemática), verificar la seguridad de los cierres perimetrales y efectuar las visitas de seguimiento post-adopción pertinentes.
                </div>
            `;
        } else if (doc.id === 'doc-002' || doc.categoria === 'legal') {
            return `
                <div class="sheet-callout-legal">
                    <strong>INSTRUMENTO PRIVADO VINCULANTE CON FUERZA OBLIGATORIA (LEY N° 21.020):</strong><br>
                    El presente contrato formaliza la cesión definitiva en adopción y tutela responsable de un ejemplar canino o felino rescatado, amparado bajo los principios de protección animal consagrados en la Ley N° 21.020, su Reglamento (Decreto Supremo N° 1007 del Ministerio del Interior y Seguridad Pública) y los Artículos 1437 y siguientes del Código Civil de la República de Chile.
                </div>

                <div class="sheet-section-title">COMPARECENCIA Y PERSONERÍA</div>
                <p>En la ciudad de Talca, Región del Maule, República de Chile, a fecha de suscripción del presente instrumento, comparecen:</p>
                <p>Por una parte, la <strong>FUNDACIÓN AMOR DE CUATRO PATAS</strong>, persona jurídica de derecho privado sin fines de lucro, RUT N° 65.184.290-K, con domicilio legal en Talca, representada para estos efectos por su Directorio, en adelante denominada indistintamente como <strong>"LA FUNDACIÓN"</strong>; y por la otra parte, don(ña) <span class="sheet-fill-line" style="min-width: 260px;"></span>, Cédula Nacional de Identidad N° <span class="sheet-fill-line" style="min-width: 130px;"></span>, de profesión u oficio <span class="sheet-fill-line" style="min-width: 140px;"></span>, con domicilio acreditado en <span class="sheet-fill-line" style="min-width: 260px;"></span>, comuna de <span class="sheet-fill-line" style="min-width: 110px;"></span>, teléfono <span class="sheet-fill-line" style="min-width: 120px;"></span>, en adelante denominado(a) como <strong>"EL ADOPTANTE"</strong>. Las partes celebran de común acuerdo el siguiente contrato solemne:</p>

                <div class="sheet-section-title">INDIVIDUALIZACIÓN FIDEDIGNA DEL ANIMAL ENTREGADO EN ADOPCIÓN</div>
                <table class="sheet-table">
                    <tr>
                        <td><strong>Nombre del Ejemplar:</strong> <span class="sheet-fill-line" style="min-width: 130px;"></span></td>
                        <td><strong>Especie:</strong> [ &nbsp; ] Canina &nbsp;&nbsp; [ &nbsp; ] Felina</td>
                        <td><strong>Sexo:</strong> [ &nbsp; ] Hembra &nbsp;&nbsp; [ &nbsp; ] Macho</td>
                    </tr>
                    <tr>
                        <td><strong>Edad Estimada:</strong> <span class="sheet-fill-line" style="min-width: 80px;"></span></td>
                        <td><strong>Raza / Mestizaje:</strong> <span class="sheet-fill-line" style="min-width: 130px;"></span></td>
                        <td><strong>Color y Manto:</strong> <span class="sheet-fill-line" style="min-width: 120px;"></span></td>
                    </tr>
                    <tr>
                        <td colspan="2"><strong>N° Microchip Oficial (ISO 11784/11785 - 15 dígitos):</strong> <span class="sheet-fill-line" style="min-width: 220px;"></span></td>
                        <td><strong>Folio Ficha Sanitaria:</strong> <span class="sheet-fill-line" style="min-width: 100px;"></span></td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong>Estado Reproductivo:</strong> [ &nbsp; ] Esterilizado(a) quirúrgicamente con certificación médica adjunta &nbsp;&nbsp; [ &nbsp; ] Cachorro con compromiso de esterilización a los 6 meses.</td>
                    </tr>
                </table>

                <div class="sheet-section-title">CLÁUSULAS CONTRACTUALES OBLIGATORIAS</div>

                <div class="sheet-clause-box">
                    <div class="sheet-clause-title">CLÁUSULA PRIMERA: OBJETO DEL CONTRATO Y TRASPASO DE CUSTODIA TUTELAR</div>
                    <p>La Fundación hace entrega material a El Adoptante de la tutela, posesión y custodia responsable del animal individualizado precedentemente. El Adoptante lo recibe a entera satisfacción, en perfecto conocimiento de sus antecedentes médicos, conductuales y sanitarios, asumiendo su cuidado de forma permanente e irrenunciable.</p>
                </div>

                <div class="sheet-clause-box">
                    <div class="sheet-clause-title">CLÁUSULA SEGUNDA: OBLIGACIONES Y DEBERES LEGALES DE EL ADOPTANTE</div>
                    <p>En conformidad a la Ley N° 21.020, El Adoptante se compromete de manera imperativa a:</p>
                    <ul style="padding-left: 1.25rem; line-height: 1.6;">
                        <li><strong>1. Bienestar y Nutrición Integral:</strong> Proveer alimentación balanceada acorde a los requerimientos etarios y fisiológicos de la especie, acceso continuo a agua fresca y limpia, cobijo higiénico y calefacción adecuada frente al frío o calor extremo. <em>Queda expresamente prohibido mantener al animal atado con cadenas o cuerdas, confinado en terrazas desprotegidas, balcones sin mallas de seguridad o azoteas a la intemperie.</em></li>
                        <li><strong>2. Asistencia Médica Preventiva y Curativa:</strong> Mantener al día su plan de vacunación anual (Óctuple/Séxtuple en perros, Triple Felina en gatos, y Antirrábica ministerial obligatoria), esquema trimestral de desparasitaciones internas y mensuales externas, y concurrir a atención veterinaria inmediata ante signos patológicos o accidentes.</li>
                        <li><strong>3. Esterilización Quirúrgica Ineludible:</strong> En caso de haberse entregado en etapa prepúber o de lactancia tardía, El Adoptante asume la obligación indelegable de presentar al animal al procedimiento quirúrgico de esterilización (ovariohisterectomía o castración) coordinado por La Fundación al cumplir entre 5 y 6 meses de edad.</li>
                        <li><strong>4. Inscripción en el Registro Nacional de Mascotas (PTRAC):</strong> Tramitar la inscripción o el cambio de titularidad del microchip oficial en la plataforma del Registro Nacional de Mascotas dependiente de la SUBDERE en un plazo fatal de quince (15) días hábiles contados desde la firma de este acto.</li>
                        <li><strong>5. Seguridad en Espacios Públicos:</strong> En el caso de caninos, transitar en la vía pública o bienes nacionales de uso público obligatoriamente con correa, collar o arnés reglamentario y placa identificatoria, prohibiéndose su circulación libre sin supervisión. En el caso de felinos, mantenerlo como gato estrictamente de interior (Indoor).</li>
                    </ul>
                </div>

                <div class="sheet-clause-box">
                    <div class="sheet-clause-title">CLÁUSULA TERCERA: PROHIBICIÓN TAXATIVA DE ENAJENACIÓN, CRUZA O ABANDONO</div>
                    <p>El Adoptante se obliga a no vender, ceder, donar, permutar, rifar ni someter a cruzas reproductivas al animal adoptado bajo ningún pretexto ni circunstancia. Cualquier acto de abandono voluntario constituirá infracción gravísima penada por la Ley N° 21.020 y dará lugar a la interposición inmediata de una querella criminal por delito de maltrato animal conforme al Artículo 291 bis y ter del Código Penal ante el Ministerio Público.</p>
                </div>

                <div class="sheet-clause-box">
                    <div class="sheet-clause-title">CLÁUSULA CUARTA: DERECHO PREFERENTE Y EXCLUSIVO DE RESTITUCIÓN</div>
                    <p>Si por caso fortuito, enfermedad catastrófica sobreviniente, fuerza mayor o pérdida acreditada de solvencia económica El Adoptante no pudiere continuar proveyendo los cuidados debidos al animal, se compromete a comunicar dicho hecho por escrito a La Fundación en un plazo máximo de 48 horas. En dicho evento, La Fundación mantendrá el derecho preferente y exclusivo de reasumir la custodia del animal, prohibiéndose taxativamente entregarlo a terceros, perreras municipales o abandonarlo a su suerte.</p>
                </div>

                <div class="sheet-clause-box">
                    <div class="sheet-clause-title">CLÁUSULA QUINTA: FACULTAD DE FISCALIZACIÓN Y VISITAS DE SEGUIMIENTO</div>
                    <p>La Fundación conserva la potestad jurídica de verificar periódicamente el bienestar del animal mediante requerimiento de fotografías, videos actualizados o visitas domiciliarias coordinadas. El Adoptante se obliga a prestar toda su colaboración para facilitar dichas inspecciones de seguimiento durante toda la existencia del ejemplar.</p>
                </div>

                <div class="sheet-clause-box">
                    <div class="sheet-clause-title">CLÁUSULA SEXTA: CLÁUSULA RESOLUTORIA Y RESTITUCIÓN CON FUERZA PÚBLICA</div>
                    <p>El incumplimiento grave o reiterado de cualquiera de las estipulaciones precedentes, la constatación de maltrato físico o desatención médica faculta a La Fundación para resolver ipso facto y de pleno derecho el presente contrato, exigiendo la devolución y retiro inmediato del animal, facultando la solicitud de auxilio de la fuerza pública (Carabineros de Chile o PDI) y la incautación preventiva ante el tribunal competente.</p>
                </div>

                <div class="sheet-clause-box">
                    <div class="sheet-clause-title">CLÁUSULA SÉPTIMA: DOMICILIO Y JURISDICCIÓN</div>
                    <p>Para todos los efectos legales dimanantes de este instrumento, las partes fijan domicilio convencional en la comuna de Talca y se someten a la competencia de sus Tribunales Ordinarios de Justicia y Juzgados de Policía Local.</p>
                </div>
            `;
        } else if (doc.id === 'doc-003' || doc.categoria === 'administrativo') {
            return `
                <div class="sheet-callout-clinic">
                    <strong>NORMA TÉCNICA INSTITUCIONAL DE BIOSEGURIDAD Y MANEJO CLÍNICO (COLMEVET / LEY 21.020):</strong><br>
                    Este protocolo médico-veterinario estandariza el procedimiento de clasificación de triage de urgencias, examen clínico general, aislamiento profiláctico de cuarentena de 15 días, diagnóstico serológico y plan de inmunización para todo ejemplar canino o felino ingresado bajo la tutela de la Fundación Amor de Cuatro Patas, garantizando el control de brotes enzoóticos y el bienestar animal.
                </div>

                <div class="sheet-section-title">I. SISTEMA DE CLASIFICACIÓN DE TRIAGE CLÍNICO DE INGRESO VETERINARIO</div>
                <p>A su recepción, todo paciente rescatado debe ser categorizado de forma inmediata según la escala tripartita de triage médico institucional:</p>

                <table class="sheet-table">
                    <thead>
                        <tr>
                            <th style="width: 22%;">Nivel de Triage</th>
                            <th style="width: 38%;">Criterios Clínicos y Signos de Alerta</th>
                            <th style="width: 15%;">Tiempo Respuesta</th>
                            <th style="width: 25%;">Conducta Terapéutica Inmediata</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span class="triage-badge-rojo">TRIAGE ROJO</span><br>
                                <strong>Prioridad 1</strong><br>
                                <small style="color:#991b1b; font-weight:600;">Emergencia Vital Crítica</small>
                            </td>
                            <td>
                                Inestabilidad hemodinámica manifiesta, politraumatismo activo / atropello reciente, shock hipovolémico o séptico, hemorragia arterial profusa, paro respiratorio o disnea aguda severa, estatus convulsivo prolongado (> 3 min), hipotermia crítica (< 36.0°C) o golpe de calor severo (> 40.5°C), traumatismo craneoencefálico con pérdida de conciencia.
                            </td>
                            <td><strong>INMEDIATO</strong><br><small>(0 a 10 min)</small></td>
                            <td>
                                Canalización venosa inmediata (catéter 20G/22G), fluidoterapia de choque con Ringer Lactato en bolos, oxigenoterapia continua en máscara, hemostasia compresiva de urgencia, analgesia mayor multimodal y termorregulación activa asistida.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="triage-badge-amarillo">TRIAGE AMARILLO</span><br>
                                <strong>Prioridad 2</strong><br>
                                <small style="color:#92400e; font-weight:600;">Urgencia Inestable</small>
                            </td>
                            <td>
                                Deshidratación moderada a severa (7% a 9%), dolor agudo marcado, cuadros eméticos y diarreas sanguinolentas fétidas (sospecha de Parvovirosis o Panleucopenia), heridas abiertas profundas con desgarro muscular, fracturas cerradas con impotencia funcional, caquexia severa, proptosis ocular traumática, sospecha de intoxicación aguda.
                            </td>
                            <td><strong>MÁXIMO</strong><br><small>(60 a 120 min)</small></td>
                            <td>
                                Fluidoterapia endovenosa de mantenimiento y rehidratación hidroelectrolítica, kits serológicos de diagnóstico rápido (Snap Parvo/Distemper o FeLV/FIV), toma de hemograma, analgesia y antibioticoterapia empírica según foco.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="triage-badge-verde">TRIAGE VERDE</span><br>
                                <strong>Prioridad 3</strong><br>
                                <small style="color:#166534; font-weight:600;">Paciente Estable</small>
                            </td>
                            <td>
                                Paciente alerta, reactivo y deambulando con normalidad. Constantes fisiológicas estables dentro de rangos normales de la especie. Dermatopatías crónicas (sarna sarcóptica, demodécica o micosis), infestación masiva de ectoparásitos (pulgas, garrapatas), malnutrición leve o heridas superficiales cicatrizadas.
                            </td>
                            <td><strong>PROGRAMADO</strong><br><small>(Dentro de 12 hrs)</small></td>
                            <td>
                                Examen Clínico Objetivo General (ECOG) completo, pesaje biométrico, administración de antiparasitario oral/spot-on de amplio espectro e ingreso a canil o box de aislamiento preventivo de cuarentena.
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="sheet-section-title">II. EXAMEN CLÍNICO OBJETIVO GENERAL (ECOG) AL INGRESO</div>
                <table class="sheet-table">
                    <thead>
                        <tr>
                            <th>Parámetro Fisiológico Evaluado</th>
                            <th>Valor Hallado en Paciente</th>
                            <th>Rango Fisiológico Canino</th>
                            <th>Rango Fisiológico Felino</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Peso Corporal y Condición</strong></td>
                            <td><span class="sheet-fill-line" style="min-width: 80px;"></span> kg &nbsp; | &nbsp; Condición: [ &nbsp; ] 1 &nbsp; [ &nbsp; ] 2 &nbsp; [ &nbsp; ] 3 &nbsp; [ &nbsp; ] 4 &nbsp; [ &nbsp; ] 5</td>
                            <td>Variable según raza y talla</td>
                            <td>3.0 - 5.5 kg (Adulto estándar)</td>
                        </tr>
                        <tr>
                            <td><strong>Frecuencia Cardíaca (FC)</strong></td>
                            <td><span class="sheet-fill-line" style="min-width: 80px;"></span> latidos por minuto (lpm)</td>
                            <td>70 a 140 lpm</td>
                            <td>140 a 220 lpm</td>
                        </tr>
                        <tr>
                            <td><strong>Frecuencia Respiratoria (FR)</strong></td>
                            <td><span class="sheet-fill-line" style="min-width: 80px;"></span> respiraciones por minuto (rpm)</td>
                            <td>15 a 30 rpm</td>
                            <td>20 a 40 rpm</td>
                        </tr>
                        <tr>
                            <td><strong>Temperatura Rectal (°C)</strong></td>
                            <td><span class="sheet-fill-line" style="min-width: 80px;"></span> °C</td>
                            <td>38.0°C a 39.2°C</td>
                            <td>38.0°C a 39.2°C</td>
                        </tr>
                        <tr>
                            <td><strong>Mucosas Aparentes y TLLC</strong></td>
                            <td>Mucosas: [ &nbsp; ] Rosadas &nbsp; [ &nbsp; ] Pálidas &nbsp; [ &nbsp; ] Ictéricas &nbsp; [ &nbsp; ] Cianóticas</td>
                            <td>TLLC < 2 segundos</td>
                            <td>TLLC < 2 segundos</td>
                        </tr>
                        <tr>
                            <td><strong>Grado de Deshidratación</strong></td>
                            <td>[ &nbsp; ] < 5% (Normal) &nbsp;&nbsp; [ &nbsp; ] 6-8% (Moderada) &nbsp;&nbsp; [ &nbsp; ] 9-10% (Grave) &nbsp;&nbsp; [ &nbsp; ] >10% (Choque)</td>
                            <td colspan="2">Pliegue cutáneo de retorno elástico inmediato</td>
                        </tr>
                        <tr>
                            <td><strong>Dentición y Estimación Etaria</strong></td>
                            <td>Esmalte dental / Sarro: <span class="sheet-fill-line" style="min-width: 90px;"></span> &nbsp; Edad Estimada: <span class="sheet-fill-line" style="min-width: 70px;"></span></td>
                            <td colspan="2">Dientes deciduos vs. permanentes con desgaste cúspideo</td>
                        </tr>
                    </tbody>
                </table>

                <div class="sheet-section-title">III. PROTOCOLO DE AISLAMIENTO PROFILÁCTICO Y CUARENTENA (DÍAS 1 AL 15)</div>
                <div class="sheet-callout-clinic">
                    <strong>CRONOGRAMA CLÍNICO DE BIOSEGURIDAD SECUENCIAL:</strong>
                    <ol style="margin: 0.5rem 0 0 1.25rem; padding: 0; line-height: 1.6;">
                        <li><strong>Día 1 (Triage, Estabilización e Higiene Sanitaria):</strong> Clasificación de triage de ingreso, estabilización hemodinámica y administración inmediata de ectoparasiticida oral o tópico de última generación (Fluralaner / Sarolaner en perros, Selamectina en gatos). Confinamiento estricto en box o canil individual desinfectado con amonio cuaternario de quinta generación.</li>
                        <li><strong>Días 2 a 3 (Pruebas Serológicas y Desparasitación Interna):</strong> Aplicación obligatoria de test diagnósticos rápidos:
                            <br>• Caninos: Test Snap Antígeno Parvovirus Fecal y Test Distemper Canino (CDV).
                            <br>• Felinos: Test Rápido Dúo FeLV (Leucemia Felina) e Inmunodeficiencia (FIV).
                            <br>Inicio de desparasitación interna de amplio espectro con Fenbendazol (50 mg/kg/día por 3 días) o asociación Praziquantel + Febantel + Pirantel.</li>
                        <li><strong>Días 4 al 14 (Monitoreo Clínico de Cuarentena):</strong> Control diario de temperatura rectal matutina y vespertina, evaluación de consistencia fecal (Escala de Bristol), ausencia de signología respiratoria (tos, estornudos, secreción serosa) y pesaje intermedio para corroborar recuperación nutricional.</li>
                        <li><strong>Día 15 (Alta de Cuarentena, Inmunización y Liberación Quirúrgica):</strong> Paciente afebril, asintomático y con curva ponderal positiva:
                            <br>✓ Aplicación de 1era Dosis de Vacuna Óctuple/Séxtuple Canina o Triple Felina.
                            <br>✓ Aplicación de Vacuna Antirrábica ministerial obligatoria (pacientes > 2 meses).
                            <br>✓ Implantación subcutánea de Microchip Oficial de 15 dígitos en zona interescapular.
                            <br>✓ Certificación de Aptitud Quirúrgica para Esterilización (Ovariohisterectomía / Castración).
                            <br>✓ Habilitación en el Sistema Web con estatus: <strong>DISPONIBLE PARA ADOPCIÓN</strong>.</li>
                    </ol>
                </div>
            `;
        } else {
            return `
                <p>${doc.descripcion || 'Documento administrativo oficial de la Fundación Amor de Cuatro Patas.'}</p>
                <div style="background: rgba(0,0,0,0.03); padding: 1.5rem; border: 1px dashed #cbd5e1; border-radius: 8px; margin: 1.5rem 0;">
                    <p><strong>Categoría:</strong> ${this.formatCategoria(doc.categoria)}</p>
                    <p><strong>Identificador:</strong> ${doc.id}</p>
                    <p><strong>Enlace en Repositorio Digital:</strong> <a href="${doc.url}" target="_blank">${doc.url}</a></p>
                </div>
            `;
        }
    },

    /**
     * Confirma la revisión local del documento; no equivale a firma o certificación legal.
     */
    acceptDocument() {
        const modal = document.getElementById('modal-view-document');
        if (modal) modal.classList.remove('active');
        if (this.currentDoc) {
            window.App.showNotification(`Documento "${this.currentDoc.titulo}" marcado como revisado localmente.`);
        }
    },

    printCurrentDocument() {
        const printContent = document.getElementById('printable-sheet');
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${this.currentDoc ? this.currentDoc.titulo : 'Documento Fundación'}</title>
                    <link rel="stylesheet" href="index.css">
                    <style>
                        body { background: #ffffff !important; color: #000000 !important; font-family: 'Inter', sans-serif; padding: 1.2cm 1.5cm; }
                        .official-sheet-container { border: none !important; box-shadow: none !important; padding: 0 !important; max-width: 100% !important; }
                        .sheet-divider { border-top: 2px solid #000; margin: 1rem 0; }
                    </style>
                </head>
                <body onload="setTimeout(() => { window.print(); window.close(); }, 300);">
                    ${printContent.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
    },

    /**
     * Alterna el modo de edición de texto directamente sobre la hoja oficial
     */
    toggleEditMode() {
        if (!this.currentDoc) return;
        const sheetContent = document.querySelector('#printable-sheet .sheet-content');
        const alertBox = document.getElementById('doc-edit-alert-container');
        const btnEdit = document.getElementById('btn-toggle-doc-edit');

        this.isEditingContent = !this.isEditingContent;

        if (this.isEditingContent) {
            if (sheetContent) {
                sheetContent.setAttribute('contenteditable', 'true');
                sheetContent.focus();
            }
            if (btnEdit) btnEdit.textContent = '👀 Salir de Edición';

            if (alertBox) {
                alertBox.innerHTML = `
                    <div class="sheet-edit-banner">
                        <div>
                            <strong>✏️ MODO DE EDICIÓN EN VIVO:</strong> Puedes hacer clic y escribir directamente en cualquier párrafo, cláusula, tabla o dato de la hoja.
                        </div>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                            <button class="btn btn-success btn-sm" onclick="DocumentsModule.saveCustomContent()">
                                💾 Guardar Cambios
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="DocumentsModule.restoreDefaultContent()">
                                🔄 Restaurar Plantilla Original
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="DocumentsModule.toggleEditMode()">
                                ✖️ Cancelar
                            </button>
                        </div>
                    </div>
                `;
                alertBox.style.display = 'block';
            }
            window.App.showNotification('Modo de edición activado. Ya puedes modificar el texto en pantalla.');
        } else {
            if (sheetContent) {
                sheetContent.removeAttribute('contenteditable');
            }
            if (btnEdit) btnEdit.textContent = '✏️ Editar Texto del Documento';
            if (alertBox) {
                alertBox.innerHTML = '';
                alertBox.style.display = 'none';
            }
        }
    },

    /**
     * Guarda el contenido HTML modificado por el usuario en la base de datos local
     */
    saveCustomContent() {
        if (!this.currentDoc) return;
        const sheetContent = document.querySelector('#printable-sheet .sheet-content');
        if (!sheetContent) return;

        // Persistir el HTML personalizado dentro del documento
        this.currentDoc.contenido_personalizado = sheetContent.innerHTML;
        window.DB.save();

        this.toggleEditMode();
        this.render();
        window.App.showNotification('¡Cambios guardados con éxito en la base de datos de la Fundación!');
    },

    /**
     * Restablece la redacción estándar de la plantilla oficial
     */
    restoreDefaultContent() {
        if (!this.currentDoc) return;
        if (!confirm('¿Deseas restaurar la redacción original de la plantilla oficial? Se descartarán todas las modificaciones que hayas realizado en este documento.')) {
            return;
        }

        delete this.currentDoc.contenido_personalizado;
        window.DB.save();

        this.isEditingContent = false;
        this.viewDocument(this.currentDoc.id);
        this.render();
        window.App.showNotification('Plantilla oficial original restablecida.');
    },

    /**
     * Abre el modal para registrar un nuevo documento
     */
    openNewDocumentModal() {
        const modal = document.getElementById('modal-document-form');
        const form = document.getElementById('form-save-document');
        if (!modal || !form) return;
        form.reset();

        const idInput = document.getElementById('doc-form-id');
        if (idInput) idInput.value = '';

        const titleEl = document.getElementById('modal-doc-form-title');
        if (titleEl) titleEl.textContent = '📁 Registrar Documento Digital';

        const btnSubmit = document.getElementById('btn-submit-save-doc');
        if (btnSubmit) btnSubmit.textContent = 'Registrar Documento';

        document.getElementById('doc-form-relation-type').value = 'general';
        this.populateRelationRecords('general');

        modal.classList.add('active');
    },

    /**
     * Abre el modal para modificar el título, categoría o enlace de Drive de un documento existente
     */
    editDocument(docId) {
        const doc = (window.DB.db.documentos || []).find(d => d.id === docId);
        if (!doc) return;

        const modal = document.getElementById('modal-document-form');
        const form = document.getElementById('form-save-document');
        if (!modal || !form) return;

        const idInput = document.getElementById('doc-form-id');
        if (idInput) idInput.value = doc.id;

        document.getElementById('doc-form-titulo').value = doc.titulo;
        document.getElementById('doc-form-categoria').value = doc.categoria;
        document.getElementById('doc-form-url').value = doc.url || '';
        document.getElementById('doc-form-desc').value = doc.descripcion || '';
        document.getElementById('doc-form-relation-type').value = doc.entidad_tipo || 'general';
        this.populateRelationRecords(doc.entidad_tipo || 'general', doc.entidad_id || '');

        const titleEl = document.getElementById('modal-doc-form-title');
        if (titleEl) titleEl.textContent = `✏️ Modificar: ${doc.titulo}`;

        const btnSubmit = document.getElementById('btn-submit-save-doc');
        if (btnSubmit) btnSubmit.textContent = 'Guardar Modificaciones';

        modal.classList.add('active');
    },

    handleSaveDocument() {
        const idInput = document.getElementById('doc-form-id');
        const docId = idInput ? idInput.value : '';
        const titulo = document.getElementById('doc-form-titulo').value.trim();
        const categoria = document.getElementById('doc-form-categoria').value;
        const url = document.getElementById('doc-form-url').value.trim();
        const descripcion = document.getElementById('doc-form-desc').value.trim();
        const entidad_tipo = document.getElementById('doc-form-relation-type').value;
        const entidad_id = entidad_tipo === 'general' ? null : document.getElementById('doc-form-relation-id').value;

        if (!titulo || !url) {
            alert('Por favor ingresa el título del documento y el enlace URL.');
            return;
        }

        if (docId) {
            // Actualización de documento existente
            const doc = (window.DB.db.documentos || []).find(d => d.id === docId);
            if (doc) {
                doc.titulo = titulo;
                doc.categoria = categoria;
                doc.url = url;
                doc.descripcion = descripcion;
                doc.entidad_tipo = entidad_tipo;
                doc.entidad_id = entidad_id;
                window.DB.save();
                window.App.showNotification(`Documento "${titulo}" actualizado correctamente.`);
            }
        } else {
            // Registro de nuevo documento
            const nuevoDoc = {
                id: window.DB.generateId('doc'),
                titulo,
                categoria,
                url,
                descripcion,
                entidad_tipo,
                entidad_id
            };

            if (!window.DB.db.documentos) window.DB.db.documentos = [];
            window.DB.db.documentos.unshift(nuevoDoc);
            window.DB.save();
            window.App.showNotification(`Documento "${titulo}" indexado exitosamente.`);
        }

        document.getElementById('modal-document-form').classList.remove('active');
        this.render();
    }
};

window.DocumentsModule = DocumentsModule;
