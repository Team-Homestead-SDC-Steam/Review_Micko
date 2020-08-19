import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReviewsModule from '../../client/src/ReviewsModule';

console.log = jest.fn(); // Suppress App console.logs
let titles = ['Review Type', 'Purchase Type', 'Language', 'Date Range', 'Playtime', 'Display As'];

jest.mock('../../client/utils.js', () => {
  const { gameTitle, gameRating, summaryQueryRes, funnyQueryRes } = require('../fixtures/sampleData');

  return {
    getPathId: () => 1,
    fetchAllGameReviews: () => Promise.resolve(gameRating),
    fetchReviewInfo: () => Promise.resolve(summaryQueryRes),
    addCommaToCount: (input) => input,
    getHumanReadableFromISO: (ISOString) => ISOString
  };
});

// DoubleEndedSlider is not tested in this integration test suite for the same reasons
// as listed in DoubleEndedSlider.component.test.js. It will be tested during E2E testing.
describe('<Reviews Module /> - FilterMenu and FilterInfo state interactions', () => {
  // Test suites: using promise queries (findBy instead of getBy) because of the many async
  // operations within the module

  test('should render both components with correct displays', async () => {
    // TODO: mock with different data from different endpoint calls
    render(<ReviewsModule />);
    let titleNodes = await screen.findAllByTestId('menu-unit-wrapper');
    expect(titleNodes.length).toBe(6);

    // Default select value
    let selectVal = await screen.findByText('Summary');
    expect(selectVal).toBeInTheDocument();

    // Default filter tag
    let filterTitle = await screen.findByText('Filters');
    expect(filterTitle).toBeInTheDocument();
    let defaultTag = await screen.findByTestId('filter-tag');
    expect(defaultTag).toHaveTextContent('Your Languages');

    // User rating from API call
    let gameSentiment = await screen.findByText('Mostly Positive');
    expect(gameSentiment).toBeInTheDocument();
  });

  test('should reset checked option for a menu to default on tag click', async () => {
    render(<ReviewsModule />);

    // Check default rendered tag for expected display
    let initialTag = await screen.findByTestId('filter-tag');
    expect(initialTag).toHaveTextContent('Your Languages');

    // Checked associated filter menu for expected display
    let yourLangsInput = await screen.findByTestId('language_your_languages');
    let allLangsInput = await screen.findByTestId('language_all_languages');
    expect(yourLangsInput).toBeChecked();
    expect(allLangsInput).not.toBeChecked();

    // Remove initial tag, assert changes match expected behavior
    await waitFor(() => fireEvent.click(initialTag));
    expect(screen.queryByTestId('filter-tag')).toBeNull();
    expect(allLangsInput).toBeChecked();
    expect(yourLangsInput).not.toBeChecked();
  });

  test('should update checked option and tag display on filter menu click', async () => {
    render(<ReviewsModule />);

    // Remove initial default tag
    let initialTag = await screen.findByTestId('filter-tag');
    await waitFor(() => fireEvent.click(initialTag));
    expect(screen.queryByTestId('filter-tag')).toBeNull();

    // Get all radio inputs & click them systematically, then check if relevant tag is visible
    let inputContainers = await screen.findAllByTestId('input-container');
    let inputs = inputContainers.map(container => container.children[0]);
    let expectedTagDisplayOrder = [
      null, 'Positive', 'Negative',
      null, 'Steam Purchasers', 'Not Purchased on Steam',
      null, 'Your Languages',
      null, 'TODO: Hook up to review-graph api', 'TODO: Hook up to review-graph api',
      null, 'Playtime: Over 1 hour', 'Playtime: Over 10 hours', 'Playtime: Over 100 hours'
    ];
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      await waitFor(() => fireEvent.click(input));
      expect(input).toBeChecked();
      if (expectedTagDisplayOrder[i] === null) {
        expect(screen.queryByTestId('filter-tag')).toBeNull();
      } else {
        let tag = screen.queryByTestId('filter-tag');
        expect(tag).not.toBeNull();
        await waitFor(() => fireEvent.click(tag));
      }
    }
  });

  test('clicking an option in "Display As" select menu does not show tags', async () => {
    render(<ReviewsModule />);

    // Remove initial default tag
    let initialTag = await screen.findByTestId('filter-tag');
    fireEvent.click(initialTag);
    expect(screen.queryByTestId('filter-tag')).toBeNull();

    let selectMenu = await screen.findByTestId('display-as-select');
    expect(selectMenu).toHaveValue('summary');

    fireEvent.change(selectMenu, { target: { value: 'most-helpful' }});
    expect(screen.queryByTestId('filter-tag')).toBeNull();
    expect(selectMenu).toHaveValue('most-helpful');

    fireEvent.change(selectMenu, { target: { value: 'funny' } });
    expect(screen.queryByTestId('filter-tag')).toBeNull();
    expect(selectMenu).toHaveValue('funny');

    fireEvent.change(selectMenu, { target: { value: 'recent' } });
    expect(screen.queryByTestId('filter-tag')).toBeNull();
    expect(selectMenu).toHaveValue('recent');
  });
});
