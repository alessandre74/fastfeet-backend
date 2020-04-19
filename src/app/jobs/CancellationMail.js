import Mail from '../../lib/Mail'

class CancellationMail {
  get key() {
    return 'CancellationMail'
  }

  async handle({ data }) {
    const { order } = data

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: `Encomenda cancelada`,
      template: 'cancellation',
      context: {
        deliveryman: order.deliveryman.name,
        number: order.id,
        description: order.product,
      },
    })
  }
}

export default new CancellationMail()
