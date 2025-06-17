import React, {
  useState,
  useEffect,
} from 'https://esm.sh/react@18?dev';
import { createRoot } from 'https://esm.sh/react-dom@18/client?dev';
import * as zebar from 'https://esm.sh/zebar@3.1.0';

// Utils
import { 
    getSongProgress, 
    operateSong, 
    playYoutubeMusic,
} from './utils/song.js';
import {
    copyHourToClipboard,
    getBrigthness,
    openStartMenu,
    setBrigthness,
} from './utils/windows.js';

// Config
import { hide_icons } from './config/systray.js';

const message = "Wellcome FeraxHp!"
const providers = zebar.createProviderGroup({
  network: { type: 'network', refreshInterval: 500 },
  glazewm: { type: 'glazewm' },
  cpu: { type: 'cpu', refreshInterval: 2500 },
  date: { type: 'date', formatting: 'EEE d MMM t' },
  battery: { type: 'battery', refreshInterval: 100 },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
  song: { type: 'media' },
  systray: { type: 'systray' },
});

createRoot(document.getElementById('root')).render(<App />);

function App() {
  const [output, setOutput] = useState(providers.outputMap);
  
  useEffect(() => { providers.onOutput(() => setOutput(providers.outputMap)); }, []);

  return (
    <div className="app">
      <div className="left">
        <button className="sbtn windows nf nf-cod-menu" onClick={async () => { await openStartMenu(zebar); }}></button>
        <img className="user" src= "./me.png" onClick={() => { playYoutubeMusic(output.song?.allSessions, output, zebar) }}></img>
        {output.song?.currentSession?.title && ( <Media output={output}/>)}
      </div>

      <div className="center">
          <div className="hour-wrapper">
            <div className="hour" onClick={copyHourToClipboard}>{output.date?.formatted ?? message}</div>
            {output.glazewm && ( <WorkspacesDots output={output}/> )}
          </div>
      </div>

      <div className="right">
        {output.network && ( <Network output={ output}/>)}
        {output.memory  && ( <Memory output={output}/>)}
        {output.cpu     && ( <Cpu output={output}/>)}
        {output.battery && ( <Battery output={output} />)}
        {output.weather && ( <WeatherIcon output={output} />)}
        {output.systray && ( <Systray output={output} />)}
        {output.glazewm && ( <Glazewm output={output}/>)}
        <BrightnessButton zebar={zebar}/>
      </div>
    </div>
  );
}
// Media
function Media( { output: { song } } ) {
    const title = song.currentSession.title;
    const style = (title.length > 15) ? { animation: "scroll 10s linear infinite" } : {};
    const copy = (sessionId) => { if (sessionId) navigator.clipboard.writeText(sessionId) };
    const isPlaying = song.currentSession.isPlaying;
    
    return <div className="media">
        <div className="song" onClick={() => { copy(song?.currentSession?.sessionId) } }>
            <div className="title" style={style}>{title}</div>
            <div className="progress">
                <div 
                    className={(!isPlaying) ? "bar paused": "bar"} 
                    style={{ width: ( getSongProgress(song.currentSession) * 100 ) + "%" }}
                ></div>
            </div>
        </div>
        <div className="controls">
            <div onClick={() => { operateSong(song, "prev")}} className="sbtn next ctr">◀</div>
            <div onClick={() => { operateSong(song, "toggle")}} className={"sbtn tgg ctr " + (!isPlaying ? "pause" : "")}>{(isPlaying ? "▣" : "▢")}</div>
            <div onClick={() => { operateSong(song, "next")}} className="sbtn prev ctr">▶</div>
        </div>
  </div>
}

// Network
function getWifiIconClass(strength) {
  if (strength >= 80 && strength <= 100) return "max nf nf-md-wifi_strength_4";
  if (strength >= 65 && strength < 80) return "med nf nf-md-wifi_strength_3";
  if (strength >= 40 && strength < 65) return "some nf nf-md-wifi_strength_2";
  if (strength >= 25 && strength < 40) return "bad nf nf-md-wifi_strength_1";
  return "worse nf nf-md-wifi_strength_outline";
}

function Network({ output: { network } }) {
    const type = network.defaultInterface?.type ?? "default";
    const strength = network.defaultGateway?.signalStrength ?? 0;
    
    const icons = {
        ethernet: (strength) => <i className="max nf nf-md-ethernet_cable"></i>,
        wifi: (strength) => <i className={getWifiIconClass(strength)}></i>,
        default: (strength) => <i className="nt def nf nf-md-wifi_strength_off_outline"></i>,
    }
    
    const name = {
        ethernet: (network) => network.defaultInterface.friendlyName,
        wifi: (network) => network.defaultGateway?.ssid ?? network.defaultInterface.friendlyName,
        default: (network) => "NN.A",
    }
    
    return <div className="network">
        {(type in icons) ? icons[type](strength) : icons.default(strength)}
        {(type in name) ? name[type](network) : icons.default(network)}
    </div>
}

// Memory
function Memory({output: {memory} }) {
    return <div className="memory">
        <i className="nf nf-fae-chip"></i>
        {Math.round(memory.usage)}%
    </div>
}

// CPU
function Cpu({ output: { cpu } }) {
    return <div className="cpu">
        <i className="nf nf-oct-cpu"></i>
        <span className={cpu.usage > 85 ? 'high-usage' : ''}>
            {Math.round(cpu.usage)}%
        </span>
    </div>
}

// Weather
function WeatherIcon({ output: { weather: { status, celsiusTemp } } }) {
    const className = {
        'clear_day': "nf nf-weather-day_sunny",
        'clear_night': "nf nf-weather-night_clear",
        'cloudy_day': "nf nf-weather-day_cloudy",
        'cloudy_night': "nf nf-weather-night_alt_cloudy",
        'light_rain_day': "nf nf-weather-day_sprinkle",
        'light_rain_night': "nf nf-weather-night_alt_sprinkle",
        'heavy_rain_day': "nf nf-weather-day_rain",
        'heavy_rain_night': "nf nf-weather-night_alt_rain",
        'snow_day': "nf nf-weather-day_snow",
        'snow_night': "nf nf-weather-night_alt_snow",
        'thunder_day': "nf nf-weather-day_lightning",
        'thunder_night': "nf nf-weather-night_alt_lightning",
    }
    
    return <div className="weather">
        <i className={className[status]}></i> 
        {Math.round(celsiusTemp)}°C
    </div>
}

// Battery
function getBatteryIcon(level) {
  if (level > 80) return "nf max nf-fa-battery_4";
  if (level > 50) return "nf med nf-fa-battery_3";
  if (level > 30) return "nf some nf-fa-battery_2";
  if (level > 10) return "nf bad nf-fa-battery_1";
  return "nf worse nf-fa-battery_0"
}

function Battery({ output: { battery } }) {
    const { chargePercent, isCharging } = battery;
    return <div className="battery">
        {isCharging && ( <i className="bt nf nf-md-power_plug charging-icon"></i> )}
        <i className={getBatteryIcon(chargePercent)}></i>
        {Math.round(chargePercent)}%
    </div>
}

// Glazewm
function Glazewm({ output: { glazewm } }) {
    // Binding
    const bindingMode = glazewm.bindingModes[0]?.name;
    const bindModes = {
        "◎": {
            class: " stop",
            func: () => { glazewm.runCommand(`wm-disable-binding-mode --name ${bindingMode}`) }
        }
    }
    
    // Tilling 
    const direction = glazewm.tilingDirection === 'horizontal' ? 'nf-md-swap_horizontal' : 'nf-md-swap_vertical'
    return (<>
        <button className={"sbtn binding-mode" + (bindModes[bindingMode]?.class ?? "")}
            key={bindingMode ?? "default"}
            onClick={() => {
                (bindingMode in bindModes) ? bindModes[bindingMode].func() : glazewm.runCommand(`wm-enable-binding-mode --name ◎`);
            }}
        > { (bindingMode ?? "◉")[0] } </button>
        <button
            className={`sbtn tiling-direction nf ${direction}`}
            onClick={() => glazewm.runCommand('toggle-tiling-direction') }
        ></button>
    </>);
}

// Glazewm : Workspaces
function WorkspacesDots({ output: { glazewm } }) {
    const names = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    const current = glazewm.currentWorkspaces;

    return (
        <div className="wks">
            {names.map(name => {
                const workspace = current.find(ws => ws.name === name);
                const hasFocus = workspace?.hasFocus ?? false;
                const isDisplayed = Boolean(workspace);

                const buttonClass = [
                    'wk', 
                    hasFocus && 'sel',
                    isDisplayed && 'act'
                ].filter(Boolean).join(' ');

                return (
                    <button
                        key={name}
                        className={buttonClass}
                        onClick={() => glazewm.runCommand(`focus --workspace ${name}`)}
                        aria-label={`Workspace ${name}`}
                    />
                );
            })}
        </div>
    );
}

// Brightness
const BrightnessButton = ({zebar}) => {
  const [br, setBr] = useState(0);
  
    // Leer el brillo real al montar el componente
    useEffect(() => {
      getBrigthness(zebar).then((valor) => setBr(parseInt(valor)));
    }, [zebar]);
  
    const handleClick = async () => {
      const newBr = br === 0 ? 99 : 0;
      const valorReal = await setBrigthness(zebar, newBr);
      setBr(parseInt(valorReal));
    };
  
    const handleWheel = async (e) => {
      let newBr = br + (e.deltaY < 0 ? 10 : -10);
      if (newBr > 99) newBr = 99;
      if (newBr < 0) newBr = 0;
      const valorReal = await setBrigthness(zebar, newBr);
      setBr(parseInt(valorReal));
    };
  
  const style = {
      fontFamily: ['Fira Mono', 'JetBrains Mono', 'Consolas', 'Menlo', 'monospace'],
  }
  
  const color = (lvl) => {
    if ( lvl > 80) return "max";
    if ( lvl > 60) return "med";
    if ( lvl > 40) return "some";
    if ( lvl > 20) return "bad";
    return "worse";
  }
  
  return <button
      onClick={handleClick}
      onWheel={handleWheel}
      style={style}
      className={'sbtn ' + color(br)}
    > {br.toString().padStart(2, '0')} </button>
};

function Systray({ output }) {
  if (!output.systray) return null;
  
    let icons = output.systray.icons.filter(e => hide_icons.every(i => e.id !== i));
  
  return (
    <div 
        className="systray-container"
        style={{ 
            "--systray-width": `calc(${icons.length + 1.2} * 22px)` 
        }}
    >
      <div className="systray-icons sbtn">
              {
                icons.map(icon => {
                    return (
                        <div
                            className="systray-icon-wrapper"
                            key={icon.id}
                            data-tooltip={icon.tooltip}
                        >
                            <img
                                className="systray-icon"
                                src={icon.iconUrl}
                                onClick={e => {
                                    e.preventDefault();
                                    output.systray.onLeftClick(icon.id);
                                }}
                                onContextMenu={e => {
                                    e.preventDefault();
                                    output.systray.onRightClick(icon.id);
                                }}
                                onAuxClick={(e) => {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(icon.id);
                                }}
                            />
                        </div>
                    )
                })
            }
        <i className="nf nf-oct-stack"></i>
      </div>
    </div>
  );
}
