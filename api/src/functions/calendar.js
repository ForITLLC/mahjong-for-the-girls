// Calendar API.
//   GET /api/calendar — PUBLIC. The upcoming nights the website renders,
//                       resolved at request time: { today, source, events }.
//
// Computing it here (rather than at build time) keeps the calendar current
// without a scheduled rebuild. See ../calendar.js for the sources and cache.

const { app } = require('@azure/functions');
const { resolveCalendar } = require('../calendar');

app.http('calendarPublic', {
  route: 'calendar',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const log = { log: (...a) => context.log(...a), warn: (...a) => context.warn(...a) };
    return {
      status: 200,
      jsonBody: await resolveCalendar(log),
      // Short browser cache; the slow Partiful scrape is cached server-side.
      headers: { 'Cache-Control': 'public, max-age=900' },
    };
  },
});
