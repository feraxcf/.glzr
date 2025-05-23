export function copyHourToClipboard() {
  const date = dateformat(new Date(), 'dd.mm.yy');
  
  console.warn('hour:', date);
  navigator.clipboard.writeText(date);
}

export async function openStartMenu() {
    const curl = await zebar.shellExec('powershell.exe', `-Command & {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^{ESC}')}`);
    if (curl.stderr) console.error(`result: ${curl.stderr}.`);
    console.warn('Windows button clicked', e);
}