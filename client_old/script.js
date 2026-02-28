let clerk;

window.addEventListener('load', async () => {
    clerk = window.Clerk;
    await clerk.load();
    console.log("Clerk loaded successfully.");
})

const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const termsCheckbox = document.getElementById("terms-checkbox")
const form = document.getElementById('signup-form');
const errorElement = document.getElementById('error');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    if(firstName.value.trim() === '') {
        showError(firstName, 'first-name-error', 'First name is required');
        isValid = false;
    }

    if(lastName.value.trim() === '') {
        showError(lastName, 'last-name-error', 'Last name is required');
        isValid = false;
    }

    if(email.value.trim() === '') {
        showError(email, 'email-error', 'Email is required');
        isValid = false;
    } else if (!emailPattern.test(email.value.trim())){
        showError(email, 'email-error', 'Please enter a valid email');
        isValid = false;
    }

    if(password.value.trim() === '') {
        showError(password, 'password-error', 'Password is required');
        isValid = false;
    } else if (!isPasswordValid(password.value.trim())) {
        showError(password, 'password-error', 'Password requirements not met');
        isValid = false;
    }

    if(!termsCheckbox.checked){
        showError(termsCheckbox, 'terms-checkbox-error', 'You must agree to the terms and service');
        termsCheckbox.classList.add('error');
        isValid = false;
    }

    if(isValid) {
        const submitButton = form.querySelector('.btn');

        submitButton.classList.add('btn-loading');
        submitButton.disabled = true;

        try {
            const signUpAttempt = await clerk.client.signUp.create({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                emailAddress: email.value.trim(),
                password: password.value,
            });


            await signUpAttempt.prepareEmailAddressVerification({
                strategy: "email_code"
            });
            window.location.href = "verify-email.html";

            console.log("Signup successful! Awaiting email verification.");
            console.log("User ID:", signUpAttempt.id);


        } catch (error) {
            submitButton.classList.remove('btn-loading');
            submitButton.disabled = false;

            console.error("Clerk signup error:", error);
            if (error.errors) {
                error.errors.forEach(err => {
                    console.log("Error code:", err.code);
                    
                    if (err.code === "form_identifier_exists") {
                        showError(email, 'email-error', 'This email is already registered');
                    } else if (err.code === "form_password_pwned") {
                        showError(password, 'password-error', 'This password has been compromised. Please use a different one.');
                    } else if (err.code === "form_param_format_invalid") {
                        showError(email, 'email-error', 'Invalid email format');
                    }
                });
            } else {
                alert("An error occured during signup. Please try again.");
            }
        }
    } else {
        console.log("do not submit");
    }
})

function showError(inputElement, errorElementId, errorMessage){
    inputElement.classList.add('error');
    document.getElementById(errorElementId).textContent = errorMessage;
}

function clearError(inputElement){
    inputElement.classList.remove('error');
    document.getElementById(inputElement.id + '-error').textContent = '';
}

function checkPasswordRequirements(passwordValue) {
    return {
        hasMinLength: passwordValue.length >= 8,
        hasUppercase: /[A-Z]/.test(passwordValue),
        hasLowercase: /[a-z]/.test(passwordValue),
        hasNumber: /[0-9]/.test(passwordValue),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)
    };
}

function isPasswordValid(passwordValue) {
    const checks = checkPasswordRequirements(passwordValue);

    return checks.hasMinLength && 
           checks.hasUppercase && 
           checks.hasLowercase && 
           checks.hasNumber && 
           checks.hasSpecial;
}

firstName.addEventListener('input', () => {
    clearError(firstName);
});

lastName.addEventListener('input', () => {
    clearError(lastName);
})

email.addEventListener('input', () => {
    clearError(email);
})

password.addEventListener('input', () => {
    const checks = checkPasswordRequirements(password.value);

    const lengthReq = document.getElementById('req-length');
    if(checks.hasMinLength){
        lengthReq.classList.add('met');
        lengthReq.querySelector('.req-icon').textContent = '✓';
    } else {
        lengthReq.classList.remove('met');
        lengthReq.querySelector('.req-icon').textContent = '✗';
    }

    const upperReq = document.getElementById('req-uppercase');
    if(checks.hasUppercase){
        upperReq.classList.add('met');
        upperReq.querySelector('.req-icon').textContent = '✓';
    } else {
        upperReq.classList.remove('met');
        upperReq.querySelector('.req-icon').textContent = '✗';
    }

    const lowerReq = document.getElementById('req-lowercase');
    if(checks.hasLowercase){
        lowerReq.classList.add('met');
        lowerReq.querySelector('.req-icon').textContent = '✓';
    } else {
        lowerReq.classList.remove('met');
        lowerReq.querySelector('.req-icon').textContent = '✗';
    }

    const numberReq = document.getElementById('req-number');
    if(checks.hasNumber){
        numberReq.classList.add('met');
        numberReq.querySelector('.req-icon').textContent = '✓';
    } else {
        numberReq.classList.remove('met');
        numberReq.querySelector('.req-icon').textContent = '✗';
    }

    const specialReq = document.getElementById('req-special');
    if(checks.hasSpecial){
        specialReq.classList.add('met');
        specialReq.querySelector('.req-icon').textContent = '✓';
    } else {
        specialReq.classList.remove('met');
        specialReq.querySelector('.req-icon').textContent = '✗';
    }
})

password.addEventListener('focus', () => {
    document.getElementById("password-requirements").style.display = "block";
})

password.addEventListener('blur', () => {
    if(!isPasswordValid(password.value.trim())){
        showError(password, 'password-error', 'Password requirements not met');
    } else {
        clearError(password)
    }
    document.getElementById("password-requirements").style.display = "none";
})

termsCheckbox.addEventListener('change', () => {
    if(termsCheckbox.checked){
        clearError(termsCheckbox);
        termsCheckbox.classList.remove('met');
    }
})