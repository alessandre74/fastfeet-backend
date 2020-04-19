module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('recipients', 'cpf', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('recipients', 'cpf')
  },
}
