function importShifty() {
  var overview = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput');
  var unmatched = findMatches();
  var nameTrack = {};
  if (unmatched.matches.length > 0 && !nameTrack[unmatched.name]) {
    showDialogBox(unmatched);
  }else{
    overview.getRange(unmatched.row + 1, 5).setBackground('cyan');
    overview.getRange(unmatched.row + 1, 5).setValue(' ');
    nameTrack[unmatched.name] = true;
    importShifty();
  }
}

function showDialogBox(unmatched) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.unmatched = unmatched;
  var html = template.evaluate();
  SpreadsheetApp.getUi().showModalDialog(html, 'Please Choose One');
}

function processName(name) {
  var overview = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput');
  var schedule = getSchedule();
  var time = schedule[name].time;
  var unmatched = findMatches();
  overview.getRange(unmatched.row + 1, 5).setValue(time);
  importShifty();
}

function getSchedule() {
  var humanity = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Shifty');
  var humanitydata = humanity.getDataRange().getValues();
  var schedule = {};
  for (var i = 1; i < humanitydata.length; i++){
      var name = humanitydata[i][2];
    
      var time = humanitydata[i][1].match(/\d*\d.\d\d../);
      schedule[toTitleCase(name)] = {
        'name': name,
        'time': time,
      };
  }
  return schedule
}

function findMatches() {
  var overview = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput');
  var overviewdata = overview.getDataRange().getValues();
  var schedule = getSchedule();
  var duplicates = {};
  var unmatched = {};
  var time;
  var nameTrack = {};
  var keys = Object.keys(schedule);
  for (var i = 4; i < overviewdata.length; i++){
    var trackTime = overviewdata[i][4];
    var viewname = overviewdata[i][5];
    var newName = viewname.replace(/[0-9]/g, '');
    var splitname = viewname.split(' ');
    var firstname = splitname[0];
    var lastname = splitname[1];
    Logger.log(schedule);
    var match = schedule[toTitleCase(newName)];
     if (match){
       if (!duplicates[toTitleCase(newName)]){
         duplicates[newName] = true;
         overview.getRange(i + 1, 5).setValue(match.time);
       }
     }else if (!nameTrack[viewname] && !trackTime && newName){
       var keycheck = {};
       var matchray = [];
       for (var j = 0; j < keys.length; j++){
         if (!duplicates[newName]){
           if (!keycheck[keys[j]]){
             if (keys[j].toLowerCase().search(firstname.toLowerCase()) !== -1){
               matchray.push(keys[j]);
               keycheck[keys[j]] = true;
             }
           }
             if (keys[j].toLowerCase().search(lastname.toLowerCase()) !== -1 && !keycheck[keys[j]]){
               matchray.push(keys[j]);
               keycheck[keys[j]] = true;
             }
         }
       }
         return {'name': newName, 'time': time, 'row' : i, 'matches': matchray};
       nameTrack[newName] = true;
     } else if (!trackTime && !match && !nameTrack[newName] || !newName) {
       overview.getRange(i + 1, 5).setBackground('cyan');
     }
    nameTrack[newName] = true;
  }
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
