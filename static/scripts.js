function sortAndGroupColumnData(columnData) {
  const trimmedColumnData = columnData.trim();
  const nonBlankLines = trimmedColumnData.split('\n').filter(line => line.trim() !== '');
  const numbers = nonBlankLines.map(Number).filter(num => !isNaN(num));
  const sortedNumbers = numbers.sort((a, b) => a - b);

  const groupedNumbers = [];
  let currentGroup = [sortedNumbers[0]];
  let groupMin = sortedNumbers[0];
  let groupMax = sortedNumbers[0];

  for (let i = 1; i < sortedNumbers.length; i++) {
    if (sortedNumbers[i] === currentGroup[currentGroup.length - 1] + 1) {
      currentGroup.push(sortedNumbers[i]);
      groupMax = sortedNumbers[i];
    } else {
      groupedNumbers.push({ group: currentGroup, min: groupMin, max: groupMax });
      currentGroup = [sortedNumbers[i]];
      groupMin = sortedNumbers[i];
      groupMax = sortedNumbers[i];
    }
  }

  if (currentGroup.length > 0) {
    groupedNumbers.push({ group: currentGroup, min: groupMin, max: groupMax });
  }

  const outliers = sortedNumbers.filter(
    num => !groupedNumbers.flat().some(group => group.group.includes(num))
  );

  const result = groupedNumbers
    .filter(group => !outliers.some(outlier => group.group.includes(outlier)))
    .map((group, index) => `Group ${index + 1}: [${group.min}, ${group.max}]`);

  if (outliers.length > 0) {
    result.push(`Outlier: [${outliers.join(', ')}]`);
  }

  return result.join('\n');
}

document.getElementById('runButton').addEventListener('click', () => {
  const inputData = document.getElementById('inputData').value;
  const outputData = sortAndGroupColumnData(inputData);
  document.getElementById('outputData').value = outputData;
});

// Use event delegation for mouseenter animation
document.addEventListener('mouseenter', (event) => {
  const element = event.target.closest('.ez-highlight');
  if (element) {
    // Add the animation class
    element.style.animation = 'ezScaleOut 1.1s ease-in-out forwards';

    // Remove the animation class after the animation duration
    element.addEventListener('animationend', () => {
      element.style.animation = '';
    }, { once: true });
  }
}, true);

// Create a map for placeholders
const placeholders = {
  english: {
    input: "Paste data from excel, or enter one number per line",
    output: "Medimizer data will appear here",
    runButton: "パターンを見つける"
  },
  japanese: {
    input: "ここにエクセルから数値を入力する",
    output: "メディマイザーに数字を貼り付ける",
    runButton: "パターンを見つける"
  }
};

// List of fonts to toggle through
const fonts = [
  { name: "'Comic Sans MS', sans-serif", isJapanese: false },
  { name: "'Lato', sans-serif", isJapanese: false },
  { name: "'Arial', sans-serif", isJapanese: false },
  { name: "'Courier New', monospace", isJapanese: false },
  { name: "'Georgia', serif", isJapanese: false },
  { name: "'Noto Sans JP', sans-serif", isJapanese: true },
];

// Track the application mode
let isJapaneseMode = false;
let currentFontIndex = 0;

// Use event delegation for click events
document.addEventListener('click', (event) => {
  const element = event.target.closest('.ez-header .ez-highlight');
  if (element) {
    // Toggle through fonts
    currentFontIndex = (currentFontIndex + 1) % fonts.length;

    // Check if we've reached a Japanese font
    if (fonts[currentFontIndex].isJapanese) {
      isJapaneseMode = true;
    } else if (isJapaneseMode) {
      // If we're in Japanese mode and hit a non-Japanese font, exit Japanese mode
      isJapaneseMode = false;
    }

    // Apply the new font to the page
    const newFont = fonts[currentFontIndex].name;
    document.documentElement.style.fontFamily = newFont;
    document.body.style.fontFamily = newFont;

    // Update header text and mode
    const headerSpan = document.querySelector('.ez-header .ez-highlight');
    const headerText = document.querySelector('.ez-header');
    if (isJapaneseMode) {
      headerSpan.textContent = '早い';
      headerText.innerHTML = '<span class="ez-highlight">早い</span>ピーエム整理ツール';

      // Update placeholders
      document.getElementById('inputData').placeholder = placeholders.japanese.input;
      document.getElementById('outputData').placeholder = placeholders.japanese.output;
      document.getElementById('runButton').textContent = 'パターンを見つける'; // Change button text
    } else {
      headerSpan.textContent = 'Ez';
      headerText.innerHTML = '<span class="ez-highlight">Ez</span> MM Work Order Entry';

      // Restore English placeholders
      document.getElementById('inputData').placeholder = placeholders.english.input;
      document.getElementById('outputData').placeholder = placeholders.english.output;
      document.getElementById('runButton').textContent = 'Run Function'; // Restore original button text
    } 
  }
}, true);
