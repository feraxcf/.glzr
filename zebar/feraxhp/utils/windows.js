export function copyHourToClipboard() {
  const date = dateformat(new Date(), 'dd.mm.yy');
  
  console.warn('hour:', date);
  navigator.clipboard.writeText(date);
}

export async function openStartMenu(zebar) {
    const curl = await zebar.shellExec('powershell.exe', `-Command & {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^{ESC}')}`);
    if (curl.stderr) console.error(`result: ${curl.stderr}.`);
    console.warn('Windows button clicked', e);
}

export const getBrigthness = async (zebar) => {
    const br = await zebar.shellExec('mbr.exe', `g -q lg`);
    if (br.stderr) console.error(`result: ${br.stderr}.`);
    return br.stdout;
}

export const setBrigthness = async (zebar, brightness) => {
    const br = await zebar.shellExec('mbr.exe', `s -q ${brightness}`);
    if (br.stderr) console.error(`result: ${br.stderr}.`);
    return br.stdout;
}