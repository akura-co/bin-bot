var
  _ = require('underscore'),
  superagent = require('superagent'),
  config = require('solid-config'),
  csv = require('fast-csv')

var range = []

csv.fromPath('/home/ubuntu/binlistData/ranges.csv', {headers: true}).on('data', function (d) {range.push(d)})

module.exports = function () {
  var url = 'https://akura.co/telegram/' + require('./package').name + '/hook'
  console.log(url)
  superagent.get(config.url + config.token + '/setWebhook').query({url: url}).end(function (err) {
    if (err)
      console.log(err)
  })
  return function (req, res) {
    console.log(req.body)
    if (req.body.message) {
      var text = 'Not found'
      var n = +req.body.message.text
      var r = _.find(range, function (range) {
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
      res.json({method: 'sendMessage', chat_id: req.body.message.chat.id, text: text})
      return
    }
    res.end()
  }
}
