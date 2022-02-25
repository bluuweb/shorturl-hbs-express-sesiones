const express = require("express");
const {
    homeUrl,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionar,
} = require("../controllers/urlController");
const validarURL = require("../middlewares/validarURL");

const router = express.Router();

router.get("/", homeUrl);

router.post("/", validarURL, agregarUrl);

router.get("/eliminar/:id", eliminarUrl);

router.get("/editar/:id", editarUrlForm);

router.post("/editar/:id", validarURL, editarUrl);

router.get("/:shortURL", redireccionar);

module.exports = router;
