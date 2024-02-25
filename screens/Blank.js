import { useTheme } from "@react-navigation/native"
import {SafeAreaView, Text} from "react-native"

export default function Blank({navigation, pages}) {
    const {colors, fonts} = useTheme();
    return (
        <SafeAreaView>
            <Text style={fontFamily = fonts.bold}>Blank</Text>
        </SafeAreaView>
    )
}