"use strict";

var advApp = angular.module('advApp', ['ui.bootstrap', 'ngAnimate']),
illionsArr = ['', ' Million', ' Billion', ' Trillion', ' Quadrillion', ' Quintillion', ' Sextillion', ' Septillion', ' Octillion', ' Nonillion', ' Decillion', ' Undecillion', ' Duodecillion', ' Tredecillion', ' Quattuordecillion', ' Quindecillion', ' Sexdecillion', ' Septendecillion', ' Octodecillion', ' Novemdecillion', ' Vigintillion', ' Unvigintillion', ' Duovigintillion', ' Tresvigintillion', ' Quattuorvigintillion', ' Quinvigintillion', ' Sexvigintillion', ' Septenvigintillion', ' Octovigintillion', ' Novemvigintillion', ' Trigintillion', ' Untrigintillion', ' Duotrigintillion', ' Tretrigintillion', ' Quattuortrigintillion', ' Quintrigintillion', ' Sextrigintillion', ' Septentrigintillion', ' Octotrigintillion', ' Novemtrigintillion', ' Quadragintillion', ' Unquadragintillion', ' Duoquadragintillion', ' Trequadragintillion', ' Quattuorquadragintillion', ' Quinquadragintillion', ' Sexquadragintillion', ' Septquadragintillion', ' Octoquadragintillion', ' Novemquadragintillion', ' Quinquagintillion', ' Unquinquagintillion', ' Duoquinquagintillion', ' Trequinquagintillion', ' Quattuorquinquagintillion', ' Quinquinquagintillion', ' Sexquinquagintillion', ' Septquinquagintillion', ' Octoquinquagintillion', ' Novemquinquagintillion', ' Sexagintillion', ' Unsexagintillion', ' Duosexagintillion', ' Tresexagintillion', ' Quattuorsexagintillion', ' Quinsexagintillion', ' Sexsexagintillion', ' Septsexagintillion', ' Octosexagintillion', ' Novemsexagintillion', ' Septuagintillion', ' Unseptuagintillion', ' Duoseptuagintillion', ' Treseptuagintillion', ' Quattuorseptuagintillion', ' Quinseptuagintillion', ' Sexseptuagintillion', ' Septseptuagintillion', ' Octoseptuagintillion', ' Novemseptuagintillion', ' Octogintillion', ' Unoctogintillion', ' Duooctogintillion', ' Treoctogintillion', ' Quattuoroctogintillion', ' Quinoctogintillion', ' Sexoctogintillion', ' Septoctogintillion', ' Octooctogintillion', ' Novemoctogintillion', ' Nonagintillion', ' Unnonagintillion', ' Duononagintillion', ' Trenonagintillion', ' Quattuornonagintillion', ' Quinnonagintillion', ' Sexnonagintillion', ' Septnonagintillion', ' Onctononagintillion', ' Novemnonagintillion', ' Centillion', ' Uncentillion'];

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
    return numFilter(input);
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
      retVal = loc.investments[input[1]][0];
    } else if (input[0] === 'cash') {
      var index = Math.floor(loc.cashUpgrades[input[1]][1][0] / 2);
      if (index === loc.investments.length + 1) {
        retVal = 'Angel Investor';
      }
      else {
        retVal = (index < loc.investments.length) ? loc.investments[index][0] : 'All';
        retVal += (loc.cashUpgrades[input[1]][1][0] % 2 === 0) ? ' Profit' : ' Speed';
      }
      retVal += ' ' + loc.cashUpgrades[input[1]][1][1];
    }
    return retVal;
  }
});

advApp.controller('advController', ['$document', '$filter', '$scope', function($document, $filter, $scope) {
  $scope.accOpen = [false, false, false, false, false, false, false];
  $scope.accOpen2 = [false, false];
  $scope.clearAfter = [false, false];
  $scope.compare = false;
  $scope.fillBefore = [false, false];
  $scope.filterTime = {'days': null, 'hours': null, 'minutes': null, 'percentage': null};
  $scope.illionsArray = illionsArr.slice(1);
  $scope.land = {};
  $scope.medicine = {};
  $scope.ore = {};
  $scope.platinumboosts = [17.77, 77.77, 777.77, 7777.77];
  $scope.potatoes = {};
  $scope.raw = false;
  $scope.ref = $scope.potatoes;
  $scope.reverse = true;
  $scope.selectAll = [false, false, false, false];
  $scope.showUpdate = false;
  $scope.sortIndex = 2;
  $scope.suitList = [
    ['Blue', 3],
    ['Gold', 2],
    ['Green', 10],
    ['Red', 2],
    ['White', 2]
  ];
  $scope.superbadgeList = [
    /*
    The structure is as follows:
    ['Name',Planet ID,[Investment,x Profit]]
    */
    ['Basket Case', 0, [6, 25]],
    ['Buy-It Shield', 0, [2, 30]],
    ['Candy Canes', 0, [10, 20]],
    ['Burger', 0, [12, 20]],
    ['Unicorn', 0, [16, 15]],
    ['Rainbow Machine', 1, [0, 30]],
    ['Villain Mask', 1, [6, 25]],
    ['Space Buddies', 1, [8, 20]],
    ['Silver Blade', 1, [12, 20]],
    ['Speaker', 1, [16, 15]],
    ['Boxing Bear', 2, [8, 20]],
    ['Time Machine', 2, [14, 15]],
    ['Bonbon', 0, [0, 25]],
    ['Kitchen Gadget', 0, [4, 30]],
    ['Fuzzee', 0, [8, 20]]
  ];
  $scope.weapons = {};
  var planets = ['potatoes', 'land', 'ore', 'weapons', 'medicine'];

  angular.element(document).ready(function() {
    var fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0],
      reader = new FileReader();
      reader.onload = function(e) {
        loadExportedJson(e.target.result);
      }
      reader.readAsText(file);
    });
    var refIndustry = localStorage.getItem('refIndustry');
    if (refIndustry) {
      var i = 0;
      for (i in planets) {
        if (planets[i] === refIndustry) {
          $scope.setWorld(refIndustry);
          break;
        }
      }
    }
    var saved = localStorage.getItem('planets');
    if (saved) {
      loadExportedJson(saved);
    }
  });

  function loadExportedJson(str) {
    var i = 0, j = 0, k = 0,
    obj = JSON.parse(str);
    for (k in planets) {
      if (obj.hasOwnProperty(planets[k])) {
        $scope.fullyResetPlanet($scope[planets[k]]);
        for (i in obj[planets[k]].levels) {
          if (obj[planets[k]].levels.hasOwnProperty(i)) {
            for (j = 0; j < $scope[planets[k]].investments.length; j++) {
              if ($scope[planets[k]].investments[j][0] === i) {
                $scope[planets[k]].investments[j][1] = obj[planets[k]].levels[i];
                break;
              }
            }
          }
        }
        $scope[planets[k]].numAngels = obj[planets[k]].numAngels;
        $scope.updateViewNumAngels($scope[planets[k]]);
        for (i = 0; i < obj[planets[k]].upgradeIndexUpTo; i++) {
          $scope[planets[k]].cashUpgrades[i][$scope[planets[k]].cashUpgrades[i].length - 1] = true;
        }
        for (i = 0; i < obj[planets[k]].angelUpgradeIndexUpTo; i++) {
          $scope[planets[k]].angelUpgrades[i][$scope[planets[k]].angelUpgrades[i].length - 1] = true;
        }
        for (i = 0; i < obj[planets[k]].upgradeIndexBonus.length; i++) {
          $scope[planets[k]].cashUpgrades[obj[planets[k]].upgradeIndexBonus[i]][$scope[planets[k]].cashUpgrades[obj[planets[k]].upgradeIndexBonus[i]].length - 1] = true;
        }
        for (i = 0; i < obj[planets[k]].angelUpgradeIndexBonus.length; i++) {
          $scope[planets[k]].angelUpgrades[obj[planets[k]].angelUpgradeIndexBonus[i]][$scope[planets[k]].angelUpgrades[obj[planets[k]].angelUpgradeIndexBonus[i]].length - 1] = true;
        }
        for (i = 0; i < obj[planets[k]].managersBought.length; i++) {
          $scope[planets[k]].managerUpgrades[Math.floor(obj[planets[k]].managersBought[i] / 2)][obj[planets[k]].managersBought[i] % 2][1] = true;
        }
        if (obj[planets[k]].platinumboost != null) {
          console.log("Has platinum boost saved.");
          for (i = 0; i < $scope.platinumboosts.length; i++) {
            if (obj[planets[k]].platinumboost == $scope.platinumboosts[i]) {
              console.log("Compares to " + i + ".");
              $scope.changePlatinum($scope[planets[k]], i);
            }
          }
        } else {
          console.log("Does not have platinum boost saved.");
          $scope.changePlatinum($scope[planets[k]], 0);
        }
        $scope[planets[k]].noSingles = obj[planets[k]].noSingles || false;
        $scope[planets[k]].noTens = obj[planets[k]].noTens || false;
        $scope[planets[k]].noHundreds = obj[planets[k]].noHundreds || false;
        if ('suit' in obj[planets[k]]) {
          $scope[planets[k]].suits[obj[planets[k]].suit][0] = true;
        }
        if ('badge' in obj[planets[k]]) {
          $scope[planets[k]].badges[obj[planets[k]].badge][0] = true;
        }
        $scope[planets[k]].triples = obj[planets[k]].triples;
        $scope[planets[k]].flux = obj[planets[k]].flux;
        $scope[planets[k]].bonusAngelEffectiveness = obj[planets[k]].bonusAngelEffectiveness;
        $scope[planets[k]].bonusMultiplier = obj[planets[k]].bonusMultiplier;
        if (angular.isDefined(obj[planets[k]].megaTicket)) {
          for (i = 0; i < obj[planets[k]].megaTicket.length; i++) {
            $scope[planets[k]].investments[obj[planets[k]].megaTicket[i]][2] = true;
          }
        }
      }
      $scope.calc($scope[planets[k]]);
    }
    $scope.$digest();
  }

  $scope.apply = function(loc) {
    $scope.applyRow(loc, loc.recTable[0]);
  };

  $scope.applyRow = function(loc, row) {
    var i = 0;
    if (row[0] === 'all') {
      for (; i < loc.investments.length; i++) {
        if (loc.investments[i][1] < row[1]) {
          loc.investments[i][1] = row[1];
        }
      }
    } else if (row[0][0] === 'level') {
      loc.investments[row[0][1]][1] = row[1];
    } else if (row[0][0] === 'cash') {
      loc.cashUpgrades[row[0][1]][2] = true;
    }
    $scope.calc(loc);
  };

  function applySuperBadge(loc) {
    var i;
    for (i = 0; i < loc.badges.length; i++) {
      if (loc.badges[i][0] === true) {
        if (loc.name === $scope[planets[$scope.superbadgeList[i][1]]].name) {
          var row = $scope.superbadgeList[i][2];
          var applyRow = Math.floor(row[0] / 2);
          var applyType = row[0] % 2;
          if (applyRow < loc.investments.length) {
            if (applyType === 0) {
              loc.investments[applyRow][3] *= row[1];
            } else {
              loc.investments[applyRow][4] /= row[1];
            }
          } else if (applyRow === loc.investments.length) {
            if (applyType === 0) {
              for (j = 0; j < loc.investments.length; j++) {
                loc.investments[j][3] *= row[1];
              }
            } else {
              for (j = 0; j < loc.investments.length; j++) {
                loc.investments[j][4] /= row[1];
              }
            }
          } else if (applyRow === loc.investments.length + 1) {
            loc.angelEffectiveness += row[1];
          } else if (row[0] < 30 || row[0] > 29 + loc.investments.length) {
            throw 'Pair not dealt with: ' + row;
          }
        }
        break;
      }
    }
  };

  function applyTuple(loc, row) {
    var i = 0, j = 0,
    applyRow = -1,
    applyType = -1;
    for (; i < row.length; i++) {
      if (typeof row[i] === 'object') {
        applyRow = Math.floor(row[i][0] / 2);
        applyType = row[i][0] % 2;
        if (applyRow < loc.investments.length) {
          if (applyType === 0) {
            loc.investments[applyRow][3] *= row[i][1];
          } else {
            loc.investments[applyRow][4] /= row[i][1];
          }
        } else if (applyRow === loc.investments.length) {
          if (applyType === 0) {
            for (j = 0; j < loc.investments.length; j++) {
              loc.investments[j][3] *= row[i][1];
            }
          } else {
            for (j = 0; j < loc.investments.length; j++) {
              loc.investments[j][4] /= row[i][1];
            }
          }
        } else if (applyRow === loc.investments.length + 1) {
          loc.angelEffectiveness += row[i][1];
        } else if (row[i][0] < 30 || row[i][0] > 29 + loc.investments.length) {
          throw 'Tuple not dealt with: ' + row;
        }
      }
    }
  };

  function calcUnlockCost(loc, index, fromLevel, numLevels) {
    var retVal = 1,
    i = 1, j = 0,
    managerDiscount = 1;
    for (; i < numLevels; i++) {
      retVal += Math.pow(loc.basePower[index], i);
    };
    if (index === 0 && $scope.isWorld('potatoes')) {
      fromLevel -= 1;
    }
    for (i = 0; i < loc.angelUpgrades.length; i++) {
      if (tupleIsActive(loc.angelUpgrades[i])) {
        if (loc.angelUpgrades[i][1][0] === (30 + index)) {
          fromLevel -= loc.angelUpgrades[i][1][1];
        }
      }
    }
    if (loc.managerUpgrades.length !== 0) {
      for (i = 0; i < loc.managerUpgrades[index].length; i++) {
        if (tupleIsActive(loc.managerUpgrades[index][i])) {
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
  };

  function calcUnlockCostAll(loc) {
    var lowestLevel = loc.investments[0][1],
    i = 1, j = 0,
    retVal = 0;
    for (; i < loc.investments.length; i++) {
      if (loc.investments[i][1] < lowestLevel) {
        lowestLevel = loc.investments[i][1];
      }
    }
    i = 0;
    while (i < loc.unlocks[loc.investments.length].length && lowestLevel >= loc.unlocks[loc.investments.length][i][0]) {
      i++;
    }
    if (i !== loc.unlocks[loc.investments.length].length) {
      for (; j < loc.investments.length; j++) {
        if (loc.investments[j][1] < loc.unlocks[loc.investments.length][i][0]) {
          retVal += calcUnlockCost(loc, j, loc.investments[j][1], loc.unlocks[loc.investments.length][i][0] - loc.investments[j][1]);
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
    calcSuits(loc);
    calcSuperBadges(loc);
    calcRecommendations(loc);
    localStorage.setItem('planets', getJsonForExport());
  };

  function calcAngelCost(numAngels, mul) {
    return (1e+15 * Math.pow(numAngels / mul, 2));
  };

  $scope.calcAngelInvestors = function(loc) {
    loc.angelCosts = [];
    var earnedNumAngels = loc.numAngels + loc.sacAngels;
    var loopVals = [['10%', 1.1], ['50%', 1.5], ['Doubled w/o Sacrificed', 2], ['Doubled', 2], ['5x', 5], ['10x', 10], ['Custom Multiplier', loc.customAngelMul || 0]];
    for (var val in loopVals) {
      loc.angelCosts[val] = []
      loc.angelCosts[val][0] = loopVals[val][0];
      if (loopVals[val][1] !== 0) {
        if (val !== '2') {
          loc.angelCosts[val][1] = loopVals[val][1] * earnedNumAngels;
        } else {
          loc.angelCosts[val][1] = (loopVals[val][1] * loc.numAngels) + loc.sacAngels;
        }
        loc.angelCosts[val][2] = calcAngelCost(loc.angelCosts[val][1], loc.angelScale);
        loc.angelCosts[val][3] = Math.max(loc.angelCosts[val][2] - loc.lifetimeEarnings, 0);
        loc.angelCosts[val][4] = loc.angelCosts[val][3] / loc.totalMoneyPerSecond;
      }
    }
  };

  function calcAngels(loc) {
    var i = 0,
    tempPlanet = null;
    loc.angelExclamation = false;
    for (; i < loc.angelUpgrades.length; i++) {
      if (!tupleIsActive(loc.angelUpgrades[i]) && loc.angelUpgrades[i][0] < loc.numAngels) {
        tempPlanet = JSON.parse(JSON.stringify(loc));
        tempPlanet.numAngels -= loc.angelUpgrades[i][0];
        tempPlanet.angelUpgrades[i][tempPlanet.angelUpgrades[i].length - 1] = true;
        calcState(tempPlanet);
        var delta = tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond;
        var percent = delta / loc.totalMoneyPerSecond;
        if (delta > 0) {
          loc.angelUpgrades[i][loc.angelUpgrades[i].length - 2] = percent;
          loc.angelExclamation = true;
        } else {
          loc.angelUpgrades[i][loc.angelUpgrades[i].length - 2] = false;
        }
      }
    }
  };

  function calcRecommendations(loc) {
    var i = 0, j = 0, k = 0,
    highestSharedLevel = loc.investments[0][1],
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
    for (; i < loc.investments.length; i++) {
      while (inc.length > 3 - (loc.noSingles ? 1 : 0) - (loc.noTens ? 1 : 0) - (loc.noHundreds ? 1 : 0)) {
        inc.pop();
      }
      if (i === 1 && $scope.isWorld('potatoes')) {
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
        tempPlanet.investments = deepCopy(loc.investments);
        tempPlanet.investments[i][1] += inc[j];
        calcState(tempPlanet);
        tempUnlock = calcUnlockCost(loc, i, loc.investments[i][1], inc[j]);
        tempUnlockTime = tempUnlock / loc.totalMoneyPerSecond;
        tempPercentageIncrease = (tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond) * 100 / loc.totalMoneyPerSecond;
        if ((loc.filterTime === null || loc.filterTime > tempUnlockTime) && ($scope.filterTime.percentage === null || $scope.filterTime.percentage < tempPercentageIncrease)) {
          upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
          if (upgradeScore > max) {
            max = upgradeScore;
            maxObj = ['level', i, tempPlanet.investments[i][1]];
          }
          loc.recTable.push([['level', i], tempPlanet.investments[i][1], upgradeScore, tempUnlock, tempUnlockTime, tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond, tempPercentageIncrease]);
        }
      }
    }
    j = -1;
    for (i = 0; i < 22; i++) {
      tempPlanet.investments = deepCopy(loc.investments);
      tempPlanet.angelEffectiveness = loc.angelEffectiveness;
      tempPlanet.cashUpgrades = deepCopy(loc.cashUpgrades);
      j = getNextCashIndex(loc, j);
      if (j !== null) {
        tempPlanet.cashUpgrades[j][tempPlanet.cashUpgrades[j].length - 1] = true;
        calcState(tempPlanet);
        tempUnlockTime = loc.cashUpgrades[j][0] / loc.totalMoneyPerSecond;
        tempPercentageIncrease = (tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond) * 100 / loc.totalMoneyPerSecond;
        if ((loc.filterTime === null || loc.filterTime > tempUnlockTime) && ($scope.filterTime.percentage === null || $scope.filterTime.percentage < tempPercentageIncrease)) {
          upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
          if (upgradeScore > max) {
            max = upgradeScore;
            maxObj = ['upgrade', j];
          }
          loc.recTable.push([['cash', j], null, upgradeScore, loc.cashUpgrades[j][0], tempUnlockTime, tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond, tempPercentageIncrease]);
        }
      } else {
        break;
      }
    }
    tempUnlock = 0;
    tempPlanet.investments = deepCopy(loc.investments);
    tempPlanet.cashUpgrades = deepCopy(loc.cashUpgrades);
    for (i = 1; i < loc.investments.length; i++) {
      if (loc.investments[i][1] < highestSharedLevel) {
        highestSharedLevel = loc.investments[i][1];
      }
    }
    for (i = 0; i < loc.unlocks[loc.investments.length].length; i++) {
      if (loc.unlocks[loc.investments.length][i][0] > highestSharedLevel) {
        highestSharedLevel = loc.unlocks[loc.investments.length][i][0];
        break;
      }
    }
    for (i = 0; i < tempPlanet.investments.length; i++) {
      if (tempPlanet.investments[i][1] < highestSharedLevel) {
        tempUnlock += calcUnlockCost(loc, i, tempPlanet.investments[i][1], highestSharedLevel - tempPlanet.investments[i][1]);
        tempPlanet.investments[i][1] = highestSharedLevel;
      }
    }
    calcState(tempPlanet);
    tempUnlockTime = tempUnlock / loc.totalMoneyPerSecond;
    tempPercentageIncrease = (tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond) * 100 / loc.totalMoneyPerSecond;
    if ((loc.filterTime === null || loc.filterTime > tempUnlockTime) && ($scope.filterTime.percentage === null || $scope.filterTime.percentage < tempPercentageIncrease)) {
      upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
      if (upgradeScore > max) {
        max = upgradeScore;
        maxObj = ['all', highestSharedLevel];
      }
      loc.recTable.push(['all', highestSharedLevel, upgradeScore, tempUnlock, tempUnlock / loc.totalMoneyPerSecond, tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond, tempPercentageIncrease]);
    }
    loc.rec = maxObj;
    $scope.reverse = true;
    $scope.sortIndex = 2;
    loc.recTable = $filter('orderBy')(loc.recTable, indexOrder, $scope.reverse);
    updateRecString(loc);
  };

  function calcState(loc) {
    var i = 0, j = true,
    highestSharedLevel = loc.investments[0][1];
    loc.totalMoneyPerSecond = 0;
    loc.angelEffectiveness = 2 + (loc.suits[suitFromName('red')][0] ? $scope.suitList[suitFromName('red')][1] : 0) + (loc.suits[suitFromName('green')][0] ? $scope.suitList[suitFromName('green')][1] : 0);
    for (; i < loc.investments.length; i++) {
      if (loc.investments[i][2] === false) {
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
    for (i = 0; i < loc.investments.length; i++) {
      if (loc.investments[i][1] < highestSharedLevel) {
        highestSharedLevel = loc.investments[i][1];
      }
      loc.investments[i][3] = loc.investments[i][1] * loc.baseProfit[i];
      if (loc.triples > 0 || loc.bonusMultiplier > 0 || loc.suits[suitFromName('gold')][0] || loc.suits[suitFromName('blue')][0]) {
        loc.investments[i][3] *= (3 * loc.triples) + loc.bonusMultiplier + (loc.suits[suitFromName('gold')][0] ? $scope.suitList[suitFromName('gold')][1] : 0) + (loc.suits[suitFromName('blue')][0] ? $scope.suitList[suitFromName('blue')][1] : 0);
      }
      if (loc.investments[i][2]) {
        loc.investments[i][3] *= $scope.selectAll[0] ? loc.platinumboost : 7.77;
      }
      loc.investments[i][4] = loc.baseSpeed[i];
      if (loc.flux > 0) {
        loc.investments[i][4] /= (1 + loc.flux * 1.21);
      }
      if (loc.suits[suitFromName('white')][0]) {
        loc.investments[i][4] /= 2;
      }
      loc.upgradeCosts[i][0] = calcUnlockCost(loc, i, loc.investments[i][1], 1);
      loc.upgradeCosts[i][2] = calcUnlockCost(loc, i, loc.investments[i][1], 10);
      loc.upgradeCosts[i][4] = calcUnlockCost(loc, i, loc.investments[i][1], getDifferenceNBonus(loc, i, 1));
      loc.upgradeCosts[i][6] = calcUnlockCostAll(loc);
    }
    for (i = 0; i < loc.cashUpgrades.length; i++) {
      if (tupleIsActive(loc.cashUpgrades[i])) {
        applyTuple(loc, loc.cashUpgrades[i]);
      }
    }
    applySuperBadge(loc);
    for (i = 0; i < loc.angelUpgrades.length; i++) {
      if (tupleIsActive(loc.angelUpgrades[i])) {
        applyTuple(loc, loc.angelUpgrades[i]);
      }
    }
    for (i = 0; i < loc.investments.length; i++) {
      j = 0;
      while (j < loc.unlocks[i].length && loc.investments[i][1] >= loc.unlocks[i][j][0]) {
        applyTuple(loc, loc.unlocks[i][j]);
        j++;
      }
    }
    j = 0;
    while (j < loc.unlocks[loc.investments.length].length && highestSharedLevel >= loc.unlocks[loc.investments.length][j][0]) {
      applyTuple(loc, loc.unlocks[loc.investments.length][j]);
      j++;
    }
    if (loc.bonusAngelEffectiveness > 0) {
      loc.angelEffectiveness += loc.bonusAngelEffectiveness;
    }
    for (i = 0; i < loc.investments.length; i++) {
      loc.investments[i][3] *= (1 + (loc.angelEffectiveness * loc.numAngels / 100));
      loc.investments[i][5] = loc.investments[i][3] / loc.investments[i][4]
      loc.totalMoneyPerSecond += loc.investments[i][5];
    }
    for (i = 0; i < loc.investments.length; i++) {
      loc.investments[i][6] = loc.investments[i][5] * 100 / loc.totalMoneyPerSecond;
    }
    for (i = 0; i < loc.upgradeCosts.length; i++) {
      loc.upgradeCosts[i][1] = loc.upgradeCosts[i][0] / loc.totalMoneyPerSecond;
      loc.upgradeCosts[i][3] = loc.upgradeCosts[i][2] / loc.totalMoneyPerSecond;
      loc.upgradeCosts[i][5] = loc.upgradeCosts[i][4] / loc.totalMoneyPerSecond;
      loc.upgradeCosts[i][7] = loc.upgradeCosts[i][6] / loc.totalMoneyPerSecond;
    }
  };

  function calcSuits(loc) {
    var i = 0, max = [-1, 0],
    tempPlanet = {};
    loc.suitExclamation = false;
    for (; i < loc.suits.length; i++) {
      if (loc.suits[i][0] === false) {
        tempPlanet = JSON.parse(JSON.stringify(loc));
        tempPlanet.suits[i][0] = true;
        $scope.changeSuits(tempPlanet, i);
        calcState(tempPlanet);
        var delta = tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond;
        var percent = delta / loc.totalMoneyPerSecond;
        if (delta > 0) {
          loc.suits[i][1] = percent;
          loc.suitExclamation = true;
          if (percent > max[1]) {
            max[0] = i;
            max[1] = percent;
          }
        } else {
          loc.suits[i][1] = false;
        }
      } else {
        loc.suits[i][1] = false;
      }
    }
    if (max[0] !== -1) {
      loc.bestSuit = max[0];
    } else {
      loc.bestSuit = null;
    }
  };

  function calcSuperBadges(loc) {
    var i = 0, max = [-1, 0],
    tempPlanet = {};
    loc.badgeExclamation = false;
    for (; i < loc.badges.length; i++) {
      if (loc.badges[i][0] === false) {
        tempPlanet = JSON.parse(JSON.stringify(loc));
        tempPlanet.badges[i][0] = true;
        $scope.changeBadge(tempPlanet, i);
        calcState(tempPlanet);
        var delta = tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond;
        var percent = delta / loc.totalMoneyPerSecond;
        if (delta > 0) {
          loc.badges[i][1] = percent;
          loc.badgeExclamation = true;
          if (percent > max[1]) {
            max[0] = i;
            max[1] = percent;
          }
        } else {
          loc.badges[i][1] = false;
        }
      } else {
        loc.badges[i][1] = false;
      }
    }
    if (max[0] !== -1) {
      loc.bestBadge = max[0];
    } else {
      loc.bestBadge = null;
    }
  };

  function calcUpgradeScore(planet, loc, unlockCost) {
    var overflowPotential = planet.totalMoneyPerSecond * unlockCost,
    divNum = 0,
    retVal = planet.totalMoneyPerSecond - loc.totalMoneyPerSecond;
    if (!isFinite(unlockCost)) {
      return 0;
    }
    while (!isFinite(overflowPotential)) {
      divNum += 100;
      overflowPotential = planet.totalMoneyPerSecond * (unlockCost / Number('1e+' + divNum));
    }
    retVal *= 1000000000000000000000 / overflowPotential;
    if (divNum !== 0) {
      retVal *= Number('1e+' + divNum);
    }
    return retVal;
  };

  $scope.changePlatinum = function(loc, index) {
    for (var i = 0; i < loc.platinum.length; i++) {
      if (i !== index) {
        loc.platinum[i][0] = false;
      } else {
        loc.platinum[i][0] = true;
      }
    }
    loc.platinumboost = $scope.platinumboosts[index];
  };

  $scope.changeSuits = function(loc, index) {
    for (var i = 0; i < loc.suits.length; i++) {
      if (i !== index) {
        loc.suits[i][0] = false;
      } else {
        loc.suits[i][1] = false;
      }
    }
  };

  $scope.changeBadge = function(loc,index) {
    for (var i = 0; i < loc.badges.length; i++) {
        if (i !== index) {
            loc.badges[i][0] = false;
        } else {
            loc.badges[i][1] = false;
        }
    }
  }

  $scope.checkAngel = function(loc, index) {
    var i = 0;
    loc.angelUpgrades[index][loc.angelUpgrades[index].length - 2] = false;
    if ($scope.fillBefore[1] && loc.angelUpgrades[index][loc.angelUpgrades[index].length - 1] == true) {
      for (; i < index; i++) {
        loc.angelUpgrades[i][loc.angelUpgrades[i].length - 1] = true;
        loc.angelUpgrades[i][loc.angelUpgrades[i].length - 2] = false;
      }
    }
    if ($scope.clearAfter[1] && loc.angelUpgrades[index][loc.angelUpgrades[index].length - 1] == false) {
      for (i = index + 1; i < loc.angelUpgrades.length; i++) {
        loc.angelUpgrades[i][loc.angelUpgrades[i].length - 1] = false;
      }
    }
    //calcAngels(loc);
  };

  $scope.checkCash = function(loc, index) {
    var i = 0;
    if ($scope.fillBefore[0] && loc.cashUpgrades[index][loc.cashUpgrades[index].length - 1] == true) {
      for (; i < index; i++) {
        loc.cashUpgrades[i][loc.cashUpgrades[i].length - 1] = true;
      }
    }
    if ($scope.clearAfter[0] && loc.cashUpgrades[index][loc.cashUpgrades[index].length - 1] == false) {
      for (i = index + 1; i < loc.cashUpgrades.length; i++) {
        loc.cashUpgrades[i][loc.cashUpgrades[i].length - 1] = false;
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
    for (; i < loc.investments.length; i++) {
      if (i !== 0) {
        string += ',\r\n';
      }
      string += '    "' + loc.investments[i][0] + '": ' + loc.investments[i][1];
    }
    string += '\r\n  },\r\n  "numAngels": ' + loc.numAngels + ',\r\n  "upgradeIndexUpTo": ';
    for (i = 0; i < loc.cashUpgrades.length; i++) {
      if (loc.cashUpgrades[i][loc.cashUpgrades[i].length - 1] === false) {
        break;
      }
    }
    string += i + ',\r\n  "upgradeIndexBonus": [';
    for (; i < loc.cashUpgrades.length; i++) {
      if (loc.cashUpgrades[i][loc.cashUpgrades[i].length - 1] === true) {
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
    for (i = 0; i < loc.angelUpgrades.length; i++) {
      if (loc.angelUpgrades[i][loc.angelUpgrades[i].length - 1] === false) {
        break;
      }
    }
    first = true;
    string += i + ',\r\n  "angelUpgradeIndexBonus": [';
    for (; i < loc.angelUpgrades.length; i++) {
      if (loc.angelUpgrades[i][loc.angelUpgrades[i].length - 1] === true) {
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
    for (i = 0; i < loc.managerUpgrades.length; i++) {
      for (j = 0; j < loc.managerUpgrades[i].length; j++) {
        if (loc.managerUpgrades[i][j][1] === true) {
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
    for (i = 0; i < loc.investments.length; i++) {
      if (loc.investments[i][2] === true) {
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
  };

  $scope.fullyResetPlanet = function(loc) {
    var i = 0;
    for (; i < loc.cashUpgrades.length; i++) {
      loc.cashUpgrades[i][loc.cashUpgrades[i].length - 1] = false;
    }
    for (i = 0; i < loc.angelUpgrades.length; i++) {
      loc.angelUpgrades[i][loc.angelUpgrades[i].length - 1] = false;
    }
    for (i = 0; i < loc.managerUpgrades.length; i++) {
      loc.managerUpgrades[i][0][loc.managerUpgrades[i][0].length - 1] = false;
      if (angular.isDefined(loc.managerUpgrades[i][1])) {
        loc.managerUpgrades[i][1][loc.managerUpgrades[i][1].length - 1] = false;
      }
    }
    loc.angelEffectiveness = 2;
    loc.angelExclamation = false;
    loc.badgeExclamation = false;
    loc.bonusAngelEffectiveness = 0;
    loc.bonusMultiplier = 0;
    loc.flux = 0;
    loc.illions = '';
    for (i = 0; i < loc.investments.length; i++) {
      if (i === 0) {
        loc.investments[i][1] = 1;
      } else {
        loc.investments[i][1] = 0;
      }
      loc.investments[i][2] = false;
    }
    loc.numAngels = 0;
    loc.platinumboost = 17.77;
    $scope.changePlatinum(loc, 0);
    loc.rec = null;
    loc.recTable = [];
    loc.recommendation = '';
    loc.suitExclamation = false;
    loc.totalMoneyPerSecond = 0;
    loc.triples = 0;
    loc.upgradeCosts = [];
    for (var i = 0; i < loc.investments.length; i++) {
      loc.upgradeCosts.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    loc.viewNumAngels = 0;
    $scope.calc(loc);
  };

  function getDifferenceNBonus(loc, index, n) {
    var i = 0,
    retVal = null;
    if (n === null) {
      return null;
    }
    for (; i < loc.unlocks[index].length; i++) {
      if (loc.investments[index][1] < loc.unlocks[index][i][0]) {
        if (i + n - 1 < loc.unlocks[index].length) {
          retVal = loc.unlocks[index][i + n - 1][0];
          break;
        }
      }
    }
    return (retVal === null) ? null : retVal - loc.investments[index][1];
  };

  function getJsonForExport() {
    var retString = '{';
    for (var p in planets) {
      if (p !== '0') {
        retString += ',\r\n';
      }
      retString += formatState($scope[planets[p]]);
    }
    return retString + '}';
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
        if (i < loc.investments.length) {
          k += loc.investments[i][0] + (j && ' Speed ' || ' Profit ') + num;
        } else if (i === loc.investments.length) {
          k += 'All' + (j && ' Speed ' || ' Profit ') + num;
        } else if (i === loc.investments.length + 1) {
          k += 'Angel Investor ' + num;
        } else if (tuple[l][0] >= 30 && tuple[l][0] <= 29 + loc.investments.length) {
          k += '+' + tuple[l][1] + ' ' + loc.investments[tuple[l][0] - 30][0];
        }
      }
    }
    return k;
  };

  function getNextCashIndex(loc, index) {
    index += 1;
    while (index < loc.cashUpgrades.length && tupleIsActive(loc.cashUpgrades[index])) {
      index++;
    }
    if (index === loc.cashUpgrades.length) {
      index = null;
    }
    return index;
  };

  function getNextPositiveUnlock(loc, index) {
    var i = 0,
    retVal = 0;
    for (; i < loc.unlocks[index].length; i++) {
      if (loc.investments[index][1] < loc.unlocks[index][i][0]) {
        retVal++;
        if (loc.unlocks[index][i][1][1] > 1) {
          return retVal;
        }
      }
    }
    return null;
  };

  $scope.getBadgeBonusInfo = function (loc, badge) {
      var ret = '';
      ret += badge[2][1]+'x on ';
      ret += $scope[planets[badge[1]]].investments[badge[2][0] / 2][0];
      if (badge[2][0] % 2 === 1)
          ret += ' Speed';
      return ret;
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
  };

  $scope.isCompare = function() {
    return $scope.compare;
  };

  $scope.isEvent = function() {
    return !$scope.isWorld('potatoes') && !$scope.isWorld('land') && !$scope.isWorld('ore') && !$scope.isWorld('weapons') && !$scope.isWorld('medicine');
  };

  $scope.isWorld = function(world) {
    return $scope.ref == $scope[world];
  };

  function lzf_decode(str) {
    var iidx = 0, oidx = 0, oLen = str.length,
    temp = Array.apply(null, new Array(oLen)).map(Number.prototype.valueOf, 0);
    do {
      var ctrl = str.charCodeAt(iidx++);
      if (ctrl < (1 << 5)) {
        ctrl++;
        while (oidx + ctrl > oLen) {
          oLen++;
          temp.push(String.fromCharCode(0));
        }
        do {
          temp[oidx++] = str.charAt(iidx++);
        } while ((--ctrl) != 0);
      } else {
        var len = ctrl >> 5, reference = oidx - ((ctrl & 0x1f) << 8) - 1;
        if (len == 7) {
          len += str.charCodeAt(iidx++);
        }
        reference -= str.charCodeAt(iidx++);
        while (oidx + len + 2 > oLen) {
          oLen++;
          temp.push(String.fromCharCode(0));
        }
        if (reference < 0) {
          console.log('error');
          return 0;
        }
        temp[oidx++] = temp[reference++];
        do {
          temp[oidx++] = temp[reference++];
        } while ((--len) >= 0);
      }
    } while (iidx < $scope.lzfData.length);
    return temp.join("");
  }

  $scope.loadGame = function(str) {
    var obj = JSON.parse(lzf_decode(atob(str))), i, id = 0;
    for (i in obj.ventures) {
      id = 0; // find the correct id from short somehow
      loc.investments[i][1] = i.numOwned;
      loc.investments[i][2] = i.isBoosted;
    }
    for (i in obj.upgrades) {
      if (i.id.indexOf("_angel_") != -1) {
        id = 0; // find the correct id from short somehow
        loc.angelUpgrades[i][3] = i.purchased;
      } else {
        id = 0; // find the correct id from short somehow
        loc.cashUpgrades[i][2] = i.purchased;
      }
    }
    for (i in obj.upgrades) {
      if (i.id.indexof("_accountant" != -1)) {
        id = 0; // find the correct id from short somehow
        loc.managerUpgrades[id][(i.id.charAt(i.id.length - 1) != '2') ? 0 : 1][1] = i.purchased;
      }
    }
    loc.lifetimeEarnings = obj.totalCash || obj.sessionCash + obj.totalPreviousCash;
    loc.numAngels = obj.angelInvestors;
    loc.sacAngels = obj.angelInvestorsSpent;
    // how to find gold multipliers, flux, bonus angel effectiveness (kong login etc), suits
  };

  $scope.resetPlanet = function(loc) {
    var i = 0;
    for (; i < loc.cashUpgrades.length; i++) {
      loc.cashUpgrades[i][loc.cashUpgrades[i].length - 1] = false;
    }
    for (i = 0; i < loc.angelUpgrades.length; i++) {
      loc.angelUpgrades[i][loc.angelUpgrades[i].length - 1] = false;
    }
    for (i = 0; i < loc.managerUpgrades.length; i++) {
      loc.managerUpgrades[i][0][loc.managerUpgrades[i][0].length - 1] = false;
      if (angular.isDefined(loc.managerUpgrades[i][1])) {
        loc.managerUpgrades[i][1][loc.managerUpgrades[i][1].length - 1] = false;
      }
    }
    loc.angelEffectiveness = 2;
    loc.angelExclamation = false;
    loc.bonusAngelEffectiveness = 0;
    loc.bonusMultiplier = 0;
    for (i = 0; i < loc.investments.length; i++) {
      if (i === 0) {
        loc.investments[i][1] = 1;
      } else {
        loc.investments[i][1] = 0;
      }
    }
    loc.rec = null;
    loc.recTable = [];
    loc.recommendation = '';
    loc.totalMoneyPerSecond = 0;
    loc.upgradeCosts = [];
    for (var i = 0; i <= loc.investments.length; i++) {
      loc.upgradeCosts.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    $scope.calc(loc);
  };

  $scope.selectedAll = function(loc, index) {
    var i = 0;
    if (index === 0) {
      for (i = 0; i < loc.investments.length; i++) {
        loc.investments[i][2] = $scope.selectAll[0];
      }
    } else if (index === 1) {
      for (i = 0; i < loc.managerUpgrades.length; i++) {
        loc.managerUpgrades[i][0][1] = $scope.selectAll[1];
/*        if ($scope.selectAll[2]) {
          $scope.selectAll[2] = false;
        }
        loc.managerUpgrades[i][1][1] = $scope.selectAll[2];*/
      }
    } else if (index === 2) {
      for (i = 0; i < loc.managerUpgrades.length; i++) {
        loc.managerUpgrades[i][1][1] = $scope.selectAll[2];
/*        if ($scope.selectAll[1]) {
          $scope.selectAll[1] = false;
        }
        loc.managerUpgrades[i][0][1] = $scope.selectAll[1];*/
      }
    } else if (index === 3) {
      for (i = 0; i < loc.managerUpgrades.length; i++) {
        loc.managerUpgrades[i][0][1] = $scope.selectAll[3];
      }
    }
  };

  $scope.setWorld = function(planet) {
    $scope.clearAfter = [false, false];
    $scope.fillBefore = [false, false];
    $scope.compare = false;
    $scope.ref = $scope[planet];
    localStorage.setItem('refIndustry', planet);
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
    if ($scope.isWorld('potatoes')) {
      if (row[index][1] === true) {
        row[(index + 1) % 2][1] = false;
      }
    }
  };

  function tupleIsActive(tuple) {
    return tuple[tuple.length - 1];
  };

  $scope.updateAngels = function() {
    updateIllionize('numAngels', 'viewNumAngels', 'illions');
  };

  $scope.updateEarnings = function() {
    updateIllionize('lifetimeEarnings', 'viewLifetimeEarnings', 'angelIllions');
  };

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

  function updateIllionize(varName, viewName, illionsName) {
    if ($scope.ref[illionsName] === '') {
      $scope.ref[varName] = $scope.ref[viewName];
    } else {
      $scope.ref[illionsName] = $scope.ref[illionsName].trim();
      $scope.ref[illionsName] = $scope.ref[illionsName].charAt(0).toUpperCase() + $scope.ref[illionsName].slice(1).toLowerCase();
      var index = $scope.illionsArray.indexOf(' ' + $scope.ref[illionsName]);
      if (index !== -1) {
        $scope.ref[varName] = $scope.ref[viewName] * Math.pow(10, 6 + (index * 3));
      }
    }
  };

  function updateRecString(loc) {
    if (loc.rec[0] === 'all') {
      loc.recommendation = 'Buy all to level ' + loc.rec[1];
    } else if (loc.rec[0] === 'level') {
      loc.recommendation = 'Buy ' + loc.investments[loc.rec[1]][0] + ' to level ' + loc.rec[2] + '.';
    } else {
      loc.recommendation = 'Buy ' + $filter('rec')(loc.recTable[0][0], loc) + ' Cash Upgrade.'
    }
  };

  $scope.updateSacrificedAngels = function() {
    updateIllionize('sacAngels', 'viewSacAngels', 'sacIllions');
  };

  function updateView(loc,varName, viewName, illionsName) {
    if (loc[varName] < Number(1e+6)) {
      loc[viewName] = loc[varName];
      loc[illionsName] = '';
    } else {
      var filtered = numFilter(loc[varName]).split(' ');
      loc[viewName] = Number(filtered[0]);
      loc[illionsName] = filtered[1];
    }
  }

  $scope.updateViewNumAngels = function (loc) {
    updateView(loc,'numAngels', 'viewNumAngels', 'illions');
  };

  function loadDefaults() {
    $scope.land.managerName = 'Workers';
    $scope.land.investments = [
      ['Blasting Sites', 0, false, 0, 0, 0, 0],
      ['Clearcuts', 0, false, 0, 0, 0, 0],
      ['Road', 0, false, 0, 0, 0, 0],
      ['Highway', 0, false, 0, 0, 0, 0],
      ['Super Highway', 0, false, 0, 0, 0, 0]
    ];
    $scope.medicine.managerName = 'Nurses';
    $scope.medicine.investments = [
      ['Ambulances', 0, false, 0, 0, 0, 0],
      ['Field Hospital', 0, false, 0, 0, 0, 0],
      ['Clinic', 0, false, 0, 0, 0, 0],
      ['Hospital', 0, false, 0, 0, 0, 0],
      ['Cloning Lab', 0, false, 0, 0, 0, 0]
    ];
    $scope.ore.managerName = 'Miners';
    $scope.ore.investments = [
      ['Mines', 0, false, 0, 0, 0, 0],
      ['Excavator', 0, false, 0, 0, 0, 0],
      ['Mega Mine', 0, false, 0, 0, 0, 0],
      ['Deep Bore', 0, false, 0, 0, 0, 0],
      ['Mega Drill', 0, false, 0, 0, 0, 0]
    ];
    $scope.potatoes.managerName = 'Farmers';
    $scope.potatoes.investments = [
      ['Communes', 0, false, 0, 0, 0, 0],
      ['Collectives', 0, false, 0, 0, 0, 0],
      ['Plantation', 0, false, 0, 0, 0, 0],
      ['Hive', 0, false, 0, 0, 0, 0],
      ['Colony', 0, false, 0, 0, 0, 0]
    ];
    $scope.weapons.managerName = 'Soldiers';
    $scope.weapons.investments = [
      ['Fireteams', 0, false, 0, 0, 0, 0],
      ['Squad', 0, false, 0, 0, 0, 0],
      ['Platoon', 0, false, 0, 0, 0, 0],
      ['Division', 0, false, 0, 0, 0, 0],
      ['Communist Ideal', 0, false, 0, 0, 0, 0]
    ];
    for (var p in planets) {
      $scope[planets[p]].angelIllions = '';
      $scope[planets[p]].illions = '';
      $scope[planets[p]].name = planets[p];
      $scope[planets[p]].noSingles = false;
      $scope[planets[p]].noTens = false;
      $scope[planets[p]].noHundreds = false;
      $scope[planets[p]].numAngels = 0;
      // $scope[planets[p]].platinum = [];
      // for (var i = 0; i < $scope.platinumboosts.length; i++) {
        // $scope[planets[p]].platinum.push(i === 0 ? [true] : [false]);
      // }
      $scope[planets[p]].rec = null;
      $scope[planets[p]].recTable = [];
      $scope[planets[p]].recommendation = '';
      $scope[planets[p]].sacAngels = 0;
      $scope[planets[p]].sacIllions = '';
      $scope[planets[p]].totalMoneyPerSecond = 0;
      $scope[planets[p]].unlocks = [];
      $scope[planets[p]].viewLifetimeEarnings = 0;
      $scope[planets[p]].viewNumAngels = 0;
      $scope[planets[p]].viewSacAngels = 0;
      $scope[planets[p]].upgradeCosts = [];
      for (var i = 0; i <= $scope[planets[p]].investments.length; i++) {
        $scope[planets[p]].upgradeCosts.push([0, 0, 0, 0, 0, 0, 0, 0]);
        $scope[planets[p]].unlocks.push([]);
      }
    }
  };

  function loadUnlocks() {
    $scope.potatoes.unlocks[0] = [];
    $scope.potatoes.unlocks[1] = [];
    $scope.potatoes.unlocks[2] = [];
    $scope.potatoes.unlocks[3] = [];
    $scope.potatoes.unlocks[4] = [];
    $scope.potatoes.unlocks[5] = [];
    $scope.potatoes.unlocks[6] = [];
    $scope.potatoes.unlocks[7] = [];
    $scope.potatoes.unlocks[8] = [];
    $scope.potatoes.unlocks[9] = [];
    $scope.potatoes.unlocks[10] = [];
    $scope.potatoes.cashUpgrades = [];
    $scope.potatoes.angelUpgrades = [];
    $scope.potatoes.managerUpgrades = [];
    $scope.weapons.unlocks[0] = [];
    $scope.weapons.unlocks[1] = [];
    $scope.weapons.unlocks[2] = [];
    $scope.weapons.unlocks[3] = [];
    $scope.weapons.unlocks[4] = [];
    $scope.weapons.unlocks[5] = [];
    $scope.weapons.unlocks[6] = [];
    $scope.weapons.unlocks[7] = [];
    $scope.weapons.unlocks[8] = [];
    $scope.weapons.unlocks[9] = [];
    $scope.weapons.cashUpgrades = [];
    $scope.weapons.angelUpgrades = [];
    $scope.weapons.managerUpgrades = [];
    $scope.land.unlocks[0] = [];
    $scope.land.unlocks[1] = [];
    $scope.land.unlocks[2] = [];
    $scope.land.unlocks[3] = [];
    $scope.land.unlocks[4] = [];
    $scope.land.unlocks[5] = [];
    $scope.land.unlocks[6] = [];
    $scope.land.unlocks[7] = [];
    $scope.land.unlocks[8] = [];
    $scope.land.unlocks[9] = [];
    $scope.land.unlocks[10] = [];
    $scope.land.cashUpgrades = [];
    $scope.land.angelUpgrades = [];
    $scope.land.managerUpgrades = [];
    $scope.medicine.unlocks[0] = [];
    $scope.medicine.unlocks[1] = [];
    $scope.medicine.unlocks[2] = [];
    $scope.medicine.unlocks[3] = [];
    $scope.medicine.unlocks[4] = [];
    $scope.medicine.unlocks[5] = [];
    $scope.medicine.unlocks[6] = [];
    $scope.medicine.unlocks[7] = [];
    $scope.medicine.unlocks[8] = [];
    $scope.medicine.unlocks[9] = [];
    $scope.medicine.cashUpgrades = [];
    $scope.medicine.angelUpgrades = [];
    $scope.medicine.managerUpgrades = [];
    $scope.ore.unlocks[0] = [];
    $scope.ore.unlocks[1] = [];
    $scope.ore.unlocks[2] = [];
    $scope.ore.unlocks[3] = [];
    $scope.ore.unlocks[4] = [];
    $scope.ore.unlocks[5] = [];
    $scope.ore.unlocks[6] = [];
    $scope.ore.unlocks[7] = [];
    $scope.ore.unlocks[8] = [];
    $scope.ore.unlocks[9] = [];
    $scope.ore.cashUpgrades = [];
    $scope.ore.angelUpgrades = [];
    $scope.ore.managerUpgrades = [];
  };
  loadDefaults();
  loadUnlocks();
}]);
