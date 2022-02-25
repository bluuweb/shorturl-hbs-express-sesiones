# Express Template Engine
En este capítulo realizaremos un proyecto para conocer como trabajar con motores de plantilla y autenticación de usuarios entre otras cosas.

## Objetivos
- Motores de plantilla (template engine)
    - [HBS y/o EJS](https://bluuweb.github.io/node/03-vistas/)
- MongoDB
    - ShortURL
- Auth User
    - Rutas protegidas
    - Sessions
    - Passport
- Email
    - Enviar confirmación de cuenta
- Subir archivos
    - Cambiar foto de perfil

#### Próximos capítulos:
- API REST
- JWT
- Firebase
    - Auth
    - Firestore
- MEVN / MERN

## Template Engines
- [Template Engines](https://expressjs.com/es/guide/using-template-engines.html)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)

En una galaxia muy lejana...
```
npm init -y
npm i -D nodemon
npm i express express-handlebars
```

package.json
```json
"scripts": {
    "dev": "nodemon index.js"
},
```

nodemon.json
```json
{
    "ext": "js,json,hbs"
}
```

index.js
```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("probando...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server andando 🔥"));
```

Directorios
```
└── views
    ├── home.hbs
    └── layouts
        └── main.hbs
```

```js
const express = require("express");
const { create } = require("express-handlebars");

const app = express();

const hbs = create({
    extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.render("home", { titulo: "Página de inicio" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server andando 🔥"));
```

views/layouts/main.hbs
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Main</title>
</head>
<body>
    {{{body}}}
</body>
</html>
```

views/home.hbs
```html
<h1>{{titulo}}</h1>
```

## Partials/Components
```js
const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});
```

views/components/Navbar.hbs
```html
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container">
    <a class="navbar-brand" href="/">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav ms-auto">
        <a class="nav-link active" aria-current="page" href="/">Home</a>
        <a class="nav-link" href="/logup">LogUp</a>
        <a class="nav-link" href="/login">LogIn</a>
        <a class="nav-link" href="/logup">LogOut</a>
      </div>
    </div>
  </div>
</nav>
```

views/layout/main.hbs
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Main</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
</head>
<body>

    {{> Navbar}}

    <div class="container mt-2">
        {{{body}}}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
</body>
</html>
```

## Helpers
- [nanoid](https://github.com/ai/nanoid#install)
- [helpers hbs](https://handlebarsjs.com/guide/block-helpers.html#simple-iterators)

```js
app.get("/", (req, res) => {
    const urls = [
        { origin: "https://www.google.com", shortURL: nanoid(7) },
        { origin: "https://www.bluuweb.org", shortURL: nanoid(7) },
    ];
    res.render("home", { titulo: "Página de inicio", urls });
});
```

```html
<h1 class="text-center my-5">{{titulo}}</h1>

<ul>
    {{#each urls }}
        <li>{{this.origin}} - {{this.shortURL}}</li>
    {{/each}}
</ul>
```

components/Card.hbs
```html
<article class="card mb-2">
    <div class="card-body">
        <p>{{url.origin}}</p>
        <p>{{url.shortURL}}</p>
        <button class="btn btn-primary">Copiar</button>
        <a href="#" class="btn btn-danger">Eliminar</a>
    </div>
</article>
```

```html
<h1 class="text-center my-5">{{titulo}}</h1>

{{#each urls }}
    {{> Card url=this}}
{{/each}}
```

## express.Router
- [Router](https://expressjs.com/es/guide/routing.html): Utilice la clase express.Router para crear manejadores de rutas montables y modulares. Una instancia Router es un sistema de middleware y direccionamiento completo.

routes/home.js
```js
const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();

router.get("/", (req, res) => {
    const urls = [
        { origin: "https://www.google.com", shortURL: nanoid(7) },
        { origin: "https://www.bluuweb.org", shortURL: nanoid(7) },
    ];
    res.render("home", { titulo: "Página de inicio", urls });
});

module.exports = router;
```

```js
app.use("/", require("./routes/home"));
```

## CREATE
components/FormAcortar.hbs
```html
<form action="/" method="post">
    <input type="text" placeholder="Ingresa URL" class="form-control my-2" name="originURL">
    <button class="btn btn-dark mb-2 w-100">Acortar URL</button>
</form>
```

```html
<h1 class="text-center my-5">{{titulo}}</h1>

{{> FormAcortar}}

{{#each urls }}
    {{> Card url=this}}
{{/each}}
```

index.js
```js
app.use(express.urlencoded({ extended: true }));
```

home.js
```js
router.post("/", (req, res) => {
    console.log(req.body);
    res.redirect("/");
});
```

## MongoDB
- [mongodb](https://www.mongodb.com/)
- [mongoosejs](https://mongoosejs.com/)

```
npm i dotenv
npm i mongoose
```

.env
```
URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

database/conexion.js
```js
const mongoose = require("mongoose");

mongoose
    .connect(process.env.URI, {})
    .then(() => console.log("db conectada! 😍"))
    .catch((e) => console.log("error de conexión: " + e));
```

index.js
```js
const express = require("express");
const { create } = require("express-handlebars");
require("dotenv").config();
require("./database/conexion");
```

### Schema
- [Schema](https://mongoosejs.com/docs/guide.html#definition): Con Mongoose, todo se deriva de un esquema.
- Cada esquema se asigna a una colección MongoDB y define la forma de los documentos dentro de esa colección.

models/Url.js
```js
const mongoose = require('mongoose')
const {Schema} = mongoose

const urlSchema = new Schema({
    origin: {
        type: String,
        unique: true,
        required: true
    },
    shortURL: {
        type: String,
        unique: true,
        required: true,
        default: nanoid(7)
    }
})
```

### Model
- Para usar nuestra definición de esquema, necesitamos convertirla a un modelo con el que podamos trabajar.

```js
const Url = mongoose.model('Url', urlSchema)
module.exports = Url
```

### routes/home.js
```js
const Url = require("../models/Url");
router.post("/", async (req, res) => {
    // console.log(req.body);
    const { originURL } = req.body;
    const url = new Url({ origin: originURL });
    console.log(url);
    try {
    } catch (error) {
        console.log(error);
    }
    res.redirect("/");
});
```

```js
router.post("/", async (req, res) => {
    const { originURL } = req.body;
    const url = new Url({ origin: originURL });
    try {
        await url.save();
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});
```

## READ
- [lean](https://mongoosejs.com/docs/tutorials/lean.html): La opción Lean le dice a Mongoose que omita la hidratación de los documentos de resultados. Esto hace que las consultas sean más rápidas y requieran menos memoria, pero los documentos de resultados son simples objetos JavaScript, no documentos Mongoose.

```js
router.get("/", async (req, res) => {
    try {
        const urls = await Url.find().lean();
        console.log(urls);
        res.render("home", { titulo: "Página de inicio", urls });
    } catch (error) {
        console.log(error);
    }
});
```

## Middlewares
- [url](https://nodejs.org/api/url.html#class-url)

middlewares/validarURL.js
```js
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
```

routes/home.js
```js
const validarURL = require("../middlewares/validarURL");
router.post("/", validarURL, async (req, res) => {
    // console.log(req.body);
    const { originURL } = req.body;

    const url = new Url({ origin: originURL });
    try {
        await url.save();
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});
```

## Controllers
controllers/urlController.js
```js
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

module.exports = {
    homeUrl,
    agregarUrl,
};
```

routes/home.js
```js
const express = require("express");
const { homeUrl, agregarUrl } = require("../controllers/urlController");
const validarURL = require("../middlewares/validarURL");

const router = express.Router();

router.get("/", homeUrl);

router.post("/", validarURL, agregarUrl);

module.exports = router;
```

## DELETE
- [findByIdAndDelete](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete)

Card.hbs
```html
<a href="/eliminar/{{url._id}}" class="btn btn-danger">Eliminar</a>
```

controllers/urlController.js
```js
const eliminarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        await Url.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};
```

routes/home.js
```js
router.get("/eliminar/:id", eliminarUrl);
```

## UPDATE
- [findById](https://mongoosejs.com/docs/api.html#model_Model.findById)

Card.hbs
```html
<a href="/editar/{{url._id}}" class="btn btn-warning">Editar</a>
```

controllers
```js
const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const urlDB = await Url.findById(id).lean();
        console.log(urlDB);
        res.render("home", { titulo: "Página de inicio", urlDB });
    } catch (error) {
        console.log(error);
    }
};
```

routes
```js
router.get("/editar/:id", editarUrlForm);
```

FormAcortar.hbs
```html
{{#if urlDB}}

    <form action="/editar/{{urlDB._id}}" method="post">
        <input type="text" placeholder="Ingresa URL" class="form-control my-2" name="originURL" value="{{urlDB.origin}}">
        <button class="btn btn-warning mb-2 w-100">Editar URL</button>
    </form>

    {{else}}

    <form action="/" method="post">
        <input type="text" placeholder="Ingresa URL" class="form-control my-2" name="originURL">
        <button class="btn btn-dark mb-2 w-100">Acortar URL</button>
    </form>

{{/if}}
```

controllers
```js
const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { originURL } = req.body;
    try {
        const url = await Url.findById(id);
        if (!url) {
            console.log("no exite");
            return res.send("error no existe el documento a editar");
        }

        await Url.findByIdAndUpdate(id, { origin: originURL });

        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};
```

routes
```js
router.post("/editar/:id", validarURL, editarUrl);
```

## Redireccionamiento
controllers
```js
const redireccionar = async (req, res) => {
    const { shortURL } = req.params;
    try {
        const url = await Url.findOne({ shortURL });
        // console.log(url);
        if (!url?.origin) {
            console.log("no exite");
            return res.send("error no existe el redireccionamiento");
        }

        res.redirect(url.origin);
    } catch (error) {
        console.log(error);
    }
};
```

routes
```js
router.get("/:shortURL", redireccionar);
```

## clipboard

index.js
```js
app.use(express.static(__dirname + "/public"));
```

main.hbs
```html
<script src="/js/app.js"></script>
```

Card.hbs
```html{5}
<article class="card mb-2">
    <div class="card-body">
        <p>{{url.origin}}</p>
        <p>{{url.shortURL}}</p>
        <button class="btn btn-primary" data-short="{{url.shortURL}}" >Copiar</button>
        <a href="/editar/{{url._id}}" class="btn btn-warning">Editar</a>
        <a href="/eliminar/{{url._id}}" class="btn btn-danger">Eliminar</a>
    </div>
</article>
```

public/js/app.js
```js
document.addEventListener("click", (e) => {
    if (e.target.dataset.short) {
        const url = `http://localhost:5000/${e.target.dataset.short}`;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log("Text copied to clipboard...");
            })
            .catch((err) => {
                console.log("Something went wrong", err);
            });
    }
});
```