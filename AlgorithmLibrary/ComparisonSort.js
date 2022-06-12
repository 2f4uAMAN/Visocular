function ComparisonSort(am, w, h) {
  this.init(am, w, h);
}

var ARRAY_SIZE_SMALL = 50;
var ARRAY_WIDTH_SMALL = 17;
var ARRAY_BAR_WIDTH_SMALL = 10;
var ARRAY_INITIAL_X_SMALL = 15;

var ARRAY_Y_POS = 250;
var ARRAY_LABEL_Y_POS = 260;

var LOWER_ARRAY_Y_POS = 500;
var LOWER_ARRAY_LABEL_Y_POS = 510;

var SCALE_FACTOR = 2.0;

var ARRAY_SIZE_LARGE = 200;
var ARRAY_WIDTH_LARGE = 4;
var ARRAY_BAR_WIDTH_LARGE = 2;
var ARRAY_INITIAL_X_LARGE = 15;

var BAR_FOREGROUND_COLOR = "#0000FF";
var BAR_BACKGROUND_COLOR = "#AAAAFF";
var INDEX_COLOR = "#0000FF";
var HIGHLIGHT_BAR_COLOR = "#FF0000";
var HIGHLIGHT_BAR_BACKGROUND_COLOR = "#FFAAAA";

// var QUICKSORT_LINE_COLOR = "#FF0000";

ComparisonSort.prototype = new Algorithm();
ComparisonSort.prototype.constructor = ComparisonSort;
ComparisonSort.superclass = Algorithm.prototype;

ComparisonSort.prototype.init = function (am, w, h) {
  var sc = ComparisonSort.superclass;
  var fn = sc.init;
  fn.call(this, am);
  this.addControls();
  this.nextIndex = 0;

  this.setArraySize(true);
  this.arrayData = new Array(ARRAY_SIZE_LARGE);
  this.arraySwap = new Array(ARRAY_SIZE_LARGE);
  this.labelsSwap = new Array(ARRAY_SIZE_LARGE);
  this.objectsSwap = new Array(ARRAY_SIZE_LARGE);

  this.createVisualObjects();
};

ComparisonSort.prototype.addControls = function () {
  this.resetButton = addControlToAlgorithmBar("Button", "Randomize Array");
  this.resetButton.onclick = this.resetCallback.bind(this);

  this.insertSortButton = addControlToAlgorithmBar("Button", "Insertion Sort");
  this.insertSortButton.onclick = this.insertSortCallback.bind(this);

  this.selectSortButton = addControlToAlgorithmBar("Button", "Selection Sort");
  this.selectSortButton.onclick = this.selectSortCallback.bind(this);

  this.bubbleSortButton = addControlToAlgorithmBar("Button", "Bubble Sort");
  this.bubbleSortButton.onclick = this.bubbleSortCallback.bind(this);

  // this.quickSortButton = addControlToAlgorithmBar("Button", "Quick Sort");
  // this.quickSortButton.onclick = this.quickSortCallback.bind(this);

  // this.mergeSortButton = addControlToAlgorithmBar("Button", "Merge Sort");
  // this.mergeSortButton.onclick = this.mergeSortCallback.bind(this);

  // this.shellSortButton = addControlToAlgorithmBar("Button", "Shell Sort");
  // this.shellSortButton.onclick = this.shellSortCallback.bind(this);

  this.sizeButton = addControlToAlgorithmBar("Button", "Change Size");
  this.sizeButton.onclick = this.changeSizeCallback.bind(this);
};

ComparisonSort.prototype.setArraySize = function (small) {
  if (small) {
    this.array_size = ARRAY_SIZE_SMALL;
    this.array_width = ARRAY_WIDTH_SMALL;
    this.array_bar_width = ARRAY_BAR_WIDTH_SMALL;
    this.array_initial_x = ARRAY_INITIAL_X_SMALL;
    this.array_y_pos = ARRAY_Y_POS;
    this.array_label_y_pos = ARRAY_LABEL_Y_POS;
    this.showLabels = true;
  } else {
    this.array_size = ARRAY_SIZE_LARGE;
    this.array_width = ARRAY_WIDTH_LARGE;
    this.array_bar_width = ARRAY_BAR_WIDTH_LARGE;
    this.array_initial_x = ARRAY_INITIAL_X_LARGE;
    this.array_y_pos = ARRAY_Y_POS;
    this.array_label_y_pos = ARRAY_LABEL_Y_POS;
    this.showLabels = false;
  }
};

ComparisonSort.prototype.resetAll = function (small) {
  this.animationManager.resetAll();
  this.setArraySize(!small);
  this.nextIndex = 0;
  this.createVisualObjects();
};

ComparisonSort.prototype.randomizeArray = function () {
  this.commands = new Array();
  for (var i = 0; i < this.array_size; i++) {
    this.arrayData[i] = Math.floor(1 + Math.random() * 99);
    this.oldData[i] = this.arrayData[i];
    if (this.showLabels) {
      this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
    } else {
      this.cmd("SetText", this.barLabels[i], "");
    }
    this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);
  }
  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
};

ComparisonSort.prototype.swap = function (index1, index2) {
  var tmp = this.arrayData[index1];
  this.arrayData[index1] = this.arrayData[index2];
  this.arrayData[index2] = tmp;

  tmp = this.barObjects[index1];
  this.barObjects[index1] = this.barObjects[index2];
  this.barObjects[index2] = tmp;

  tmp = this.barLabels[index1];
  this.barLabels[index1] = this.barLabels[index2];
  this.barLabels[index2] = tmp;

  this.cmd(
    "Move",
    this.barObjects[index1],
    this.barPositionsX[index1],
    this.array_y_pos
  );
  this.cmd(
    "Move",
    this.barObjects[index2],
    this.barPositionsX[index2],
    this.array_y_pos
  );
  this.cmd(
    "Move",
    this.barLabels[index1],
    this.barPositionsX[index1],
    this.array_label_y_pos
  );
  this.cmd(
    "Move",
    this.barLabels[index2],
    this.barPositionsX[index2],
    this.array_label_y_pos
  );
  this.cmd("Step");
};

ComparisonSort.prototype.createVisualObjects = function () {
  this.barObjects = new Array(this.array_size);
  this.oldBarObjects = new Array(this.array_size);
  this.oldbarLabels = new Array(this.array_size);

  this.barLabels = new Array(this.array_size);
  this.barPositionsX = new Array(this.array_size);
  this.oldData = new Array(this.array_size);
  this.obscureObject = new Array(this.array_size);

  var xPos = this.array_initial_x;
  var yPos = this.array_y_pos;
  var yLabelPos = this.array_label_y_pos;

  this.commands = new Array();
  for (var i = 0; i < this.array_size; i++) {
    xPos = xPos + this.array_width;
    this.barPositionsX[i] = xPos;
    this.cmd(
      "CreateRectangle",
      this.nextIndex,
      "",
      this.array_bar_width,
      200,
      xPos,
      yPos,
      "center",
      "bottom"
    );
    this.cmd("SetForegroundColor", this.nextIndex, BAR_FOREGROUND_COLOR);
    this.cmd("SetBackgroundColor", this.nextIndex, BAR_BACKGROUND_COLOR);
    this.barObjects[i] = this.nextIndex;
    this.oldBarObjects[i] = this.barObjects[i];
    this.nextIndex += 1;
    if (this.showLabels) {
      this.cmd("CreateLabel", this.nextIndex, "99", xPos, yLabelPos);
    } else {
      this.cmd("CreateLabel", this.nextIndex, "", xPos, yLabelPos);
    }
    this.cmd("SetForegroundColor", this.nextIndex, INDEX_COLOR);

    this.barLabels[i] = this.nextIndex;
    this.oldbarLabels[i] = this.barLabels[i];
    ++this.nextIndex;
  }
  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.randomizeArray();
  for (i = 0; i < this.array_size; i++) {
    this.obscureObject[i] = false;
  }
  this.lastCreatedIndex = this.nextIndex;
};

ComparisonSort.prototype.highlightRange = function (lowIndex, highIndex) {
  for (var i = 0; i < lowIndex; i++) {
    if (!this.obscureObject[i]) {
      this.obscureObject[i] = true;
      this.cmd("SetAlpha", this.barObjects[i], 0.08);
      this.cmd("SetAlpha", this.barLabels[i], 0.08);
    }
  }
  for (i = lowIndex; i <= highIndex; i++) {
    if (this.obscureObject[i]) {
      this.obscureObject[i] = false;
      this.cmd("SetAlpha", this.barObjects[i], 1.0);
      this.cmd("SetAlpha", this.barLabels[i], 1.0);
    }
  }
  for (i = highIndex + 1; i < this.array_size; i++) {
    if (!this.obscureObject[i]) {
      this.obscureObject[i] = true;
      this.cmd("SetAlpha", this.barObjects[i], 0.08);
      this.cmd("SetAlpha", this.barLabels[i], 0.08);
    }
  }
};

ComparisonSort.prototype.reset = function () {
  for (var i = 0; i < this.array_size; i++) {
    this.arrayData[i] = this.oldData[i];
    this.barObjects[i] = this.oldBarObjects[i];
    this.barLabels[i] = this.oldbarLabels[i];
    if (this.showLabels) {
      this.cmd("SetText", this.barLabels[i], this.arrayData[i]);
    } else {
      this.cmd("SetText", this.barLabels[i], "");
    }
    this.cmd("SetHeight", this.barObjects[i], this.arrayData[i] * SCALE_FACTOR);
  }
  this.commands = new Array();
};

ComparisonSort.prototype.resetCallback = function (event) {
  this.randomizeArray();
};

ComparisonSort.prototype.changeSizeCallback = function (event) {
  this.resetAll(this.showLabels);
};

ComparisonSort.prototype.insertSortCallback = function (event) {
  this.animationManager.clearHistory();
  this.commands = new Array();
  this.insertionSortSkip(1, 0);
  this.animationManager.StartNewAnimation(this.commands);
  this.commands = new Array();
};

ComparisonSort.prototype.selectSortCallback = function (event) {
  this.commands = new Array();
  this.animationManager.clearHistory();

  for (var i = 0; i < this.array_size - 1; i++) {
    var smallestIndex = i;
    this.cmd(
      "SetForegroundColor",
      this.barObjects[smallestIndex],
      HIGHLIGHT_BAR_COLOR
    );
    this.cmd(
      "SetBackgroundColor",
      this.barObjects[smallestIndex],
      HIGHLIGHT_BAR_BACKGROUND_COLOR
    );
    for (var j = i + 1; j < this.array_size; j++) {
      this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[j],
        HIGHLIGHT_BAR_BACKGROUND_COLOR
      );
      this.cmd("Step");
      if (this.arrayData[j] < this.arrayData[smallestIndex]) {
        this.cmd(
          "SetForegroundColor",
          this.barObjects[smallestIndex],
          BAR_FOREGROUND_COLOR
        );
        this.cmd(
          "SetBackgroundColor",
          this.barObjects[smallestIndex],
          BAR_BACKGROUND_COLOR
        );
        smallestIndex = j;
      } else {
        this.cmd(
          "SetForegroundColor",
          this.barObjects[j],
          BAR_FOREGROUND_COLOR
        );
        this.cmd(
          "SetBackgroundColor",
          this.barObjects[j],
          BAR_BACKGROUND_COLOR
        );
      }
    }
    if (smallestIndex != i) {
      this.swap(smallestIndex, i);
    }
    this.cmd("SetForegroundColor", this.barObjects[i], BAR_FOREGROUND_COLOR);
    this.cmd("SetBackgroundColor", this.barObjects[i], BAR_BACKGROUND_COLOR);
  }
  this.animationManager.StartNewAnimation(this.commands);
};
ComparisonSort.prototype.bubbleSortCallback = function (event) {
  this.animationManager.clearHistory();

  this.commands = new Array();
  for (var i = this.array_size - 1; i > 0; i--) {
    for (var j = 0; j < i; j++) {
      this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[j],
        HIGHLIGHT_BAR_BACKGROUND_COLOR
      );

      this.cmd(
        "SetForegroundColor",
        this.barObjects[j + 1],
        HIGHLIGHT_BAR_COLOR
      );
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[j + 1],
        HIGHLIGHT_BAR_BACKGROUND_COLOR
      );
      this.cmd("Step");
      if (this.arrayData[j] > this.arrayData[j + 1]) {
        this.swap(j, j + 1);
      }
      this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
      this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);

      this.cmd(
        "SetForegroundColor",
        this.barObjects[j + 1],
        BAR_FOREGROUND_COLOR
      );
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[j + 1],
        BAR_BACKGROUND_COLOR
      );
    }
  }
  this.animationManager.StartNewAnimation(this.commands);
};
ComparisonSort.prototype.quickSortCallback = function (event) {
  this.animationManager.clearHistory();

  this.commands = new Array();
  this.iID = this.nextIndex++;
  this.jID = this.nextIndex++;
  this.cmd(
    "CreateLabel",
    this.iID,
    "i",
    this.barObjects[0],
    this.array_label_y_pos + 20
  );
  this.cmd(
    "CreateLabel",
    this.jID,
    "j",
    this.barObjects[this.array_size - 1],
    this.array_label_y_pos + 20
  );
  this.cmd("SetForegroundColor", this.iID, HIGHLIGHT_BAR_COLOR);
  this.cmd("SetBackgroundColor", this.iID, HIGHLIGHT_BAR_BACKGROUND_COLOR);
  this.cmd("SetForegroundColor", this.jID, HIGHLIGHT_BAR_COLOR);
  this.cmd("SetBackgroundColor", this.jID, HIGHLIGHT_BAR_BACKGROUND_COLOR);
  this.doQuickSort(0, this.array_size - 1);
  this.cmd("Delete", this.iID);
  this.cmd("Delete", this.jID);
  this.animationManager.StartNewAnimation(this.commands);
};

ComparisonSort.prototype.insertionSortSkip = function (inc, offset) {
  for (var i = inc + offset; i < this.array_size; i = i + inc) {
    var j = i;
    while (j > inc - 1) {
      this.cmd("SetForegroundColor", this.barObjects[j], HIGHLIGHT_BAR_COLOR);
      this.cmd(
        "SetForegroundColor",
        this.barObjects[j - inc],
        HIGHLIGHT_BAR_COLOR
      );
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[j],
        HIGHLIGHT_BAR_BACKGROUND_COLOR
      );
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[j - inc],
        HIGHLIGHT_BAR_BACKGROUND_COLOR
      );
      this.cmd("Step");
      if (this.arrayData[j - inc] <= this.arrayData[j]) {
        this.cmd(
          "SetForegroundColor",
          this.barObjects[j],
          BAR_FOREGROUND_COLOR
        );
        this.cmd(
          "SetForegroundColor",
          this.barObjects[j - inc],
          BAR_FOREGROUND_COLOR
        );
        this.cmd(
          "SetBackgroundColor",
          this.barObjects[j],
          BAR_BACKGROUND_COLOR
        );
        this.cmd(
          "SetBackgroundColor",
          this.barObjects[j - inc],
          BAR_BACKGROUND_COLOR
        );
        break;
      }
      this.swap(j, j - inc);
      this.cmd("SetForegroundColor", this.barObjects[j], BAR_FOREGROUND_COLOR);
      this.cmd(
        "SetForegroundColor",
        this.barObjects[j - inc],
        BAR_FOREGROUND_COLOR
      );
      this.cmd("SetBackgroundColor", this.barObjects[j], BAR_BACKGROUND_COLOR);
      this.cmd(
        "SetBackgroundColor",
        this.barObjects[j - inc],
        BAR_BACKGROUND_COLOR
      );
      j = j - inc;
    }
  }
};

ComparisonSort.prototype.disableUI = function (event) {
  this.resetButton.disabled = true;
  this.insertSortButton.disabled = true;
  this.selectSortButton.disabled = true;
  this.bubbleSortButton.disabled = true;
  this.sizeButton.disabled = true;
};
ComparisonSort.prototype.enableUI = function (event) {
  this.resetButton.disabled = false;
  this.insertSortButton.disabled = false;
  this.selectSortButton.disabled = false;
  this.bubbleSortButton.disabled = false;
  this.sizeButton.disabled = false;
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new ComparisonSort(animManag, canvas.width, canvas.height);
}
