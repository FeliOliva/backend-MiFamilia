const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");
const { verifyToken } = require("../auth");

router.get("/ventas", verifyToken, ventasController.getVentas);
router.get("/ventas/:id", verifyToken, ventasController.getVentaById);
router.post("/ventas", verifyToken, ventasController.addVenta);
router.delete("/ventas/:id", verifyToken, ventasController.dropVenta);
router.post("/ventas/:id", verifyToken, ventasController.upVenta);

module.exports = router;