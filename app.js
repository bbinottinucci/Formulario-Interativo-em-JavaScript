// REFERÊNCIAS GLOBAIS
const form = document.getElementById('cadastroForm');
const submitBtn = document.getElementById('submitBtn');
const termsCheckbox = document.getElementById('terms');
const errorSummary = document.getElementById('error-summary');

// Etapa 1
const nameInput = document.getElementById('name');
const nameMirror = document.getElementById('nameMirror');
const charCount = document.getElementById('charCount');
const MAX_LENGTH = 50;

// Etapa 2
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const CIDADES_DATA = {
    'SP': ['São Paulo', 'Campinas', 'Santos'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Angra dos Reis'],
    'MG': ['Belo Horizonte', 'Ouro Preto', 'Uberlândia']
};

// Etapa 3
const emailInput = document.getElementById('email');
const emailFeedback = document.getElementById('emailFeedback');

// Etapa 5
const passwordInput = document.getElementById('password');
const passwordStrength = document.getElementById('password-strength');
const courseSelect = document.getElementById('course');

// FUNÇÕES DE VALIDAÇÃO GERAIS

// Validação de Nome (mínimo 3)
const validateName = () => nameInput.value.length >= 3 && nameInput.value.length <= MAX_LENGTH;

// Validação de E-mail (formato básico)
const validateEmail = () => {
    const value = emailInput.value;
    // verificar se tem @ e um ponto após o @
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

// Validação de Curso (select obrigatório)
const validateCourse = () => courseSelect.value !== '';

// Validação de Senha com Indicador de Força (Etapa 5)
// Requisitos

const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++; // Pelo menos 8 caracteres
    if (/[A-Z]/.test(password)) strength++; // Letra maiúscula
    if (/[0-9]/.test(password)) strength++; // Número
    if (/[^A-Za-z0-9]/.test(password)) strength++; // Símbolo

    passwordStrength.className = '';
    
    if (password.length === 0) {
        return '';
    } else if (strength <= 1) {
        passwordStrength.classList.add('weak');
        return 'fraca';
    } else if (strength <= 3) {
        passwordStrength.classList.add('medium');
        return 'média';
    } else {
        passwordStrength.classList.add('strong');
        return 'forte';
    }
};

// Função Principal que checa o formulário e atualiza o botão
const validateForm = () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isCourseValid = validateCourse();
    const isTermsChecked = termsCheckbox.checked;
    
    // Para o desafio final, exigimos uma senha 'forte'
    const passwordLevel = checkPasswordStrength(passwordInput.value);
    const isPasswordStrongEnough = passwordLevel === 'forte';

    // Se a validação do campo nome falhar, aplica a classe 'invalid'
    nameInput.classList.toggle('invalid', !isNameValid);

    // Se o email estiver preenchido mas for inválido
    emailInput.classList.toggle('invalid', emailInput.value !== '' && !isEmailValid);
    emailInput.classList.toggle('valid', emailInput.value !== '' && isEmailValid);

    // Habilita o botão apenas se TUDO for válido
    const allValid = isNameValid && isEmailValid && isCourseValid && isTermsChecked && isPasswordStrongEnough;
    submitBtn.disabled = !allValid;
    
    return { isNameValid, isEmailValid, isCourseValid, isTermsChecked, isPasswordStrongEnough };
};

// =========================================================
// EVENTOS
// =========================================================

// --- Etapa 1: Contador de Caracteres ---
nameInput.addEventListener('input', (event) => {
    const value = event.target.value;
    const length = value.length;

    nameMirror.textContent = value;
    charCount.textContent = `${length}/${MAX_LENGTH}`;

    // Feedback visual (vermelho se ultrapassar 50)
    if (length > MAX_LENGTH) {
        nameInput.classList.add('invalid');
        charCount.classList.add('error');
    } else {
        nameInput.classList.remove('invalid');
        charCount.classList.remove('error');
    }
    
    validateForm(); // Revalida o botão Enviar
});

// --- Etapa 2: Select Dependente (Estado -> Cidade) ---
citySelect.disabled = true; // Desabilitar cidades inicialmente

stateSelect.addEventListener('change', (event) => {
    const selectedState = event.target.value;
    
    // Limpa e reinicializa
    citySelect.innerHTML = '<option value="">Selecione a Cidade</option>';
    citySelect.disabled = true;

    if (selectedState && CIDADES_DATA[selectedState]) {
        citySelect.disabled = false;
        
        CIDADES_DATA[selectedState].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
    validateForm();
});

// --- Etapa 3: Foco e Blur (E-mail) ---
emailInput.addEventListener('focus', () => {
    emailInput.classList.add('focus-blue');
    emailFeedback.textContent = 'Aguardando digitação...';
    emailFeedback.className = 'feedback';
});

emailInput.addEventListener('blur', () => {
    emailInput.classList.remove('focus-blue');
    
    const value = emailInput.value;

    if (value === '') {
        emailFeedback.textContent = 'O campo E-mail é obrigatório.';
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        emailFeedback.classList.add('error');
    } else if (!validateEmail()) {
        emailFeedback.textContent = 'Formato de e-mail inválido (ex: usuario@dominio.com).';
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        emailFeedback.classList.add('error');
    } else {
        emailFeedback.textContent = 'E-mail validado com sucesso.';
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
        emailFeedback.classList.remove('error');
        emailFeedback.classList.add('success');
    }
    validateForm();
});

// --- Etapa 5: Indicador de Força de Senha ---
passwordInput.addEventListener('input', () => {
    // A função checkPasswordStrength já atualiza o estilo do div
    checkPasswordStrength(passwordInput.value);
    validateForm();
});

// --- Validação em tempo real (para o botão) ---
// Qualquer mudança nos campos revalida o botão de submit.
courseSelect.addEventListener('change', validateForm);
termsCheckbox.addEventListener('change', validateForm);


// --- Etapa 4/5: Validação Final e Submit ---
form.addEventListener('submit', (event) => {
    event.preventDefault(); // <-- OBRIGATÓRIO: Impede o envio padrão do formulário
    
    const results = validateForm();
    let errorMessages = [];
    
    // Revalidação final e coleta de mensagens de erro
    if (!results.isNameValid) errorMessages.push('Nome: deve ter entre 3 e 50 caracteres.');
    if (!results.isEmailValid) errorMessages.push('E-mail: o formato não é válido.');
    if (!results.isCourseValid) errorMessages.push('Curso: a seleção é obrigatória.');
    if (!results.isPasswordStrongEnough) errorMessages.push('Senha: deve ser forte (mín. 8 caracteres, maiúsculas, números e símbolos).');
    if (!results.isTermsChecked) errorMessages.push('Aceite os termos para continuar.');

    if (errorMessages.length > 0) {
        // Exibe o sumário de erros
        errorSummary.innerHTML = `**Foram encontrados ${errorMessages.length} erros:**<ul>${errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>`;
        errorSummary.style.display = 'block';
        alert('Formulário inválido! Verifique o sumário de erros abaixo.');
    } else {
        // Envio com sucesso
        errorSummary.style.display = 'none';
        
        // Simulação de envio de dados
        console.log("Dados prontos para envio:", new FormData(form));
        alert('🚀 Cadastro enviado com sucesso!');
        
        // Reset do formulário após envio com sucesso
        form.reset(); 
        
        // Resetar estados visuais e feedback
        submitBtn.disabled = true;
        nameInput.classList.remove('valid', 'invalid');
        emailInput.classList.remove('valid', 'invalid', 'focus-blue');
        passwordInput.classList.remove('valid', 'invalid');
        passwordStrength.className = '';
        nameMirror.textContent = '';
        charCount.textContent = `0/${MAX_LENGTH}`;
        emailFeedback.textContent = '';
        errorSummary.innerHTML = '';
        
        // Resetar select dependente
        citySelect.innerHTML = '<option value="">Selecione a Cidade</option>';
        citySelect.disabled = true;
    }
});