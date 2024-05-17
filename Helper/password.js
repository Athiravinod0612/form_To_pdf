const bcrypt = require('bcrypt');

const bcryptPassword = async (text) => {
    try {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(text, salt);
        return passwordHash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

module.exports = {
    bcryptPassword,
    comparePassword
};
