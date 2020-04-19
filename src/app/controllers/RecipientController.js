import * as Yup from 'yup'
import { Op } from 'sequelize'

import Recipient from '../models/Recipient'

class RecipientController {
  async index(req, res) {
    const { s: query } = req.query

    const recipient = await Recipient.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query || ''}%`,
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: ['id'],
    })
    return res.json(recipient)
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id, {
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    })

    return res.json(recipient)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
      cpf: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' })
    }

    const { cpf } = req.body

    const recipientExists = await Recipient.findOne({
      where: {
        cpf,
      },
    })

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already registered' })
    }

    const recipient = await Recipient.create(req.body)

    return res.json(recipient)
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
      cpf: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' })
    }

    const { id } = req.params

    const recipient = await Recipient.findByPk(id)

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' })
    }

    const { name } = await recipient.update(req.body)

    return res.json({ message: `Recipient ${name} updated successfully!` })
  }

  async delete(req, res) {
    const { id } = req.params

    const recipient = await Recipient.findByPk(id)

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found!' })
    }

    await recipient.destroy()

    return res.status(204).json()
  }
}

export default new RecipientController()
