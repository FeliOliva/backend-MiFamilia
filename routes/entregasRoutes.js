const express = require("express");
const router = express.Router();
const entregasControllers = require("../controllers/entregasControllers");
const { verifyToken } = require("../auth");

router.get("/entregas", verifyToken, entregasControllers.getEntregas);
router.get("/entregas/:id", verifyToken, entregasControllers.getEntregaById);
router.get("/entregas/cliente/:clienteId", verifyToken, entregasControllers.getEntregaByCliente);
router.get("/entregas/negocio/:negocioId", verifyToken, entregasControllers.getEntregasByNegocio);
router.post("/entregas", verifyToken, entregasControllers.addEntrega);
router.put("/entregas/:id", verifyToken, entregasControllers.updateEntrega);
router.delete("/entregas/:id", verifyToken, entregasControllers.dropEntrega);
router.post("/entregas/:id", verifyToken, entregasControllers.upEntrega);

module.exports = router;