import { extendTheme } from "@chakra-ui/react";
import '@fontsource/montserrat';

const theme = extendTheme({
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Montserrat', sans-serif`
  }
});

export default theme;