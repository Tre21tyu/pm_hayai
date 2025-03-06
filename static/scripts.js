function sortAndGroupColumnData(columnData) {
  const trimmedColumnData = columnData.trim();
  const nonBlankLines = trimmedColumnData.split('\n').filter(line => line.trim() !== '');
  const numbers = nonBlankLines.map(Number).filter(num => !isNaN(num));
  const sortedNumbers = numbers.sort((a, b) => a - b);

  const groupedNumbers = [];
  let currentGroup = [];
  let groupMin, groupMax;

  // Handle empty input case
  if (sortedNumbers.length === 0) {
    const outputContainer = document.getElementById('outputData');
    outputContainer.innerHTML = ''; // Clear previous content
    outputContainer.classList.add('show-placeholder');
    return;
  }

  // Initialize first group
  currentGroup = [sortedNumbers[0]];
  groupMin = sortedNumbers[0];
  groupMax = sortedNumbers[0];

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
    num => !groupedNumbers.some(group => group.group.includes(num))
  );

  // Create HTML output
  const outputContainer = document.getElementById('outputData');
  outputContainer.innerHTML = ''; // Clear previous content
  outputContainer.classList.remove('show-placeholder');

  groupedNumbers.forEach((group, index) => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group-container';

    const groupLabel = document.createElement('div');
    groupLabel.className = 'group-label';
    groupLabel.textContent = `Group ${index + 1}:`;
    groupDiv.appendChild(groupLabel);

    // Create button row container
    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';

    // Add the min and max buttons to the button row
    buttonRow.appendChild(createCopyButton(group.min, 'Min'));
    buttonRow.appendChild(createCopyButton(group.max, 'Max'));

    // Add the button row to the group div
    groupDiv.appendChild(buttonRow);

    outputContainer.appendChild(groupDiv);
  });

  // For outliers, we need to handle them differently since they're individual values
  if (outliers.length > 0) {
    const outlierDiv = document.createElement('div');
    outlierDiv.className = 'group-container';

    const outlierLabel = document.createElement('div');
    outlierLabel.className = 'group-label';
    outlierLabel.textContent = 'Outliers:';
    outlierDiv.appendChild(outlierLabel);

    // Create a separate button row for each outlier
    outliers.forEach(outlier => {
      const buttonRow = document.createElement('div');
      buttonRow.className = 'button-row';
      buttonRow.appendChild(createCopyButton(outlier, 'Value'));
      outlierDiv.appendChild(buttonRow);
    });

    outputContainer.appendChild(outlierDiv);
  }
}

  function createCopyButton(value, label) {
  const button = document.createElement('button');
  button.className = 'copy-button';
  button.textContent = `${label}: ${value}`;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(value.toString());

      // Visual feedback
      button.classList.add('copied');
      const originalText = button.textContent;
      button.textContent = 'Copied!';

      setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = originalText;
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });

  return button;
}

document.getElementById('runButton').addEventListener('click', () => {
  const inputData = document.getElementById('inputData').value;
  sortAndGroupColumnData(inputData);
});
//
// Add clipboard paste functionality
document.getElementById('pasteButton').addEventListener('click', async () => {
  try {
    // Read from clipboard
    const clipboardText = await navigator.clipboard.readText();

    // Insert clipboard text into input field
    const inputField = document.getElementById('inputData');
    inputField.value = clipboardText;

    // Automatically run the sorting function
    sortAndGroupColumnData(clipboardText);

    // Provide visual feedback
    const pasteButton = document.getElementById('pasteButton');
    const originalText = pasteButton.textContent;
    pasteButton.textContent = 'Pasted!';

    setTimeout(() => {
      pasteButton.textContent = originalText;
    }, 1500);

  } catch (err) {
    console.error('Failed to read clipboard:', err);
    alert('Unable to access clipboard. Please check your browser permissions.');
  }
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
    runButton: "Find patterns",
    pasteButton: "Paste from clipboard"
  },
  japanese: {
    input: "ここにエクセルから数値を入力する",
    output: "メディマイザーに数字を貼り付ける",
    runButton: "パターンを見つける",
    pasteButton: "クリップボードから貼り付け"
  }
};

// List of fonts to toggle through
const fonts = [
  { name: "'Lato', sans-serif", isJapanese: false },
  { name: "'Arial', sans-serif", isJapanese: false },
  { name: "'Courier New', monospace", isJapanese: false },
  { name: "'Georgia', serif", isJapanese: false },
  { name: "'Comic Sans MS', sans-serif", isJapanese: false },
  { name: "'Noto Sans JP', sans-serif", isJapanese: true }
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
      document.getElementById('outputData').setAttribute('data-placeholder', placeholders.japanese.output);
      document.getElementById('runButton').textContent = placeholders.japanese.runButton;
      document.getElementById('pasteButton').textContent = placeholders.japanese.pasteButton;
    } else {
      headerSpan.textContent = 'Ez';
      headerText.innerHTML = '<span class="ez-highlight">Ez</span> MM Work Order Entry';

      // Restore English placeholders
      document.getElementById('inputData').placeholder = placeholders.english.input;
      document.getElementById('outputData').setAttribute('data-placeholder', placeholders.english.output);
      document.getElementById('runButton').textContent = placeholders.english.runButton;
      document.getElementById('pasteButton').textContent = placeholders.english.pasteButton;
    }
  }
}, true);

// Store default placeholders
const defaultPlaceholders = {
  inputData: "Paste data from excel, or enter one number per line",
  outputData: "Use the Reassign WO fn in medimizer to make for speedy work order reassignment"
};

// Initialize placeholders on page load (modified to keep placeholders visible)
document.addEventListener('DOMContentLoaded', () => {
  // Make sure output container shows placeholder initially
  const outputContainer = document.getElementById('outputData');
  outputContainer.classList.add('show-placeholder');

  // Keep placeholders visible by default
  const helpTextToggle = document.getElementById('helpTextToggle');
  helpTextToggle.checked = true; // Check the toggle by default
});

// Toggle help text functionality
document.getElementById('helpTextToggle').addEventListener('change', (event) => {
  const inputTextarea = document.getElementById('inputData');
  const outputContainer = document.getElementById('outputData');

  if (!event.target.checked) {
    inputTextarea.placeholder = '';
    outputContainer.setAttribute('data-placeholder', '');
    outputContainer.classList.remove('show-placeholder');
  } else {
    inputTextarea.placeholder = defaultPlaceholders.inputData;
    outputContainer.setAttribute('data-placeholder', defaultPlaceholders.outputData);
    // Only show placeholder if there's no content
    if (outputContainer.innerHTML.trim() === '') {
      outputContainer.classList.add('show-placeholder');
    }
  }
});

// Help video functionality
document.getElementById('needHelp').addEventListener('click', (event) => {
  event.preventDefault();
  const videoContainer = document.getElementById('videoContainer');
  const videoFrame = document.getElementById('videoFrame');

  // Create and set up iframe
  videoFrame.innerHTML = `
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/1KrVpgcdPqk"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  videoContainer.classList.remove('d-none');
});

// Close video functionality
document.querySelector('.close-video').addEventListener('click', () => {
  const videoContainer = document.getElementById('videoContainer');
  const videoFrame = document.getElementById('videoFrame');
  videoFrame.innerHTML = ''; // Remove iframe content
  videoContainer.classList.add('d-none');
});
