import { Op } from 'sequelize'
import Order from '../models/Order'
import Deliveryman from '../models/Deliveryman'
import Recipient from '../models/Recipient'
import File from '../models/File'

class OrdersDeliveredController {
  async index(req, res) {
    const { page = 1 } = req.query
    const { id: deliveryman_id } = req.params

    const deliveryman = await Deliveryman.findByPk(deliveryman_id)

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' })
    }

    const count = await Order.count({
      where: {
        deliveryman_id,
        canceled_at: null,
        end_date: {
          [Op.not]: null,
        },
      },
    })

    const order = await Order.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        end_date: {
          [Op.not]: null,
        },
      },
      attributes: {
        exclude: ['updatedAt'],
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
      order: ['createdAt'],
      limit: 4,
      offset: (page - 1) * 4,
    })

    res.header('x-total-count', count)

    return res.json(order)
  }
}

export default new OrdersDeliveredController()
