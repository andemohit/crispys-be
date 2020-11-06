const express = require('express');
const router = express.Router();
const sql = require("mssql");
const conn = require("../../connection/connect")();

const routes = () => {
    router.route('/').get((req, res) => {
        conn.connect().then(() => {
            const sqlQuery = "SELECT * FROM customer";
            const requ = new sql.Request(conn);
            requ.query(sqlQuery).then((recordset) => {
                console.log('recordset', recordset.recordset);
                res.json(recordset.recordset);
                conn.close();
            }).catch((err) => {
                conn.close();
                res.status(400).send("Error while " + err);
            })
        }).catch((err) => {
            conn.close();
            res.status(400).send("Error while connecting" + err);
        })
    })
    return router;
}
module.exports = routes;