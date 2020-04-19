import Recipient from '../models/Recipient'

class RecipientFindCPFController {
  async show(req, res) {
    const { cpf } = req.params
    const recipient = await Recipient.findOne({
      where: {
        cpf,
      },
      attributes: ['cpf'],
    })

    return res.json(recipient)
  }
}

export default new RecipientFindCPFController()
