//ambil property pool dr objek postsgress
const {Pool} = require('pg')

// setup connection pool
// const dbPool = new Pool({
//     database: 'myproject',
//     port: 5432,
//     user: 'postgres',
//     password: '1qaz0plm'
// })

const dbPool = new Pool({
    database: 'db35nqc04s9gth',
    port: 5432,
    user: 'gjrfibeylpgmsw',
    password: '82b2a11cb150200af861bebc68dd17b232de5433881efbb87789abeed0f7f717'
})

// export db pool to be use for query
module.exports = dbPool