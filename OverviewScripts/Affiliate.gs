function importAffiliates() {
  var overviewsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput');
  var guygrid = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GuyGrid');
  var overviewlastrow = overviewsheet.getLastRow();
  var overviewlastcolumn = overviewsheet.getLastColumn();
  var overviewdata = overviewsheet.getDataRange().getValues();
  var length = overviewdata.length
  var guydata = guygrid.getDataRange().getValues();
  var newtitles = [];
  var airings = [];
  
  for(var i = 4; i < overviewdata.length; i++){
    var airingId = overviewdata[i][17];
    var plaintitle = overviewdata[i][2];
    airingId = airingId.replace('a1','');
    for(var j = 0; j < guydata.length; j++){
      if(guydata[j][5].indexOf(airingId) !== -1){
        var titles = overviewdata[i][2].split('\n')[0];
        var replayStatus = overviewdata[i][11];
        var format = overviewdata[i][13];
        var matchingRow = j
        var live
        var afftitle = guydata[matchingRow][0];
        var afftitle = afftitle.replace('ESPN Play Latin North','Axtel').replace('ESPN Play PAC Rim','Foxtel').replace('ESPN Play Caribbean','Lime').replace('ESPN Play Latin South','Fibertel').replace('ESPN Play Brasil','Life Brasil').replace('ACC Network Extra,','').replace('ACC Network Extra, ','').replace('ESPN3.com,','').replace(', ESPN3.com','').replace('ESPN Play EMEA','ESPN 390')
          if (afftitle == 'ESPN3.com' || afftitle == 'ACC Network Extra'){
            if (airings.indexOf(airingId) == -1){
            newtitles.push([titles]);
            airings.push([airingId]);
            }
          }else{        
            if (replayStatus.search('International') !== -1){
              if (format.search('Live Only') !== -1){
                live = 'Live Only on ';
                }else if (format.search('Replay Only') !== -1){
                  live = 'Replay Only on ';
                }else{
                  live = 'Live/Replay on ';
                }
                }else{
                  live = 'Live/Replay Also on '
                }
                if (airings.indexOf(airingId) == -1){
                newtitles.push([titles + '\n' + live + afftitle]);
                airings.push([airingId]);
                }
            }
      }
    }
   var stringies = airings.toString()
   Logger.log(stringies)
    if (stringies.search(airingId) == -1){
      newtitles.push([plaintitle]);
      airings.push([airingId]);
    }
  }
  Logger.log(airings)
  overviewsheet.getRange(5,3,overviewlastrow - 4).setValues(newtitles);
}
