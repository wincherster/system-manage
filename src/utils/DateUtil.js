import Moment from 'moment'
export default {
  dateFilter (value, type, format) {
    if (!value) return ''
    switch (type) {
      case '1':
        return Moment(value).format(format)
      case '2':
        return String(value).length === 13 ? Moment(parseInt(value)).format(format) : Moment.unix(parseInt(value)).format(format)
      default:
        return Moment(value).format(format)
    }
  }
}
