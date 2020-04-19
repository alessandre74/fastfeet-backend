import Order from '../models/Order'

class OrderEndController {
  async update(req, res) {
    const { id } = req.params
    const { signature_id } = req.body

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(400).json({ error: 'Order not found!' })
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order canceled!' })
    }

    if (order.start_date === null) {
      return res.status(400).json({ error: 'Start date not registered!' })
    }

    if (order.end_date !== null) {
      return res
        .status(400)
        .json({ error: 'Order has already been delivered!' })
    }

    await order.update({
      end_date: new Date(),
      signature_id,
    })

    return res.json()
  }
}

export default new OrderEndController()
