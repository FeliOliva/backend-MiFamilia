const subRubroModel = require("../models/subRubroModel");
const { redisClient } = require("../db");

const getSubRubros = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

        if (pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ error: "Los parámetros de paginación no son válidos" });
        }

        const cacheKey = `subRubros:${limitNumber}:${pageNumber}`;

        //Verificar si los datos está en caché
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData)); // Retorna la caché
        }

        //Consultar la base de datos con Prisma
        const subRubrosData = await subRubroModel.getSubRubros(limitNumber, pageNumber);

        //Guardar en Redis con expiración de 10 minutos
        await redisClient.setEx(cacheKey, 600, JSON.stringify(subRubrosData));

        res.status(200).json(subRubrosData);
    } catch (error) {
        console.error("Error al obtener los subRubros:", error);
        res.status(500).json({ error: "Error al obtener los subRubros" });
    }
}

const getSubRubroById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const subRubro = await subRubroModel.getSubRubroById(id);
        res.json(subRubro);
    } catch (error) {
        console.error("Error al obtener el subRubro:", error);
        res.status(500).json({ error: "Error al obtener el subRubro" });
    }
}

const addSubRubro = async (req, res) => {
    try {
        const { nombre, rubroId, rol_usuario } = req.body;
        if (rol_usuario !== 0) {
            return res.status(401).json({ error: "No tienes permiso para realizar esta accion" });
        }
        if (!nombre || !rubroId) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        const keys = await redisClient.keys("subRubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        const newSubRubro = await subRubroModel.addSubRubro({ nombre: nombre.toUpperCase(), rubroId });
        res.json(newSubRubro);
    } catch (error) {
        console.error("Error al agregar el subRubro:", error);
        res.status(500).json({ error: "Error al agregar el subRubro" });
    }
}

const updateSubRubro = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, rubroId } = req.body;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const subRubro = await subRubroModel.getSubRubroById(id);
        if (!subRubro) {
            return res.status(404).json({ error: "El subRubro no existe" });
        }
        await redisClient.del(`subRubros:${id}`);
        const keys = await redisClient.keys("subRubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const updatedSubRubro = await subRubroModel.updateSubRubro(id, { nombre: nombre.toUpperCase(), rubroId });
        res.json(updatedSubRubro);
    } catch (error) {
        console.error("Error al actualizar el subRubro:", error);
        res.status(500).json({ error: "Error al actualizar el subRubro" });
    }
}

const dropSubRubro = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        await redisClient.del(`subRubros:${id}`);
        const keys = await redisClient.keys("subRubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const deletedSubRubro = await subRubroModel.updateSubRubroStatus(id, 0);
        res.json(deletedSubRubro);
    } catch (error) {
        console.error("Error al eliminar el subRubro:", error);
        res.status(500).json({ error: "Error al eliminar el subRubro" });
    }
}

const upSubRubro = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        await redisClient.del(`subRubros:${id}`);
        const keys = await redisClient.keys("subRubros:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const upSubRubro = await subRubroModel.updateSubRubroStatus(id, 1);
        res.json(upSubRubro);
    } catch (error) {
        console.error("Error al activar el subRubro:", error);
        res.status(500).json({ error: "Error al activar el subRubro" });
    }
}

module.exports = { getSubRubros, getSubRubroById, addSubRubro, updateSubRubro, dropSubRubro, upSubRubro };