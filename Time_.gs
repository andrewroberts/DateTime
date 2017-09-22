// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - TODO

// Time_.gs
// ========

var Time_ = {

/**
 * Get Date Object from date & time strings
 *
 * @param {String} dateString - YYYY-MM-dd or MM/dd/YYYY
 * @param {String} timeString - HH:mm a
 *
 * @return {Date} or null
 */
 
getDateTime: function(dateString, timeString) {

  Log.functionEntryPoint()
  
  Log.fine('dateString: ' + dateString)
  Log.fine('timeString: ' + timeString)

  if (typeof dateString !== 'string') {
    throw new TypeError('Bad date parameter')
  }

  if (typeof timeString !== 'string') {
    throw new TypeError('Bad time parameter')
  }

  var year 
  var month
  var day
  var hour
  var minutes

  var dateArray = dateString.split('-')
    
  if (dateArray.length === 3) {
  
    Log.fine('Date format YYYY-MM-dd or YY-MM-dd')

    year = dateArray[0]

    if (year.length === 2) {
      year = '20' + year
    }

    month = parseInt(dateArray[1], 10) - 1
    day = dateArray[2]
  
  } else {
  
    Log.fine('Date is format mm/dd/YYYY or mm/dd/YY')
    dateArray = dateString.split('/')
    
    if (dateArray.length !== 3) {
      throw new Error('Unrecognised date format')    
    }

    year = dateArray[2]
    
    if (year.length === 2) {
      year = '20' + year
    }
        
    month = parseInt(dateArray[0], 10) - 1    
    day = dateArray[1]
  }

  Log.fine('year:' + year)
  Log.fine('month:' + month)
  Log.fine('day:' + day)

  if (day > 31) {
    throw new Error('Day is greater than 31: ' + day)
  }

  if (month > 12) {
    throw new Error('Month is greater than 12: ' + month)
  }
    
  var timeArray = timeString.split(':')
  
  hour = parseInt(timeArray[0], 10)
  minutes = parseInt(timeArray[1], 10)
  
  Log.fine('hour: ' + hour)
  Log.fine('minutes: ' + minutes)

  var dateTimeInMs = (new Date(year, month, day)).getTime() + (hour * 60 * 60 * 1000) + (minutes * 60 * 1000)
  
  if (dateTimeInMs !== dateTimeInMs) {
    throw new Error('dateTime is NaN: ' + dateTimeInMs)
  }

  Log.fine('dateTimeInMs: ' + dateTimeInMs)
  var dateTime = new Date(dateTimeInMs)
  return dateTime
  
}, // Time_.getDateTime()

/**
 * Given a script date object, return the time in the timezone of the 
 * user's calendar
 *
 * Based on Sandy Good's answer to SO question:
 *
 *   http://stackoverflow.com/questions/15645343/how-to-use-timezone-of-calendar-to-set-timezone-for-date-object
 *
 * @param {Date} scriptDateTime
 * @param {Calendar} calendar
 *
 * @return {Date} calendarDateTime
 */
 
getCalendarDateTime: function(scriptDateTime, calendar) {

  Log.functionEntryPoint()
  
  Log.fine('scriptDateTime: ' + scriptDateTime)

  var calendarTimeZoneString = calendar.getTimeZone() 
  var calendarTimeZone = Utilities.formatDate(scriptDateTime, calendarTimeZoneString, 'Z')
  var calendarTz = Number(calendarTimeZone.slice(0,3)) 
  Log.fine('calendarTimeZone: %s (%s)', calendarTimeZoneString, calendarTz)

  var scriptTimeZoneString = Session.getScriptTimeZone()
  var scriptTimeZone = Utilities.formatDate(scriptDateTime, scriptTimeZoneString, 'Z')
  var sessionTz = Number(scriptTimeZone.slice(0,3))
  Log.fine('scriptTimeZone: %s (%s)', scriptTimeZoneString, sessionTz)

  // If both time zones are the same sign, get the difference between the
  // two.  E.g. -4 and -2.  Difference is 2
  // 
  // If each time zone is a different sign, add the absolute values together.
  // -4 and +1 should be 5

  var timeZoneDiff

  if (calendarTz < 0 && sessionTz > 0 || calendarTz > 0 && sessionTz < 0) {
  
    timeZoneDiff = Math.abs(Math.abs(calendarTz) + Math.abs(sessionTz))
    
  } else {
  
    timeZoneDiff = Math.abs(Math.abs(calendarTz) - Math.abs(sessionTz)) 
  }

  Log.fine('timeZoneDiff: ' + timeZoneDiff)

  var scriptHour = scriptDateTime.getHours()
  var calendarHour
  
  if (calendarTz >= sessionTz) {
  
    calendarHour = scriptHour - timeZoneDiff
    
  } else {
  
    calendarHour = scriptHour + timeZoneDiff    
  }

  var calendarDateTime = new Date(
    scriptDateTime.getYear(), 
    scriptDateTime.getMonth(),
    scriptDateTime.getDate(),
    calendarHour,
    scriptDateTime.getMinutes())
    
  Log.fine('calendarDateTime: ' + calendarDateTime)

  return calendarDateTime
  
}, // Time_.getCalendarDateTime()

/**
 * Given a calendar date object, return the time in the timezone of the script
 *
 * Based on Sandy Good's answer to SO question:
 *
 *   http://stackoverflow.com/questions/15645343/how-to-use-timezone-of-calendar-to-set-timezone-for-date-object
 *
 * @param {Date} scriptDateTime
 * @param {Calendar} calendar
 *
 * @return {Date} scriptDateTime
 */
 
getScriptDateTime: function(scriptDateTime, calendar) {

  Log.functionEntryPoint()
  
  Log.fine('scriptDateTime: ' + scriptDateTime)

  var calendarTimeZoneString = calendar.getTimeZone() 
  var calendarTimeZone = Utilities.formatDate(scriptDateTime, calendarTimeZoneString, 'Z')
  var calendarTz = Number(calendarTimeZone.slice(0,3)) 
  Log.fine('calendarTimeZone: %s (%s)', calendarTimeZoneString, calendarTz)

  var scriptTimeZoneString = Session.getScriptTimeZone()
  var scriptTimeZone = Utilities.formatDate(scriptDateTime, scriptTimeZoneString, 'Z')
  var sessionTz = Number(scriptTimeZone.slice(0,3))
  Log.fine('scriptTimeZone: %s (%s)', scriptTimeZoneString, sessionTz)

  // If both time zones are the same sign, get the difference between the
  // two.  E.g. -4 and -2.  Difference is 2
  // 
  // If each time zone is a different sign, add the absolute values together.
  // -4 and +1 should be 5

  var timeZoneDiff

  if (calendarTz < 0 && sessionTz > 0 || calendarTz > 0 && sessionTz < 0) {
  
    timeZoneDiff = Math.abs(Math.abs(calendarTz) + Math.abs(sessionTz))
    
  } else {
  
    timeZoneDiff = Math.abs(Math.abs(calendarTz) - Math.abs(sessionTz)) 
  }

  Log.fine('timeZoneDiff: ' + timeZoneDiff)

  var scriptHour = scriptDateTime.getHours()
  var calendarHour
  
  if (calendarTz >= sessionTz) {
  
    calendarHour = scriptHour + timeZoneDiff
    
  } else {
  
    calendarHour = scriptHour - timeZoneDiff    
  }

  var calendarDateTime = new Date(
    scriptDateTime.getYear(), 
    scriptDateTime.getMonth(),
    scriptDateTime.getDate(),
    calendarHour,
    scriptDateTime.getMinutes())
    
  Log.fine('calendarDateTime: ' + calendarDateTime)

  return calendarDateTime
  
}, // Time_.getScriptDateTime()

/**
 * Given a script date object, return the time in the timezone of the 
 * user's calendar
 *
 * Based on Sandy Good's answer to SO question:
 *
 *   http://stackoverflow.com/questions/15645343/how-to-use-timezone-of-calendar-to-set-timezone-for-date-object
 *
 * @param {Date} scriptDateTime
 * @param {Calendar} calendar
 *
 * @return {Date} calendarDateTime
 */
 
gmtToCalendarDate: function(scriptDateTime, calendar) {

  Log.functionEntryPoint()
  
  Log.fine('scriptDateTime: ' + scriptDateTime)

  var calendarTimeZoneString = calendar.getTimeZone() 
  var calendarTimeZone = Utilities.formatDate(scriptDateTime, calendarTimeZoneString, 'Z')
  var calendarTz = Number(calendarTimeZone.slice(0,3)) 
  Log.fine('calendarTimeZone: %s (%s)', calendarTimeZoneString, calendarTz)

  var scriptTimeZoneString = Session.getScriptTimeZone()
  var scriptTimeZone = Utilities.formatDate(scriptDateTime, scriptTimeZoneString, 'Z')
  var sessionTz = Number(scriptTimeZone.slice(0,3))
  Log.fine('scriptTimeZone: %s (%s)', scriptTimeZoneString, sessionTz)

  // If both time zones are the same sign, get the difference between the
  // two.  E.g. -4 and -2.  Difference is 2
  // 
  // If each time zone is a different sign, add the absolute values together.
  // -4 and +1 should be 5

  var timeZoneDiff

  if (calendarTz < 0 && sessionTz > 0 || calendarTz > 0 && sessionTz < 0) {
  
    timeZoneDiff = Math.abs(Math.abs(calendarTz) + Math.abs(sessionTz))
    
  } else {
  
    timeZoneDiff = Math.abs(Math.abs(calendarTz) - Math.abs(sessionTz)) 
  }

  Log.fine('timeZoneDiff: ' + timeZoneDiff)

  var scriptHour = scriptDateTime.getHours()
  var calendarHour
  
  if (calendarTz >= sessionTz) {
  
    calendarHour = scriptHour - timeZoneDiff
    
  } else {
  
    calendarHour = scriptHour + timeZoneDiff    
  }

  var calendarDateTime = new Date(
    scriptDateTime.getYear(), 
    scriptDateTime.getMonth(),
    scriptDateTime.getDate(),
    calendarHour,
    scriptDateTime.getMinutes())
    
  Log.fine('calendarDateTime: ' + calendarDateTime)

  return calendarDateTime
  
}, // Time_.getCalendarDateTime()

/**
 * Get formatted date
 *
 * @param {Date} date
 *
 * @return {String} formatted date
 */

getFormattedDate: function(date) {

  var timeZone = Session.getScriptTimeZone()
  
  if (typeof date !== 'object') {
    throw new Error('date needs to be a Date object, when it is a ' + typeof date)
  }
  
  return Utilities.formatDate(date, timeZone, "MM/dd/YYYY")
  
}, // Time_.getFormattedDate()

/**
 * Formatted the time
 *
 * @param {Date} date
 * @param {String} timeZone [OPTIONAL]
 *
 * @return {String} formatted date
 */

getFormattedTime: function(time, timeZone) {

  if (typeof timeZone === 'undefined') {
    timeZone = Session.getScriptTimeZone()
  }

  if (typeof time !== 'object') {
    throw new Error('time needs to be a Date object, when it is a ' + typeof time)
  }

  return Utilities.formatDate(time, timeZone, "hh:mm a")
  
}, // Time_.getFormattedTime()
 
/**
 * Get midnight (in calendar time zone) from some number of days ago
 *
 * @param {Number} days [OPTIONAL, DEFAUL = 0 (midnight yesterday, 00:00 today)] Days to go back or forward
 * @param {Calendar} calendar [OPTIONAL]
 *
 * @return {Date} midnight
 */
 
getMidnight: function(days, calendar) {

  Log.functionEntryPoint()  

  calendar = (typeof calendar === 'undefined') ? Calendar_.get() : calendar
  days = (typeof days === 'undefined') ? 0 : days

  var now = new Date()
  var nowInMs = now.getTime()
  var midnightGmtInMs = (Math.floor(nowInMs / MS_PER_DAY) * MS_PER_DAY) + (days * MS_PER_DAY)
  
  var calendarTimeZoneString = calendar.getTimeZone() 
  var calendarTimeZone = Utilities.formatDate(now, calendarTimeZoneString, 'Z')
  var calendarTzInMs = Number(calendarTimeZone.slice(0,3)) * MS_PER_HOUR
  
  var midnightInCalendarTime

  if (calendarTzInMs < 0) {
    
    midnightInCalendarTime = new Date(midnightGmtInMs + (calendarTzInMs * -1))
    
  } else {

    midnightInCalendarTime = new Date(midnightGmtInMs - calendarTzInMs)
  }
  
  return midnightInCalendarTime
  
}, // Time_.getMidnight() 

/**
 * Check if this is a new day
 */

newDay: function() {
    
    Log.functionEntryPoint()
    
    var lastCheckedDate = Properties_.getProperty(PROPERTY_DAILY_CHECK)
    Log.fine('lastCheckedDate: ' + lastCheckedDate)
     
    var today = (new Date()).toDateString()
    Properties_.setProperty(PROPERTY_DAILY_CHECK, today)    
    Log.fine('today: ' + today)
    
    var newDay = (lastCheckedDate !== today)   
    Log.fine('newDay: ' + newDay)
    
    return newDay
    
}, // Time_.newDay()

/**
 * Get Date Object from date string of format YYYY-MM-dd and time 
 * string of HH:mm format
 *
 * @param {Object} 
 *
 * @return {Object}
 */
 
getDateTime: function(dateStr, timeStr) {

  Log.functionEntryPoint()

  var dateArr = dateStr.split('-')
  var timeArr = timeStr.split(':')
  
  var dateTime = new Date(
    dateArr[0], 
    parseInt(dateArr[1], 10) - 1, 
    dateArr[2]).getTime() + parseInt(timeArr[0], 10) * 60 * 60 * 1000 + parseInt(timeArr[1], 10) * 60 * 1000
    
  return new Date(dateTime)
  
}, // Time_.getDateTime()

/**
 * Convert the duration from a GSheet into a number of hours.
 *
 * The spreadsheet stores durations as time since Sat Dec 30 1899 00:00 UTC.
 *
 * @param {Date} duration 
 *
 * @return {number} number of hours
 */
 
convertDurationToHours: function(duration) {

  Log.functionEntryPoint()
  
  var baseline = (new Date(1899, 11, 30, 0)).getTime()
  var currentHours = 0
  
  // Check if it most likely a date
  if (typeof duration === 'object') {
  
    var msduration = duration.getTime()
    currentHours = Math.floor((msduration - baseline) / (1000 * 60 * 60)) 
  }
  
  return currentHours
  
}, // Time_.convertDurationToHours()

// Get noon of yesterday

getYesterday: function() {
  
  var now = new Date()
  var yesterday = new Date(now.getTime() - (24 * 3600 * 1000))
  yesterday.setHours(12)
  return yesterday
  
}, // Time_.getYesterday()

// Get noon of tomorrow

getTomorrow: function() {
  
  var now = new Date()
  var tomorrow = new Date(now.getTime() + (24 * 3600 * 1000))
  tomorrow.setHours(12)
  return tomorrow
  
}, // Time_.getTomorrow_()

// Get a week today

getAWeekToday: function() {
  
  var now = new Date()
  var tomorrow = new Date(now.getTime() + (7* 24 * 3600 * 1000))
  tomorrow.setHours(12)
  return tomorrow
  
}, // Time_.getAWeekToday_()

inLast24Hours: function(lastUpdate) {

  var now = (new Date()).getTime()
  var twentyFourhrsAgoInMs = now.getTime() - MS_IN_24_HOURS
  return (lastUpdate.getTime() > twentyFourhrsAgoInMs) 
  
}, // Time_.inLast24Hours()

/**
 *
 *
 * @param {Object} 
 *
 * @return {Object}
 */

getMondays: function(originalDate) {

  Log.functionEntryPoint()

  var date = originalDate
  var month = date.getMonth()
  var mondays = []

  date.setDate(1)

  // Get the first Monday in the month
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1)
  }

  // Get all the other Tuesdays in the month
  while (date.getMonth() === month) {
    mondays.push(new Date(date.getTime()));
    date.setDate(date.getDate() + 7);
  }

  return mondays
  
}, // Time_.getMondays()

getUKTimezoneString: function(date) {
  var timezone = date.getTimezoneOffset()
  return timezone === 0 ? "GMT" : "GMT+1"  
},

/**
 * Check if this is a new day
 */

newDay: function() {
    
  Log.functionEntryPoint()
  
  var lastCheckedDate = Properties_.getProperty(PROPERTY_EVENTS_CHECKED)
  Log.fine('lastCheckedDate: ' + lastCheckedDate)
  
  var today = (new Date()).toDateString()
  Properties_.setProperty(PROPERTY_EVENTS_CHECKED, today)    
  Log.fine('today: ' + today)
  
  var newDay = (lastCheckedDate !== today)   
  Log.fine('newDay: ' + newDay)
  
  return newDay
    
} // Time_.newDay()

} // Time_
