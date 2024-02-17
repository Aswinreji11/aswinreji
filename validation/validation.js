
//middleware in js for checking email and username

const isvalidEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^s@]+$/;

    return emailRegex.test(email)

}

const isValidName = (name) => {

    return name.trim().length > 0;

}

const isValidPassword = (password) => {

    const passwordRegex = /(?=.*\d)(?=.*[a-z]).{8,}/;

    return passwordRegex.test(password)

}

module.exports = {
    isvalidEmail,
    isValidName,
    isValidPassword
}