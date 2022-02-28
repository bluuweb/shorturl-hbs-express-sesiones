const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        match: [/^[a-zA-Z0-9]+$/, "Solo letras y números"],
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        index: { unique: true },
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    tokenConfirm: {
        type: String,
        default: null,
    },
    confirm: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre("save", async function (next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    try {
        // generate a salt
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        console.log(error);
        next();
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
