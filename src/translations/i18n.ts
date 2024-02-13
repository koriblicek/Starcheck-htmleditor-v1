import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next
    .use(initReactI18next)
    .init({
        fallbackLng: 'sk',
        resources: {
            gb: {
                translation: {
                    button: {
                        close: 'Close',
                    },
                    title: {
                    },
                    text: {
                    },
                    label: {

                    },
                    message: {
                    },
                    languages: {
                        sk: 'Slovak',
                        gb: 'English',
                    },
                }
            },
            sk: {
                translation: {
                    button: {
                        close: 'Zatvoriť',
                    },
                    title: {
                    },
                    text: {
                    },
                    label: {
                    },
                    message: {
                    },
                    languages: {
                        sk: 'Slovensky',
                        gb: 'Anglicky',
                    },
                }
            }
        }
    });