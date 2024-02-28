import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedButton(props) {
    const {behind, front, under} = props;
    let {styles} = props;
    const [pressed, setPressed] = useState(false);
    if (typeof styles === "function") {
        styles = styles(pressed);
    }

    return (
        <View style={[ styles.cells,
                        {flexDirection: "column"}]}>
            <AnimatedPressable
                {...props}
                onTouchStart= {() => setPressed(true)}
                onTouchEnd={() => setPressed(false)}
                onTouchCancel={() => setPressed(false)}
                delayLongPress={props.delayLongPress ? props.delayLongPress : 500}
                style={ styles.button }>
                <View style={{flexDirection: "column"}}>
                    <View>
                        {behind}
                    </View>
                    {props.frontResponsive 
                        ? front(styles.front) 
                        : front}
                </View>
            </AnimatedPressable>
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