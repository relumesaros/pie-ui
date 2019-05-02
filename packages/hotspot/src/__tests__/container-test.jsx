import React from 'react';
import _ from 'lodash';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Container from '../hotspot/container';

describe('Container', () => {
  let onSelectChoice, wrapper;

  const mkWrapper = (opts = {}) => {
    opts = _.extend(
      {
        classes: {
          base: 'base'
        },
        dimensions: {
          height: 0,
          width: 0
        },
        disabled: false,
        hotspotColor: 'rgba(137, 183, 244, 0.65)',
        imageUrl: '',
        isEvaluateMode: false,
        outlineColor: 'blue',
        session: { answers: [] },
        shapes: []
      },
      opts
    );

    return shallow(<Container {...opts} onSelectChoice={onSelectChoice} />);
  };

  beforeEach(() => {
    onSelectChoice = jest.fn();
    wrapper = mkWrapper();
  });

  describe('snapshots', () => {
    describe('outline color', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ outlineColor: 'red' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('hotspot color', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ hotspotColor: 'rgba(217, 30, 24, 0.65)' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('image', () => {
      it('renders', () => {
        const wrapper = mkWrapper({ imageUrl: 'https://picsum.photos/id/102/200/300' });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('shapes', () => {
      it('renders', () => {
        const wrapper = mkWrapper({
          shapes: [
            { id: '1', x: 5, y: 5, width: 5, height: 5 },
            { id: '2', x: 25, y: 25, width: 5, height: 5 }
          ],
          imageUrl: 'https://picsum.photos/id/102/200/300',
          dimensions: {
            width: 200,
            height: 300
          }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
