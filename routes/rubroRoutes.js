const exprees = require("express");
const router = exprees.Router();
const rubroController = require("../controllers/rubroController");
const { verifyToken } = require("../auth");

router.get("/rubros", verifyToken, rubroController.getRubros);
router.get("/rubros/:id", verifyToken, rubroController.getRubroById);
router.post("/rubros", verifyToken, rubroController.addRubro);
router.put("/rubros/:id", verifyToken, rubroController.updateRubro);
router.delete("/rubros/:id", verifyToken, rubroController.dropRubro);
router.post("/rubros/:id", verifyToken, rubroController.upRubro);

module.exports = router;