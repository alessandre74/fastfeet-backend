require('dotenv/config')

module.exports = {
  dialect: 'postgres',
  // options.timezone:'America/Sao_Paulo',
  timezone: '-03:00',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
