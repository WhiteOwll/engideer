const pool = require('./database/pool')
exports.runQuery = function(sql, values, callback) {
    pool.getConnection(function(err, conn) {
        conn.query(sql, values, function (err, results) {
            conn.release()
            if(callback != null) {
              callback(results)
            }
        })
      })

}
