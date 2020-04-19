import { startOfDay, endOfDay } from 'date-fns'
import { Op } from 'sequelize'
import Order from '../models/Order'

class OrderStartController {
  async update(req, res) {
    const hourNow = new Date().getHours()

    if (hourNow < 8 || hourNow > 18) {
      return res.status(400).json({
        error:
          'time allowed for pick-up of deliveries, is from 8:00 am to 6:00 pm',
      })
    }

    const { id } = req.params
    const { deliveryman_id } = req.body

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found!' })
    }

    const quantityDeliveries = await Order.count({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    })

    if (quantityDeliveries === 5) {
      return res.status(401).json({ error: 'Withdrawal limit exceeded!' })
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order canceled!' })
    }

    if (order.start_date !== null && order.end_date !== null) {
      return res.status(404).json({ error: 'Order withdrawn and delivered!' })
    }

    if (order.start_date !== null) {
      return res.status(404).json({ error: 'Order start already processed!' })
    }

    await order.update({
      start_date: new Date(),
    })

    return res.json({
      message: `updated successfully`,
    })
  }
}

export default new OrderStartController()
