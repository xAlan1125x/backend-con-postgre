export class PedidoController {
    service;
    constructor(service) {
        this.service = service;
    }
    checkout = async (req, res, next) => {
        try {
            const pedido = await this.service.checkout(req.body);
            res.status(201).json({ data: pedido });
        }
        catch (error) {
            next(error);
        }
    };
}
