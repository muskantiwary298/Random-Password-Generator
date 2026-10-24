
const passwordField = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}?"
};

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function secureRandom(max) {
    const random = new Uint32Array(1);
    const limit = Math.floor(4294967296 / max) * max;

    do {
        crypto.getRandomValues(random);
    } while (random[0] >= limit);

    return random[0] % max;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function generatePassword() {
    message.textContent = "";

    const selectedSets = [];

    if (uppercase.checked) {
        selectedSets.push(characterSets.uppercase);
    }

    if (lowercase.checked) {
        selectedSets.push(characterSets.lowercase);
    }

    if (numbers.checked) {
        selectedSets.push(characterSets.numbers);
    }

    if (symbols.checked) {
        selectedSets.push(characterSets.symbols);
    }

    if (selectedSets.length === 0) {
        passwordField.value = "";
        message.textContent = "Please select at least one option!";
        return;
    }

    const length = Number(lengthSlider.value);
    const allCharacters = selectedSets.join("");
    const passwordCharacters = [];

    // Include at least one character from every selected group
    selectedSets.forEach((set) => {
        passwordCharacters.push(set[secureRandom(set.length)]);
    });

    // Fill the remaining password length
    while (passwordCharacters.length < length) {
        passwordCharacters.push(
            allCharacters[secureRandom(allCharacters.length)]
        );
    }

    passwordField.value = shuffle(passwordCharacters).join("");
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", async () => {
    const password = passwordField.value;

    if (!password) {
        message.textContent = "Generate a password first!";
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        message.textContent = "Password copied successfully!";
    } catch {
        message.textContent =
            "Copy unavailable. Please select and copy the password manually.";
    }
});

// Generate a password when the page opens
generatePassword();
