function generatePassword(length = 12) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:',.<>/?";
    let password = [
        chars[Math.floor(Math.random() * 26)], // lowercase
        chars[Math.floor(Math.random() * 26) + 26], // uppercase
        chars[Math.floor(Math.random() * 10) + 52], // digit
        chars[Math.floor(Math.random() * 32) + 62] // symbol
    ];
    for (let i = 4; i < length; i++) {
        password.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    return password.sort(() => Math.random() - 0.5).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gen-form');
    const resultDiv = document.getElementById('result');
    const passwordSpan = document.getElementById('password');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const copyMsg = document.getElementById('copy-msg');
    const downloadOptionModal = document.getElementById('downloadOptionModal');
    const zipYesBtn = document.getElementById('zip-yes');
    const zipNoBtn = document.getElementById('zip-no');
    const zipCancelBtn = document.getElementById('zip-cancel');
    const passwordModal = document.getElementById('passwordModal');
    const downloadZipBtn = document.getElementById('download-zip-btn');
    const passwordCancelBtn = document.getElementById('password-cancel');
    const userPassword = document.getElementById('userPassword');
    const userPasswordConfirm = document.getElementById('userPasswordConfirm');
    const downloadError = document.getElementById('download-error');

    let currentPassword = "";

    form.addEventListener('submit', e => {
        e.preventDefault();
        const length = parseInt(document.getElementById('length').value) || 12;
        currentPassword = generatePassword(length);
        passwordSpan.textContent = currentPassword;
        resultDiv.style.display = 'block';
        copyMsg.style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentPassword).then(() => {
            copyMsg.style.display = 'inline';
            setTimeout(() => { copyMsg.style.display = 'none'; }, 1500);
        });
    });

    downloadBtn.addEventListener('click', () => {
        downloadOptionModal.style.display = 'block';
    });

    zipYesBtn.addEventListener('click', () => {
        downloadOptionModal.style.display = 'none';
        passwordModal.style.display = 'block';
        userPassword.value = '';
        userPasswordConfirm.value = '';
        downloadError.style.display = 'none';
    });

    zipNoBtn.addEventListener('click', () => {
        downloadOptionModal.style.display = 'none';
        const txtBlob = new Blob([currentPassword], {type: "text/plain"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(txtBlob);
        link.download = "password.txt";
        link.click();
    });

    zipCancelBtn.addEventListener('click', () => {
        downloadOptionModal.style.display = 'none';
    });

    passwordCancelBtn.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });

    downloadZipBtn.addEventListener('click', async () => {
        if (userPassword.value !== userPasswordConfirm.value || !userPassword.value) {
            downloadError.style.display = 'inline';
            return;
        }
        downloadError.style.display = 'none';
        // Create password.txt blob
        const txtBlob = new Blob([currentPassword], {type: "text/plain"});
        // Use zip.js to create password-protected zip
        const writer = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {
            password: userPassword.value,
            encryptionStrength: 3 // AES-256
        });
        await writer.add("password.txt", new zip.BlobReader(txtBlob));
        const zipBlob = await writer.close();
        // Download zip
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = "password.zip";
        link.click();
        passwordModal.style.display = 'none';
    });
});