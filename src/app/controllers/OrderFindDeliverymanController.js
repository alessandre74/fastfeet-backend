import Order from '../models/Order'

class OrderFindDeliverymanController {
  async show(req, res) {
    const { id: deliveryman_id } = req.params

    const deliveryman = await Order.findOne({
      where: {
        deliveryman_id,
      },
    })

    return res.json(deliveryman)
  }
}

export default new OrderFindDeliverymanController()
