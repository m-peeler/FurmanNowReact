import {SafeAreaView, View, StyleSheet} from "react-native"

function splitLists(list, perRow) {
    let twoDList = [];
    for (let i = 0; i < list.length; i++){
        let rem = i % perRow;
        if (rem == 0){ 
            twoDList.push([list[i]])
        } else {
            twoDList[(i - rem)/perRow].push(list[i])
        }
    }
    return twoDList;
}

export default function ButtonGrid({buttonList, perRow}){
    console.log("Button List:");
    console.log(buttonList);
    console.log(perRow);
    const sepPages = splitLists(buttonList, perRow)
    return (
        <SafeAreaView style={styles.container}>
            {sepPages.map((rowButtons) =>
                <View style={{flexDirection: "row"}}>
                    {rowButtons}
                </View>
                )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containers: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#321e3f",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 70,
        paddingHorizontal: 50,
        paddingBottom: 20,
        boxSizing: "border-box",
    }
})