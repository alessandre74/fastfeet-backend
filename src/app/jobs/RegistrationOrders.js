import Mail from '../../lib/Mail'

class RegistrationOrders {
  get key() {
    return 'RegistrationOrders'
  }

  async handle({ data }) {
    const { deliveryman, order } = data
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Encomenda disponível para entrega`,
      template: 'register',
      context: {
        deliveryman: deliveryman.name,
        number: order.id,
        description: order.product,
      },
    })
  }
}

export default new RegistrationOrders()
