
const palette = {
    furmanMidnightPurple: "#201537",
    furmanPurple: "#582C83",
    furmanGray: "#54585a",
    furmanWhite: "#FFFFFF",
    furmanCompBlue: "#AADEEB",
    furmanCompRed: "#E3322B",
    furmanCompYellow: "#F2BE1A",
    furmanCompGreen: "#669933",

    cloudyPurple: "#E7D6F1",
    lightPurple: "#8442c0",
    midPurple: "#813fb1",
    black: "#110017"
};

const CommonTheme = {
    fonts: {
        heading: "Abril Fatface Italic",
        bold: "BarlowSCSB",
        regular: "BarlowSCR",
        italic: "BarlowSCI",
        thin: "BarlowSCT"
    },
    colors: {
        emergency: palette.furmanCompRed,
        emergencyText: palette.black,
        positive: palette.furmanCompGreen,
        negative: palette.furmanCompRed,
    }
}

const DefaultTheme = {
    dark: false,
    fonts: CommonTheme.fonts,
    colors: {
        ...CommonTheme.colors,
        primary: palette.midPurple,
        background: palette.furmanWhite,
        card: palette.cloudyPurple,
        text: palette.black,
        accentCard: palette.lightPurple,
        accentText: palette.furmanPurple,
        emergencyText: palette.black,
        border: palette.furmanCompYellow,
        notification: palette.furmanCompBlue,
        notificationText: palette.furmanWhite
    },
};

const DarkTheme = {
    dark: true,
    fonts: CommonTheme.fonts,
    colors: {
        ...CommonTheme.colors,
        primary: palette.furmanPurple,
        background: palette.black,
        card: palette.furmanMidnightPurple,
        text: palette.furmanWhite,
        accentCard: palette.furmanPurple,
        accentText: palette.lightPurple,
        emergencyText: palette.furmanWhite,
        border: palette.furmanCompBlue,
        notification: palette.furmanCompYellow,
        notificationText: palette.black
    },
};

exports.DefaultTheme = DefaultTheme;
exports.DarkTheme = DarkTheme;
