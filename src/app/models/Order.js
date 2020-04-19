import Sequelize, { Model } from 'sequelize'

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.INTEGER,
        deliveryman_id: Sequelize.INTEGER,
        signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        status: {
          type: Sequelize.VIRTUAL,
          get() {
            if (this.canceled_at) return 'Cancelada'
            if (this.start_date) {
              if (this.end_date) return 'Entregue'
              return 'Retirada'
            }
            return 'Pendente'
          },
        },
      },
      {
        sequelize,
        tableName: 'orders',
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    })
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    })
    this.belongsTo(models.File, { foreignKey: 'signature_id', as: 'signature' })
  }
}

export default Order
