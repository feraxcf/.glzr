import palette from 'https://unpkg.com/@catppuccin/palette@1.7.1/esm/palette.js'; 


const css2dom = (css) => document.querySelector("#color").innerHTML = css;

const scheme = {
    light: "latte",
    dark: "mocha"
};

const mode = scheme["light"];
console.warn(palette);
console.warn(palette[mode]);
console.warn(mode);

const text = 
`:root{
    --ctp-rosewater  : ${palette[mode].colors.rosewater.hex} ;
    --ctp-flamingo   : ${palette[mode].colors.flamingo.hex} ;
    --ctp-pink       : ${palette[mode].colors.pink.hex} ;
    --ctp-mauve      : ${palette[mode].colors.mauve.hex} ;
    --ctp-red        : ${palette[mode].colors.red.hex} ;
    --ctp-maroon     : ${palette[mode].colors.maroon.hex} ;
    --ctp-peach      : ${palette[mode].colors.peach.hex} ;
    --ctp-yellow     : ${palette[mode].colors.yellow.hex} ;
    --ctp-green      : ${palette[mode].colors.green.hex} ;
    --ctp-teal       : ${palette[mode].colors.teal.hex} ;
    --ctp-sky        : ${palette[mode].colors.sky.hex} ;
    --ctp-sapphire   : ${palette[mode].colors.sapphire.hex} ;
    --ctp-blue       : ${palette[mode].colors.blue.hex} ;
    --ctp-text       : ${palette[mode].colors.text.hex} ;
    --ctp-subtext1   : ${palette[mode].colors.subtext1.hex} ;
    --ctp-subtext0   : ${palette[mode].colors.subtext0.hex} ;
    --ctp-overlay2   : ${palette[mode].colors.overlay2.hex} ;
    --ctp-overlay1   : ${palette[mode].colors.overlay1.hex} ;
    --ctp-overlay0   : ${palette[mode].colors.overlay0.hex} ;
    --ctp-surface2   : ${palette[mode].colors.surface2.hex} ;
    --ctp-surface1   : ${palette[mode].colors.surface1.hex} ;
    --ctp-surface0   : ${palette[mode].colors.surface0.hex} ;
    --ctp-base       : ${palette[mode].colors.base.hex} ;
    --ctp-mantle     : ${palette[mode].colors.mantle.hex} ;
    --ctp-crust      : ${palette[mode].colors.crust.hex} ;
}`;

css2dom(text);
