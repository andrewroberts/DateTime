// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - TODO

/**
 * Get Date Object from date & time strings
 *
 * @param {String} dateString - YYYY-MM-dd or MM/dd/YYYY
 * @param {String} timeString - HH:mm a
 *
 * @return {Date} or null
 */
 
function getDateTime(dateString, timeString) {
  
  Logger.log('dateString: ' + dateString)
  Logger.log('timeString: ' + timeString)

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
  
    Logger.log('Date format YYYY-MM-dd or YY-MM-dd')

    year = dateArray[0]

    if (year.length === 2) {
      year = '20' + year
    }

    month = parseInt(dateArray[1], 10) - 1
    day = dateArray[2]
  
  } else {
  
    Logger.log('Date is format mm/dd/YYYY or mm/dd/YY')
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

  Logger.log('year:' + year)
  Logger.log('month:' + month)
  Logger.log('day:' + day)

  if (day > 31) {
    throw new Error('Day is greater than 31: ' + day)
  }

  if (month > 12) {
    throw new Error('Month is greater than 12: ' + month)
  }
    
  var timeArray = timeString.split(':')
  
  hour = parseInt(timeArray[0], 10)
  minutes = parseInt(timeArray[1], 10)
  
  Logger.log('hour: ' + hour)
  Logger.log('minutes: ' + minutes)

  var dateTimeInMs = (new Date(year, month, day)).getTime() + (hour * 60 * 60 * 1000) + (minutes * 60 * 1000)
  
  if (dateTimeInMs !== dateTimeInMs) {
    throw new Error('dateTime is NaN: ' + dateTimeInMs)
  }

  Logger.log('dateTimeInMs: ' + dateTimeInMs)
  var dateTime = new Date(dateTimeInMs)
  return dateTime
  
} // DateTime_.getDateTime()

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
 
function getCalendarDateTime(scriptDateTime, calendar) {

  Logger.log('scriptDateTime: ' + scriptDateTime)

  var calendarTimeZoneString = calendar.getTimeZone() 
  var calendarTimeZone = Utilities.formatDate(scriptDateTime, calendarTimeZoneString, 'Z')
  var calendarTz = Number(calendarTimeZone.slice(0,3)) 
  Logger.log('calendarTimeZone: %s (%s)', calendarTimeZoneString, calendarTz)

  var scriptTimeZoneString = Session.getScriptTimeZone()
  var scriptTimeZone = Utilities.formatDate(scriptDateTime, scriptTimeZoneString, 'Z')
  var sessionTz = Number(scriptTimeZone.slice(0,3))
  Logger.log('scriptTimeZone: %s (%s)', scriptTimeZoneString, sessionTz)

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

  Logger.log('timeZoneDiff: ' + timeZoneDiff)

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
    
  Logger.log('calendarDateTime: ' + calendarDateTime)

  return calendarDateTime
  
} // DateTime_.getCalendarDateTime()

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
 
function getScriptDateTime(scriptDateTime, calendar) {
  
  Logger.log('scriptDateTime: ' + scriptDateTime)

  var calendarTimeZoneString = calendar.getTimeZone() 
  var calendarTimeZone = Utilities.formatDate(scriptDateTime, calendarTimeZoneString, 'Z')
  var calendarTz = Number(calendarTimeZone.slice(0,3)) 
  Logger.log('calendarTimeZone: %s (%s)', calendarTimeZoneString, calendarTz)

  var scriptTimeZoneString = Session.getScriptTimeZone()
  var scriptTimeZone = Utilities.formatDate(scriptDateTime, scriptTimeZoneString, 'Z')
  var sessionTz = Number(scriptTimeZone.slice(0,3))
  Logger.log('scriptTimeZone: %s (%s)', scriptTimeZoneString, sessionTz)

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

  Logger.log('timeZoneDiff: ' + timeZoneDiff)

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
    
  Logger.log('calendarDateTime: ' + calendarDateTime)

  return calendarDateTime
  
} // DateTime_.getScriptDateTime()

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
 
function gmtToCalendarDate(scriptDateTime, calendar) {
  
  Logger.log('scriptDateTime: ' + scriptDateTime)

  var calendarTimeZoneString = calendar.getTimeZone() 
  var calendarTimeZone = Utilities.formatDate(scriptDateTime, calendarTimeZoneString, 'Z')
  var calendarTz = Number(calendarTimeZone.slice(0,3)) 
  Logger.log('calendarTimeZone: %s (%s)', calendarTimeZoneString, calendarTz)

  var scriptTimeZoneString = Session.getScriptTimeZone()
  var scriptTimeZone = Utilities.formatDate(scriptDateTime, scriptTimeZoneString, 'Z')
  var sessionTz = Number(scriptTimeZone.slice(0,3))
  Logger.log('scriptTimeZone: %s (%s)', scriptTimeZoneString, sessionTz)

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

  Logger.log('timeZoneDiff: ' + timeZoneDiff)

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
    
  Logger.log('calendarDateTime: ' + calendarDateTime)

  return calendarDateTime
  
} // DateTime_.getCalendarDateTime()

/**
 * Get formatted date
 *
 * @param {Date} date
 *
 * @return {String} formatted date
 */

function getFormattedDate(date) {

  var timeZone = Session.getScriptTimeZone()
  
  if (typeof date !== 'object') {
    throw new Error('date needs to be a Date object, when it is a ' + typeof date)
  }
  
  return Utilities.formatDate(date, timeZone, "MM/dd/YYYY")
  
} // DateTime_.getFormattedDate()

/**
 * Formatted the time
 *
 * @param {Date} date
 * @param {String} timeZone [OPTIONAL]
 *
 * @return {String} formatted date
 */

function getFormattedTime(time, timeZone) {

  if (typeof timeZone === 'undefined') {
    timeZone = Session.getScriptTimeZone()
  }

  if (typeof time !== 'object') {
    throw new Error('time needs to be a Date object, when it is a ' + typeof time)
  }

  return Utilities.formatDate(time, timeZone, "hh:mm a")
  
} // DateTime_.getFormattedTime()
 
/**
 * Get midnight (in calendar time zone) from some number of days ago
 *
 * @param {Number} days [OPTIONAL, DEFAUL = 0 (midnight yesterday, 00:00 today)] Days to go back or forward
 * @param {Calendar} calendar [OPTIONAL]
 *
 * @return {Date} midnight
 */
 
function getMidnight(days, calendar) {

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
  
} // DateTime_.getMidnight() 

/**
 * Check if this is a new day
 */

function newDay() {
    
    var lastCheckedDate = Properties_.getProperty(PROPERTY_DAILY_CHECK)
    Logger.log('lastCheckedDate: ' + lastCheckedDate)
     
    var today = (new Date()).toDateString()
    Properties_.setProperty(PROPERTY_DAILY_CHECK, today)    
    Logger.log('today: ' + today)
    
    var newDay = (lastCheckedDate !== today)   
    Logger.log('newDay: ' + newDay)
    
    return newDay
    
} // DateTime_.newDay()

/**
 * Get Date Object from date string of format YYYY-MM-dd and time 
 * string of HH:mm format
 *
 * @param {Object} 
 *
 * @return {Object}
 */
 
function getDateTime(dateStr, timeStr) {

  var dateArr = dateStr.split('-')
  var timeArr = timeStr.split(':')
  
  var dateTime = new Date(
    dateArr[0], 
    parseInt(dateArr[1], 10) - 1, 
    dateArr[2]).getTime() + parseInt(timeArr[0], 10) * 60 * 60 * 1000 + parseInt(timeArr[1], 10) * 60 * 1000
    
  return new Date(dateTime)
  
} // DateTime_.getDateTime()

/**
 * Convert the duration from a GSheet into a number of hours.
 *
 * The spreadsheet stores durations as time since Sat Dec 30 1899 00:00 UTC.
 *
 * @param {Date} duration 
 *
 * @return {number} number of hours
 */
 
function convertDurationToHours(duration) {
  
  var baseline = (new Date(1899, 11, 30, 0)).getTime()
  var currentHours = 0
  
  // Check if it most likely a date
  if (typeof duration === 'object') {
  
    var msduration = duration.getTime()
    currentHours = Math.floor((msduration - baseline) / (1000 * 60 * 60)) 
  }
  
  return currentHours
  
} // DateTime_.convertDurationToHours()

// Get noon of yesterday

function getYesterday() {
  
  var now = new Date()
  var yesterday = new Date(now.getTime() - (24 * 3600 * 1000))
  yesterday.setHours(12)
  return yesterday
  
} // DateTime_.getYesterday()

// Get noon of tomorrow

function getTomorrow() {
  
  var now = new Date()
  var tomorrow = new Date(now.getTime() + (24 * 3600 * 1000))
  tomorrow.setHours(12)
  return tomorrow
  
} // DateTime_.getTomorrow_()

// Get a week today

function getAWeekToday() {
  var now = new Date()
  var tomorrow = new Date(now.getTime() + (7* 24 * 3600 * 1000))
  tomorrow.setHours(12)
  return tomorrow 
}

function inLast24Hours(lastUpdate) {
  var now = (new Date()).getTime()
  var twentyFourhrsAgoInMs = now.getTime() - MS_IN_24_HOURS
  return (lastUpdate.getTime() > twentyFourhrsAgoInMs) 
}

function getMondays(originalDate) {

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
}

function getUKTimezoneString(date) {
  var timezone = date.getTimezoneOffset()
  return timezone === 0 ? "GMT" : "GMT+1"  
}

/**
 * Check if this is a new day
 */

function newDay() {
  
  var lastCheckedDate = Properties_.getProperty(PROPERTY_EVENTS_CHECKED)
  Logger.log('lastCheckedDate: ' + lastCheckedDate)
  
  var today = (new Date()).toDateString()
  Properties_.setProperty(PROPERTY_EVENTS_CHECKED, today)    
  Logger.log('today: ' + today)
  
  var newDay = (lastCheckedDate !== today)   
  Logger.log('newDay: ' + newDay)
  
  return newDay   
}

/**
 * Get the number of weeks the script has been running for.
 */

function getWeekNumber() {
  
  if (USE_HARDCODED_WEEK_NUMBER) {
    return WEEK_NUMBER
  }
  
  var callingfunction = 'Utils.getWeekNumber()'
  var todaysWeekNumber = getActualWeekNumber(new Date())[1] // [YYYY, MM]
  var properties = PropertiesService.getScriptProperties()
  var weekStarted = properties.getProperty(PROPERTY_WEEK_STARTED)
  
  if (weekStarted === null) {
    
    weekStarted = todaysWeekNumber
    properties.setProperty(PROPERTY_WEEK_STARTED, weekStarted)
    
  } else {
    
    Assert.assertNumber(
      +weekStarted, 
      callingfunction, 
      'Invalid week started number stored')
  }
  
  var weekNumber = todaysWeekNumber - weekStarted + 1
  Logger.log('Week number: ' + weekNumber)
  return weekNumber
      
  // Private Functions
  // -----------------
  
  /* For a given date, get the ISO week number
   *
   * Based on information at:
   *
   *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
   *
   * Algorithm is to find nearest thursday, it's year
   * is the year of the week number. Then get weeks
   * between that date and the first day of that year.
   *
   * Note that dates in one year can be weeks of previous
   * or next year, overlap is up to 3 days.
   *
   * e.g. 2014/12/29 is Monday in week  1 of 2015
   *      2012/1/1   is Sunday in week 52 of 2011
   */
   
  function getActualWeekNumber(d) {
      // Copy date so don't modify original
      d = new Date(+d);
      d.setHours(0,0,0);
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setDate(d.getDate() + 4 - (d.getDay()||7));
      // Get first day of year
      var yearStart = new Date(d.getFullYear(),0,1);
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
      // Return array of year and week number
      return [d.getFullYear(), weekNo];
      
  } // DateTime_.getWeekNumber.getActualWeekNumber
    
} // DateTime_.getWeekNumber()

/**
 * @return {Date} the date six months ago
 */

function getSixMonthsAgo() {
  
  Log_.functionEntryPoint()
  var todayInMs = (new Date()).getTime()
  var sixMonthsAgoInMs = todayInMs - ((365 * 24 * 60 * 60 * 1000) / 2)
  return (new Date(sixMonthsAgoInMs))
  
} // DateTime_.getSixMonthsAgo() 
  
/**
 * If the original date in the script is not the required day of the week, the 
 * look backwards or forwards in time.
 *
 * @param {Date} originalDate
 * @param {string} dayOfTheWeekString
 * @param {boolean} forwards [OPTIONAL, DEFAULT true]
 *
 * @return {Date} new date
 */

function getDateOnThisDay(originalDate, dayOfTheWeekString, forwards) {

  if (forwards === undefined) {
    forwards = true;
  }
  
  var dayOfTheWeekIndex = DAYS_OF_WEEK_
    .indexOf(
      dayOfTheWeekString.trim().toUpperCase())
  
  var nextDate = originalDate;
  var nextDay = nextDate.getDay();
  var offset = 0;
  
  while (nextDay !== dayOfTheWeekIndex) {
  
    forwards ? offset++ : offset--;
    
    nextDate = new Date(
      originalDate.getYear(), 
      originalDate.getMonth(), 
      originalDate.getDate() + offset);
           
    nextDay = nextDate.getDay();
  }
  
  return nextDate;
  
} // DateTime_.getDateOnThisDay()
    