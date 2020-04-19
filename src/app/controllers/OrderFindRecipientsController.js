import Order from '../models/Order'

class OrderFindRecipientsController {
  async show(req, res) {
    const { id: recipient_id } = req.params

    const recipients = await Order.findOne({
      where: {
        recipient_id,
      },
    })

    return res.json(recipients)
  }
}

export default new OrderFindRecipientsController()
