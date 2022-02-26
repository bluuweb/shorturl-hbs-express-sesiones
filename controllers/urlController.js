const Url = require("../models/Url");

const homeUrl = async (req, res) => {
    try {
        const urls = await Url.find().lean();
        res.render("home", { titulo: "Página de inicio", urls });
    } catch (error) {
        console.log(error);
    }
};

const agregarUrl = async (req, res) => {
    const { originURL } = req.body;

    const url = new Url({ origin: originURL });
    try {
        await url.save();
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

const eliminarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        await Url.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const urlDB = await Url.findById(id).lean();
        // console.log(urlDB);
        res.render("home", { titulo: "Página de inicio", urlDB });
    } catch (error) {
        console.log(error);
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { originURL } = req.body;
    try {
        const url = await Url.findById(id);
        if (!url) {
            console.log("no exite 2");
            return res.send("error no existe el documento a editar");
        }

        await Url.findByIdAndUpdate(id, { origin: originURL });

        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

const redireccionar = async (req, res) => {
    const { shortURL } = req.params;
    // console.log(shortURL);
    if (!shortURL) return res.send("fallá el parametro");
    if (shortURL === "favicon.ico") return res.send("fallá el parametro");
    try {
        const url = await Url.findOne({ shortURL });
        // console.log(url);
        if (!url?.origin) {
            console.log("no exite 1");
            return res.send("error no existe el redireccionamiento");
        }

        res.redirect(url.origin);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    homeUrl,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionar,
};
