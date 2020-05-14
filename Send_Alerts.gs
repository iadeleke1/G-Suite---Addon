
var slack_token = getSlack_token();
var slack_post_url = "https://slack.com/api/chat.postMessage";
var response_html =[];

function getSlack_token(){
  try{
    var file = DriveApp.getFilesByName("Slack token").next();

    var decode = Utilities.base64Decode(file.getBlob().getDataAsString());

    var content = Utilities.newBlob(decode).getDataAsString();

    return content;
  }
  catch (e){
    Logger.log(e);

  }
}

//Used for encoding strings and saving the encoded string to a file
function encrypt(){
  var string = "test string";
  var encode = Utilities.base64Encode(string);
  var newFile = DriveApp.createFile("Slack token",encoded);
}


//Function to get all the channels that are subscribed to receive notifications
function getChannels(){
  //Get Report priority from spreadsheet
  var slack_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Slack");
  var empty = slack_sheet.getDataRange().getValues();
  var channels = [];

  if (empty[0] == ""){
    Logger.log("No question order saved at this moment");
  }
  else{
    for (var i = 0; i < empty.length; i++){
      channels[i] = (empty[i][0]);
    }
  }
  return channels;
}

//Function to get all the emails that are subscribed to receive notifications
function getEmails(){
  var email_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Email");
  var empty = email_sheet.getDataRange().getValues();
  var emails = [];

  if (empty[0] == ""){
    Logger.log("No question order saved at this moment");
  }
  else{
    for (var i = 0; i < empty.length; i++){
      emails[i] = (empty[i][0]);
    }
  }
  return emails;
}

//This is the main function
function main(e) {
  var values = e.namedValues;

  var slack_block = create_block_message(values);
  //Send Slack Notifications
  sendSlackMessage(slack_block);
  //Logger.log(values);

  //Send Email Notifications
  sendEmail();
}

//This function takes the reponses
//Creates Slack Blocks for posting the responses to Slack
//Creats email HTML template for the responses
//Returns Slack message Block
//Poppulates the Email report array.

function create_block_message(formResponses){
  //Get all responses and create Slack blocks to display the responses
  //Priority for blocks
  //Requestor Name
  //Group Name
  //Description
  //Request Type
  //Priority Level
  //Other Details or Comments


  //Get Report priority from spreadsheet
  var questions_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Report_Order");
  var empty = questions_sheet.getDataRange().getValues();
  var question_order = [];

  if (empty[0] == ""){
    Logger.log("No question order saved at this moment");
  }
  else{
    for (var i = 0; i < empty.length; i++){
      question_order[i] = (empty[i][0]);
    }
  }

  var formResponses_data = [];
  for (var i = 0; i < question_order.length; i ++){
    var keys = question_order[i];
    formResponses_data[i ] = {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*" + keys + "*" + ": " + formResponses[keys]
          }
        };
        //Construct the HTML for the report
        response_html[i] = '<tr><td width="180">' + '<p><strong> ' + keys + '</strong></p>' + '</td>' + '<td width="180">' + '<p>' + formResponses[keys] + '</p></td></tr>';
        //      count++;
  }
  var temp = [];
  for (var i = 0; i < formResponses_data.length; i ++){
    temp[i+1] = formResponses_data[i];
  }
  formResponses_data = temp;
//Heading for the message block.
  formResponses_data[0] = {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*A new response has been submitted for your survey* 👋👋👋"
        }
      };

   Logger.log(formResponses_data);
   Logger.log(question_order);
  return formResponses_data;
}

//This functino sends messages to Slack
//Takes in an array of slack block to be posted in the text. See Block Builder by Slack.
function sendSlackMessage(block_array){
  var channels = getChannels();

  //Logger.log("Got here send Slack");

  for (var i = 0; i < channels.length; i ++){
    var payload =
        {
          "token" : slack_token,
          "channel" : channels[i],
          "text": "Test",
          "blocks": JSON.stringify(block_array)
        };

    var options =
        {
          "method" : "POST",
          "payload" : payload,
          "followRedirects" : false,
          "muteHttpExceptions": true
        };

    var result = UrlFetchApp.fetch(slack_post_url,options);
  }
}

//This function sends an email
function sendEmail(){
  var email_body = composeEmail();
  Logger.log("Got here send email");
  //var email_body = cemail();
  var addresses = getEmails();
  for (var i = 0; i < addresses.length; i ++){
    MailApp.sendEmail({
      to: addresses[i],
      subject: "A response has been submitted to the form",
      htmlBody: email_body
    });
  }
}

//This function composes the full email body
//It uses the values of the response html array which is populated in create_block_message
function composeEmail(){
  var temp2 = '<h3>A new response has been submitted, here are the answers </h3>'
  + '<table border="1" style=" background-color: lightblue;">' + '<tbody>'

  for (var i = 0; i < response_html.length; i++){
   var temp2 = temp2 +  response_html[i];
  }
  temp2= temp2 + '</tbody>' + '</table>';

  var t = HtmlService.createHtmlOutput(temp2);
  //Logger.log(t.getContent());
  return t.getContent();
}
