const validateName = (name: string): boolean => {
    const nameRegex = /^(?!.*\s{2,})[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+){0,5}$/;
    return nameRegex.test(name);
};

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const validateBirthDate = (birthDate: string): boolean => {
    const actualYear = new Date().getFullYear();
    const birthYear = new Date(birthDate).getFullYear();
    return !isNaN(Date.parse(birthDate)) && (actualYear - birthYear >= 18);
}

const validateSpecialityDescriptionAndInterests = (text: string): boolean => {
    const textRegex = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9.,;:!?()'"%\-–—/@#&+\s]{3,1000}$/;
    return textRegex.test(text);
}

export { validateName, validateEmail, validateBirthDate, validateSpecialityDescriptionAndInterests };