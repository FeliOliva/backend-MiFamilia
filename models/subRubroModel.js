const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSubRubros = async (limit, page) => {
    try {
        const offset = (page - 1) * limit;
        const subRubros = await prisma.subRubro.findMany({
            skip: offset,
            take: limit
        });
        const totalSubRubros = await prisma.subRubro.count();
        return {
            subRubros,
            total: totalSubRubros,
            totalPages: Math.ceil(totalSubRubros / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Error consultando subrubros:", error);
        throw new Error("Error al obtener los subrubros");
    }
};
const getSubRubroById = async (id) => {
    try {
        return await prisma.subRubro.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
        console.error("Error consultando subrubros:", error);
        throw new Error("Error al obtener el subrubro");
    }
};
const addSubRubro = async (data) => {
    try {
        return await prisma.subRubro.create({ data });
    } catch (error) {
        console.error("Error consultando subrubros:", error);
        throw new Error("Error al obtener el subrubro");
    }
}
const updateSubRubro = async (id, data) => {
    try {
        return await prisma.subRubro.update({ where: { id: parseInt(id) }, data });
    } catch (error) {
        console.error("Error consultando subrubros:", error);
        throw new Error("Error al obtener el subrubro");
    }
};
const updateSubRubroStatus = async (id, estado) => {
    try {
        return await prisma.subRubro.update({ where: { id: parseInt(id) }, data: { estado } });
    } catch (error) {
        console.error("Error consultando subrubros:", error);
        throw new Error("Error al obtener el subrubro");
    }
};

module.exports = { getSubRubros, getSubRubroById, addSubRubro, updateSubRubro, updateSubRubroStatus };