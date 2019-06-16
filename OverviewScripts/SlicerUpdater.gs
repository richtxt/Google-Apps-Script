function updateSlicers() {
  populateData();
}

function populateData() {
  var cmsrows = {}
  var cmssheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CMSExport');
  var cmsdata = cmssheet.getDataRange().getValues();
  var cmsrange = cmssheet.getDataRange();
  var cmslastcol = cmssheet.getLastColumn();
  var headerrange = cmssheet.getRange(1,1,1,cmslastcol).getValues();
  var headerdata = headerrange[0];
    for (var k = 1; k < cmsdata.length; k++){
      var cmsairing = cmsdata[k][headerdata.indexOf('Airing ID')];
      var cmsslicer = cmsdata[k][headerdata.indexOf('Primary Slicer')];
      cmsrows[cmsairing] = {
        airing: cmsairing,
        slicer: cmsslicer,
      }
    }
  writeSlicers(cmsrows);
 }

function writeSlicers(cmsrows){
  var overviewsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput');
  var overviewdata = overviewsheet.getDataRange().getValues();
  var overviewlast = overviewsheet.getLastRow();
  for (var i = 4; i < overviewdata.length; i++){
  var cellRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(i+1, 11);
  var airingRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OverviewOutput').getRange(i+1, 18);
  var overSlicer = overviewdata[i][10];
  var overAiring = overviewdata[i][17];
    if (overAiring !== '' && cmsrows[overAiring]){
  var match = cmsrows[overAiring].slicer;
    if (match !== '') {
      cellRange.setValue(match.replace('IPENC_VZ0',''));
//      if (overSlicer !== match.replace('IPENC_VZ0','')) {
//        cellRange.setNote('Changed from: ' + overSlicer);
//      }
    }else{
      cellRange.setNote('Not in CMS');
    }
    }else{
      airingRange.setNote('No Airing ID Found');
    }
  }
}
