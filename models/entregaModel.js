const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllEntregas = async (limit, page) => {
    try {
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        const offset = (page - 1) * limit;
        const entregas = await prisma.entregas.findMany({
            skip: offset,
            take: limit,
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                },
                negocio: {
                    select: {
                        nombre: true
                    }
                },
                metodoPago: {
                    select: {
                        nombre: true
                    }
                }
            },
        });
        const totalEntregas = await prisma.entregas.count();

        return {
            entregas,
            total: totalEntregas,
            totalPages: Math.ceil(totalEntregas / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Error obteniendo todas las entregas:", error);
        throw new Error("Error al obtener las entregas");
    }
};

const getEntregaById = async (id) => {
    try {
        return await prisma.entregas.findUnique({
            where: { id: parseInt(id) },
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                },
                negocio: {
                    select: {
                        nombre: true
                    }
                },
                metodoPago: {
                    select: {
                        nombre: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error obteniendo entrega por id:", error);
        throw new Error("Error al obtener la entrega por id");
    }

}

const getEntregasByCliente = async (clienteId, limit, page) => {
    try {
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        const offset = (page - 1) * limit;
        const entregas = await prisma.entregas.findMany({
            where: { clienteId: parseInt(clienteId) },
            skip: offset,
            take: limit,
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                },
                negocio: {
                    select: {
                        nombre: true
                    }
                },
                metodoPago: {
                    select: {
                        nombre: true
                    }
                }
            }
        });
        const totalEntregas = await prisma.entregas.count({
            where: { clienteId: parseInt(clienteId) }
        });

        return {
            entregas,
            total: totalEntregas,
            totalPages: Math.ceil(totalEntregas / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Error obteniendo entregas por cliente:", error);
        throw new Error("Error al obtener las entregas del cliente");
    }
};

const getEntregasByNegocio = async (negocioId, limit, page) => {
    try {
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        const offset = (page - 1) * limit;
        const entregas = await prisma.entregas.findMany({
            where: { negocioId: parseInt(negocioId) },
            skip: offset,
            take: limit,
            include: {
                cliente: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                },
                negocio: {
                    select: {
                        nombre: true
                    }
                },
                metodoPago: {
                    select: {
                        nombre: true
                    }
                }
            }
        });
        const totalEntregas = await prisma.entregas.count({
            where: { negocioId: parseInt(negocioId) }
        });

        return {
            entregas,
            total: totalEntregas,
            totalPages: Math.ceil(totalEntregas / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Error obteniendo entregas por negocio:", error);
        throw new Error("Error al obtener las entregas del negocio");
    }
};

const addEntrega = async (data) => {
    try {
        return await prisma.entregas.create({ data });
    } catch (error) {
        console.error("Error agregando entrega:", error);
        throw new Error("Error al agregar la entrega");
    }
};

const updateEntrega = async (id, monto) => {
    try {
        return await prisma.entregas.update({
            where: { id: parseInt(id) },
            data: { monto }
        });
    } catch (error) {
        console.error("Error actualizando entrega:", error);
        throw new Error("Error al actualizar la entrega");
    }
};

const updateEntregaStatus = async (id, estado) => {
    try {
        return await prisma.entregas.update({
            where: { id: parseInt(id) },
            data: { estado }
        });
    } catch (error) {
        console.error("Error actualizando estado de la entrega:", error);
        throw new Error("Error al modificar el estado de la entrega");
    }
};

module.exports = {
    getAllEntregas,
    getEntregaById,
    getEntregasByCliente,
    getEntregasByNegocio,
    addEntrega,
    updateEntrega,
    updateEntregaStatus
};
