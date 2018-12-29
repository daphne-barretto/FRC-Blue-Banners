var sheet = SpreadsheetApp.openById("1-FjTtJFtYutNcRIop_n1g3Pc-SqGjCWmLRMroZSF31Q").getSheetByName("BB Rankings");

function run(){
 
  var nextEmptyRow = sheet.getRange('H2:H').getValues().filter(String).length + 2;
  var numTeamsListed = sheet.getRange('A2:A').getValues().filter(String).length;
  
  for(var i = nextEmptyRow; i <= numTeamsListed + 1; i++){
    var currentTeamNum = sheet.getRange('A' + i).getValue();
    var awardResults = checkBlueBanners(currentTeamNum);
    
    sheet.getRange('F' + i).setValue(awardResults.wins);
    sheet.getRange('G' + i).setValue(awardResults.chairmans);
    sheet.getRange('H' + i).setValue(awardResults.woodieFlowers);
  }
    
}

function checkBlueBanners(teamNumber) {
  
  var url = "https://www.thebluealliance.com/api/v3/team/frc" + teamNumber + "/awards";
  var options = {
    "method": "GET",
    "headers": {
      "X-TBA-Auth-Key": "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6"
    },
    "payload": {
    }
  };
  
  var awardList = JSON.parse(UrlFetchApp.fetch(url, options));
  var numAwards = awardList.length;
 
  var numWins = 0, numChairmans = 0, numWoodieFlowers = 0;
  
  for(var i = 0; i < numAwards; i++){
    if (awardList[i].award_type == 0 || awardList[i].award_type == 69){
      numChairmans++;
    } else if (awardList[i].award_type == 1 && checkOfficialEvent(awardList[i].event_key)){
      numWins++;
    } else if (awardList[i].award_type == 3){
      numWoodieFlowers++;
    }
  }
  
  return {
    "wins" : numWins,
    "chairmans" : numChairmans,
    "woodieFlowers" : numWoodieFlowers
  };

}

function checkOfficialEvent(eventKey) {
  
  var url = "https://www.thebluealliance.com/api/v3/event/" + eventKey;
  var options = {
    "method": "GET",
    "headers": {
      "X-TBA-Auth-Key": "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6"
    },
    "payload": {
    }
  };
  
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  var eventType = response.event_type;
  
  if(eventType == 0 || eventType == 1 || eventType == 2 || eventType == 3 || eventType == 4 || eventType == 5 || eventType == 6){
    return true;
  }
  
  return false;

}

function listTeams(){
 
  var listOfTeams = [];
  
  for(var i = 0; i < 15; i++){
    var url = "https://www.thebluealliance.com/api/v3/teams/" + i;
    var options = {
      "method": "GET",
      "headers": {
        "X-TBA-Auth-Key": "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6"
      },
      "payload": {
      }
    };
    var response = JSON.parse(UrlFetchApp.fetch(url, options));
    
    for(var j = 0; j < response.length; j++){
      listOfTeams.push([response[j].team_number]);
    }
    
  }
    
  sheet.getRange('A2:A' + listOfTeams.length).setValues(listOfTeams);
  
}

function listSeasons(){
  
  var listOfNumSeasons = [];
  
  var nextEmptyRow = sheet.getRange('B2:B').getValues().filter(String).length + 2;
  var numTeamsListed = sheet.getRange('A2:A').getValues().filter(String).length;

  
  for(var i = nextEmptyRow; i <= numTeamsListed + 1; i++){
    var currentTeamNum = sheet.getRange('A' + i).getValue();
    
    var url = "https://www.thebluealliance.com/api/v3/team/frc" + currentTeamNum + "/years_participated";
    var options = {
      "method": "GET",
      "headers": {
        "X-TBA-Auth-Key": "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6"
      },
      "payload": {
      }
    };
    var currentNumSeasons = JSON.parse(UrlFetchApp.fetch(url, options)).length;
    var seasonsOfCurrentTeam = JSON.parse(UrlFetchApp.fetch(url, options));
    //Check if 2018 is in seasonsOfCurrentTeam
    //If 2018 not included, mark it somehow (add column for if current team?)
    
    Logger.log(currentNumSeasons);
    
    sheet.getRange('B' + i).setValue(currentNumSeasons);
  }
  
  sheet.getRange('B2:B' + listOfNumSeasons.length).setValues(listOfNumSeasons);
  
}