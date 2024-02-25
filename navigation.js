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


const Stack = createNativeStackNavigator();

const pages = [
    { id: 1, name: "Contact", page: "Contact", icon: "./assets/images/icon.png"},
    { id: 2, name: "Athletics", page: "Athletics", icon: "./assets/images/icon.png"},
    { id: 3, name: "Hours", page: "Hours", icon: "./assets/images/icon.png"},
    { id: 4, name: "Menus", page: "Menus", icon: "./assets/images/icon.png"},
    { id: 5, name: "Events", page: "Events", icon: "./assets/images/icon.png"},
    { id: 6, name: "Map", page: "Map", icon: "./assets/images/icon.png"},
    { id: 7, name: "Transit", page: "Transit", icon: "./assets/images/icon.png"},
    { id: 8, name: "Health", page: "Health", icon: "./assets/images/icon.png"},
    { id: 9, name: "Dates", page: "Dates", icon: "./assets/images/icon.png"},
]

const pageComponents = {
    "Contact" : Contacts,
    "Athletics": Athletics,
    "Hours": Hours,
    "Menus": Blank,
    "Events": Events,
    "Map": Blank,
    "Transit": Blank,
    "Health": Health,
    "Dates": Dates,
}

const news = [
    { id: 101, name: "The Paladin", page: "The Paladin", icon: "./assets/images/icon.png"},
    { id: 102, name: "FUNC", page: "FUNC", icon: "./assets/images/icon.png"},
    { id: 103, name: "The Echo", page: "The Echo", icon: "./assets/images/icon.png"},
    { id: 104, name: "Christo et Doctrinae", page: "Christo et Doctrinae", icon: "./assets/images/icon.png"},
    { id: 105, name: "President's Page", page: "President's Page", icon: "./assets/images/icon.png"},
    { id: 106, name: "In the News", page: "In the News", icon: "./assets/images/icon.png"},
]

const newsComponents = {
    "The Paladin": Blank,
    "FUNC": Blank,
    "The Echo": Blank,
    "Christo et Doctrinae": Blank,
    "President's Page": Blank,
    "In the News": Blank,
}


export default function Navigation(props) {
    const {colors} = useTheme();
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
                    fontFamily: "Abril Fatface Italic"
                }}}>
                <Stack.Screen name="Home" 
                    component={HomeScreen} 
                    initialParams={{pages: pages}}
                    options={{title: "Home"}}/>
                <Stack.Screen name="Feed" 
                    component={Feed} 
                    initialParams={{pages: news}}
                    options={{title: "News"}} />
                {pages.map(page =>
                        <Stack.Screen 
                            name={page.name}
                            component={pageComponents[page.page]}
                            key={page.id}
                            options={{
                                title: page.name
                            }}
                        />
                )}
                {news.map(page =>
                        <Stack.Screen
                            name={page.name}
                            component={newsComponents[page.page]}
                            key={page.id}
                            options={{title: page.name}}
                        />
                )}
            </Stack.Group>
        </Stack.Navigator>
    )
}
