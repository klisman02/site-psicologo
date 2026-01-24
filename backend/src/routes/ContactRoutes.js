const { Router } = require("express");
const { enviarContato } = require("../controllers/ContactController");

const router = Router();
router.post("/contato", (req, res, next) => {
  console.log("🟢 [ContactRoutes] POST /contato recebido");
  next();
}, enviarContato);

module.exports = router;
