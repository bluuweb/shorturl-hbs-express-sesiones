const { URL } = require("url");

const validarURL = (req, res, next) => {
    try {
        const { originURL } = req.body;
        const urlFrontend = new URL(originURL);
        if (urlFrontend.origin !== "null") {
            return next();
        } else {
            throw new Error("no válida 😲");
        }
    } catch (error) {
        // console.log(error);
        return res.redirect("/");
    }
};

module.exports = validarURL;
