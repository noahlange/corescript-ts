import { $, Managers, Objects } from 'corescript';
import * as test from 'tape-catch';

const v = { characterName: 'vehicle' };
$.dataSystem = { airship: v, boat: v, ship: v } as any;
$.gameMap = new Objects.Game_Map();

test('vehicles should be created on instantiation', t => {
  t.ok($.gameMap.airship);
  t.ok($.gameMap.ship);
  t.ok($.gameMap.boat);
  t.end();
});

test('setup() should throw without loaded map data', t => {
  t.throws(() => $.gameMap.setup(1));
  t.end();
});

test('isEventRunning() should return interpreter status', t => {
  const interpreter = ($.gameMap as any)
    ._interpreter as Objects.Game_Interpreter;
  const list = [{ code: 123, indent: 0, parameters: ['foobar'] }];
  interpreter.setup(list);
  t.true($.gameMap.isEventRunning());
  interpreter.clear();
  t.false($.gameMap.isEventRunning());
  t.end();
});

test('vehicle() should return appropriate vehicle from string OR index', t => {
  t.is($.gameMap.vehicle(0), $.gameMap.vehicle('boat'));
  t.is($.gameMap.vehicle(1), $.gameMap.vehicle('ship'));
  t.is($.gameMap.vehicle(2), $.gameMap.vehicle('airship'));
  t.end();
});
