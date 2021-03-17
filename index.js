var _ = require('underscore')
var csv = require('fast-csv')
var config = require(__dirname + '/../.' + require('./package').name)

module.exports = () => {
  var range = []
  csv.parseFile(__dirname + '/../binlistData/ranges.csv', {headers: true, ignoreEmpty: true, discardUnmappedColumns: true}).
    on('data', d => range.push(d))
  return (req, res) => {
    console.log(req.body)
    if (req.body.message) {
      var text = 'Not found'
      var n = +req.body.message.text
      var r = _.find(range, range => {
        if (n < +range.iin_start)
          return
        if (+range.iin_end && (n > +range.iin_end))
          return
        if (!+range.iin_end && (n != +range.iin_start))
          return
        return true
      })
      if (r)
        text = _.values(_.pick(r, ['scheme', 'type', 'country'])).join(' ')
      return res.json({method: 'sendMessage', chat_id: req.body.message.chat.id, text: text})
    }
    res.end()
  }
}
