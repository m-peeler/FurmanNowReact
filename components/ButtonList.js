import {View} from "react-native";
import {FlashList} from "@shopify/flash-list";

export default function ButtonList(props) {
    const {data, sorter, style} = props;
    delete props["data"];
    delete props["sorter"];
    delete props["style"];
    return (
        <View style={style.bounding}>
            <FlashList
                {...props}
                data={sorter(data)}
            />
        </View>
    )
}