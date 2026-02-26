let clerk;

window.addEventListener('load', async () => {
    clerk = window.Clerk;
    await clerk.load();
    console.log("Clerk loaded successfully.");
})

const verifyForm = document.getElementById('verify-form');
const verificationCode = document.getElementById('verification-code');
const resendButton = document.getElementById('resend-code');

verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const code = verificationCode.value.trim();

    if (code.length !== 6) {
        showError('Please enter a 6-digit code');
        return;
    }

    try {
        const submitButton = verifyForm.querySelector('.btn');

        submitButton.classList.add('btn-loading');
        submitButton.disabled = true;

        const result = await clerk.client.signUp.attemptEmailAddressVerification({
            code: code
        });

        if (result.status === "complete") {
            await clerk.setActive({session: result.createdSessionId});

            const user = await clerk.user;
            
            try {
                const response = await fetch('http://localhost:8000/api/v1/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user.emailAddresses[0].emailAddress,
                        name: user.fullName
                    })
                });

            if(!response.ok) {
                const error = await response.json();
                throw new Error(error.detail);
            }

            } catch (fetchError) {
                console.error("Registration error:", fetchError);
                showError('Account verified but registration failed.');
            }
        }
    } catch (error) {
        submitButton.classList.remove('btn-loading');
        submitButton.disabled = false;
        
        console.error("Verification error:", error);
        if (error.errors) {
            error.errors.forEach(err => {
                if (err.code === "form_code_incorrect") {
                    showError('Incorrect code. Please try again.');
                } else if (err.code === "verification_expired") {
                    showError('Code expired. Click "Resend" to get a new one.');
                } else {
                    showError('Verification failed. Please try again.');
                }
            });
        } else {
            showError('Verification failed. Please try again.');
        }
    }
})

resendButton.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        await clerk.client.signUp.prepareEmailAddressVerification({
            strategy: "email_code"
        });

        clearError();
        alert("New code sent! Check your email.");
    } catch (error) {
        console.error("Resend error:", error);
        showError('Failed to resend code. Please try again.');
    }
})

function showError(message){
    document.getElementById('code-error').textContent = message;
    verificationCode.classList.add('error');
}

function clearError(){
    document.getElementById('code-error').textContent = '';
    verificationCode.classList.remove('error');
}

verificationCode.addEventListener('input', clearError)