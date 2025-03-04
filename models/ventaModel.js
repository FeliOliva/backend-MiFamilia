const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getVentas = async (limitNumber, pageNumber) => {
    try {
        const offset = (pageNumber - 1) * limitNumber;

        const ventas = await prisma.venta.findMany({
            skip: offset,
            take: limitNumber,
            include: {
                cliente: {
                    select: { nombre: true, apellido: true }
                },
                negocio: {
                    select: { nombre: true }
                },
                metodoPago: {
                    select: { nombre: true }
                },
                caja: {
                    select: { nombre: true }
                },
                detalles: {
                    include: {
                        producto: true
                    }
                }
            }
        });

        const totalVentas = await prisma.venta.count();

        return {
            ventas,
            total: totalVentas,
            totalPages: Math.ceil(totalVentas / limitNumber),
            currentPage: pageNumber
        };

    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw new Error("Error al obtener las ventas");
    }
};



const getVentaById = async (id) => {
    try {
        return await prisma.venta.findUnique({ where: { id: parseInt(id) } });
    } catch (error) {
        console.error("Error consultando ventas:", error);
        throw new Error("Error al obtener la venta");
    }
}

const addVenta = async (data) => {
    try {
        return await prisma.$transaction(async (prisma) => {
            const nuevaVenta = await prisma.venta.create({
                data: {
                    nroVenta: data.nroVenta,
                    total: data.total, // Se pasa el total ya calculado desde el controlador
                    clienteId: data.clienteId || null,
                    negocioId: data.negocioId,
                    metodoPagoId: data.metodoPagoId || null,
                    cajaId: data.cajaId || null,
                },
            });

            await prisma.detalleVenta.createMany({
                data: data.detalles.map((detalle) => ({
                    precio: detalle.precio,
                    cantidad: detalle.cantidad,
                    subTotal: detalle.subTotal, // `subTotal` ya está calculado
                    ventaId: nuevaVenta.id,
                    productoId: detalle.productoId,
                })),
            });

            return {
                ...nuevaVenta,
                detalles: data.detalles,
            };
        });
    } catch (error) {
        console.error("Error al agregar la venta:", error);
        throw new Error("Error al agregar la venta");
    }
};


const updateVentaStatus = async (id, estado) => {
    try {
        return await prisma.venta.update({ where: { id: parseInt(id) }, data: { estado } });
    } catch (error) {
        console.error("Error consultando ventas:", error);
        throw new Error("Error al obtener la venta");
    }
}


module.exports = { getVentas, getVentaById, addVenta, updateVentaStatus };