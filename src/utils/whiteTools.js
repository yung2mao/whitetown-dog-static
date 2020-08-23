export default class WhiteUtils {
  dataFormat(dateObj) {
    let year = dateObj.getFullYear()
    let month = ("0" + (dateObj.getMonth() + 1)).slice(-2)
    let day = ("0" + dateObj.getDate()).slice(-2)
    return year + "-" + month + "-" + day
  }
}
