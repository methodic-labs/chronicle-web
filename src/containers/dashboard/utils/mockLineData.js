// @flow
import random from 'lodash/random';
import range from 'lodash/range';
import { DateTime } from 'luxon';

type LineDatePoint = {
  x :string;
  y :number;
};

function mockLineData(days :number, min :number, max :number) {
  const step = Math.floor((max - min) / days);
  const elements = range(days)
    .map<LineDatePoint>((e, i) => ({
      x: DateTime.local().minus({ days: days - i }).toFormat('yyyy-MM-dd'),
      y: random(min, step * i + min)
    }));

  return elements;
}

export default mockLineData;
