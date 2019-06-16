function copy() {
  
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  var weekday_value = currentDate.getDay();
  
  var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  var testfolder = DriveApp.getFolderById('0B3Q68Clz8i4bOTVmS3JWbGNibmc');
  var overview = DriveApp.getFileById('1MKamDRh1lJBv2j-miZEliFeFmL_vyhnBJ9nsntgH-0o');
  overview.makeCopy(currentDate.toLocaleDateString("en-US") + " " + weekdays[weekday_value] + " ESPN Overview", testfolder)
  
}
