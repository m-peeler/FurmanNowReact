import Feed from "./screens/Feed";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Blank from "./screens/Blank";
import Contacts from "./screens/Contacts";
import { useTheme } from "@react-navigation/native";
import Events from "./screens/Events";
import Dates from "./screens/Dates";
import Athletics from "./screens/Athletics";
import Hours from "./screens/Hours";
import Health from "./screens/Health";
import Transit from "./screens/Transit";
import Map from "./screens/Map";


const Stack = createNativeStackNavigator();

class Page {
    constructor(id, name, {icon=defaultIcon, category = "None", showName=true}) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.category = category;
        this.showName = showName;
    }
}

const defaultIcon = "./assets/images/icon.png";
const catHome = "Home Screen";
const catNews = "News Sources";
const pages = [
    [new Page(1, "Contact", {category: catHome}), Contacts],
    [new Page(2, "Athletics", {category: catHome}),  Athletics],
        [new Page(21, "Athletics-More-Info", {showName: false}),  Blank],
    [new Page(3, "Hours", {category: catHome}),  Hours],
        [new Page(31, "Hours-More-Info", {showName: false}),  Blank],
    [new Page(4, "Dining", {category: catHome}),  Blank],
        [new Page(41, "Dining-More-Info", {showName: false}),  Blank],
    [new Page(5, "Events", {category: catHome}),  Events],
        [new Page(51, "Events-More-Info", {showName: false}),  Blank],
    [new Page(6, "Map", {category: catHome}),  Map],
    [new Page(7, "Transit", {category: catHome}),  Transit],
    [new Page(8, "Health", {category: catHome}),  Health],
    [new Page(9, "Dates", {category: catHome}),  Dates],

        [new Page(101, "The Paladin", {category: catNews}),  Blank],
        [new Page(102, "FUNC", {category: catNews}),  Blank],
        [new Page(103, "The Echo", {category: catNews}),  Blank],
        [new Page(104, "Christo et Doctrinae", {category: catNews}),  Blank],
        [new Page(105, "President's Page", {category: catNews}),  Blank],
        [new Page(106, "In the News", {category: catNews}),  Blank],
]

export default function Navigation(props) {
    const {colors, fonts} = useTheme();
    console.log(colors);
    return (
        <Stack.Navigator
            initialRouteName="Home">
            <Stack.Group
                screenOptions={{        
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 30,
                    fontFamily: fonts.heading
                }}}>
                <Stack.Screen name="Home" 
                    component={HomeScreen} 
                    initialParams={{pages: 
                        pages.filter(([page, c]) => page.category == catHome)
                            .map(([page, c]) => page)
                    }}
                    options={{title: "Home"}}/>
                <Stack.Screen name="Feed" 
                    component={Feed} 
                    initialParams={{pages: 
                        pages.filter(([page, c]) => page.category == catNews)
                            .map(([page, c]) => page)    
                    }}
                    options={{title: "News"}} />
                {pages.map(page =>
                        <Stack.Screen 
                            name={page[0].name}
                            component={page[1]}
                            key={page[0].id}
                            options={{
                                title: page[0].showName ? page[0].name : ""
                            }}
                        />
                )}
            </Stack.Group>
        </Stack.Navigator>
    )
}
