const { URL } = require("url");

const validarURL = (req, res, next) => {
    try {
        const { originURL } = req.body;
        const urlFrontend = new URL(originURL);
        if (urlFrontend.origin !== "null") {
            // validación para que no envíen ftp://
            if (
                urlFrontend.protocol === "http:" ||
                urlFrontend.protocol === "https:"
            ) {
                return next();
            }
        }
        throw new Error("no válida 😲");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

module.exports = validarURL;
