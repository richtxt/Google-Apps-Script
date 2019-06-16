function copyColumns() {
  var cmssheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CMSExport');
  var overviewsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput');
  
  var cmsdata = cmssheet.getDataRange().getValues();
  var cmsrange = cmssheet.getDataRange();
  var cmslastcol = cmssheet.getLastColumn();
  var headerrange = cmssheet.getRange(1,1,1,cmslastcol).getValues();
  var headerdata = headerrange[0];
  var titleNum = headerdata.indexOf('Title');
  var startNum= headerdata.indexOf('Start Time');
  var endNum = headerdata.indexOf('End Time');
  var opNum = headerdata.indexOf('Operator');
  var airNum = headerdata.indexOf('Airing ID');
  var nums = [titleNum,startNum,endNum,opNum,airNum];
  var titleArray = [
    { key: 'title', column: 'Title', destinationIndex: 2 },
    { key: 'operator', column: 'Operator', destinationIndex: 5 },
    { key: 'startTime', column: 'Start Time', destinationIndex: 6 },
    { key: 'endTime', column: 'End Time', destinationIndex: 7 },
    { key: 'primarySlicer', column: 'Primary Slicer', destinationIndex: 10 },
    { key: 'network', column: 'Network', destinationIndex: 21 },
    { key: 'simulcastNet', column: 'Simulcast Net', destinationIndex: 11 },
    { key: 'cc', column: 'CC', destinationIndex: 12 },
    { key: 'replayStatus', column: 'Replay Status', destinationIndex: 13 },
    { key: 'commRepl', column: 'Comm Repl', destinationIndex: 14 },
    { key: 'language', column: 'Language', destinationIndex: 15 },
    { key: 'airingId', column: 'Airing ID', destinationIndex: 17 },
    { key: 'fsMcrPcr', column: 'FS/MCR/PCR', destinationIndex: 22 },
    { key: 'e3ExclSrc', column: 'E3 Excl Src', destinationIndex: 23 },
    { key: 'league', column: 'League', destinationIndex: 24 },
    { key: 'category', column: 'Category', destinationIndex: 25 },
    { key: 'ccline', column: 'bridgeNumber' },
    { key: 'embargo', column: 'Replay Embargo'}
  ];
  var columns = getColumnMetadata(headerdata, titleArray);
  var rows = [];
  for (var i = 1; i < cmsdata.length; i++) {
    var rownumber = i + 4;
    var row = getRow(titleArray, columns, cmsdata[i]);
    humanReadable(row,rownumber)
    processInternationalEvents(row);
    ACC(row);
    SEC(row,rownumber);
    replayOnly(row,rownumber);
    dailyShows(row);
    abcrsn(row,rownumber);
    checkLang(row,rownumber);
    rows.push(getRowArr(row, titleArray));
  }
  overviewsheet.getRange(5,1,rows.length,26).setValues(rows);
  replaceNames()
}

function humanReadable (row,rownumber) {
  if (row.replayStatus == 'LR'){
    row.replayStatus = ''
  } else if (row.replayStatus == 'LO') {
    row.replayStatus = 'Live Only'
  } else if (row.replayStatus == 'RO') {
    row.replayStatus = 'Replay Only'
  }
//  var op = row.operator;
//  op = op.substring(0, op.indexOf('@')).replace('.',' ');
//  row.operator = titleCase(op);
  row.category = row.category.replace('Soccer/Futbol','Soccer');
  var st = new Date(row.startTime)
  var startobj = Utilities.formatDate(st,"GMT-04:00","hh:mm a");
  row.startTime = startobj
  var end = new Date(row.endTime)
  var endobj = Utilities.formatDate(end,"GMT-04:00","hh:mm a");
  if (row.embargo !== 'null'){
  var embargo = new Date(row.embargo)
  var embarobj = Utilities.formatDate(embargo,"GMT-04:00","hh:mm a");
  }
  if (embargo && endobj !== embarobj){
    var endRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 8);
     endRange.setNote('Embargo differs from end time: ' + embarobj);
  }
  row.endTime = endobj
  row.primarySlicer = row.primarySlicer.replace('IPENC_VZ0','');
  
  if (row.cc){
    row.cc = 'Y'
  }
}
      
function processInternationalEvents(row) {
  var intray = ['pacrim_live', 'latin_south', 'latin_north', 'carribean_live', 'brazil_live'];
//  if (intray.indexOf(row.network) !== -1 && row.category == 'Baseball' && row.language == 'English' && row.simulcastNet !== '') {
//    UI(row);
//}
  if (row.category.toLowerCase() == 'sportscenter' && intray.indexOf(row.network) !== -1){
    if (!row.replayStatus){
  row.replayStatus = 'Wait For Copyright';
    }else{
    row.replayStatus = row.replayStatus + '\n' + 'Wait For Copyright';
    }
  }
  if (intray.indexOf(row.network) !== -1) {
    row.simulcastNet = 'International';
  }
  if (intray.indexOf(row.network) !== -1 && row.e3ExclSrc == 'DTC-D') {
    row.simulcastNet = 'International' + '\n' + 'ESPN+';
  }
  if (intray.indexOf(row.network) !== -1 && row.e3ExclSrc == 'WF') {
    row.simulcastNet = 'International' + '\n' + 'World Feed';
  }
  if (intray.indexOf(row.network) !== -1 && row.commRepl == 'AD SERVE') {
    row.commRepl = 'Ad Serve';
  }
  if (intray.indexOf(row.network) !== -1 && row.commRepl == 'N/A' || intray.indexOf(row.network) !== -1 && row.commRepl == 'TBD') {
    row.commRepl = 'Pass Through';
  }
  var replaysport = titleCase(row.category.replace('Soccer/Futbol','Soccer')) + '\n' + row.replayStatus
  if (intray.indexOf(row.network) !== -1 && row.replayStatus !== '') {
    row.replayStatus = replaysport.replace('Futebol','Soccer').replace('ESPN3','').replace('Polo','Polo' + '\n' + ' Equestrian');
  } else if (intray.indexOf(row.network) !== -1){
    row.replayStatus = titleCase(row.category.replace('Soccer/Futbol','Soccer').replace('Futebol','Soccer').replace('ESPN3','').replace('Polo','Polo' + '\n' + ' Equestrian'));
  }
  if (intray.indexOf(row.network) !== -1 && row.league !== '' && row.replayStatus.toLowerCase().search('soccer') !== -1){
    row.replayStatus = row.replayStatus + '\n' + titleCase(row.league);
  }
  var lowTitle = row.title.toLowerCase();
  if (intray.indexOf(row.network) !== -1 && lowTitle.search('esports') !== -1){
    row.replayStatus = 'eSports';
  }
}

function ACC(row){
  if (row.network == 'accextra'){
    if (row.commRepl == 'AD SERVE' || row.commRepl == 'Ad Serve'){
      if (row.replayStatus == ''){
        row.replayStatus = 'Site Will Call';
      }else if (row.replayStatus !== ''){
        row.replayStatus = row.replayStatus + '\n' + 'Site Will Call'
      }
    }
    if (row.commRepl == 'N/A' || row.commRepl == 'Pass Through'){
      if (row.replayStatus == ''){
        row.replayStatus = 'Site May Call';
      }else if (row.replayStatus !== ''){
        row.replayStatus = row.replayStatus + '\n' + 'Site May Call';
      }
    }
    if (row.category !== ''){
       row.simulcastNet = 'ACC ' + row.category
    }else if (row.league !== ''){
      row.simulcastNet = 'ACC ' + row.league;
    }else{
    row.simulcastNet = 'ACC *Sport not Found*';
    }
    if (row.commRepl == 'AD SERVE'){
      row.commRepl = 'Ad Serve';
    }else if (row.commRepl == 'N/A'){
      row.commRepl = 'Pass Through';
    }
  }
}

function SEC(row,rownumber) {
  if (row.network == 'secplus') {
    if (row.simulcastNet == 'SEC') {
      if (row.league !== ''){
            row.simulcastNet = 'SEC Linear' + '\n' + titleCase(row.league.replace('NCAA ',''));
      } else if (row.league == '' && row.category !== ''){
        row.simulcastNet = 'SEC Linear' + '\n' + row.category;
      } else {
        row.simulcastNet = 'SEC Linear **Needs Sport**';
      }
      if (row.league.toLowerCase().search('soccer') !== -1 || row.league.toLowerCase().search('basketball') !== -1 || row.league.toLowerCase().search('lacrosse') !== -1 || row.league.toLowerCase().search('football') !== -1 || row.league.toLowerCase().search('hockey') !== -1 || row.league.toLowerCase().search('field hockey') !== -1 || row.league.toLowerCase().search('rugby') !== -1 || row.league.toLowerCase().search('cricket') !== -1 || row.category.toLowerCase().search('cricket') !== -1 || row.category.toLowerCase().search('soccer') !== -1 || row.category.toLowerCase().search('basketball') !== -1 || row.category.toLowerCase().search('football') !== -1) {
      row.replayStatus = 'Replay Only' + '\n' + 'Slate Halftime' + '\n' + 'CC11';
      row.commRepl = 'Ad Serve';
      }else{
      row.replayStatus = 'Replay Only' + '\n' + 'CC11';
      row.commRepl = 'Ad Serve';
      }
    }else if (row.simulcastNet !== 'SEC'){
      if (row.league !== ''){
        row.simulcastNet = 'SEC+ ' + '\n' + titleCase(row.league.replace('NCAA ',''));
      }else if (row.league == '' && row.category !== ''){
        row.simulcastNet = 'SEC+ ' + '\n' + row.category;
      }else {
        row.simulcastNet = 'SEC+ **Needs Sport**';
      }
      if (row.commRepl == 'AD SERVE') {
        row.commRepl = 'Ad Serve';
      }
      if (row.commRepl == 'SHARED INV'){
        row.commRepl = 'Shared Inventory';
            var adRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 15);
        adRange.setNote('Check With ESPN');
      }
      if (row.commRepl == 'N/A'){
        row.commRepl = 'Pass Through';
      }
    }
  }
}

function replayOnly (row,rownumber){
  var simulray = ['EU', 'E1', 'DE', 'E2', 'E4'];
  var halfSports = ['Basketball','Lacrosse','Soccer','Futbol','Hockey','Field Hockey','Football','Rugby','Cricket'];
  if (row.network == 'espn3'){
    if (simulray.indexOf(row.simulcastNet) !== -1){
      if (row.commRepl == 'TBD' || row.commRepl == 'AD SERVE'){
          row.commRepl = 'Ad Serve';
      }else if (row.commRepl == 'N/A'){
        row.commRepl = 'Pass Through';
      }
    }
    if (row.simulcastNet == 'E1'){
      if (row.ccline && row.ccline !== '' && row.ccline.search('CC02') == -1 && row.ccline !== '[null]'){
      var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 12);
        cellRange.setNote('Metadata is different : ' + row.ccline);
      }
      row.simulcastNet = 'Replay Only' + '\n' + 'E1 - CC02'
      if (row.category !== ''){
        row.replayStatus = row.category
      } else if (row.category == '') {
        row.replayStatus = titleCase(row.league.replace('NCAA ',''));
      } else{
        row.replayStatus = '**Needs Sport**';
      }
    }
    if (row.simulcastNet == 'E2'){
      Logger.log(row.ccline);
      if (row.ccline && row.ccline !== '' && row.ccline.search('CC03') == -1 && row.ccline !== '[null]'){
        var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 12);
        cellRange.setNote('Metadata is different : ' + row.ccline);
      }
      row.simulcastNet = 'Replay Only' + '\n' + 'E2 - CC03'
      if (row.category !== ''){
      row.replayStatus = row.category
    } else if (row.category == '') {
      row.replayStatus = titleCase(row.league.replace('NCAA ',''));
    } else{
      row.replayStatus = '**Needs Sport**';
      }
    }
    if (row.simulcastNet == 'DE'){
      if (row.ccline && row.ccline !== '' && row.ccline.search('CC06') == -1 && row.ccline !== '[null]'){
        var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 12);
        cellRange.setNote('Metadata is different : ' + row.ccline);
      }
      row.simulcastNet = 'Replay Only' + '\n' + 'DE - CC06'
      if (row.category !== ''){
      row.replayStatus = row.category
    } else if (row.category == '') {
      row.replayStatus = titleCase(row.league.replace('NCAA ',''));
    } else{
      row.replayStatus = '**Needs Sport**';
      }
    }
    if (row.simulcastNet == 'EU'){
      if (row.ccline && row.ccline !== '' && row.ccline.search('CC05') == -1 && row.ccline !== '[null]'){
        var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 12);
        cellRange.setNote('Metadata is different : ' + row.ccline);
      }
      row.simulcastNet = 'Replay Only' + '\n' + 'EU - CC05'
      if (row.category !== ''){
      row.replayStatus = row.category
    } else if (row.category == '') {
      row.replayStatus = titleCase(row.league.replace('NCAA ',''));
    } else{
      row.replayStatus = '**Needs Sport**';
      }
    }
    if (row.simulcastNet == 'E4'){
      if (row.ccline && row.ccline !== '' && row.ccline.search('CC04') == -1 && row.ccline !== '[null]'){
        var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 12);
        cellRange.setNote('Metadata is different : ' + row.ccline);
      }
      row.simulcastNet = 'Replay Only' + '\n' + 'E4 - CC04'
      if (row.category !== ''){
      row.replayStatus = row.category
    } else if (row.category == '') {
      row.replayStatus = titleCase(row.league.replace('NCAA ',''));
    } else{
      row.replayStatus = '**Needs Sport**';
      }
    }
    for (var i = 0; i < halfSports.length; i++){
      if (row.replayStatus.search(halfSports[i]) !== -1 && row.replayStatus.search('Slate Halftime') == -1){
        row.replayStatus = row.replayStatus + '\n' + 'Slate Halftime';
      }
    }
  }
}

function dailyShows (row) {
  if (row.title.search('Golic and Wingo') !== -1) {
    row.simulcastNet = 'Replay Only';
    row.cc = 'Y';
    row.replayStatus = 'Golic and Wingo' + '\n' + 'Format';
    row.commRepl = 'Ad Serve';
  }
  if (row.title.search('Around The Horn') !== -1) {
    row.simulcastNet = 'Replay Only';
    row.cc = 'Y';
    row.replayStatus = 'Around The Horn' + '\n' + 'Format';
    row.commRepl = 'Ad Serve';
  }
  if (row.title.search('Will Cain Show') !== -1) {
    row.simulcastNet = 'Replay Only';
    row.cc = 'Y';
    row.replayStatus = 'Will Cain Show' + '\n' + 'Format';
    row.commRepl = 'Ad Serve';
  }
  if (row.title.search('First Take') !== -1) {
    row.simulcastNet = 'Replay Only';
    row.cc = 'Y';
    row.replayStatus = 'First Take' + '\n' + 'Format';
    row.commRepl = 'Ad Serve';
  }
  if (row.title.search('Get Up!') !== -1) {
    row.simulcastNet = 'Replay Only';
    row.cc = 'Y';
    row.replayStatus = 'Get Up!' + '\n' + 'Format';
    row.commRepl = 'Ad Serve';
  }
  if (row.title.search('Pardon The Interruption') !== -1) {
    row.simulcastNet = 'Replay Only';
    row.cc = 'Y';
    row.replayStatus = 'PTI' + '\n' + 'Format';
    row.commRepl = 'Ad Serve';
  }
  if (row.title.search('HIGH NOON') !== -1 || row.title.search('High Noon') !== -1) {
  row.simulcastNet = 'Replay Only';
  row.cc = 'Y';
  row.replayStatus = 'High Noon' + '\n' + 'Format';
  row.commRepl = 'Ad Serve';
  }
  if (row.title.search('Stephen A. Smith') !== -1) {
  row.simulcastNet = 'Replay Only';
  row.cc = 'Y';
  row.replayStatus = 'Stephen A. Smith' + '\n' + 'Format';
  row.commRepl = 'Ad Serve';
  }
  if (row.title.search('Highly Questionable') !== -1) {
  row.simulcastNet = 'Replay Only';
  row.cc = 'Y';
  row.replayStatus = 'Highly Questionable' + '\n' + 'Format';
  row.commRepl = 'Ad Serve';
  }
}

function abcrsn(row,rownumber) {
  if (row.e3ExclSrc.search('ABC') !== -1 && row.simulcastNet !== 'International'){
    if (row.title.search('X Games') !== -1){
      row.simulcastNet = 'ABC Simulcast';
      row.replayStatus = 'Teradek Only';
      row.commRepl = 'Ad Serve';
    }else{
      row.simulcastNet = 'ABC Simulcast';
      row.replayStatus = '212-721-8992';
      row.commRepl = 'Ad Serve';
    }
  }
  if (row.e3ExclSrc.search('RSN') !== -1 && row.simulcastNet !== 'International'){
    var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 15);
    if (row.network == 'accextra'){
    row.simulcastNet = 'RSN' + '\n' + row.simulcastNet;
    row.cc = 'Y';
    row.replayStatus = 'Take All Breaks';
    }
    if (row.commRepl == 'TBD'){
    row.simulcastNet = 'RSN';
    row.replayStatus = 'Take All Breaks';
    row.commRepl = 'Ad Serve';
    cellRange.setNote('Marked as TBD in Metadata')
    }else if (row.commRepl == 'AD SERVE'){
    row.simulcastNet = 'RSN';
    row.replayStatus = 'Take All Breaks';
    row.commRepl = 'Ad Serve';
    }else if (row.commRepl == 'N/A'){
      row.simulcastNet = 'RSN';
      row.replayStatus = 'Teradek Only';
      row.commRepl = 'Pass Through'
    }
//    cellRange.setNote('RSN Events are subject to being College Extra');
  }
}

function checkLang(row,rownumber) {
  var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(rownumber, 16);
  if (row.fsMcrPcr.search('SS') !== -1 && row.language !== 'Spanish'){
    cellRange.setNote('Language does not match metadata please review');
  } else if (row.fsMcrPcr.search('EE') !== -1 && row.language !== 'English'){
    cellRange.setNote('Language does not match metadata please review');
  } else if (row.fsMcrPcr.search('Portuguese') !== -1 && row.language !== 'Portuguese'){
    cellRange.setNote('Language does not match metadata please review');
  }
}

function getColumnMetadata(headerdata, titleArray) {
  var columns = {};
  for (var i = 0; i < titleArray.length; i++) {
    var item = titleArray[i];
    var columnIndex = headerdata.indexOf(item.column);
    columns[item.key] = {
      destinationIndex: item.destinationIndex,
      index: columnIndex,
      title: item.column
    };
  }
  return columns;
}

function getRow(titleArray, columns, rowArr) {
  var row = {};
  for (var i = 0; i < titleArray.length; i++) {
    var rownumber = i + 1;
    var title = titleArray[i];
    row[title.key] = rowArr[columns[title.key].index];
  }
  return row;
}

function rowToArray(row, titleArray) {
  var rowArr = [];
  for (var i = 0; i < titleArray.length; i++) {
    var title = titleArray[i];
    rowArr[title.destinationIndex] = row[title.key];
  }
  for (var k = 0; k < rowArr.length; k++) {
    if (!rowArr[k]) {
      rowArr[k] = '';
    }
  }
  return rowArr;
}

function getRowArr(row, titleArray) {
  var rowArr = rowToArray(row, titleArray);
  return rowArr;
}

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

function uiInternational(row) {
var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Is this Inet event Ad Served?: '+ row.title + ' ' + row.network + ' ' + row.category + ' ' + row.simulcastNet, ui.ButtonSet.YES_NO);
      if (response == ui.Button.YES){
      row.commRepl = 'Ad Serve';
    } else {
      SpreadsheetApp.getActiveSpreadsheet().toast('The event ' + row.title + ' May have been an international MLB Ad Served event please take a look');
    }
}

function replaceNames(nums){
  var overviewsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput');
  var namesheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NameDatabase');
  var overviewdata = overviewsheet.getDataRange().getValues();
  var namedata = namesheet.getDataRange().getValues();
  var overviewrange = overviewsheet.getDataRange();
  var nameColumn = namesheet.getRange(1,2,namesheet.getLastRow()).getValues();
  for (var i = 4; i < overviewdata.length; i++){
    var name = overviewdata[i][5];
    var indexValue = findNames(name,nameColumn);
    if (indexValue !== -1){
      var replaceName = namedata[indexValue][0]
      overviewsheet.getRange(i+1, 5+1).setValue(replaceName);
    }else{
      var ui = SpreadsheetApp.getUi();
      ui.alert(name + ' isn\'t in the database please change manually!',ui.ButtonSet.OK);
    }
  }
}

function findNames(search,range){
  if(search == "") return false;
  for (var i=0; i<range.length; i++)
  if (range[i] == search) return i;
  return -1;
}
