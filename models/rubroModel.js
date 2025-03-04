const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRubros = async (limit, page) => {
    try {
        const offset = (page - 1) * limit;
        const rubros = await prisma.rubro.findMany({
            skip: offset,
            take: limit
        });
        const totalRubros = await prisma.rubro.count();
        return {
            rubros,
            total: totalRubros,
            totalPages: Math.ceil(totalRubros / limit),
            currentPage: page
        };
    } catch (error) {
        console.error('Error consultando rubros:', error);
        throw new Error('Error al obtener los rubros');
    }
};
const getRubroById = async (id) => {
    try {
        return await prisma.rubro.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
        console.error('Error consultando rubros:', error);
        throw new Error('Error al obtener el rubro');
    }
};
const addRubro = async (data) => {
    try {
        return await prisma.rubro.create({ data });
    } catch (error) {
        console.error('Error consultando rubros:', error);
        throw new Error('Error al obtener el rubro');
    }
};
const updateRubro = async (id, data) => {
    try {
        return await prisma.rubro.update({ where: { id: parseInt(id) }, data });
    } catch (error) {
        console.error('Error consultando rubros:', error);
        throw new Error('Error al obtener el rubro');
    }
};
const updateRubroStatus = async (id, estado) => {
    try {
        return await prisma.rubro.update({ where: { id: parseInt(id) }, data: { estado } });
    } catch (error) {
        console.error('Error consultando rubros:', error);
        throw new Error('Error al obtener el rubro');
    }
};

module.exports = { getRubros, getRubroById, addRubro, updateRubro, updateRubroStatus };
