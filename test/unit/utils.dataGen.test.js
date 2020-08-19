const fs = require('fs');
const { convertObjToCsv, writeToCsv, generateHexUnit, getRandomHexColor, getRandIdx } = require('../../data-gen/utils');
const { PassThrough } = require('stream');

describe('Data generation utils', () => {
  test('convertObjToCsv converts an object into a csv string', () => {
    let argsToTestWithExpected = [
      [{}, [], ''],
      [{ a: 1 }, ['a'], '1\r\n'],
      [{ a: 1, b: 2 }, ['a', 'b'], '1,2\r\n'],
      [{ a: false, b: true }, ['b', 'a'], 'true,false\r\n'],
      [{ a: 1, b: 2, c: 3 }, ['a', 'b'], '1,2\r\n'],
      [{ a: 1, b: 2, c: 3 }, ['a', 'd'], '1,undefined\r\n'],
      [{ a: 'a', b: 'b,c', c: ',,,,,' }, ['a', 'b', 'c'], 'a,"b,c",",,,,,"\r\n']
    ];
    argsToTestWithExpected.forEach(([obj, keys, expected]) => {
      expect(convertObjToCsv(obj, keys)).toBe(expected);
    });
  });

  test('writeToCsv writes an array of objects to fs in csv format', () => {
    // Mock file system & createWriteStream
    jest.spyOn(fs, 'createWriteStream');
    let virtualFs = {};
    fs.createWriteStream.mockImplementation((writePath) => {
      const mockedStream = new PassThrough();
      mockedStream.write = (data) => {
        if (!virtualFs[writePath]) {
          virtualFs[writePath] = '';
        }
        virtualFs[writePath] += data;
      };
      mockedStream.end = mockedStream.write;
      return mockedStream;
    });

    // Test write function against mock two times: resolve then reject
    let writePromise = writeToCsv(
      [
        { a: 1, b: 2, c: 3 },
        { a: 'a', b: 'b,c', c: ',,,,,' }
      ],
      ['a', 'b', 'c'],
      '/some/file/path'
    );
    expect(fs.createWriteStream.mock.calls[0][0]).toStrictEqual('/some/file/path');
    expect(writePromise).resolves.toBe(true);
    // Check that mock-written file to virtual file system is valid .csv
    expect(virtualFs).toStrictEqual({
      '/some/file/path': 'a,b,c\r\n1,2,3\r\na,"b,c",",,,,,"\r\n'
    });

    let otherWritePromise = writeToCsv(
      [{}],
      'Non-array input which should result in stream error',
      '/some/other/path'
    );
    expect(fs.createWriteStream.mock.calls[1][0]).toStrictEqual('/some/other/path');
    expect(otherWritePromise).rejects.toBeInstanceOf(Error);
    jest.clearAllMocks();
  }); // End writeToCsv test suite

  // The tests below each run 50 times to ensure consistency
  test('generateHexUnit generates a string between 00 and ff', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateHexUnit()).toMatch(/[0-9a-f]{2}/);
    }
  });

  test('getRandomHexColor produces a valid hex color without #', () => {
    for (let i = 0; i < 50; i++) {
      expect(getRandomHexColor()).toMatch(/[0-9a-f]{6}/);
    }
  });

  test('getRandIdx produces a random index between 0 and input', () => {
    for (let i = 1; i < 50; i++) {
      let random = getRandIdx(i);
      expect(random).toBeGreaterThanOrEqual(0);
      expect(random).toBeLessThan(i);
    }
  });
});
