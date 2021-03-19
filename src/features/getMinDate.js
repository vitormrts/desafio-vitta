function getMinDate(todos, minDate) {
    var today = new Date();
    minDate =
      "" +
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    
    return minDate
}

export { getMinDate }