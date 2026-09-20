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
        const users = this.getUsers();
        const session = this.getSession();
        if (!users.length) {
            this.showSetup();
        } else if (session && Date.now() - session.lastActivity < this.MAX_IDLE_MS) {
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
        document.getElementById('btn-auth-logout')?.addEventListener('click', () => this.logout());
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
        if (president.length < 10 || treasurer.length < 10) {
            error.textContent = 'Cada contraseña debe tener al menos 10 caracteres.';
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
        this.showLogin('Configuración terminada. Inicia sesión con una de las cuentas.');
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
        document.getElementById('auth-password').value = '';
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
