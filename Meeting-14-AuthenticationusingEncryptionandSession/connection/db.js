//ambil property pool dr objek postsgress
const {Pool} = require('pg')

// setup connection pool
const dbPool = new Pool({
    database: 'myproject',
    port: 5432,
    user: 'postgres',
    password: '1qaz0plm'
})

// export db pool to be use for query
module.exports = dbPool