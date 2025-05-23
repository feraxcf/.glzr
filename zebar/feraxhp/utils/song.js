export const ytSessionId = "com.github.th-ch.youtube-music";
export const getSongProgress = (song) => ((song.position) / (song.endTime));

export const operateSong = (song, type) => {
    if (type === 'toggle') song.togglePlayPause()
    else if (type === 'next') song.next();
    else if (type === 'prev') song.previous();
}

export const openYoutubeMusic = (zebar) => {
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

export const playYoutubeMusic = (sessions, output, zebar) => {
    if (sessions.some(s => s.sessionId === ytSessionId)) output.song.togglePlayPause({session_id: ytSessionId});
    else { openYoutubeMusic(zebar) }
}