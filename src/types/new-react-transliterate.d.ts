declare module 'new-react-transliterate' {
    import { ComponentType, ReactElement } from 'react';

    export type Language =
        | 'am' | 'ar' | 'bn' | 'be' | 'bg' | 'yue-hant' | 'zh' | 'zh-hant'
        | 'fr' | 'de' | 'el' | 'gu' | 'he' | 'hi' | 'it' | 'ja' | 'kn'
        | 'ml' | 'mr' | 'ne' | 'or' | 'fa' | 'pt' | 'pa' | 'ru' | 'sa'
        | 'sr' | 'si' | 'es' | 'ta' | 'te' | 'ti' | 'uk' | 'ur' | 'vi';

    export enum TriggerKeys {
        KEY_RETURN = 13,
        KEY_ENTER = 13,
        KEY_SPACE = 32,
        KEY_TAB = 9,
    }

    export interface NewReactTransliterateProps {
        value: string;
        onChangeText: (text: string) => void;
        lang?: Language;
        enabled?: boolean;
        renderComponent?: (props: any) => ReactElement;
        maxOptions?: number;
        offsetY?: number;
        offsetX?: number;
        containerClassName?: string;
        containerStyles?: React.CSSProperties;
        activeItemStyles?: React.CSSProperties;
        hideSuggestionBoxOnMobileDevices?: boolean;
        hideSuggestionBoxBreakpoint?: number;
        triggerKeys?: number[];
        insertCurrentSelectionOnBlur?: boolean;
        showCurrentWordAsLastSuggestion?: boolean;
        placeholder?: string;
    }

    export const NewReactTransliterate: ComponentType<NewReactTransliterateProps>;

    export interface GetTransliterateSuggestionsOptions {
        numOptions?: number;
        showCurrentWordAsLastSuggestion?: boolean;
        lang?: Language;
    }

    export function getTransliterateSuggestions(
        word: string,
        options?: GetTransliterateSuggestionsOptions
    ): Promise<string[]>;
}

declare module 'new-react-transliterate/styles.css' {
    const content: any;
    export default content;
}
