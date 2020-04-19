import * as Yup from 'yup'
import { Op } from 'sequelize'
import Deliveryman from '../models/Deliveryman'
import File from '../models/File'

class DeliverymanController {
  async index(req, res) {
    const { s: query } = req.query
    const deliveryman = await Deliveryman.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query || ''}%`,
        },
      },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      order: ['id'],
    })

    return res.json(deliveryman)
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'avatar_id', 'createdAt'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    })

    return res.json(deliveryman)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' })
    }

    const emailExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    })

    if (emailExists) {
      return res.send(400)
    }

    const { id, name, email } = await Deliveryman.create(req.body)

    return res.json({ id, name, email })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' })
    }
    const { email } = req.body
    const { id } = req.params

    const deliveryman = await Deliveryman.findByPk(id)

    if (email && email !== deliveryman.email) {
      const emailExists = await Deliveryman.findOne({
        where: { email },
      })

      if (emailExists) {
        return res
          .status(400)
          .json({ error: 'This email is already registered!' })
      }
    }

    const { name, avatar_id } = await deliveryman.update(req.body)

    return res.json({ id, name, email, avatar_id })
  }

  async delete(req, res) {
    const { id } = req.params

    const deliveryman = await Deliveryman.findByPk(id)

    if (!deliveryman) {
      return res.status(204).json({ error: 'Deliveryman not found!' })
    }

    await deliveryman.destroy()

    return res.status(204).json()
  }
}
export default new DeliverymanController()
