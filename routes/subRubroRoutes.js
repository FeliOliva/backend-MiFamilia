const express = require("express");
const router = express.Router();
const subRubroController = require("../controllers/subRubroController");
const { verifyToken } = require("../auth");

router.get("/subRubros", verifyToken, subRubroController.getSubRubros);
router.get("/subRubros/:id", verifyToken, subRubroController.getSubRubroById);
router.post("/subRubros", verifyToken, subRubroController.addSubRubro);
router.put("/subRubros/:id", verifyToken, subRubroController.updateSubRubro);
router.delete("/subRubros/:id", verifyToken, subRubroController.dropSubRubro);
router.post("/subRubros/:id", verifyToken, subRubroController.upSubRubro);

module.exports = router;