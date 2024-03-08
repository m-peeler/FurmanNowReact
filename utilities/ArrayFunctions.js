export default function arrayPartition(arr, partitionOn) {
  const partitions = {};
  let lenPartitions = 0;

  arr.forEach((element) => {
    let partitionVal;

    if (typeof partitionOn === 'string') {
      partitionVal = element[partitionOn];
    } else if (typeof partitionOn === 'function') {
      partitionVal = partitionOn(element);
    }

    if (partitionVal in partitions) {
      partitions[partitionVal].push(element);
    } else {
      partitions[partitionVal] = [element];
      lenPartitions += 1;
    }
  });
  return lenPartitions > 0 ? partitions : null;
}
