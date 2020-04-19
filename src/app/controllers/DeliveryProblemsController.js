import * as Yup from 'yup'

import DeliveryProblems from '../models/DeliveryProblems'
import Deliveryman from '../models/Deliveryman'
import Order from '../models/Order'
import CancellationMail from '../jobs/CancellationMail'
import Queue from '../../lib/Queue'

class DeliveryProblemsController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblems.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },

      order: ['createdAt'],
    })

    return res.json(deliveryProblems)
  }

  async show(req, res) {
    const { delivery_id } = req.params
    const deliveryProblems = await DeliveryProblems.findAll({
      where: {
        delivery_id,
      },
      order: ['createdAt'],
    })

    return res.json(deliveryProblems)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }
    const { delivery_id } = req.params

    const order = await Order.findByPk(delivery_id)

    if (!order) {
      return res.status(401).json({ erro: 'Order not found!' })
    }

    if (order.canceled_at !== null) {
      return res.status(401).json({ error: 'Order has already been canceled!' })
    }

    if (order.start_date === null) {
      return res.status(401).json({ error: 'order not picked up for delivery' })
    }

    if (order.start_date !== null && order.end_date !== null) {
      return res
        .status(401)
        .json({ error: 'Order has already been delivered!' })
    }

    const { description } = req.body

    const { id } = await DeliveryProblems.create({
      delivery_id,
      description,
    })

    return res.json({ id, delivery_id, description })
  }

  async delete(req, res) {
    const { id: delivery_id } = req.params

    const order = await Order.findByPk(delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found!' })
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ error: 'Order canceled!' })
    }

    order.canceled_at = new Date()

    await order.save()

    await Queue.add(CancellationMail.key, { order })

    return res.json(order)
  }
}

export default new DeliveryProblemsController()
