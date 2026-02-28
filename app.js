import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyCod7fdpg39a6a4yl35d5e30jAGXrrA7R8",
    authDomain: "vkseishop.firebaseapp.com",
    projectId: "vkseishop",
    storageBucket: "vkseishop.firebasestorage.app",
    messagingSenderId: "920882217983",
    appId: "1:920882217983:web:c78ada6cc325dd6a099dca"
};

// Проверка конфигурации
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app, auth, googleProvider, microsoftProvider;

if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    microsoftProvider = new OAuthProvider('microsoft.com');
}

let currentMode = 'login';
let recaptchaVerifier = null;
let confirmationResult = null;

// Применяем тему и инициализируем
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme + '-theme');
    updateThemeIcon(savedTheme);
    
    initThemeToggle();
    initAuth();
});

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(newTheme + '-theme');
        
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-notification');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function initAuth() {
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const profileModal = document.getElementById('profileModal');
    const closeBtn = document.querySelector('.close');
    const closeProfileBtn = document.querySelector('.close-profile');
    const authForm = document.getElementById('authForm');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authError = document.getElementById('authError');
    const logoutBtn = document.getElementById('logoutBtn');

    // Открытие модального окна
    authBtn.addEventListener('click', () => {
        authModal.style.display = 'block';
    });

    // Закрытие модальных окон
    closeBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
        authError.textContent = '';
        const phoneAuthSection = document.getElementById('phoneAuthSection');
        if (phoneAuthSection) phoneAuthSection.style.display = 'none';
    });

    closeProfileBtn.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            authError.textContent = '';
            const phoneAuthSection = document.getElementById('phoneAuthSection');
            if (phoneAuthSection) phoneAuthSection.style.display = 'none';
        }
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });

    // Переключение вкладок
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.tab;
            authError.textContent = '';
            const phoneAuthSection = document.getElementById('phoneAuthSection');
            if (phoneAuthSection) phoneAuthSection.style.display = 'none';
            
            if (currentMode === 'register') {
                document.getElementById('modalTitle').textContent = 'Регистрация';
                document.querySelector('.submit-btn').textContent = 'Зарегистрироваться';
            } else {
                document.getElementById('modalTitle').textContent = 'Вход в аккаунт';
                document.querySelector('.submit-btn').textContent = 'Войти';
            }
        });
    });

    // Обработка формы Email
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.textContent = '';
        
        if (!isFirebaseConfigured) {
            authError.textContent = '⚠️ Firebase не настроен! Настрой в app.js';
            authError.style.color = '#ff9800';
            return;
        }
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        try {
            if (currentMode === 'register') {
                await createUserWithEmailAndPassword(auth, email, password);
                authModal.style.display = 'none';
                authForm.reset();
                showSuccessMessage('✅ Регистрация успешна!');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                authModal.style.display = 'none';
                authForm.reset();
                showSuccessMessage('✅ Вход выполнен!');
            }
        } catch (error) {
            let errorMessage = 'Произошла ошибка';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email уже используется';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Неверный формат email';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Пароль минимум 6 символов';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = 'Неверный email или пароль';
                    break;
            }
            
            authError.textContent = errorMessage;
        }
    });

    // Вход через Google
    const googleSignInBtn = document.getElementById('googleSignIn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            authError.textContent = '';
            
            if (!isFirebaseConfigured) {
                authError.textContent = '⚠️ Firebase не настроен!';
                authError.style.color = '#ff9800';
                return;
            }
            
            try {
                await signInWithPopup(auth, googleProvider);
                authModal.style.display = 'none';
                showSuccessMessage('✅ Вход через Google выполнен!');
            } catch (error) {
                authError.textContent = 'Ошибка входа через Google';
            }
        });
    }

    // Вход через Microsoft
    const microsoftSignInBtn = document.getElementById('microsoftSignIn');
    if (microsoftSignInBtn) {
        microsoftSignInBtn.addEventListener('click', async () => {
            authError.textContent = '';
            
            if (!isFirebaseConfigured) {
                authError.textContent = '⚠️ Firebase не настроен!';
                authError.style.color = '#ff9800';
                return;
            }
            
            try {
                await signInWithPopup(auth, microsoftProvider);
                authModal.style.display = 'none';
                showSuccessMessage('✅ Вход через Microsoft выполнен!');
            } catch (error) {
                authError.textContent = 'Ошибка входа через Microsoft';
            }
        });
    }

    // Показать форму входа по телефону
    const phoneSignInBtn = document.getElementById('phoneSignIn');
    if (phoneSignInBtn) {
        phoneSignInBtn.addEventListener('click', () => {
            const phoneAuthSection = document.getElementById('phoneAuthSection');
            phoneAuthSection.style.display = 'block';
            authError.textContent = '';
            
            if (!isFirebaseConfigured) {
                authError.textContent = '⚠️ Firebase не настроен!';
                authError.style.color = '#ff9800';
                return;
            }
            
            // Инициализация reCAPTCHA
            if (!recaptchaVerifier) {
                recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'normal',
                    'callback': () => {
                        console.log('reCAPTCHA решена');
                    }
                });
            }
        });
    }

    // Отправка кода на телефон
    const sendCodeBtn = document.getElementById('sendCode');
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', async () => {
            authError.textContent = '';
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            
            if (!phoneNumber.startsWith('+')) {
                authError.textContent = 'Номер должен начинаться с + (например: +79991234567)';
                return;
            }
            
            try {
                confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
                document.getElementById('codeSection').style.display = 'block';
                sendCodeBtn.disabled = true;
                authError.textContent = '';
                authError.style.color = '#4caf50';
                authError.textContent = '✅ Код отправлен на телефон!';
            } catch (error) {
                authError.textContent = 'Ошибка отправки кода: ' + error.message;
            }
        });
    }

    // Проверка кода
    const verifyCodeBtn = document.getElementById('verifyCode');
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', async () => {
            authError.textContent = '';
            const code = document.getElementById('verificationCode').value.trim();
            
            try {
                await confirmationResult.confirm(code);
                authModal.style.display = 'none';
                const phoneAuthSection = document.getElementById('phoneAuthSection');
                if (phoneAuthSection) phoneAuthSection.style.display = 'none';
                showSuccessMessage('✅ Вход по телефону выполнен!');
            } catch (error) {
                authError.textContent = 'Неверный код';
            }
        });
    }

    // Выход
    logoutBtn.addEventListener('click', async () => {
        if (isFirebaseConfigured) {
            await signOut(auth);
        }
        profileModal.style.display = 'none';
        showSuccessMessage('Вы вышли из аккаунта');
    });

    // Отслеживание состояния авторизации
    if (isFirebaseConfigured) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                authBtn.textContent = 'Профиль';
                authBtn.onclick = () => {
                    document.getElementById('userEmail').textContent = user.email || user.phoneNumber || 'Не указано';
                    document.getElementById('userName').textContent = user.displayName || 'Пользователь';
                    profileModal.style.display = 'block';
                };
            } else {
                authBtn.textContent = 'Войти';
            }
        });
    }
}
