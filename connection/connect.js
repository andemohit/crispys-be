const sql = require("mssql");
const connect = function () {
    const conn = new sql.ConnectionPool({
        user: 'mohit',
        password: 'Moh@1995',
        server: 'crispysbe.database.windows.net',
        database: 'CRISPYS'
    });
    return conn;
};

module.exports = connect;
