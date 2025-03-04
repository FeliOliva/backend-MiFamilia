const rubroModel = require("../models/rubroModel");
const { redisClient } = require("../db");

const getRubros = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        if (pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ error: "Los parámetros de paginación no son válidos" });
        }
        const cacheKey = `rubros:${limitNumber}:${pageNumber}`;
        //Verificar si los datos está en caché
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData)); // Retorna la caché
        }
        //Consultar la base de datos con Prisma
        const rubrosData = await rubroModel.getRubros(limitNumber, pageNumber);
        //Guardar en Redis con expiración de 10 minutos
        await redisClient.setEx(cacheKey, 600, JSON.stringify(rubrosData));
        res.status(200).json(rubrosData);
    } catch (error) {
        console.error("Error al obtener los rubros:", error);
        res.status(500).json({ error: "Error al obtener los rubros" });
    }
}

const getRubroById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const rubro = await rubroModel.getRubroById(id);
        res.json(rubro);
    } catch (error) {
        console.error("Error al obtener el rubro:", error);
        res.status(500).json({ error: "Error al obtener el rubro" });
    }
}

const addRubro = async (req, res) => {
    try {
        const { nombre, rol_usuario } = req.body;
        if (rol_usuario !== 0) {
            return res.status(403).json({ error: "No tienes permiso para agregar rubros" });
        }
        if (!nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }
        const keys = await redisClient.keys("rubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        const newRubro = await rubroModel.addRubro({ nombre: nombre.toUpperCase() });
        res.json(newRubro);
    } catch (error) {
        console.error("Error al agregar el rubro:", error);
        res.status(500).json({ error: "Error al agregar el rubro" });
    }
}

const updateRubro = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, rol_usuario } = req.body;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const rubro = await rubroModel.getRubroById(id);
        if (!rubro) {
            return res.status(404).json({ error: "El rubro no existe" });
        }
        if (rol_usuario !== 0) {
            return res.status(403).json({ error: "No tienes permiso para actualizar rubros" });
        }
        if (!nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }
        await redisClient.del(`rubros:${id}`);
        const keys = await redisClient.keys("rubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const updatedRubro = await rubroModel.updateRubro(id, { nombre: nombre.toUpperCase() });
        res.json(updatedRubro);
    } catch (error) {
        console.error("Error al actualizar el rubro:", error);
        res.status(500).json({ error: "Error al actualizar el rubro" });
    }
}

const dropRubro = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        await redisClient.del(`rubros:${id}`);
        const keys = await redisClient.keys("rubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const deletedRubro = await rubroModel.updateRubroStatus(id, 0);
        res.json(deletedRubro);
    } catch (error) {
        console.error("Error al eliminar el rubro:", error);
        res.status(500).json({ error: "Error al eliminar el rubro" });
    }
}

const upRubro = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        await redisClient.del(`rubros:${id}`);
        const keys = await redisClient.keys("rubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const upRubro = await rubroModel.updateRubroStatus(id, 1);
        res.json(upRubro);
    } catch (error) {
        console.error("Error al activar el rubro:", error);
        res.status(500).json({ error: "Error al activar el rubro" });
    }
}

module.exports = { getRubros, getRubroById, addRubro, updateRubro, dropRubro, upRubro };