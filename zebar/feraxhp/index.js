import React, {
  useState,
  useEffect,
} from 'https://esm.sh/react@18?dev';
import { createRoot } from 'https://esm.sh/react-dom@18/client?dev';
import * as zebar from 'https://esm.sh/zebar@2';

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
  const [song, setSong] = useState(null);
  
  useEffect(() => {
      providers.onOutput(() => setOutput(providers.outputMap));

      const fetchSong = async () => {
        try {
            const response = await fetch('http://localhost:4343/api/v1/song', {
            method: 'GET',
            headers: { 'accept': 'application/json' },
            });
            const data = await response.json();
            
            setSong(data);
        } catch (error) { 
            console.info('Is a song being played?:', error); 
            setSong(null); 
        }
      };

      fetchSong();
      const interval = setInterval(fetchSong, 1000);

      return () => clearInterval(interval);
  }, []);
  
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
  function getSongProgress(songOutput) {
    if (
        songOutput && 
        songOutput.songDuration
    ) {
      return (songOutput.elapsedSeconds / songOutput.songDuration);
    }
    return 0;
  }

  return (
    <div className="app">
      <div className="left">
        <img 
            className="user" 
            style = {(song && song.imageSrc && !song.isPaused) ? { animation: "rotate 5s linear infinite" } : {}}
            src={(song && song.imageSrc) ? song.imageSrc : "https://avatars.githubusercontent.com/u/116177764?v=4"}
            onClick={() => { 
                try {
                    fetch('http://localhost:4343/api/v1/toggle-play', {
                        method: 'POST',
                        headers: { 'accept': 'application/json' },
                    });
                } catch (error) { console.info('Is a song being played?:', error); }
            }}
        ></img>
        {song && (
          <div className="song">
              <div 
                  className="title"
                  style = { (song.title.length > 20) ? { animation: "scroll 20s linear infinite" } : {}}>
                      {song.title}
                  </div>
              <div className="progress">
                  <div
                      className={ song.isPaused ? "bar paused": "bar" }
                      style = {{ width: (getSongProgress(song) * 100) + "%" }}>
                  </div>
              </div>
          </div>
        )}
        {/* 
        {output.glazewm && (
          <div className="workspaces">
            {output.glazewm.currentWorkspaces.map(workspace => (
              <button
                className={`workspace ${workspace.hasFocus && 'focused'} ${workspace.isDisplayed && 'displayed'}`}
                onClick={() =>
                  output.glazewm.runCommand(
                    `focus --workspace ${workspace.name}`,
                  )
                }
                key={workspace.name}
              >
                {workspace.displayName ?? workspace.name}
              </button>
            ))}
          </div>
        )} */}
      </div>

      <div className="center">
          <div className="hour-wrapper">
              <div className="hour">{output.date?.formatted}</div>
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
        {output.glazewm && (
          <>
            {output.glazewm.bindingModes.map(bindingMode => (
              <button
                className="binding-mode"
                key={bindingMode.name}
              >
                {bindingMode.displayName ?? bindingMode.name}
              </button>
            ))}

            <button
              className={`tiling-direction nf ${output.glazewm.tilingDirection === 'horizontal' ? 'nf-md-swap_horizontal' : 'nf-md-swap_vertical'}`}
              onClick={() =>
                output.glazewm.runCommand('toggle-tiling-direction')
              }
            ></button>
          </>
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
      </div>
    </div>
  );
}