function condense() {
  var eventSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var writeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SuperSecretLauraTab');
  var eventData = eventSheet.getDataRange().getValues();
  var lastRow = eventSheet.getLastRow();
  var ticker = 1;
  
  for (var i = 0; i < lastRow; i++){
    if (eventSheet.getRange(i+1,5).getValue() == "Notes"){
      var title = eventSheet.getRange(i+1,1).getValue();
      var op = eventSheet.getRange(i+16,2).getValue();
      var airing = eventSheet.getRange(i+18,2).getValue();
      var notes = eventSheet.getRange(i+2,3).getValue();
      writeSheet.getRange(ticker, 1).setValue(title);
      writeSheet.getRange(ticker, 2).setValue(op);
      writeSheet.getRange(ticker, 3).setValue(airing);
      writeSheet.getRange(ticker, 4).setValue(notes);
      ticker++;
    }
  
  }
  
}
