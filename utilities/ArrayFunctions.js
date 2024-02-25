export default function arrayPartition(arr, partitionOn) {
    let partitions = {};

    arr.forEach((element) => {
        let partitionVal;

        if (typeof partitionOn == "string") {
            partitionVal = element[partitionOn];
        } else if (typeof partitionOn == "function") {
            partitionVal = partitionOn(element);
        }

        if (partitionVal in partitions) {
            partitions[partitionVal].push(element);
        } else {
            partitions[partitionVal] = [element];
        }
    })

    return partitions;
}