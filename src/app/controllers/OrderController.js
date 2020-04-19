import * as Yup from 'yup'
import { Op } from 'sequelize'
import Order from '../models/Order'
import Recipient from '../models/Recipient'
import Deliveryman from '../models/Deliveryman'
import File from '../models/File'
import RegistrationOrders from '../jobs/RegistrationOrders'
import Queue from '../../lib/Queue'

class OrderController {
  async index(req, res) {
    const { s: query } = req.query

    const order = await Order.findAll({
      where: {
        product: {
          [Op.iLike]: `%${query || ''}%`,
        },
      },
      attributes: {
        exclude: [
          'deliveryman_id',
          'recipient_id',
          'signature_id',
          'createdAt',
          'updatedAt',
        ],
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
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },

        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],

      order: ['id'],
      // limit: 2,
      // offset: (page - 1) * 2,
    })

    return res.json(order)
  }

  async show(req, res) {
    const { id } = req.params
    const order = await Order.findByPk(id, {
      attributes: {
        exclude: [
          'deliveryman_id',
          'recipient_id',
          'signature_id',
          'createdAt',
          'updatedAt',
        ],
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
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    })

    return res.json(order)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' })
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id)

    if (!recipient) {
      return res.status(404).json({ erro: 'Recipient not found!' })
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id)

    if (!deliveryman) {
      return res.status(404).json({ erro: 'Deliveryman not found!' })
    }

    const order = await Order.create(req.body)

    await Queue.add(RegistrationOrders.key, { deliveryman, order })

    return res.json(order)
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' })
    }

    const { id } = req.params

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found!' })
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id)

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found!' })
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id)

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found!' })
    }

    const { recipient_id, deliveryman_id, product } = await order.update(
      req.body
    )
    return res.json({
      recipient_id,
      deliveryman_id,
      product,
    })
  }

  async delete(req, res) {
    const { id } = req.params

    const order = await Order.findByPk(id)

    if (!order) {
      return res.status(404).json({ error: 'Order not found!' })
    }

    await order.destroy()

    return res.status(204).json()
  }
}

export default new OrderController()
