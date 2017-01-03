"use strict";

var advApp = angular.module('advApp', ['ui.bootstrap', 'ngAnimate']),
illionsArr = ['', ' Million', ' Billion', ' Trillion', ' Quadrillion', ' Quintillion', ' Sextillion', ' Septillion', ' Octillion', ' Nonillion', ' Decillion', ' Undecillion', ' Duodecillion', ' Tredecillion', ' Quattuordecillion', ' Quindecillion', ' Sexdecillion', ' Septendecillion', ' Octodecillion', ' Novemdecillion', ' Vigintillion', ' Unvigintillion', ' Duovigintillion', ' Tresvigintillion', ' Quattuorvigintillion', ' Quinvigintillion', ' Sexvigintillion', ' Septenvigintillion', ' Octovigintillion', ' Novemvigintillion', ' Trigintillion', ' Untrigintillion', ' Duotrigintillion', ' Tretrigintillion', ' Quattuortrigintillion', ' Quintrigintillion', ' Sextrigintillion', ' Septentrigintillion', ' Octotrigintillion', ' Novemtrigintillion', ' Quadragintillion', ' Unquadragintillion', ' Duoquadragintillion', ' Trequadragintillion', ' Quattuorquadragintillion', ' Quinquadragintillion', ' Sexquadragintillion', ' Septquadragintillion', ' Octoquadragintillion', ' Novemquadragintillion', ' Quinquagintillion', ' Unquinquagintillion', ' Duoquinquagintillion', ' Trequinquagintillion', ' Quattuorquinquagintillion', ' Quinquinquagintillion', ' Sexquinquagintillion', ' Septquinquagintillion', ' Octoquinquagintillion', ' Novemquinquagintillion', ' Sexagintillion', ' Unsexagintillion', ' Duosexagintillion', ' Tresexagintillion', ' Quattuorsexagintillion', ' Quinsexagintillion', ' Sexsexagintillion', ' Septsexagintillion', ' Octosexagintillion', ' Novemsexagintillion', ' Septuagintillion', ' Unseptuagintillion', ' Duoseptuagintillion', ' Treseptuagintillion', ' Quattuorseptuagintillion', ' Quinseptuagintillion', ' Sexseptuagintillion', ' Septseptuagintillion', ' Octoseptuagintillion', ' Novemseptuagintillion', ' Octogintillion', ' Unoctogintillion', ' Duooctogintillion', ' Treoctogintillion', ' Quattuoroctogintillion', ' Quinoctogintillion', ' Sexoctogintillion', ' Septoctogintillion', ' Octooctogintillion', ' Novemoctogintillion', ' Nonagintillion', ' Unnonagintillion', ' Duononagintillion', ' Trenonagintillion', ' Quattuornonagintillion', ' Quinnonagintillion', ' Sexnonagintillion', ' Septnonagintillion', ' Onctononagintillion', ' Novemnonagintillion', ' Centillion', ' Uncentillion'];

function expFilter(input) {
  var out = "",
  mCount = 0,
  e = 6;
  if (input === Infinity) {
    return "Infinity";
  } else if (input !== null) {
    // var exp = Math.floor(Math.log10(input));//Math.log10 is not available in some mobile browsers
    // var out = "";
    // if (exp >= 6) {
    //   out += (input / Math.pow(10, exp));
    //   out += 'E+' + exp;
    // } else {
    //   out = input;
    // }
    // return out;
    if (input >= Number(1e6)) {
      out = input.toExponential(2);
      out = out.replace('e','E');//Just to look like in-game
    } else {
      out = input;
    }
    return out;
  }
}

function numFilter(input) {
  var out = "",
  mCount = 0,
  e = 6;
  if (input === Infinity) {
    return "Infinity";
  } else if (input !== null) {
    while (input >= Number('1e+' + e)) {
      e += 3;
      mCount++;
    }
    if (e !== 6) {
      e -= 3;
      input /= Number('1e+' + e);
    }
    if (input < 1000) {
      out = Math.round(input * 1000) / 1000;
    } else {
      out = Math.round(input * 100) / 100;
      out = out.toLocaleString("en-US");
    }
  }
  return out + illionsArr[mCount];
}

advApp.filter('time', function() {
  return function(input) {
    if (input === Infinity) {
      return "———";
    } else {
      input = Math.floor(input);
      var s = ("00" + input % 60).slice(-2);
      var m = ("00" + Math.floor(input / 60) % 60).slice(-2);
      var h = ("00" + Math.floor(input / 3600) % 24).slice(-2);
      var d = Math.floor(input / 86400);
      var out = "";
      if (d >= 1) {
        out += numFilter(d) + ' d';
        if (d < 100) {
          out += ', '
        }
      }
      if (d < 100) {
        out += h + ":" + m + ":" + s;
      }
      return out;
    }
  };
});

advApp.filter('num', function() {
  return function(input) {
    // return numFilter(input);
    return expFilter(input);
  };
});

advApp.filter('percentage', function() {
  return function(input) {
    if (isNaN(input)) return input;
    return Math.floor(input * 1000) / 10 + '%';
  };
});

advApp.filter('rec', function() {
  "use strict";
  return function(input, loc) {
    var retVal = '';
    if (input === 'all') {
      retVal = 'All';
    } else if (input[0] === 'level') {
      retVal = loc.generators[input[1]][0];
    } else if (input[0] === 'cash') {
      var index = Math.floor(loc.upgrades[input[1]][1][0] / 2);
      if (index === loc.generators.length + 1) {
        retVal = 'Angel Investor';
      }
      else {
        retVal = (index < loc.generators.length) ? loc.generators[index][0] : 'All';
        retVal += (loc.upgrades[input[1]][1][0] % 2 === 0) ? ' Profit' : ' Speed';
      }
      retVal += ' ' + loc.upgrades[input[1]][1][1];
    }
    return retVal;
  }
});

advApp.controller('advController', ['$document', '$filter', '$scope', function($document, $filter, $scope) {
  //Unlocks, Medals, Upgrades, Experiments
  $scope.accOpen = [false, false, false, false];
  //
  $scope.accOpen2 = [false, false];
  //[<timeout>, <cost>, <timesBought>]
  $scope.autoClicker = [5, 25, 0];
  $scope.clearAfter = [false];
  $scope.compare = false;
  $scope.comradesPerSecond = 1;
  $scope.fillBefore = [false];
  // $scope.filterTime = {'days': null, 'hours': null, 'minutes': null, 'percentage': null};
  $scope.illionsArray = illionsArr.slice(1);
  /**
   * Array industryExperiments:
   * Each item
   * [<industryID> (e.g. 0=potatoes, 1=land), <generatorID> (e.g. -1=potato, 0=farmer), <multiplier>, <scientistsObtained>, <researched>]
   *
   */
  $scope.industryExperiments = [
      [0, -1, 15, 5, false], [1, -1, 15, 5, false],  [2, -1, 15, 5, false], [3, -1, 15, 5, false], [4, -1, 15, 5, false],
      [0, 0, 3, 10, false], [1, 0, 3, 10, false], [2, 0, 3, 10, false], [3, 0, 3, 10, false], [4, 0, 3, 10, false],
      [0, 1, 3, 25, false], [1, 1, 3, 25, false], [2, 1, 3, 25, false], [3, 1, 3, 25, false], [4, 1, 3, 25, false],
      [0, 2, 3, 100, false], [1, 2, 3, 100, false], [2, 2, 3, 100, false], [3, 2, 3, 100, false], [4, 2, 3, 100, false],
      [0, 3, 3, 500, false], [1, 3, 3, 500, false], [2, 3, 3, 500, false], [3, 3, 3, 500, false], [4, 3, 3, 500, false],
      [0, 4, 3, 2000, false], [1, 4, 3, 2000, false], [2, 4, 3, 2000, false], [3, 4, 3, 2000, false], [4, 4, 3, 2000, false]
  ];
  $scope.land = {};
  $scope.medicine = {};
  $scope.ore = {};
  $scope.potatoes = {};
  $scope.refIndustry = $scope.potatoes;
  $scope.numComrades = 0;
  $scope.numScientists = 0;
  $scope.self = $scope;
  /**
   * Array stateExperiments:
   * Here I exclude Auto Clicker, because it is simpler to place it separately
   * Each item
   * [<multiplier>, <cost>, <timesBought>]
   */
  $scope.stateExperiments = [
    [3, 25, 0],
    [9, 100, 0],
    [36, 500, 0],
    [99, 2500, 0],
    [999, 10000, 0]
  ];
  $scope.totalProfitMultiplier = 0;
  $scope.viewNumComrades = 0;
  $scope.viewExpComrades = 0;
  $scope.viewNumScientists = 0;
  $scope.viewExpScientists = 0;
  // $scope.reverse = true;
  // $scope.selectAll = [false, false, false, false];
  // $scope.sortIndex = 2;
  $scope.weapons = {};
  var industries = ['potatoes', 'land', 'ore', 'weapons', 'medicine'];

  angular.element(document).ready(function() {
    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0],
      reader = new FileReader();
      reader.onload = function(e) {
        loadExportedJson(e.target.result);
      };
      reader.readAsText(file);
    });
    var refIndustry = localStorage.getItem('refIndustry');
    if (refIndustry) {
      var i = 0;
      for (i in industries) {
        if (industries[i] === refIndustry) {
          $scope.setIndustry(refIndustry);
          break;
        }
      }
    }
    var saved = localStorage.getItem('industries');
    if (saved) {
      loadExportedJson(saved);
    }
  });

  function loadExportedJson(str) {
    return;//Rethink this block
    var i = 0, j = 0, k = 0,
    obj = JSON.parse(str);
    for (k in industries) {
      if (obj.hasOwnProperty(industries[k])) {
        $scope.fullyResetPlanet($scope[industries[k]]);
        for (i in obj[industries[k]].levels) {
          if (obj[industries[k]].levels.hasOwnProperty(i)) {
            for (j = 0; j < $scope[industries[k]].generators.length; j++) {
              if ($scope[industries[k]].generators[j][0] === i) {
                $scope[industries[k]].generators[j][1] = obj[industries[k]].levels[i];
                break;
              }
            }
          }
        }
        $scope[industries[k]].numScientists = obj[industries[k]].numScientists;
        // $scope.updateViewNumAngels($scope[industries[k]]);
        for (i = 0; i < obj[industries[k]].upgradeIndexUpTo; i++) {
          $scope[industries[k]].upgrades[i][$scope[industries[k]].upgrades[i].length - 1] = true;
        }
        for (i = 0; i < obj[industries[k]].angelUpgradeIndexUpTo; i++) {
          $scope[industries[k]].medals[i][$scope[industries[k]].medals[i].length - 1] = true;
        }
        for (i = 0; i < obj[industries[k]].upgradeIndexBonus.length; i++) {
          $scope[industries[k]].upgrades[obj[industries[k]].upgradeIndexBonus[i]][$scope[industries[k]].upgrades[obj[industries[k]].upgradeIndexBonus[i]].length - 1] = true;
        }
        for (i = 0; i < obj[industries[k]].angelUpgradeIndexBonus.length; i++) {
          $scope[industries[k]].medals[obj[industries[k]].angelUpgradeIndexBonus[i]][$scope[industries[k]].medals[obj[industries[k]].angelUpgradeIndexBonus[i]].length - 1] = true;
        }
        for (i = 0; i < obj[industries[k]].managersBought.length; i++) {
          $scope[industries[k]].industryExperiments[Math.floor(obj[industries[k]].managersBought[i] / 2)][obj[industries[k]].managersBought[i] % 2][1] = true;
        }
        if (obj[industries[k]].platinumboost != null) {
          console.log("Has platinum boost saved.");
          for (i = 0; i < $scope.platinumboosts.length; i++) {
            if (obj[industries[k]].platinumboost == $scope.platinumboosts[i]) {
              console.log("Compares to " + i + ".");
              $scope.changePlatinum($scope[industries[k]], i);
            }
          }
        } else {
          console.log("Does not have platinum boost saved.");
          $scope.changePlatinum($scope[industries[k]], 0);
        }
        $scope[industries[k]].noSingles = obj[industries[k]].noSingles || false;
        $scope[industries[k]].noTens = obj[industries[k]].noTens || false;
        $scope[industries[k]].noHundreds = obj[industries[k]].noHundreds || false;
        if ('suit' in obj[industries[k]]) {
          $scope[industries[k]].suits[obj[industries[k]].suit][0] = true;
        }
        if ('badge' in obj[industries[k]]) {
          $scope[industries[k]].badges[obj[industries[k]].badge][0] = true;
        }
        $scope[industries[k]].triples = obj[industries[k]].triples;
        $scope[industries[k]].flux = obj[industries[k]].flux;
        $scope[industries[k]].bonusAngelEffectiveness = obj[industries[k]].bonusAngelEffectiveness;
        $scope[industries[k]].bonusMultiplier = obj[industries[k]].bonusMultiplier;
        if (angular.isDefined(obj[industries[k]].megaTicket)) {
          for (i = 0; i < obj[industries[k]].megaTicket.length; i++) {
            $scope[industries[k]].generators[obj[industries[k]].megaTicket[i]][2] = true;
          }
        }
      }
      $scope.calc($scope[industries[k]]);
    }
    $scope.$digest();
  }

  $scope.apply = function(loc) {
    $scope.applyRow(loc, loc.recTable[0]);
  };

  $scope.applyRow = function(loc, row) {
    var i = 0;
    if (row[0] === 'all') {
      for (; i < loc.generators.length; i++) {
        if (loc.generators[i][1] < row[1]) {
          loc.generators[i][1] = row[1];
        }
      }
    } else if (row[0][0] === 'level') {
      loc.generators[row[0][1]][1] = row[1];
    } else if (row[0][0] === 'cash') {
      loc.upgrades[row[0][1]][2] = true;
    }
    $scope.calc(loc);
  };

  function applyTuple(loc, row) {
    var i = 0, j = 0,
    applyRow = -1,
    applyType = -1;
    for (; i < row.length; i++) {
      if (typeof row[i] === 'object') {
        applyRow = Math.floor(row[i][0] / 2);
        applyType = row[i][0] % 2;
        if (applyRow < loc.generators.length) {
          if (applyType === 0) {
            loc.generators[applyRow][3] *= row[i][1];
          } else {
            loc.generators[applyRow][4] /= row[i][1];
          }
        } else if (applyRow === loc.generators.length) {
          if (applyType === 0) {
            for (j = 0; j < loc.generators.length; j++) {
              loc.generators[j][3] *= row[i][1];
            }
          } else {
            for (j = 0; j < loc.generators.length; j++) {
              loc.generators[j][4] /= row[i][1];
            }
          }
        } else if (applyRow === loc.generators.length + 1) {
          loc.angelEffectiveness += row[i][1];
        } else if (row[i][0] < 30 || row[i][0] > 29 + loc.generators.length) {
          throw 'Tuple not dealt with: ' + row;
        }
      }
    }
  }

  function calcUnlockCost(loc, index, fromLevel, numLevels) {
    var retVal = 1,
    i = 1, j = 0,
    managerDiscount = 1;
    for (; i < numLevels; i++) {
      retVal += Math.pow(loc.basePower[index], i);
    }
    if (index === 0 && $scope.isIndustry('potatoes')) {
      fromLevel -= 1;
    }
    for (i = 0; i < loc.medals.length; i++) {
      if (tupleIsActive(loc.medals[i])) {
        if (loc.medals[i][1][0] === (30 + index)) {
          fromLevel -= loc.medals[i][1][1];
        }
      }
    }
    if (loc.industryExperiments.length !== 0) {
      for (i = 0; i < loc.industryExperiments[index].length; i++) {
        if (tupleIsActive(loc.industryExperiments[index][i])) {
          if (loc.name === 'potatoes') {
            if (i === 0) {
              managerDiscount = 0.9;
            } else {
              managerDiscount *= 0.00001;
            }
          } else {
            managerDiscount = 0.75;
          }
        }
      }
    }
    retVal *= loc.baseCost[index] * Math.pow(loc.basePower[index], fromLevel) * managerDiscount;
    return retVal;
  }

  function calcUnlockCostAll(loc) {
    var lowestLevel = loc.generators[0][1],
    i = 1, j = 0,
    retVal = 0;
    for (; i < loc.generators.length; i++) {
      if (loc.generators[i][1] < lowestLevel) {
        lowestLevel = loc.generators[i][1];
      }
    }
    i = 0;
    while (i < loc.unlocks[loc.generators.length].length && lowestLevel >= loc.unlocks[loc.generators.length][i][0]) {
      i++;
    }
    if (i !== loc.unlocks[loc.generators.length].length) {
      for (; j < loc.generators.length; j++) {
        if (loc.generators[j][1] < loc.unlocks[loc.generators.length][i][0]) {
          retVal += calcUnlockCost(loc, j, loc.generators[j][1], loc.unlocks[loc.generators.length][i][0] - loc.generators[j][1]);
        }
      }
    } else {
      retVal = null;
    }
    return retVal;
  }

  $scope.calc = function(loc) {
    calcState(loc);
    calcAngels(loc);
    calcRecommendations(loc);
    localStorage.setItem('industries', getJsonForExport());
  };

  function calcAngelCost(numAngels, mul) {
    return (1e+15 * Math.pow(numScientists / mul, 2));
  }

  $scope.calcAngelInvestors = function(loc) {
    loc.angelCosts = [];
    var earnedNumAngels = loc.numScientists + loc.sacAngels;
    var loopVals = [['10%', 1.1], ['50%', 1.5], ['Doubled w/o Sacrificed', 2], ['Doubled', 2], ['5x', 5], ['10x', 10], ['Custom Multiplier', loc.customAngelMul || 0]];
    for (var val in loopVals) {
      loc.angelCosts[val] = []
      loc.angelCosts[val][0] = loopVals[val][0];
      if (loopVals[val][1] !== 0) {
        if (val !== '2') {
          loc.angelCosts[val][1] = loopVals[val][1] * earnedNumAngels;
        } else {
          loc.angelCosts[val][1] = (loopVals[val][1] * loc.numScientists) + loc.sacAngels;
        }
        loc.angelCosts[val][2] = calcAngelCost(loc.angelCosts[val][1], loc.angelScale);
        loc.angelCosts[val][3] = Math.max(loc.angelCosts[val][2] - loc.lifetimeEarnings, 0);
        loc.angelCosts[val][4] = loc.angelCosts[val][3] / loc.comradesPerSecond;
      }
    }
  };

  function calcAngels(loc) {
    var i = 0,
    tempPlanet = null;
    loc.angelExclamation = false;
    for (; i < loc.medals.length; i++) {
      if (!tupleIsActive(loc.medals[i]) && loc.medals[i][0] < loc.numScientists) {
        tempPlanet = JSON.parse(JSON.stringify(loc));
        tempPlanet.numScientists -= loc.medals[i][0];
        tempPlanet.medals[i][tempPlanet.medals[i].length - 1] = true;
        calcState(tempPlanet);
        var delta = tempPlanet.comradesPerSecond - loc.comradesPerSecond;
        var percent = delta / loc.comradesPerSecond;
        if (delta > 0) {
          loc.medals[i][loc.medals[i].length - 2] = percent;
          loc.angelExclamation = true;
        } else {
          loc.medals[i][loc.medals[i].length - 2] = false;
        }
      }
    }
  }

  function calcRecommendations(loc) {
    var i = 0, j = 0, k = 0,
    highestSharedLevel = loc.generators[0][1],
    inc = [],
    tempPlanet = JSON.parse(JSON.stringify(loc)),
    max = 0,
    maxObj = [0, 0],
    tempUnlock = null, tempUnlockTime = null, tempPercentageIncrease = null,
    upgradeScore = 0;
    loc.recTable = [];
    if (!loc.noSingles) {
      inc.push(1);
    }
    if (!loc.noTens) {
      inc.push(10);
    }
    if (!loc.noHundreds) {
      inc.push(100);
    }
    $scope.updateFilterTime(loc);
    for (; i < loc.generators.length; i++) {
      while (inc.length > 3 - (loc.noSingles ? 1 : 0) - (loc.noTens ? 1 : 0) - (loc.noHundreds ? 1 : 0)) {
        inc.pop();
      }
      if (i === 1 && $scope.isIndustry('potatoes')) {
        for (j = 1; j < 4; j++) {
          k = getDifferenceNBonus(loc, i, j);
          if (k !== null) {
            inc.push(k);
          }
        }
      } else {
        k = getDifferenceNBonus(loc, i, 1);
        if (k !== null) {
          inc.push(k);
        }
      }
      if (!loc.hasMegaTickets) {
        k = getDifferenceNBonus(loc, i, getNextPositiveUnlock(loc, i));
        if (k !== null && inc.indexOf(k) === -1) {
          inc.push(k);
        }
      }
      for (j = 0; j < inc.length; j++) {
        tempPlanet.generators = deepCopy(loc.generators);
        tempPlanet.generators[i][1] += inc[j];
        calcState(tempPlanet);
        tempUnlock = calcUnlockCost(loc, i, loc.generators[i][1], inc[j]);
        tempUnlockTime = tempUnlock / loc.comradesPerSecond;
        tempPercentageIncrease = (tempPlanet.comradesPerSecond - loc.comradesPerSecond) * 100 / loc.comradesPerSecond;
        if ((loc.filterTime === null || loc.filterTime > tempUnlockTime) && ($scope.filterTime.percentage === null || $scope.filterTime.percentage < tempPercentageIncrease)) {
          upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
          if (upgradeScore > max) {
            max = upgradeScore;
            maxObj = ['level', i, tempPlanet.generators[i][1]];
          }
          loc.recTable.push([['level', i], tempPlanet.generators[i][1], upgradeScore, tempUnlock, tempUnlockTime, tempPlanet.comradesPerSecond - loc.comradesPerSecond, tempPercentageIncrease]);
        }
      }
    }
    j = -1;
    for (i = 0; i < 22; i++) {
      tempPlanet.generators = deepCopy(loc.generators);
      tempPlanet.angelEffectiveness = loc.angelEffectiveness;
      tempPlanet.upgrades = deepCopy(loc.upgrades);
      j = getNextCashIndex(loc, j);
      if (j !== null) {
        tempPlanet.upgrades[j][tempPlanet.upgrades[j].length - 1] = true;
        calcState(tempPlanet);
        tempUnlockTime = loc.upgrades[j][0] / loc.comradesPerSecond;
        tempPercentageIncrease = (tempPlanet.comradesPerSecond - loc.comradesPerSecond) * 100 / loc.comradesPerSecond;
        if ((loc.filterTime === null || loc.filterTime > tempUnlockTime) && ($scope.filterTime.percentage === null || $scope.filterTime.percentage < tempPercentageIncrease)) {
          upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
          if (upgradeScore > max) {
            max = upgradeScore;
            maxObj = ['upgrade', j];
          }
          loc.recTable.push([['cash', j], null, upgradeScore, loc.upgrades[j][0], tempUnlockTime, tempPlanet.comradesPerSecond - loc.comradesPerSecond, tempPercentageIncrease]);
        }
      } else {
        break;
      }
    }
    tempUnlock = 0;
    tempPlanet.generators = deepCopy(loc.generators);
    tempPlanet.upgrades = deepCopy(loc.upgrades);
    for (i = 1; i < loc.generators.length; i++) {
      if (loc.generators[i][1] < highestSharedLevel) {
        highestSharedLevel = loc.generators[i][1];
      }
    }
    for (i = 0; i < loc.unlocks[loc.generators.length].length; i++) {
      if (loc.unlocks[loc.generators.length][i][0] > highestSharedLevel) {
        highestSharedLevel = loc.unlocks[loc.generators.length][i][0];
        break;
      }
    }
    for (i = 0; i < tempPlanet.generators.length; i++) {
      if (tempPlanet.generators[i][1] < highestSharedLevel) {
        tempUnlock += calcUnlockCost(loc, i, tempPlanet.generators[i][1], highestSharedLevel - tempPlanet.generators[i][1]);
        tempPlanet.generators[i][1] = highestSharedLevel;
      }
    }
    calcState(tempPlanet);
    tempUnlockTime = tempUnlock / loc.comradesPerSecond;
    tempPercentageIncrease = (tempPlanet.comradesPerSecond - loc.comradesPerSecond) * 100 / loc.comradesPerSecond;
    if ((loc.filterTime === null || loc.filterTime > tempUnlockTime) && ($scope.filterTime.percentage === null || $scope.filterTime.percentage < tempPercentageIncrease)) {
      upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
      if (upgradeScore > max) {
        max = upgradeScore;
        maxObj = ['all', highestSharedLevel];
      }
      loc.recTable.push(['all', highestSharedLevel, upgradeScore, tempUnlock, tempUnlock / loc.comradesPerSecond, tempPlanet.comradesPerSecond - loc.comradesPerSecond, tempPercentageIncrease]);
    }
    loc.rec = maxObj;
    $scope.reverse = true;
    $scope.sortIndex = 2;
    loc.recTable = $filter('orderBy')(loc.recTable, indexOrder, $scope.reverse);
    updateRecString(loc);
  }

  function calcState(loc) {
    var i = 0, j = true,
    highestSharedLevel = loc.generators[0][1];
    loc.comradesPerSecond = 0;
    loc.angelEffectiveness = 2 + (loc.suits[suitFromName('red')][0] ? $scope.suitList[suitFromName('red')][1] : 0) + (loc.suits[suitFromName('green')][0] ? $scope.suitList[suitFromName('green')][1] : 0);
    for (; i < loc.generators.length; i++) {
      if (loc.generators[i][2] === false) {
        j = false;
        break;
      }
    }
    if (j === true) {
      $scope.selectAll[0] = true;
    } else {
      $scope.selectAll[0] = false;
    }
    j = 0;
    for (i = 0; i < loc.generators.length; i++) {
      if (loc.generators[i][1] < highestSharedLevel) {
        highestSharedLevel = loc.generators[i][1];
      }
      loc.generators[i][3] = loc.generators[i][1] * loc.baseProfit[i];
      if (loc.triples > 0 || loc.bonusMultiplier > 0 || loc.suits[suitFromName('gold')][0] || loc.suits[suitFromName('blue')][0]) {
        loc.generators[i][3] *= (3 * loc.triples) + loc.bonusMultiplier + (loc.suits[suitFromName('gold')][0] ? $scope.suitList[suitFromName('gold')][1] : 0) + (loc.suits[suitFromName('blue')][0] ? $scope.suitList[suitFromName('blue')][1] : 0);
      }
      if (loc.generators[i][2]) {
        loc.generators[i][3] *= $scope.selectAll[0] ? loc.platinumboost : 7.77;
      }
      loc.generators[i][4] = loc.baseSpeed[i];
      if (loc.flux > 0) {
        loc.generators[i][4] /= (1 + loc.flux * 1.21);
      }
      if (loc.suits[suitFromName('white')][0]) {
        loc.generators[i][4] /= 2;
      }
      loc.upgradeCosts[i][0] = calcUnlockCost(loc, i, loc.generators[i][1], 1);
      loc.upgradeCosts[i][2] = calcUnlockCost(loc, i, loc.generators[i][1], 10);
      loc.upgradeCosts[i][4] = calcUnlockCost(loc, i, loc.generators[i][1], getDifferenceNBonus(loc, i, 1));
      loc.upgradeCosts[i][6] = calcUnlockCostAll(loc);
    }
    for (i = 0; i < loc.upgrades.length; i++) {
      if (tupleIsActive(loc.upgrades[i])) {
        applyTuple(loc, loc.upgrades[i]);
      }
    }
    applySuperBadge(loc);
    for (i = 0; i < loc.medals.length; i++) {
      if (tupleIsActive(loc.medals[i])) {
        applyTuple(loc, loc.medals[i]);
      }
    }
    for (i = 0; i < loc.generators.length; i++) {
      j = 0;
      while (j < loc.unlocks[i].length && loc.generators[i][1] >= loc.unlocks[i][j][0]) {
        applyTuple(loc, loc.unlocks[i][j]);
        j++;
      }
    }
    j = 0;
    while (j < loc.unlocks[loc.generators.length].length && highestSharedLevel >= loc.unlocks[loc.generators.length][j][0]) {
      applyTuple(loc, loc.unlocks[loc.generators.length][j]);
      j++;
    }
    if (loc.bonusAngelEffectiveness > 0) {
      loc.angelEffectiveness += loc.bonusAngelEffectiveness;
    }
    for (i = 0; i < loc.generators.length; i++) {
      loc.generators[i][3] *= (1 + (loc.angelEffectiveness * loc.numScientists / 100));
      loc.generators[i][5] = loc.generators[i][3] / loc.generators[i][4]
      loc.comradesPerSecond += loc.generators[i][5];
    }
    for (i = 0; i < loc.generators.length; i++) {
      loc.generators[i][6] = loc.generators[i][5] * 100 / loc.comradesPerSecond;
    }
    for (i = 0; i < loc.upgradeCosts.length; i++) {
      loc.upgradeCosts[i][1] = loc.upgradeCosts[i][0] / loc.comradesPerSecond;
      loc.upgradeCosts[i][3] = loc.upgradeCosts[i][2] / loc.comradesPerSecond;
      loc.upgradeCosts[i][5] = loc.upgradeCosts[i][4] / loc.comradesPerSecond;
      loc.upgradeCosts[i][7] = loc.upgradeCosts[i][6] / loc.comradesPerSecond;
    }
  }

  function calcUpgradeScore(planet, loc, unlockCost) {
    var overflowPotential = planet.comradesPerSecond * unlockCost,
    divNum = 0,
    retVal = planet.comradesPerSecond - loc.comradesPerSecond;
    if (!isFinite(unlockCost)) {
      return 0;
    }
    while (!isFinite(overflowPotential)) {
      divNum += 100;
      overflowPotential = planet.comradesPerSecond * (unlockCost / Number('1e+' + divNum));
    }
    retVal *= 1000000000000000000000 / overflowPotential;
    if (divNum !== 0) {
      retVal *= Number('1e+' + divNum);
    }
    return retVal;
  }

  $scope.checkAngel = function(loc, index) {
    var i = 0;
    loc.medals[index][loc.medals[index].length - 2] = false;
    if ($scope.fillBefore[1] && loc.medals[index][loc.medals[index].length - 1] == true) {
      for (; i < index; i++) {
        loc.medals[i][loc.medals[i].length - 1] = true;
        loc.medals[i][loc.medals[i].length - 2] = false;
      }
    }
    if ($scope.clearAfter[1] && loc.medals[index][loc.medals[index].length - 1] == false) {
      for (i = index + 1; i < loc.medals.length; i++) {
        loc.medals[i][loc.medals[i].length - 1] = false;
      }
    }
    //calcAngels(loc);
  };

  $scope.checkCash = function(loc, index) {
    var i = 0;
    if ($scope.fillBefore[0] && loc.upgrades[index][loc.upgrades[index].length - 1] == true) {
      for (; i < index; i++) {
        loc.upgrades[i][loc.upgrades[i].length - 1] = true;
      }
    }
    if ($scope.clearAfter[0] && loc.upgrades[index][loc.upgrades[index].length - 1] == false) {
      for (i = index + 1; i < loc.upgrades.length; i++) {
        loc.upgrades[i][loc.upgrades[i].length - 1] = false;
      }
    }
  };

  $scope.clickSort = function(loc, index) {
    if (index === $scope.sortIndex) {
      $scope.reverse = !$scope.reverse;
    } else {
      $scope.sortIndex = index;
      if (index === 2 || index >= 5) {
        $scope.reverse = true;
      } else {
        $scope.reverse = false;
      }
    }
    loc.recTable = $filter('orderBy')(loc.recTable, indexOrder, $scope.reverse);
  };

  $scope.decrementDays = function(loc) {
    if ($scope.filterTime.days !== null) {
      if ($scope.filterTime.days > 0) {
        $scope.filterTime.days--;
      }
    }
  };

  $scope.decrementHours = function(loc) {
    if ($scope.filterTime.hours !== null) {
      if ($scope.filterTime.hours > 0) {
        $scope.filterTime.hours--;
      }
    }
  };

  $scope.decrementMinutes = function(loc) {
    if ($scope.filterTime.minutes !== null) {
      if ($scope.filterTime.minutes > 0) {
        $scope.filterTime.minutes--;
      }
    }
  };

  $scope.decrementPercentage = function(loc) {
    if ($scope.filterTime.percentage !== null) {
      if ($scope.filterTime.percentage > 0) {
        $scope.filterTime.percentage--;
      }
    }
  };

  function deepCopy(input) {
    var temp = [];
    for (var i = 0; i < input.length; i++) {
      temp.push(input[i].slice());
    }
    return temp;
  }

  $scope.export = function() {
    var blob = new Blob([getJsonForExport()], {type: "application/json"});
    var title = "AdvCommCalc.json";
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, title);
    } else {
      var downloadLink = angular.element("<a></a>");
      downloadLink.attr("href", window.URL.createObjectURL(blob));
      downloadLink.attr("download", title);
      $document.find("body").append(downloadLink);
      downloadLink[0].click();
      downloadLink.remove();
    }
  };

  function formatState(loc) {
    var string = '"' + loc.name + '": {\r\n  "levels": {\r\n',
    i = 0, j = 0, first = true;
    for (; i < loc.generators.length; i++) {
      if (i !== 0) {
        string += ',\r\n';
      }
      string += '    "' + loc.generators[i][0] + '": ' + loc.generators[i][1];
    }
    string += '\r\n  },\r\n  "numScientists": ' + loc.numScientists + ',\r\n  "upgradeIndexUpTo": ';
    for (i = 0; i < loc.upgrades.length; i++) {
      if (loc.upgrades[i][loc.upgrades[i].length - 1] === false) {
        break;
      }
    }
    string += i + ',\r\n  "upgradeIndexBonus": [';
    for (; i < loc.upgrades.length; i++) {
      if (loc.upgrades[i][loc.upgrades[i].length - 1] === true) {
        if (first !== true) {
          string += ',\r\n'
        } else {
          string += '\r\n';
          first = false;
        }
        string += '    ' + i;
      }
    }
    string += '\r\n  ],\r\n  "angelUpgradeIndexUpTo": ';
    for (i = 0; i < loc.medals.length; i++) {
      if (loc.medals[i][loc.medals[i].length - 1] === false) {
        break;
      }
    }
    first = true;
    string += i + ',\r\n  "angelUpgradeIndexBonus": [';
    for (; i < loc.medals.length; i++) {
      if (loc.medals[i][loc.medals[i].length - 1] === true) {
        if (first !== true) {
          string += ',\r\n'
        } else {
          string += '\r\n';
          first = false;
        }
        string += '    ' + i;
      }
    }
    first = true;
    string += '\r\n  ],\r\n  "managersBought": [';
    for (i = 0; i < loc.industryExperiments.length; i++) {
      for (j = 0; j < loc.industryExperiments[i].length; j++) {
        if (loc.industryExperiments[i][j][1] === true) {
          if (first !== true) {
            string += ',\r\n'
          } else {
            string += '\r\n';
            first = false;
          }
          string += '    ' + ((i * 2) + j);
        }
      }
    }
    string += '\r\n  ], \r\n  "noSingles": ' + loc.noSingles + ',\r\n  "noTens": ' + loc.noTens + ',\r\n  "noHundreds": ' + loc.noHundreds + ',\r\n  "platinumboost": ' + loc.platinumboost;
    for (i = 0; i < loc.suits.length; i++) {
      if (loc.suits[i][0] === true) {
        string += ',\r\n  "suit": ' + i;
        break;
      }
    }
    for (i = 0; i < loc.badges.length; i++) {
      if (loc.badges[i][0] === true) {
        string += ',\r\n  "badge": ' + i;
      }
    }
    string += ',\r\n  "triples": ' + loc.triples + ',\r\n  "flux": ' + loc.flux + ',\r\n  "bonusAngelEffectiveness": ' + loc.bonusAngelEffectiveness + ',\r\n  "bonusMultiplier": ' + loc.bonusMultiplier + ',\r\n  "megaTicket": [';
    first = true;
    for (i = 0; i < loc.generators.length; i++) {
      if (loc.generators[i][2] === true) {
        if (first !== true) {
          string += ',\r\n'
        } else {
          string += '\r\n';
          first = false;
        }
        string += '    ' + i;
      }
    }
    string += '\r\n  ]\r\n}';
    return string;
  }

  $scope.fullyResetPlanet = function(loc) {
    var i = 0;
    for (; i < loc.upgrades.length; i++) {
      loc.upgrades[i][loc.upgrades[i].length - 1] = false;
    }
    for (i = 0; i < loc.medals.length; i++) {
      loc.medals[i][loc.medals[i].length - 1] = false;
    }
    for (i = 0; i < loc.industryExperiments.length; i++) {
      loc.industryExperiments[i][0][loc.industryExperiments[i][0].length - 1] = false;
      if (angular.isDefined(loc.industryExperiments[i][1])) {
        loc.industryExperiments[i][1][loc.industryExperiments[i][1].length - 1] = false;
      }
    }
    loc.angelEffectiveness = 2;
    loc.angelExclamation = false;
    loc.badgeExclamation = false;
    loc.bonusAngelEffectiveness = 0;
    loc.bonusMultiplier = 0;
    loc.flux = 0;
    loc.comradesIllions = '';
    for (i = 0; i < loc.generators.length; i++) {
      if (i === 0) {
        loc.generators[i][1] = 1;
      } else {
        loc.generators[i][1] = 0;
      }
      loc.generators[i][2] = false;
    }
    loc.numScientists = 0;
    loc.platinumboost = 17.77;
    $scope.changePlatinum(loc, 0);
    loc.rec = null;
    loc.recTable = [];
    loc.recommendation = '';
    loc.suitExclamation = false;
    loc.comradesPerSecond = 0;
    loc.triples = 0;
    loc.upgradeCosts = [];
    for (var i = 0; i < loc.generators.length; i++) {
      loc.upgradeCosts.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    loc.viewNumScientists = 0;
    $scope.calc(loc);
  };

  function getDifferenceNBonus(loc, index, n) {
    var i = 0,
    retVal = null;
    if (n === null) {
      return null;
    }
    for (; i < loc.unlocks[index].length; i++) {
      if (loc.generators[index][1] < loc.unlocks[index][i][0]) {
        if (i + n - 1 < loc.unlocks[index].length) {
          retVal = loc.unlocks[index][i + n - 1][0];
          break;
        }
      }
    }
    return (retVal === null) ? null : retVal - loc.generators[index][1];
  }

  function _getGeneratorName(industryName, generatorID) {
    if(generatorID < 0) {//If < 0, then it's the base resource (potato, land, etc.)
      return $scope[industryName].name[0].toUpperCase() + $scope[industryName].name.slice(1);
    }
    return $scope[industryName].generators[generatorID][0];
  }

  $scope.getGeneratorName = function(loc, generatorID) {
    if(!isNaN(loc)) {//In order to pass the ID of the industry
      return _getGeneratorName($scope[industries[loc]].name, generatorID);
    } else {
      return _getGeneratorName(loc.name, generatorID);
    }
  };

  function getJsonForExport() {
    var retString = '{';
    for (var p in industries) {
      if (p !== '0') {
        retString += ',\r\n';
      }
      retString += formatState($scope[industries[p]]);
    }
    return retString + '}';
  }

  $scope.getMilestoneName = function(loc, tuple) {
    //tuple[0]=generatorID, tuple[1]=milestone
    var ret = '';
    ret += expFilter(tuple[1]);
    ret += ' ' + _getGeneratorName(loc.name,tuple[0]);
    return ret;
  };

  $scope.getNamedType = function(loc, tuple) {
    var i, j, k = '', l = 1, num;
    for (; l < tuple.length - 1; l++) {
      if (typeof tuple[l] === 'object') {
        i = Math.floor(tuple[l][0] / 2);
        j = tuple[l][0] % 1;
        num = tuple[l][1];
        if (l !== 1) {
          k += ', ';
        }
        if (i < loc.generators.length) {
          k += loc.generators[i][0] + (j && ' Speed ' || ' Profit ') + num;
        } else if (i === loc.generators.length) {
          k += 'All' + (j && ' Speed ' || ' Profit ') + num;
        } else if (i === loc.generators.length + 1) {
          k += 'Angel Investor ' + num;
        } else if (tuple[l][0] >= 30 && tuple[l][0] <= 29 + loc.generators.length) {
          k += '+' + tuple[l][1] + ' ' + loc.generators[tuple[l][0] - 30][0];
        }
      }
    }
    return k;
  };

  function getNextCashIndex(loc, index) {
    index += 1;
    while (index < loc.upgrades.length && tupleIsActive(loc.upgrades[index])) {
      index++;
    }
    if (index === loc.upgrades.length) {
      index = null;
    }
    return index;
  }

  function getNextPositiveUnlock(loc, index) {
    var i = 0,
    retVal = 0;
    for (; i < loc.unlocks[index].length; i++) {
      if (loc.generators[index][1] < loc.unlocks[index][i][0]) {
        retVal++;
        if (loc.unlocks[index][i][1][1] > 1) {
          return retVal;
        }
      }
    }
    return null;
  }

  $scope.hideUpdate = function() {
    $scope.showUpdate = false;
  };

  $scope.incrementDays = function(loc) {
    if ($scope.filterTime.days !== null) {
      $scope.filterTime.days++;
    } else {
      $scope.filterTime.days = 1;
    }
  };

  $scope.incrementHours = function(loc) {
    if ($scope.filterTime.hours !== null) {
      $scope.filterTime.hours++;
    } else {
      $scope.filterTime.hours = 1;
    }
  };

  $scope.incrementMinutes = function(loc) {
    if ($scope.filterTime.minutes !== null) {
      $scope.filterTime.minutes++;
    } else {
      $scope.filterTime.minutes = 1;
    }
  };

  $scope.incrementPercentage = function(loc) {
    if ($scope.filterTime.percentage !== null) {
      $scope.filterTime.percentage++;
    } else {
      $scope.filterTime.percentage = 1;
    }
  };

  function indexOrder(input) {
    return input[$scope.sortIndex];
  }

  $scope.isCompare = function() {
    return $scope.compare;
  };

  $scope.isEvent = function() {
    return !$scope.isIndustry('potatoes') && !$scope.isIndustry('land') && !$scope.isIndustry('ore') && !$scope.isIndustry('weapons') && !$scope.isIndustry('medicine');
  };

  $scope.isIndustry = function(world) {
    return $scope.refIndustry == $scope[world];
  };

  // function lzf_decode(str) {
  //   var iidx = 0, oidx = 0, oLen = str.length,
  //   temp = Array.apply(null, new Array(oLen)).map(Number.prototype.valueOf, 0);
  //   do {
  //     var ctrl = str.charCodeAt(iidx++);
  //     if (ctrl < (1 << 5)) {
  //       ctrl++;
  //       while (oidx + ctrl > oLen) {
  //         oLen++;
  //         temp.push(String.fromCharCode(0));
  //       }
  //       do {
  //         temp[oidx++] = str.charAt(iidx++);
  //       } while ((--ctrl) != 0);
  //     } else {
  //       var len = ctrl >> 5, reference = oidx - ((ctrl & 0x1f) << 8) - 1;
  //       if (len == 7) {
  //         len += str.charCodeAt(iidx++);
  //       }
  //       reference -= str.charCodeAt(iidx++);
  //       while (oidx + len + 2 > oLen) {
  //         oLen++;
  //         temp.push(String.fromCharCode(0));
  //       }
  //       if (reference < 0) {
  //         console.log('error');
  //         return 0;
  //       }
  //       temp[oidx++] = temp[reference++];
  //       do {
  //         temp[oidx++] = temp[reference++];
  //       } while ((--len) >= 0);
  //     }
  //   } while (iidx < $scope.lzfData.length);
  //   return temp.join("");
  // }

  // $scope.loadGame = function(str) {
  //   var obj = JSON.parse(lzf_decode(atob(str))), i, id = 0;
  //   for (i in obj.ventures) {
  //     id = 0; // find the correct id from short somehow
  //     loc.generators[i][1] = i.numOwned;
  //     loc.generators[i][2] = i.isBoosted;
  //   }
  //   for (i in obj.upgrades) {
  //     if (i.id.indexOf("_angel_") != -1) {
  //       id = 0; // find the correct id from short somehow
  //       loc.medals[i][3] = i.purchased;
  //     } else {
  //       id = 0; // find the correct id from short somehow
  //       loc.upgrades[i][2] = i.purchased;
  //     }
  //   }
  //   for (i in obj.upgrades) {
  //     if (i.id.indexof("_accountant" != -1)) {
  //       id = 0; // find the correct id from short somehow
  //       loc.industryExperiments[id][(i.id.charAt(i.id.length - 1) != '2') ? 0 : 1][1] = i.purchased;
  //     }
  //   }
  //   loc.lifetimeEarnings = obj.totalCash || obj.sessionCash + obj.totalPreviousCash;
  //   loc.numScientists = obj.angelInvestors;
  //   loc.sacAngels = obj.angelInvestorsSpent;
  //   // how to find gold multipliers, flux, bonus angel effectiveness (kong login etc), suits
  // };

  $scope.resetPlanet = function(loc) {
    var i = 0;
    for (; i < loc.upgrades.length; i++) {
      loc.upgrades[i][loc.upgrades[i].length - 1] = false;
    }
    for (i = 0; i < loc.medals.length; i++) {
      loc.medals[i][loc.medals[i].length - 1] = false;
    }
    for (i = 0; i < loc.industryExperiments.length; i++) {
      loc.industryExperiments[i][0][loc.industryExperiments[i][0].length - 1] = false;
      if (angular.isDefined(loc.industryExperiments[i][1])) {
        loc.industryExperiments[i][1][loc.industryExperiments[i][1].length - 1] = false;
      }
    }
    loc.angelEffectiveness = 2;
    loc.angelExclamation = false;
    loc.bonusAngelEffectiveness = 0;
    loc.bonusMultiplier = 0;
    for (i = 0; i < loc.generators.length; i++) {
      if (i === 0) {
        loc.generators[i][1] = 1;
      } else {
        loc.generators[i][1] = 0;
      }
    }
    loc.rec = null;
    loc.recTable = [];
    loc.recommendation = '';
    loc.comradesPerSecond = 0;
    loc.upgradeCosts = [];
    for (var i = 0; i <= loc.generators.length; i++) {
      loc.upgradeCosts.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    $scope.calc(loc);
  };

  $scope.selectedAll = function(loc, index) {
    var i = 0;
    if (index === 0) {
      for (i = 0; i < loc.generators.length; i++) {
        loc.generators[i][2] = $scope.selectAll[0];
      }
    } else if (index === 1) {
      for (i = 0; i < loc.industryExperiments.length; i++) {
        loc.industryExperiments[i][0][1] = $scope.selectAll[1];
/*        if ($scope.selectAll[2]) {
          $scope.selectAll[2] = false;
        }
        loc.industryExperiments[i][1][1] = $scope.selectAll[2];*/
      }
    } else if (index === 2) {
      for (i = 0; i < loc.industryExperiments.length; i++) {
        loc.industryExperiments[i][1][1] = $scope.selectAll[2];
/*        if ($scope.selectAll[1]) {
          $scope.selectAll[1] = false;
        }
        loc.industryExperiments[i][0][1] = $scope.selectAll[1];*/
      }
    } else if (index === 3) {
      for (i = 0; i < loc.industryExperiments.length; i++) {
        loc.industryExperiments[i][0][1] = $scope.selectAll[3];
      }
    }
  };

  $scope.setIndustry = function(industry) {
    $scope.clearAfter = [false];
    $scope.fillBefore = [false];
    $scope.compare = false;
    $scope.refIndustry = $scope[industry];
    localStorage.setItem('refIndustry', industry);
  };

  function suitFromName(name) {
    var i = 0;
    for (; i < $scope.suitList.length; i++) {
      if ($scope.suitList[i][0].toLowerCase() === name) {
        return i;
      }
    }
    return null;
  }

  $scope.toggleManagers = function(row, index) {
    if ($scope.isIndustry('potatoes')) {
      if (row[index][1] === true) {
        row[(index + 1) % 2][1] = false;
      }
    }
  };

  function tupleIsActive(tuple) {
    return tuple[tuple.length - 1];
  }

  // $scope.updateAngels = function() {
  //   updateIllionize('numScientists', 'viewNumScientists', 'comradesIllions');
  // };

  $scope.updateCientificNumber = function(parent, varName, viewName, expName) {
      return updateCientificNumber(parent, varName, viewName, expName);
  };

  function updateCientificNumber(parent, varName, viewName, expName) {
    var ret = parent[viewName];
    ret *= Math.pow(10,parent[expName]);
    parent[varName] = ret;
  }

  function updateCientificView(parent, varName, viewName, expName) {
    if(parent[varName] < Number(1e+6)) {
      parent[viewName] = parent[varName];
      parent[expName] = 0;
    } else {
      var filtered = expFilter(parent[varName]).slice('E+');
      parent[viewName] = Number(filtered[0]);
      parent[expName] = Number(filtered[1]);
      // var exp = Math.log(parent[varName]);
      // parent[viewName] = parent[varName] / Math.pow(10, exp);
      // parent[expName] = exp;
    }
  }

  $scope.updateComrades = function() {
    updateCientificNumber($scope, 'numComrades', 'viewNumComrades', 'viewExpComrades');
  };

  // $scope.updateEarnings = function() {
  //   updateIllionize('lifetimeEarnings', 'viewLifetimeEarnings', 'scientistIllions');
  // };

  $scope.updateFilterTime = function(loc) {
    if ($scope.filterTime.days === null && $scope.filterTime.hours === null && $scope.filterTime.minutes === null) {
      loc.filterTime = null;
    } else {
      loc.filterTime = ($scope.filterTime.days !== null ? $scope.filterTime.days * 86400 : 0) + ($scope.filterTime.hours !== null ? $scope.filterTime.hours * 3600 : 0) + ($scope.filterTime.minutes !== null ? $scope.filterTime.minutes * 60 : 0)
      if (loc.filterTime === 0) {
        loc.filterTime = null;
      }
    }
  };

  // function updateIllionize(varName, viewName, illionsName) {
  //   if ($scope.refIndustry[illionsName] === '') {
  //     $scope.refIndustry[varName] = $scope.refIndustry[viewName];
  //   } else {
  //     $scope.refIndustry[illionsName] = $scope.refIndustry[illionsName].trim();
  //     $scope.refIndustry[illionsName] = $scope.refIndustry[illionsName].charAt(0).toUpperCase() + $scope.refIndustry[illionsName].slice(1).toLowerCase();
  //     var index = $scope.illionsArray.indexOf(' ' + $scope.refIndustry[illionsName]);
  //     if (index !== -1) {
  //       $scope.refIndustry[varName] = $scope.refIndustry[viewName] * Math.pow(10, 6 + (index * 3));
  //     }
  //   }
  // };

  function updateRecString(loc) {
    if (loc.rec[0] === 'all') {
      loc.recommendation = 'Buy all to level ' + loc.rec[1];
    } else if (loc.rec[0] === 'level') {
      loc.recommendation = 'Buy ' + loc.generators[loc.rec[1]][0] + ' to level ' + loc.rec[2] + '.';
    } else {
      loc.recommendation = 'Buy ' + $filter('rec')(loc.recTable[0][0], loc) + ' Cash Upgrade.'
    }
  }

  // $scope.updateSacrificedAngels = function() {
  //   updateIllionize('sacAngels', 'viewSacAngels', 'sacIllions');
  // };

  $scope.updateScientists = function() {
    updateCientificNumber($scope, 'numScientists', 'viewNumScientists', 'viewExpScientists');
  };

  $scope.updateVariable = function(tuple, idVariable, idViewNumVariable, idViewExpVariable) {
    var ret = tuple[idViewNumVariable];
    ret *= Math.pow(10,tuple[idViewExpVariable]);
    tuple[idVariable] = ret;
  };

  // function updateView(loc,varName, viewName, illionsName) {
  //   if (loc[varName] < Number(1e+6)) {
  //     loc[viewName] = loc[varName];
  //     loc[illionsName] = '';
  //   } else {
  //     var filtered = numFilter(loc[varName]).split(' ');
  //     loc[viewName] = Number(filtered[0]);
  //     loc[illionsName] = filtered[1];
  //   }
  // }

  $scope.updateViewComrades = function() {
    updateCientificView($scope, 'numComrades', 'viewNumComrades', 'viewExpComrades');
  };

  $scope.updateViewScientists = function() {
    updateCientificView($scope, 'numScientists', 'viewNumScientists', 'viewExpScientists');
  };

  $scope.updateViewVariables = function(tuple, idVariable, idViewNumVariable, idViewExpVariable) {
    if(tuple[idVariable] < Number(1e+6)) {
      tuple[idViewNumVariable] = tuple[idVariable];
      tuple[idViewExpVariable] = 0;
    } else {
      var filtered = expFilter(tuple[idVariable]).slice('E+');
      tuple[idViewNumVariable] = Number(filtered[0]);
      tuple[idViewExpVariable] = Number(filtered[1]);
    }
  };

  // $scope.updateViewNumAngels = function (loc) {
  //   updateView(loc,'numScientists', 'viewNumScientists', 'comradesIllions');
  // };

  /**
   * Array generators: Each item is a non-base generator (e.g. Farmer, Commune, etc.)
   * The ultimate generatos (e.g. Colony, Super Highway) don't fit in here, think about later...
   * Each item:
   * [<generatorName>, <amount>, <viewAmount>, <viewExpAmount>, <receipt? Array? Too long...>, <timeout>, <generatedID> (e.g. -1=potato, 0=farmer, etc.), <amountGenerated>, <amountGeneratedTotal=amountGenerated*amount>, <amountGeneratedPerSec=amountGeneratedTotal/timeout>
   * Leave last two empty, calculate.
   */
  function loadDefaults() {
    $scope.land.generators = [
      ['Worker', 0, 0, 0, [], 3, -1, 3, 0, 0],
      ['Blasting Site', 0, 0, 0, [], 6, 0, 12, 0, 0],
      ['Clearcut', 0, 0, 0, [], 6, 1, 12, 0, 0],
      ['Road', 0, 0, 0, [], 12, 2, 48, 0, 0],
      ['Highway', 0, 0, 0, [], 15, 3, 75, 0, 0]
    ];
    $scope.medicine.generators = [
      ['Nurse', 0, 0, 0, [], 15, -1, 15000, 0, 0],
      ['Ambulance', 0, 0, 0, [], 30, -1, 1666667, 0, 0],
      ['Field Hospital', 0, 0, 0, [], 60, -1, 1.85e10, 0, 0],
      ['Clinic', 0, 0, 0, [], 120, -1, 2.06e14, 0, 0],
      ['Hospital', 0, 0, 0, [], 240, -1, 2.29e17, 0, 0]
    ];
    $scope.ore.generators = [
      ['Miner', 0, 0, 0, [], 7, -1, 7, 0, 0],
      ['Mine', 0, 0, 0, [], 14, 0, 28, 0, 0],
      ['Excavator', 0, 0, 0, [], 28, 1, 84, 0, 0],
      ['Mega Mine', 0, 0, 0, [], 56, 2, 224, 0, 0],
      ['Deep Bore', 0, 0, 0, [], 112, 3, 560, 0, 0]
    ];
    $scope.potatoes.generators = [
      ['Farmer', 0, 0, 0, [], 1, -1, 1, 0, 0],
      ['Commune', 0, 0, 0, [], 2, 0, 4, 0, 0],
      ['Collective', 0, 0, 0, [], 3, 1, 9, 0, 0],
      ['Plantation', 0, 0, 0, [], 4, 2, 16, 0, 0],
      ['Hive', 0, 0, 0, [], 5, 3, 25, 0, 0]
    ];
    $scope.weapons.generators = [
      ['Soldier', 0, 0, 0, [], 11, -1, 11, 0, 0],
      ['Fireteam', 0, 0, 0, [], 22, -1, 520370, 0, 0],
      ['Squad', 0, 0, 0, [], 44, -1, 4.4e11, 0, 0],
      ['Platoon', 0, 0, 0, [], 88, -1, 8.8e16, 0, 0],
      ['Division', 0, 0, 0, [], 176, -1, 1.76e24, 0, 0]
    ];
    for (var p in industries) {
      $scope[industries[p]].expTotalResource = 0;
      $scope[industries[p]].name = industries[p];
      // $scope[industries[p]].noSingles = false;
      // $scope[industries[p]].noTens = false;
      // $scope[industries[p]].noHundreds = false;
      // $scope[industries[p]].rec = null;
      // $scope[industries[p]].recTable = [];
      // $scope[industries[p]].recommendation = '';
      $scope[industries[p]].numTotalResource = 0;
      $scope[industries[p]].resourceAmountPerClick = 1;
      $scope[industries[p]].unlocks = [];
      $scope[industries[p]].viewTotalResource = 0;
    }
  }

  /**
   * Array medals: I assume that once the user obtains the medal, he will claim the scientists.
   * If selected manually, the user will need to manually input the scientists added;
   * If achieved by recommendation table, make it automatic
   * Each item:
   * [<generatorID> (e.g. -1=potato, 0=farmer), <milestone>, <scientistsObtained>, <claimed>]
   *
   * Array unlocks: each index is one unlock
   * Array index item:
   * [<generatorID> (e.g. Farmer, Commune, etc.), <amountToUnlock>, <increaseOnComradesPerSec>, <obtained>]
   *
   * Array upgrades: Placed 10 upgrade/line. Inittialy placed 30 levels, don't know yet how many upgrades there are...
   * Each item:
   * [<cost>, <multiplier=7>, <bought>]
   */
  function loadUnlocks() {
    $scope.land.medals = [[-1, 1e6, 1, false], [-1, 1e30, 1, false], [-1, 1e75, 1, false],
        [0, 1e6, 2, false], [0, 1e30, 2, false], [0, 1e75, 2, false],
        [1, 1e6, 3, false], [1, 1e30, 3, false], [1, 1e75, 3, false],
        [2, 1e6, 4, false], [2, 1e30, 4, false], [2, 1e75, 4, false],
        [3, 1e6, 5, false], [3, 1e30, 5, false], [3, 1e75, 5, false],
        [4, 1e6, 6, false], [4, 1e30, 6, false], [4, 1e75, 6, false]
    ];
    $scope.land.unlocks = [[0, 500, 1, false], [0, 5e5, 1, false], [0, 5e8, 1, false], [0, 5e11, 1, false],
        [1, 500, 1, false], [1, 5e5, 1, false], [1, 5e8, 1, false], [1, 5e11, 1, false],
        [2, 500, 1, false], [2, 5e5, 1, false], [2, 5e8, 1, false], [2, 5e11, 1, false],
        [3, 500, 1, false], [3, 5e5, 1, false], [3, 5e8, 1, false], [3, 5e11, 1, false],
        [4, 500, 1, false], [4, 5e5, 1, false], [4, 5e8, 1, false], [4, 5e11, 1, false]];
    $scope.land.upgrades = [[40, 7, false], [8.4e2, 7, false], [1.76e4, 7, false], [3.7e5, 7, false], [7.78e6, 7, false], [1.63e8, 7, false], [3.43e9, 7, false],[7.20e10, 7, false], [1.51e12, 7, false], [3.18e13, 7, false],
        [6.67e14, 7, false], [1.40e16, 7, false], [2.94e17, 7, false], [6.18e18, 7, false], [1.30e20, 7, false], [2.72e21, 7, false], [5.72e22, 7, false], [1.20e24, 7, false], [2.52e25, 7, false], [5.30e26, 7, false],
        [1.11e28, 7, false], [2.34e29, 7, false], [4.91e30, 7, false], [1.03e32, 7, false], [2.16e33, 7, false], [4.55e34, 7, false], [9.54e35, 7, false], [2.00e37, 7, false], [4.21e38, 7, false], [8.84e39, 7, false]];

    $scope.medicine.medals = [];
    $scope.medicine.unlocks = [];
    $scope.medicine.upgrades = [];

    $scope.ore.medals = [];
    $scope.ore.unlocks = [];
    $scope.ore.upgrades = [];

    $scope.potatoes.medals = [[-1, 1e6, 1, false], [-1, 1e30, 1, false], [-1, 1e75, 1, false],
        [0, 1e6, 2, false], [0, 1e30, 2, false], [0, 1e75, 2, false],
        [1, 1, 3, false], [1, 1e30, 3, false], [1, 1e75, 3, false],
        [2, 1, 4, false], [2, 1e30, 4, false], [2, 1e75, 4, false],
        [3, 1, 5, false], [3, 1e30, 5, false], [3, 1e75, 5, false],
        [4, 1, 6, false], [4, 1e30, 6, false], [4, 1e75, 6, false]
    ];
    $scope.potatoes.unlocks = [[0, 1000, 1, false], [0, 1e6, 1, false], [0, 1e9, 1, false], [0, 1e12, 1, false],
        [1, 1000, 2, false], [1, 1e6, 2, false], [1, 1e9, 2, false], [1, 1e12, 2, false],
        [2, 500, 3, false], [2, 5e5, 3, false], [2, 5e8, 3, false], [2, 5e11, 3, false],
        [3, 1000, 4, false], [3, 1e6, 4, false], [3, 1e9, 4, false], [3, 1e12, 4, false],
        [4, 1000, 5, false], [4, 1e6, 5, false], [4, 1e9, 5, false], [4, 1e12, 5, false]];
    $scope.potatoes.upgrades = [[30, 7, false], [6.30e02, 7, false], [1.32e04, 7, false], [2.78e05, 7, false], [5.83e06, 7, false], [1.23e08, 7, false], [2.57e09, 7, false], [5.40e10, 7, false], [1.13e12, 7, false], [2.38e13, 7, false],
        [5.00e14, 7, false], [1.05e16, 7, false], [2.21e17, 7, false], [4.63e18, 7, false], [9.73e19, 7, false], [2.04e21, 7, false], [4.29e22, 7, false], [9.01e23, 7, false], [1.89e25, 7, false], [3.97e26, 7, false],
        [8.35e27, 7, false], [1.75e29, 7, false], [3.68e30, 7, false], [7.73e31, 7, false], [1.62e33, 7, false], [3.41e34, 7, false], [7.16e35, 7, false], [1.50e37, 7, false], [3.16e38, 7, false], [6.63e39, 7, false]];

    $scope.weapons.medals = [];
    $scope.weapons.unlocks = [];
    $scope.weapons.upgrades = [];
  }
  loadDefaults();
  loadUnlocks();
}]);
