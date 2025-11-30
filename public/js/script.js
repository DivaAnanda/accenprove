// public/js/script.js
const API_URL = window.location.origin;

console.log('🚀 Script loaded. API URL:', API_URL);

// FUNGSI TOGGLE PASSWORD
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}

// FUNGSI NAVIGASI
function showForm(formId) {
    document.querySelectorAll('.container').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(formId).classList.add('active');
}

function showLogin() { 
    // Clear URL parameters
    window.history.replaceState({}, document.title, '/');
    showForm('loginForm'); 
}

function showRegister() { showForm('registerForm'); }
function showResetPasswordInitial() { showForm('resetPasswordInitial'); }
function showGmailSuccess() { showForm('accountSuccess'); }

// HELPER FUNCTION
function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        ip: 'client-ip',
    };
}

async function fetchAPI(endpoint, options = {}) {
    try {
        const url = `${API_URL}${endpoint}`;
        console.log('📡 Fetching:', url);
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'same-origin',
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Response data:', data);
        
        return { response, data };
    } catch (error) {
        console.error('❌ API Error:', error);
        return { error: error.message };
    }
}

// FUNGSI LOGIN
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('✗ Email dan kata sandi tidak boleh kosong!');
        return;
    }
    
    console.log('🔐 Attempting login for:', email);
    
    const { data, error } = await fetchAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            deviceInfo: getDeviceInfo(),
        }),
    });
    
    if (error) {
        alert('✗ Terjadi kesalahan koneksi: ' + error);
        return;
    }
    
    if (data && data.success) {
        alert('✓ ' + data.message);
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('rememberMe').checked = false;
    } else {
        alert('✗ ' + (data?.message || 'Login gagal'));
    }
}

// FUNGSI REGISTER
async function register(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('✗ Semua field harus diisi!');
        return;
    }
    
    if (!agreeTerms) {
        alert('✗ Anda harus setuju dengan Syarat & Ketentuan!');
        return;
    }
    
    console.log('📝 Attempting registration for:', email);
    
    const { data, error } = await fetchAPI('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        }),
    });
    
    if (error) {
        alert('✗ Terjadi kesalahan koneksi: ' + error);
        return;
    }
    
    if (data && data.success) {
        document.getElementById('confirmEmail').textContent = email;
        showForm('gmailConfirm');
        
        // Clear form
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('agreeTerms').checked = false;
    } else {
        alert('✗ ' + (data?.message || 'Registrasi gagal'));
    }
}

// FUNGSI RESET PASSWORD - TAHAP 1 (Kirim Email)
async function resetPasswordStep1(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        alert('✗ Email tidak boleh kosong!');
        return;
    }
    
    console.log('🔑 Requesting password reset for:', email);
    
    const { data, error } = await fetchAPI('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
    
    if (error) {
        alert('✗ Terjadi kesalahan koneksi: ' + error);
        return;
    }
    
    if (data && data.success) {
        // Simpan email untuk reference
        sessionStorage.setItem('resetEmail', email);
        
        // UNTUK DEMO: Tampilkan alert dengan instruksi
        alert('✓ ' + data.message + '\n\n📧 Dalam mode production, email akan dikirim ke inbox Anda.\n\n⚠️ Untuk demo/testing tanpa SMTP, klik OK lalu akan langsung ke form password baru.');
        
        // Clear form
        document.getElementById('resetEmail').value = '';
        
        // DEMO MODE: Langsung ke form password baru
        // Di production, user harus klik link di email
        showForm('resetPasswordNew');
    } else {
        alert('✗ ' + (data?.message || 'Reset password gagal'));
    }
}

// FUNGSI RESET PASSWORD - TAHAP 2 (Update Password)
async function resetPasswordStep2(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (!newPassword || !confirmNewPassword) {
        alert('✗ Kata sandi tidak boleh kosong!');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('✗ Konfirmasi kata sandi tidak cocok!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('✗ Kata sandi minimal 6 karakter!');
        return;
    }
    
    console.log('🔐 Updating password...');
    
    // DEMO MODE: Gunakan token dummy
    // Di production, token diambil dari URL setelah klik link email
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    
    // Jika tidak ada token di URL (demo mode), buat token dummy
    if (!token) {
        console.log('⚠️ Demo mode: Using dummy token');
        // Di production, ini akan error dan user harus request link baru
        alert('⚠️ Mode Demo: Dalam production, Anda harus klik link dari email.\n\nUntuk demo ini, sistem akan simulasikan update password.');
        
        // Update password untuk demo user
        const demoEmail = sessionStorage.getItem('resetEmail') || 'demo@gmail.com';
        
        // Simulasi success
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        sessionStorage.removeItem('resetEmail');
        
        alert('✓ Password berhasil diubah (DEMO MODE)!\n\n📧 Dalam production, email konfirmasi akan dikirim.\n\nSilakan login dengan password baru Anda.');
        
        showForm('resetPasswordSuccess');
        return;
    }
    
    // PRODUCTION MODE: Gunakan token dari URL
    const { data, error } = await fetchAPI('/api/auth/verify-reset-token', {
        method: 'POST',
        body: JSON.stringify({
            token,
            newPassword,
            confirmPassword: confirmNewPassword,
        }),
    });
    
    if (error) {
        alert('✗ Terjadi kesalahan koneksi: ' + error);
        return;
    }
    
    if (data && data.success) {
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        sessionStorage.removeItem('resetEmail');
        
        // Remove token from URL
        window.history.replaceState({}, document.title, '/');
        
        showForm('resetPasswordSuccess');
        alert('✓ ' + data.message + '\n\n📧 Email konfirmasi telah dikirim.');
    } else {
        alert('✗ ' + (data?.message || 'Reset password gagal'));
    }
}

// FUNGSI OTP
async function requestOTP(email) {
    console.log('📱 Requesting OTP for:', email);
    
    const { data, error } = await fetchAPI('/api/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
    
    if (error) {
        alert('✗ Terjadi kesalahan koneksi: ' + error);
        return false;
    }
    
    if (data && data.success) {
        alert('✓ ' + data.message);
        return true;
    } else {
        alert('✗ ' + (data?.message || 'Request OTP gagal'));
        return false;
    }
}

async function verifyOTP(email, otp) {
    console.log('🔐 Verifying OTP for:', email);
    
    const { data, error } = await fetchAPI('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
    });
    
    if (error) {
        alert('✗ Terjadi kesalahan koneksi: ' + error);
        return false;
    }
    
    if (data && data.success) {
        alert('✓ ' + data.message);
        return true;
    } else {
        alert('✗ ' + (data?.message || 'Verifikasi OTP gagal'));
        return false;
    }
}

console.log('✅ All functions loaded');