/**
 * Autenticación local previa a la conexión con Supabase Auth.
 * Las contraseñas nunca se guardan: se conserva un verificador PBKDF2 con sal.
 * Esta barrera protege la interfaz del MVP en el dispositivo; la autorización
 * definitiva de datos deberá aplicarse en el servidor mediante Supabase RLS.
 */
const AuthModule = {
    USERS_KEY: 'fundacion_auth_users_v1',
    SESSION_KEY: 'fundacion_auth_session_v1',
    ITERATIONS: 210000,
    MAX_IDLE_MS: 30 * 60 * 1000,
    initialized: false,

    async init() {
        if (this.initialized) return;
        this.initialized = true;
        this.bindEvents();
        let users = this.getUsers();
        const session = this.getSession();
        
        // Si es la primera vez que se abre el sistema en este dominio/navegador,
        // auto-inicializar de inmediato las credenciales oficiales de demostración
        if (!users.length) {
            try {
                users = await Promise.all([
                    this.buildUser('presidenta', 'Presidenta de la Fundación', 'Presidenta2026!'),
                    this.buildUser('tesorera', 'Tesorera de la Fundación', 'Tesorera2026!')
                ]);
                localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            } catch (e) {
                console.warn('Error inicializando usuarios demo:', e);
            }
        }

        if (session && Date.now() - session.lastActivity < this.MAX_IDLE_MS) {
            this.activateSession(session);
        } else {
            this.clearSession();
            this.showLogin();
        }
        ['click', 'keydown', 'pointerdown'].forEach(eventName => {
            document.addEventListener(eventName, () => this.touchSession(), { passive: true });
        });
        setInterval(() => this.checkExpiry(), 60000);
    },

    bindEvents() {
        document.getElementById('auth-setup-form')?.addEventListener('submit', event => {
            event.preventDefault();
            this.createInitialUsers();
        });
        document.getElementById('auth-login-form')?.addEventListener('submit', event => {
            event.preventDefault();
            this.login();
        });
        document.getElementById('auth-role')?.addEventListener('change', event => {
            const passInput = document.getElementById('auth-password');
            if (passInput) {
                passInput.value = event.target.value === 'presidenta' ? 'Presidenta2026!' : 'Tesorera2026!';
            }
        });
        document.getElementById('btn-auth-logout')?.addEventListener('click', () => this.logout());
        document.getElementById('form-cambiar-password')?.addEventListener('submit', event => {
            event.preventDefault();
            this.cambiarPassword(event);
        });
    },

    getUsers() {
        try { return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]'); }
        catch { return []; }
    },

    getSession() {
        try { return JSON.parse(sessionStorage.getItem(this.SESSION_KEY) || 'null'); }
        catch { return null; }
    },

    bytesToBase64(bytes) {
        return btoa(String.fromCharCode(...bytes));
    },

    base64ToBytes(value) {
        return Uint8Array.from(atob(value), char => char.charCodeAt(0));
    },

    async deriveVerifier(password, salt) {
        const material = await crypto.subtle.importKey(
            'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
        );
        const bits = await crypto.subtle.deriveBits({
            name: 'PBKDF2', salt, iterations: this.ITERATIONS, hash: 'SHA-256'
        }, material, 256);
        return this.bytesToBase64(new Uint8Array(bits));
    },

    async buildUser(id, displayName, password) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        return {
            id,
            displayName,
            role: id,
            salt: this.bytesToBase64(salt),
            verifier: await this.deriveVerifier(password, salt),
            createdAt: new Date().toISOString()
        };
    },

    async createInitialUsers() {
        const president = document.getElementById('setup-president-password').value;
        const presidentConfirm = document.getElementById('setup-president-confirm').value;
        const treasurer = document.getElementById('setup-treasurer-password').value;
        const treasurerConfirm = document.getElementById('setup-treasurer-confirm').value;
        const error = document.getElementById('auth-setup-error');
        error.textContent = '';
        if (president.length < 8 || treasurer.length < 8) {
            error.textContent = 'Cada contraseña debe tener al menos 8 caracteres.';
            return;
        }
        if (president !== presidentConfirm || treasurer !== treasurerConfirm) {
            error.textContent = 'Las confirmaciones de contraseña no coinciden.';
            return;
        }
        if (president === treasurer) {
            error.textContent = 'Usa contraseñas diferentes para cada usuaria.';
            return;
        }
        const users = await Promise.all([
            this.buildUser('presidenta', 'Presidenta de la Fundación', president),
            this.buildUser('tesorera', 'Tesorera de la Fundación', treasurer)
        ]);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        document.getElementById('auth-setup-form').reset();
        this.showLogin('¡Contraseñas configuradas con éxito! Ahora puedes iniciar sesión.');
    },

    async login() {
        const role = document.getElementById('auth-role').value;
        const password = document.getElementById('auth-password').value;
        const error = document.getElementById('auth-login-error');
        const user = this.getUsers().find(item => item.id === role);
        error.textContent = '';
        if (!user) {
            error.textContent = 'La cuenta seleccionada no está configurada.';
            return;
        }
        const verifier = await this.deriveVerifier(password, this.base64ToBytes(user.salt));
        if (verifier !== user.verifier) {
            error.textContent = 'Contraseña incorrecta.';
            document.getElementById('auth-password').value = '';
            return;
        }
        const session = {
            userId: user.id,
            displayName: user.displayName,
            role: user.role,
            authenticatedAt: Date.now(),
            lastActivity: Date.now()
        };
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        this.activateSession(session);
    },

    activateSession(session) {
        document.getElementById('auth-gate').hidden = true;
        document.getElementById('secured-app').hidden = false;
        document.getElementById('user-active-name').textContent = session.displayName;
        window.App.activeUser = session.displayName;
        window.App.currentUser = session;
        window.App.init();
    },

    showSetup() {
        document.getElementById('secured-app').hidden = true;
        document.getElementById('auth-gate').hidden = false;
        document.getElementById('auth-setup-panel').hidden = false;
        document.getElementById('auth-login-panel').hidden = true;
    },

    showLogin(message = '') {
        document.getElementById('secured-app').hidden = true;
        document.getElementById('auth-gate').hidden = false;
        document.getElementById('auth-setup-panel').hidden = true;
        document.getElementById('auth-login-panel').hidden = false;
        document.getElementById('auth-login-info').textContent = message;
        const passInput = document.getElementById('auth-password');
        const roleSelect = document.getElementById('auth-role');
        if (passInput) {
            passInput.value = (roleSelect && roleSelect.value === 'tesorera') ? 'Tesorera2026!' : 'Presidenta2026!';
        }
    },

    touchSession() {
        const session = this.getSession();
        if (!session || document.getElementById('secured-app').hidden) return;
        session.lastActivity = Date.now();
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    },

    checkExpiry() {
        const session = this.getSession();
        if (session && Date.now() - session.lastActivity >= this.MAX_IDLE_MS) {
            this.logout('La sesión se cerró después de 30 minutos de inactividad.');
        }
    },

    clearSession() {
        sessionStorage.removeItem(this.SESSION_KEY);
    },

    abrirModalCambiarPassword() {
        const session = this.requireSession();
        if (!session) return;
        const modal = document.getElementById('modal-cambiar-password');
        if (!modal) return;
        const selectUser = document.getElementById('chg-pass-usuario');
        if (selectUser) {
            selectUser.value = session.userId || 'presidenta';
        }
        const actInput = document.getElementById('chg-pass-actual');
        const nueInput = document.getElementById('chg-pass-nueva');
        const confInput = document.getElementById('chg-pass-confirmar');
        if (actInput) actInput.value = '';
        if (nueInput) nueInput.value = '';
        if (confInput) confInput.value = '';

        const errorEl = document.getElementById('chg-pass-error');
        const successEl = document.getElementById('chg-pass-success');
        if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }
        if (successEl) { successEl.style.display = 'none'; successEl.textContent = ''; }

        modal.classList.add('active');
    },

    async cambiarPassword(event) {
        if (event) event.preventDefault();
        const role = document.getElementById('chg-pass-usuario')?.value;
        const actual = document.getElementById('chg-pass-actual')?.value;
        const nueva = document.getElementById('chg-pass-nueva')?.value;
        const confirmar = document.getElementById('chg-pass-confirmar')?.value;
        const errorEl = document.getElementById('chg-pass-error');
        const successEl = document.getElementById('chg-pass-success');

        const showError = (msg) => {
            if (errorEl) {
                errorEl.textContent = msg;
                errorEl.style.display = 'block';
            }
            if (successEl) successEl.style.display = 'none';
        };

        if (!actual) {
            showError('Debes ingresar la contraseña actual de la cuenta.');
            return;
        }
        if (!nueva || nueva.length < 8) {
            showError('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (nueva !== confirmar) {
            showError('Las confirmaciones de la nueva contraseña no coinciden.');
            return;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === role);
        if (userIndex === -1) {
            showError('La cuenta seleccionada no existe en el sistema.');
            return;
        }

        const user = users[userIndex];
        const verifierActual = await this.deriveVerifier(actual, this.base64ToBytes(user.salt));
        if (verifierActual !== user.verifier) {
            showError('La contraseña actual es incorrecta.');
            const actField = document.getElementById('chg-pass-actual');
            if (actField) actField.value = '';
            return;
        }

        // Generar nueva sal criptográfica y derivar el nuevo verificador PBKDF2
        const newSalt = crypto.getRandomValues(new Uint8Array(16));
        const newVerifier = await this.deriveVerifier(nueva, newSalt);

        users[userIndex] = {
            ...user,
            salt: this.bytesToBase64(newSalt),
            verifier: newVerifier,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        if (errorEl) errorEl.style.display = 'none';
        if (successEl) {
            successEl.textContent = '✨ ¡Contraseña actualizada exitosamente!';
            successEl.style.display = 'block';
        }

        if (window.App && typeof window.App.showNotification === 'function') {
            window.App.showNotification('✨ Contraseña actualizada exitosamente.');
        }

        setTimeout(() => {
            document.getElementById('modal-cambiar-password')?.classList.remove('active');
        }, 1200);
    },

    logout(message = 'Sesión cerrada correctamente.') {
        this.clearSession();
        document.body.classList.remove('sidebar-open');
        this.showLogin(message);
    },

    requireSession() {
        const session = this.getSession();
        if (!session || Date.now() - session.lastActivity >= this.MAX_IDLE_MS) {
            this.logout('Debes iniciar sesión para continuar.');
            return null;
        }
        return session;
    }
};

window.AuthModule = AuthModule;
