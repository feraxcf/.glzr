import React, {
  useState,
  useEffect,
} from 'https://esm.sh/react@18?dev';
import { createRoot } from 'https://esm.sh/react-dom@18/client?dev';
import * as zebar from 'https://esm.sh/zebar@2';
import dateformat from 'https://esm.sh/dateformat@4';

const ytSessionId = "com.github.th-ch.youtube-music";

const providers = zebar.createProviderGroup({
  network: { type: 'network', refreshInterval: 500 },
  glazewm: { type: 'glazewm' },
  cpu: { type: 'cpu', refreshInterval: 2500 },
  date: { type: 'date', formatting: 'EEE d MMM t' },
  battery: { type: 'battery', refreshInterval: 100 },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
  song: { type: 'media' },
});

createRoot(document.getElementById('root')).render(<App />);

function App() {
  const [output, setOutput] = useState(providers.outputMap);
  
  useEffect(() => { providers.onOutput(() => setOutput(providers.outputMap)); }, []);
  
  // Get icon to show for current network status.
  function getNetworkIcon(networkOutput) {
    switch (networkOutput.defaultInterface?.type) {
      case 'ethernet':
        return <i className="good nf nf-md-ethernet_cable"></i>;
      case 'wifi':
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          return <i className="max nf nf-md-wifi_strength_4"></i>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 65
        ) {
          return <i className="med nf nf-md-wifi_strength_3"></i>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 40
        ) {
          return <i className="some nf nf-md-wifi_strength_2"></i>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 25
        ) {
          return <i className="bad nf nf-md-wifi_strength_1"></i>;
        } else {
          return <i className="worse nf nf-md-wifi_strength_outline"></i>;
        }
      default:
        return (
          <i className="nt def nf nf-md-wifi_strength_off_outline"></i>
        );
    }
  }

  // Get icon to show for how much of the battery is charged.
  function getBatteryIcon(batteryOutput) {
    if (batteryOutput.chargePercent > 80)
      return <i className="nf max nf-fa-battery_4"></i>;
    if (batteryOutput.chargePercent > 50)
      return <i className="nf med nf-fa-battery_3"></i>;
    if (batteryOutput.chargePercent > 30)
      return <i className="nf some nf-fa-battery_2"></i>;
    if (batteryOutput.chargePercent > 10)
      return <i className="nf bad nf-fa-battery_1"></i>;
    return <i className="nf worse nf-fa-battery_0"></i>;
  }

  // Get icon to show for current weather status.
  function getWeatherIcon(weatherOutput) {
    switch (weatherOutput.status) {
      case 'clear_day':
        return <i className="nf nf-weather-day_sunny"></i>;
      case 'clear_night':
        return <i className="nf nf-weather-night_clear"></i>;
      case 'cloudy_day':
        return <i className="nf nf-weather-day_cloudy"></i>;
      case 'cloudy_night':
        return <i className="nf nf-weather-night_alt_cloudy"></i>;
      case 'light_rain_day':
        return <i className="nf nf-weather-day_sprinkle"></i>;
      case 'light_rain_night':
        return <i className="nf nf-weather-night_alt_sprinkle"></i>;
      case 'heavy_rain_day':
        return <i className="nf nf-weather-day_rain"></i>;
      case 'heavy_rain_night':
        return <i className="nf nf-weather-night_alt_rain"></i>;
      case 'snow_day':
        return <i className="nf nf-weather-day_snow"></i>;
      case 'snow_night':
        return <i className="nf nf-weather-night_alt_snow"></i>;
      case 'thunder_day':
        return <i className="nf nf-weather-day_lightning"></i>;
      case 'thunder_night':
        return <i className="nf nf-weather-night_alt_lightning"></i>;
    }
  }

  // Calculate the percentage of the song that has been played.
  const getSongProgress = (song) => ((song.position) / (song.endTime));
  
  const openYoutubeMusic = () => {
      zebar.shellSpawn('YouTube Music.exe').then((ytm) => {
          ytm.onStdout(async output => {
              if (output.includes('"api-server::menu" loaded')) {
                  await new Promise(resolve => setTimeout(resolve, 3500));
                  await fetch('http://localhost:4343/api/v1/play', {
                      method: 'POST',
                      headers: { 'accept': 'application/json' },
                  })
                  .then(() => { console.warn("Played") })
                  .catch((error) => { console.error('Error playing song:', error) });
              }
          });
      });
  }
  
  const playYoutubeMusic = (sessions) => {
      if (sessions.some(s => s.sessionId === ytSessionId)) output.song.togglePlayPause({session_id: ytSessionId});
      else { openYoutubeMusic() }
  }

  function copyHourToClipboard() {
    const date = dateformat(new Date(), 'dd.mm.yy');
    
    console.warn('hour:', date);
    navigator.clipboard.writeText(date);
  }
  
  async function openStartMenu() {
      const curl = await zebar.shellExec('powershell.exe', `-Command & {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^{ESC}')}`);
      if (curl.stderr) console.error(`result: ${curl.stderr}.`);
      console.warn('Windows button clicked', e);
  }
  
  const operateSong = (song, type) => {
      if (type === 'toggle') song.togglePlayPause()
      else if (type === 'next') song.next();
      else if (type === 'prev') song.previous();
  }

  return (
    <div className="app">
      <div className="left">
        <button 
            className="sbtn windows nf nf-cod-menu"
            onClick={async () => { await openStartMenu(); }}
        ></button>
        <img  className="user" src= "./me.png" onClick={() => { playYoutubeMusic(output.song?.allSessions) }}
        ></img>
              {output.song?.currentSession?.title && (
            <div className="media">
                <div className="song" onClick={() => { if (output.song?.currentSession?.sessionId) navigator.clipboard.writeText(output.song.currentSession.sessionId); } }>
                    <div className="title" 
                        style = { (output.song.currentSession.title.length > 15) ? { animation: "scroll 10s linear infinite" } : {}}
                    > { output.song.currentSession.title } </div>
                    <div className="progress">
                        <div
                            className={ (!output.song.currentSession.isPlaying) ? "bar paused": "bar" }
                            style = {{ width: ( getSongProgress(output.song.currentSession) * 100 ) + "%" }}>
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <div onClick={() => { operateSong(output.song, "prev")}} className="sbtn next ctr">◀</div>
                    <div onClick={() => { operateSong(output.song, "toggle")}} className={"sbtn tgg ctr " + (!output.song.currentSession.isPlaying ? "pause" : "")}>{(output.song.currentSession.isPlaying ? "▣" : "▢")}</div>
                    <div onClick={() => { operateSong(output.song, "next")}} className="sbtn prev ctr">▶</div>
                </div>
          </div>
        )}
      </div>

      <div className="center">
          <div className="hour-wrapper">
              <div className="hour" onClick={copyHourToClipboard}>{output.date?.formatted ?? "EEE d MMM t"}</div>
              {output.glazewm && (
                  <div className="wks">
                      {Array.from({ length: 9 }, (_, i) => (i + 1).toString()).map(workspaceName => {
                            const workspace = output.glazewm.currentWorkspaces.find(ws => ws.name === workspaceName);
                            const wks = {
                                name: workspaceName,
                                hasFocus: workspace?.hasFocus ?? false,
                                isDisplayed: workspace? true : false,
                            }
                    
                            return (
                                <button
                                    className={`wk ${wks.hasFocus ? 'sel' : ''} ${wks.isDisplayed ? 'act' : ''}`}
                                    onClick={() => output.glazewm.runCommand(
                                        `focus --workspace ${wks.name}`,
                                    )}
                                    key={wks.name}
                                ></button>
                            );
                        })}
                  </div>
              )}
          </div>
      </div>

      <div className="right">
        { output.song?.currentSession?.sessionId !== ytSessionId && (
            <button className="tb ytm" onClick={() => { playYoutubeMusic(output.song.allSessions) }}> </button>
        )}
        

        {output.network && (
          <div className="network">
            {getNetworkIcon(output.network)}
            {output.network.defaultGateway?.ssid}
          </div>
        )}

        {output.memory && (
          <div className="memory">
            <i className="nf nf-fae-chip"></i>
            {Math.round(output.memory.usage)}%
          </div>
        )}

        {output.cpu && (
          <div className="cpu">
            <i className="nf nf-oct-cpu"></i>

            <span
              className={output.cpu.usage > 85 ? 'high-usage' : ''}
            >
              {Math.round(output.cpu.usage)}%
            </span>
          </div>
        )}

        {output.battery && (
          <div className="battery">
            {/* Show icon for whether battery is charging. */}
            {output.battery.isCharging && (
              <i className="bt nf nf-md-power_plug charging-icon"></i>
            )}
            {getBatteryIcon(output.battery)}
            {Math.round(output.battery.chargePercent)}%
          </div>
        )}

        {output.weather && (
          <div className="weather">
            {getWeatherIcon(output.weather)}
            {Math.round(output.weather.celsiusTemp)}°C
          </div>
        )}
        {output.glazewm && (
            <>
            <button className={ "sbtn binding-mode" + (output.glazewm?.bindingModes[0]?.name === "◎" ? " stop" : "") } 
                key={output.glazewm?.bindingModes[0]?.name ?? "default"} 
                onClick={() => {
                    if (output.glazewm?.bindingModes[0]?.name)
                        output.glazewm.runCommand(`wm-disable-binding-mode --name ${output.glazewm?.bindingModes[0]?.name}`)
                    else 
                        output.glazewm.runCommand(`wm-enable-binding-mode --name ◎`)
                }}
            >
                {output.glazewm?.bindingModes[0]?.name ?? "◉"}
            </button>

            <button
              className={`sbtn tiling-direction nf ${output.glazewm.tilingDirection === 'horizontal' ? 'nf-md-swap_horizontal' : 'nf-md-swap_vertical'}`}
              onClick={() =>
                output.glazewm.runCommand('toggle-tiling-direction')
              }
            ></button>
          </>
        )}
      </div>
    </div>
  );
}