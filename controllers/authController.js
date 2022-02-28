const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const formRegister = (req, res) => {
    res.render("register", { mensajes: req.flash("mensajes") });
};

const registrarUsuario = async (req, res) => {
    const { nombre, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect("/register");
    }

    try {
        if (await User.findOne({ email })) {
            throw new Error("Ya existe este usuario");
        }

        const user = new User({ username: nombre, email, password });
        user.tokenConfirm = nanoid();
        console.log(user);
        await user.save();

        // res.json(user);
        req.flash("mensajes", [
            { msg: "Revise su correo electrónico para confirmar cuenta" },
        ]);
        res.redirect("/login");
    } catch (error) {
        // console.log(error);
        // res.send(error.message);
        req.flash("mensajes", [{ msg: error.message }]);
        res.redirect("/register");
    }
};

const confirmarCuenta = async (req, res) => {
    const { tokenConfirm } = req.params;
    try {
        const user = await User.findOne({ tokenConfirm });
        if (!user) throw new Error("no se pudo confirmar cuenta");

        user.tokenConfirm = null;
        user.confirm = true;

        await user.save();

        // res.render("login");
        req.flash("mensajes", [{ msg: "Cuenta confirmada" }]);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};

const formLogin = (req, res) => {
    res.render("login", { mensajes: req.flash("mensajes") });
};

const loginUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect("/login");
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) throw new Error("No existe el usuario");

        if (!user.confirm) throw new Error("Usuario no confirmado");

        if (!(await user.comparePassword(password))) {
            throw new Error("Password incorrecta");
        }

        res.redirect("/");
    } catch (error) {
        // console.log(error);
        // res.send(error.message);
        req.flash("mensajes", [{ msg: error.message }]);
        res.redirect("/login");
    }
};

module.exports = {
    formRegister,
    registrarUsuario,
    confirmarCuenta,
    formLogin,
    loginUsuario,
};
