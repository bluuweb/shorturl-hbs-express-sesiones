const express = require("express");
const { body } = require("express-validator");
const {
    formRegister,
    registrarUsuario,
    confirmarCuenta,
    formLogin,
    loginUsuario,
} = require("../controllers/authController");
const router = express.Router();

router.get("/register", formRegister);

router.post(
    "/register",
    [
        body("nombre", "Ingrese un nombre").trim().notEmpty().escape(),
        body("email", "Ingrese un email válido")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body("password", "Contraseña con 6 o más carácteres")
            .trim()
            .isLength({ min: 6 })
            .escape()
            .custom((value, { req }) => {
                if (value !== req.body.passwordRepit) {
                    throw new Error("Password no coinciden");
                } else {
                    return value;
                }
            }),
    ],
    registrarUsuario
);

router.get("/register/:tokenConfirm", confirmarCuenta);
router.get("/login", formLogin);
router.post(
    "/login",
    [
        body("email", "Ingrese un email válido")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body("password", "Contraseña no cumple el formato")
            .trim()
            .isLength({ min: 6 })
            .escape(),
    ],
    loginUsuario
);

module.exports = router;
