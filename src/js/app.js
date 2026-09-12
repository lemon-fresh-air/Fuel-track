function render(){
  document.getElementById('balanceHeader').innerHTML=balanceHeader();
  document.getElementById('tab-gas').innerHTML=gasPage();
  document.getElementById('tab-petrol').innerHTML=petrolPage();
  document.getElementById('tab-calc').innerHTML=calcPage();
  document.getElementById('tab-history').innerHTML=historyPage();
  document.getElementById('tab-stats').innerHTML=statsPage();
  document.getElementById('tab-settings').innerHTML=settingsPage();
  syncUiChrome();bindDynamicEvents();bindFormattedInputs();
  bindOdoWidget();
}

initApp();

