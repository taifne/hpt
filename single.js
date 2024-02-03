let size = 30 * 24; 
let dateUTC = new Date();
let dtFrom = new Date( dateUTC.valueOf() -  size * 3600 * 1000).toISOString();
let dtTo = new Date( dateUTC.valueOf() ).toISOString();
console.log(dtFrom)