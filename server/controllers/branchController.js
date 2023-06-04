const db = require("../config/db");

async function getBranch(req, res){
    db.query(
            `SELECT id, branch_name, province, city, lng, lat from branchs`,
            (err, result) => {
                if(err) res.status(400).send(err);
                res.send({
                    status: 200,
                    data: result
                })
            }
        )
}

module.exports = {
    getBranch,
};