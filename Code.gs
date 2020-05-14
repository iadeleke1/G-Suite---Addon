function onInstall() {
  //Create a triggers
  if (ScriptApp.getProjectTriggers().length == 0){
    verifySheets();
    addFormSubmissionListener();
    Logger.log("Found no triggers so created a new new");
  }
}

function addFormSubmissionListener(){
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("onFormSubmit")
     .forSpreadsheet(sheet)
     .onFormSubmit()
     .create();
  var form = FormApp.openByUrl(sheet.getUrl());
   ScriptApp.newTrigger("onFormSubmit")
     .forSpreadsheet(form)
     .onFormSubmit()
     .create();
}

function onOpen(){
  try
  {
    SpreadsheetApp.getUi().createAddonMenu().addItem('G Form Add-on', 'showSidebar').addToUi();
    Logger.log(ScriptApp.getProjectTriggers().toString());
    Logger.log("Show side panel for spreadsheets");
  }
  catch (e)
  {
    FormApp.getUi().createAddonMenu().addItem('G Form Add-on', 'showSidebar').addToUi();
    Logger.log(ScriptApp.getProjectTriggers().toString());
    Logger.log("Show side panel for forms");
}

  var triggers = ScriptApp.getProjectTriggers();

  if (ScriptApp.getProjectTriggers().length == 0){
    Logger.log("Found no triggers so created a new new");
    verifySheets();
    addFormSubmissionListener();
    Logger.log("Found no triggers so created a new new");
  }
}

function onFormSubmit(e){
// var slack_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Slack");
// slack_sheet.deleteColumn(1);
// slack_sheet.getRange(i, 1).setValue(channels[i])
Logger.log("Nothing to do");
}

function showSidebar(){
  var html = HtmlService.createHtmlOutputFromFile('side_bar.html');
  try
  {
    SpreadsheetApp.getUi().showSidebar(html);
  }
  catch (e)
  {
    FormApp.getUi().showSidebar(html);
}
}
function updateChannels(channels){
  //clear previous column that hosted the channels
 try{
   var slack_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Slack");
   slack_sheet.insertColumnBefore(1);
   slack_sheet.deleteColumn(2);
   Logger.log(channels);
   var row = 1;
   for (var i = 0; i < channels.length ; i++){
     slack_sheet.getRange(row, 1).setValue(channels[i]);
     row++;
   }
 }
 catch (e){

   var form = FormApp.getActiveForm();
   var slack_sheet = SpreadsheetApp.openById(form.getDestinationId()).getSheetByName("Slack");

   //slack_sheet.insertColumnAfter(1,2);
   slack_sheet.insertColumnBefore(1);
   slack_sheet.deleteColumn(2);
   Logger.log(channels);
   var row = 1;
   for (var i = 0; i < channels.length ; i++){
     slack_sheet.getRange(row, 1).setValue(channels[i]);
     row++;
   }
 }
}


function updateEmails(emails){
  //clear previous column that hosted the channels
 try{
   var email_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Email");
   email_sheet.insertColumnBefore(1);
   email_sheet.deleteColumn(2);
   var row = 1;
   for (var i = 0; i < emails.length ; i++){
     email_sheet.getRange(row, 1).setValue(emails[i]);
     row++;
   }
 }
 catch (e){
   var form = FormApp.getActiveForm();
   var email_sheet = SpreadsheetApp.openById(form.getDestinationId()).getSheetByName("Email");

   email_sheet.insertColumnBefore(1);
   email_sheet.deleteColumn(2);
   var row = 1;
   for (var i = 0; i < emails.length ; i++){
     email_sheet.getRange(row, 1).setValue(emails[i]);
     row++;
   }

 }
}

//This function updates the report questions order
//It take the list from the Add-on as
function updateQuestions(questions){
  //clear previous column that hosted the channels
  try{
    var questions_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report_Order");
    questions_sheet.insertColumnBefore(1);
    questions_sheet.deleteColumn(2);
    Logger.log(questions);
    var row = 1;
    for (var i = 0; i < questions.length && row != 7 ; i++){
      questions_sheet.getRange(row, 1).setValue(questions[i]);
      row++;
    }
  }
  catch (e){

    var form = FormApp.getActiveForm();
    var questions_sheet = SpreadsheetApp.openById(form.getDestinationId()).getSheetByName("Report_Order");
    questions_sheet.insertColumnBefore(1);
    questions_sheet.deleteColumn(2);
    var row = 1;
    for (var i = 0; i < questions.length && row != 7 ; i++){
      questions_sheet.getRange(row, 1).setValue(questions[i]);
      row++;
    }

  }

}

function doGet(){
  return HtmlService.createHtmlOutputFromFile('side_bar.html');
}

function getSlackList(){
  try{
    var slack_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Slack");
    var empty = slack_sheet.getDataRange().getValues()[0];
    if (empty[0] == ""){
      Logger.log("No channels are currently getting notifications");
    }
    else{
      //return the list of channels getting notifications.
      return( slack_sheet.getDataRange().getValues());
    }
  }
  catch (e){
    var form = FormApp.getActiveForm();
    var slack_sheet = SpreadsheetApp.openById(form.getDestinationId()).getSheetByName("Slack");
    var empty = slack_sheet.getDataRange().getValues();
    if (empty[0] == ""){
      Logger.log("No channels are currently getting notifications");
    }
    else{
      //return the list of channels getting notifications.
      return( slack_sheet.getDataRange().getValues());
    }
  }
}

function getEmailList(){
  //If add-on is opened from a spreadsheet
  try{
    var email_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Email");
    var empty = email_sheet.getDataRange().getValues()[0];
    if (empty[0] == ""){
      Logger.log("No Emails are currently getting notifications");
    }
    else{
      //return the list of channels getting notifications.
      //Logger.log(email_sheet.getDataRange().getValues());
      return( email_sheet.getDataRange().getValues());
    }
  }//If the add-on is opened from the form
  catch (e){
    var form = FormApp.getActiveForm();
    var email_sheet = SpreadsheetApp.openById(form.getDestinationId()).getSheetByName("Email");
    var empty = (email_sheet.getDataRange().getValues());

    if (empty[0] == ""){
      Logger.log("No Emails are currently getting notifications");
    }
    else{
      //return the list of channels getting notifications.
      //Logger.log(email_sheet.getDataRange().getValues());
      return( email_sheet.getDataRange().getValues());
   }

  }
}

function closeSidebar() {
  try{
    var html = HtmlService.createHtmlOutput("<script>google.script.host.close();</script>");
    SpreadsheetApp.getUi().showSidebar(html);
  }
  catch (e){
    var html = HtmlService.createHtmlOutput("<script>google.script.host.close();</script>");
    FormApp.getUi().showSidebar(html);
  }

}

function getReportOrder(){
  try{
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
    var form = FormApp.openByUrl(spreadsheet);

    var questions = form.getItems();
    var question_array = [];
    var row = 1;
    for (var i = 0; i < questions.length; i++){
      question_array[i] = questions[i].getTitle();
    }
    if (question_array.length !== 0){
      //return questions to the Add-on
      return(question_array);
    }
  }

  catch (e){
    var form = FormApp.getActiveForm();

    var questions = form.getItems();
    var question_array = [];
    var row = 1;
    for (var i = 0; i < questions.length; i++){
      question_array[i] = questions[i].getTitle();
    }
    if (question_array.length !== 0){
      //return questions to the Add-on
      return(question_array);
    }
  }
}

function verifySheets()
{
  try{
    var spreadsheet_id = SpreadsheetApp.getActiveSpreadsheet();

    if (spreadsheet_id == null){
      var form = FormApp.getActiveForm();
      var formName = form.getTitle();

      Logger.log("Got here no active spreadsheet");
      //Create spreadsheet and set it to active

      var new_spreadsheet = SpreadsheetApp.create(formName);
      form_id = form.getDestinationId();
      SpreadsheetApp.setActiveSpreadsheet(new_spreadsheet);
    }

    var email_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Email");
    var slack_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Slack");
    var question_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report_Order");

    if (email_sheet == null){
      var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
      spreadSheet.insertSheet().setName("Email");
    }
    if (slack_sheet == null){
      var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
      spreadSheet.insertSheet().setName("Slack");
    }
    if (question_sheet == null){
      var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
      spreadSheet.insertSheet().setName("Report_Order");
    }
    Logger.log("Got here verify sheets");
  }
  catch (e){

    var form_id;
    var form = FormApp.getActiveForm();
    var formName = form.getTitle();

    //Check whether this is a new form and setup a response spreadsheet if it is a new form
    try{
      form_id = form.getDestinationId();
    }
    catch (e){
      var exception = e.name;
      if (exception === "Exception"){
        var sheet = SpreadsheetApp.create(formName);
        form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
        form_id = form.getDestinationId();
        SpreadsheetApp.setActiveSheet(sheet);
      }
    }

    var spreadsheet = SpreadsheetApp.openById(form_id);
    var email_sheet = spreadsheet.getSheetByName("Email");
    var slack_sheet = spreadsheet.getSheetByName("Slack");
    var question_sheet = spreadsheet.getSheetByName("Report_Order");

    if (email_sheet == null){
      spreadsheet.insertSheet().setName("Email");
    }
    if (slack_sheet == null){
      spreadsheet.insertSheet().setName("Slack");
    }
    if (question_sheet == null){
      spreadsheet.insertSheet().setName("Report_Order");
    }
  }
}
