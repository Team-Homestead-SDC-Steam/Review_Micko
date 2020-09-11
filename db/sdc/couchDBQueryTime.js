/*
Running this file will query the id specified by the steamReviews.get parameter
This queryFunc is wrapped in a process timer provided by nodeJS, so it actually measures the time it took to finish executing the queryFunc -- which I believe should be more or less the same time it took to query CouchDB
*/

const nano = require('nano')('http://admin:test@127.0.0.1:5984');
const {
  performance,
  PerformanceObserver
} = require('perf_hooks');

const steamReviews = nano.use('steam-reviews');

let queryFunc = () => {
  steamReviews.get('9655767')
  .then(data => {
    console.log(data);
  })
}

const wrapped = performance.timerify(queryFunc);

const obs = new PerformanceObserver((list) => {
  console.log('Query time process in ms: ', list.getEntries()[0].duration);
  obs.disconnect();
})

obs.observe({ entryTypes: ['function'] });

wrapped();