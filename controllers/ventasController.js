const ventaModel = require("../models/ventaModel");
const { redisClient } = require("../db");

const getVentas = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;

        if (pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ error: "Los parámetros de paginación no son válidos" });
        }

        const cacheKey = `Ventas:${limitNumber}:${pageNumber}`;
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const ventasData = await ventaModel.getVentas(limitNumber, pageNumber);
        await redisClient.setEx(cacheKey, 600, JSON.stringify(ventasData));

        res.status(200).json(ventasData);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ error: "Error al obtener las ventas" });
    }
};

const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const ventaData = await ventaModel.getVentaById(id);
        res.status(200).json(ventaData);
    } catch (error) {
        console.error("Error al obtener la venta:", error);
        res.status(500).json({ error: "Error al obtener la venta" });
    }
}

const addVenta = async (req, res) => {
    try {
        const { nroVenta, clienteId, negocioId, metodoPagoId, cajaId, rol_usuario, detalles } = req.body;

        if (rol_usuario !== 0 && rol_usuario !== 1) {
            return res.status(401).json({ error: "No tienes permiso para realizar esta acción" });
        }

        if (!nroVenta || !negocioId || !detalles || detalles.length === 0) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        // Calcular total sumando los subtotales de los detalles
        const detallesProcesados = detalles.map(detalle => ({
            ...detalle,
            subTotal: detalle.cantidad * detalle.precio
        }));
        const totalCalculado = detallesProcesados.reduce((sum, detalle) => sum + detalle.subTotal, 0);

        // Limpiar caché de Redis antes de insertar nueva venta
        const keys = await redisClient.keys("Ventas:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        const nuevaVenta = await ventaModel.addVenta({
            nroVenta,
            total: totalCalculado, // Pasamos el total calculado
            clienteId,
            negocioId,
            metodoPagoId,
            cajaId,
            detalles: detallesProcesados, // Pasamos los detalles con `subTotal` ya calculado
        });

        res.status(200).json(nuevaVenta);
    } catch (error) {
        console.error("Error al agregar la venta:", error);
        res.status(500).json({ error: "Error al agregar la venta" });
    }
};


const dropVenta = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const keys = await redisClient.keys("Ventas:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const ventaData = await ventaModel.updateVentaStatus(id, 0);
        res.status(200).json(ventaData);
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        res.status(500).json({ error: "Error al eliminar la venta" });
    }
}

const upVenta = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "El id es obligatorio" });
        }
        const keys = await redisClient.keys("Ventas:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        const ventaData = await ventaModel.updateVentaStatus(id, 1);
        res.status(200).json(ventaData);
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        res.status(500).json({ error: "Error al actualizar la venta" });
    }
}

module.exports = { getVentas, getVentaById, addVenta, dropVenta, upVenta };