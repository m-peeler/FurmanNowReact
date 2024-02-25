import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";


export default function Button(props) {
    const {behind, front, under, onPress, onLongPress, accessibilityLabel, accessibilityHint} = props;
    let {styles, delayLongPress} = props;
    const {colors, fonts} = useTheme();
    if (styles.button == undefined) {
        styles = {button: {color: colors.text}}
    }
    delayLongPress = delayLongPress ? delayLongPress : 500;

    const [pressed, setPressed] = useState(false);

    return (
        <View style={[ styles.cells,
                        {flexDirection: "column"}]}>
            <Pressable
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                onTouchStart= {() => setPressed(true)}
                onTouchEnd={() => setPressed(false)}
                onTouchCancel={() => {setPressed(false)}}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={delayLongPress}
                style={[
                    styles.button,
                    {
                        backgroundColor: styles.button.backgroundColor(pressed),
                        cornerRadius: styles.button.borderRadius
                    },
                ]}>
                <View style={{flexDirection: "column"}}>
                    <View>
                        {behind}
                    </View>
                    {props.frontResponsive 
                        ? front(pressed) 
                        : front}
                </View>
            </Pressable>
            {under}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
    },
    center: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    behind: {
        alignItems: "center",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
    },
})

const buttonStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
    },
    wrapperCustom: {
        borderRadius: 16,
        padding:6
    }, 
    logBox: {
        padding: 5,
        margin: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e21aef",
        backgroundColor: "#e21aef"
    },
});