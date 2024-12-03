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
