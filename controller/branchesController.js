const express = require('express');
const router = express.Router();
const sql = require("mssql");
const conn = require("../connection/connect")();

const routes = () => {
    router.route('/').get((req, res) => {
        conn.connect().then(() => {
            const sqlQuery = "SELECT * FROM branches";
            const requ = new sql.Request(conn);
            requ.query(sqlQuery).then((recordset) => {
                res.header("Access-Control-Allow-Origin", "*");
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

    router.route('/').post(function (req, res) {
        conn.connect().then(function () {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function () {
                var request = new sql.Request(transaction);
                request.input("branchName", sql.VarChar(20), req.body.branchName)
                request.input("branchManager", sql.VarChar(80), req.body.branchManager)
                request.input("branchNumber", sql.VarChar(15), req.body.branchNumber)
                request.input("branchLocation", sql.VarChar(80), req.body.branchLocation)
                request.execute("usp_insertBranch").then(function () {
                    transaction.commit().then(function (recordSet) {
                        conn.close();
                        res.status(200).send(req.body);
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send(err);
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).json({ "message": "Duplicate branch name" })
                });
            }).catch(function (err) {
                conn.close();
                console.log('3', err);
                res.status(400).send(err);
            });
        }).catch(function (err) {
            conn.close();
            console.log('4', err);
            res.status(400).send(err);
        });
    });

    router.route('/:id').put(function (req, res) {
        conn.connect().then(function () {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function () {
                var request = new sql.Request(transaction);
                request.input("branchName", sql.VarChar(20), req.params.id);
                request.input("branchManager", sql.VarChar(80), req.body.branchManager);
                request.input("branchNumber", sql.VarChar(15), req.body.branchNumber);
                request.input("branchLocation", sql.VarChar(15), req.body.branchLocation);
                request.execute("usp_updateBranch").then(function () {
                    transaction.commit().then(function (recordSet) {
                        conn.close();
                        res.status(200).send(req.body);
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send(err);
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send(err);
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send(err);
            });
        }).catch(function (err) {
            conn.close();
            res.status(400).send(err);
        });
    });

    router.route('/:id').delete(function (req, res) {
        var branchName = req.params.id;
        conn.connect().then(function () {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function () {
                var request = new sql.Request(transaction);
                request.input("branchName", sql.VarChar(20), branchName)
                request.execute("usp_deleteBranch").then(function () {
                    transaction.commit().then(function (recordSet) {
                        conn.close();
                        res.status(200).json({ 'message': `${branchName} deleted successfully` });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Deleting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while Deleting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while Deleting data");
            });
        })
    });


    return router;
}
module.exports = routes;