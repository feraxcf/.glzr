import palette from 'https://unpkg.com/@catppuccin/palette@1.7.1/esm/palette.js'; 

const css2dom = (css) => document.querySelector("#color").innerHTML = css;

const scheme = {
    light: "frappe",
    dark: "mocha"
};

const rgb2string = (rgb) => `${rgb.r}, ${rgb.g}, ${rgb.b}`;

export const setColorScheme = (mode_) => {
    const mode = scheme[mode_];
    const theme = palette[mode];
    console.warn(theme)
    
    const text = 
    `:root{
        --ctp-rosewater  : ${theme.colors.rosewater.hex} ;
        --ctp-flamingo   : ${theme.colors.flamingo.hex} ;
        --ctp-pink       : ${theme.colors.pink.hex} ;
        --ctp-mauve      : ${theme.colors.mauve.hex} ;
        --ctp-red        : ${theme.colors.red.hex} ;
        --ctp-maroon     : ${theme.colors.maroon.hex} ;
        --ctp-peach      : ${theme.colors.peach.hex} ;
        --ctp-yellow     : ${theme.colors.yellow.hex} ;
        --ctp-green      : ${theme.colors.green.hex} ;
        --ctp-teal       : ${theme.colors.teal.hex} ;
        --ctp-sky        : ${theme.colors.sky.hex} ;
        --ctp-sapphire   : ${theme.colors.sapphire.hex} ;
        --ctp-blue       : ${theme.colors.blue.hex} ;
        --ctp-text       : ${theme.colors.text.hex} ;
        --ctp-subtext1   : ${theme.colors.subtext1.hex} ;
        --ctp-subtext0   : ${theme.colors.subtext0.hex} ;
        --ctp-overlay2   : ${theme.colors.overlay2.hex} ;
        --ctp-overlay1   : ${theme.colors.overlay1.hex} ;
        --ctp-overlay0   : ${theme.colors.overlay0.hex} ;
        --ctp-surface2   : ${theme.colors.surface2.hex} ;
        --ctp-surface1   : ${theme.colors.surface1.hex} ;
        --ctp-surface0   : ${theme.colors.surface0.hex} ;
        --ctp-base       : ${(theme.name === "latte") ? theme.colors.mantle.hex : theme.colors.base.hex} ;
        --ctp-base-rgb   : ${(theme.name === "latte") ? rgb2string(theme.colors.mantle.rgb) : rgb2string(theme.colors.base.rgb)} ;
        --ctp-mantle     : ${theme.colors.mantle.hex} ;
        --ctp-crust      : ${theme.colors.crust.hex} ;
    }`;
    
    css2dom(text);
}
