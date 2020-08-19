const { getPurchaseTypeDataForGameId, getReviewsByGameIdWithOptions, getUserById, getBadgeById } = require('../../db/index');

export const dbTest = () => describe('Database query methods', () => {
  test('getPurchaseTypeDataForGameId lists how many reviewers bought a game via direct / key for input game id', async (done) => {
    let expectedPurchases = { direct: 1, key: 1 };
    for (let i = 1; i <= 5; i++) {
      let results = await getPurchaseTypeDataForGameId(i);
      expect(results).toStrictEqual(expectedPurchases);
    }
    done();
  });

  test('getReviewsByGameIdWithOptions filters, sorts, and returns valid review data for input game id, accounting for input options', async (done) => {
    let keys = ['id_user', 'id_game', 'is_recommended', 'hours_on_record', 'hours_at_review_time', 'purchase_type', 'date_posted', 'received_free', 'review_text', 'num_found_helpful', 'num_found_funny', 'num_comments'];
    let numRecommended = { 1: 2, 2: 0, 3: 1, 4: 1, 5: 0 };
    for (let i = 1; i <= 4; i++) {
      let results = await getReviewsByGameIdWithOptions(i, {});
      expect(results.length).toBe(2);
      results.forEach(result => {
        keys.forEach(key => {
          expect(result).toHaveProperty(key);
        });
      });
      let directPurchase = await getReviewsByGameIdWithOptions(i, { purchase_type: 'steam' });
      expect(directPurchase.length).toBe(1);
      let recommendedReviews = await getReviewsByGameIdWithOptions(i, { review_type: 'positive' });
      expect(recommendedReviews.length).toBe(numRecommended[i]);
    }
    done();
  });

  test('getUserById finds the correct details for input user id', async (done) => {
    for (let i = 1; i <= 10; i++) {
      let result = await getUserById(i);
      expect(result.length).toBe(1);
      let expectedKeys = ['username', 'profile_url', 'is_online', 'num_products', 'num_reviews', 'steam_level', 'id_badge', 'is_in_game', 'in_game_id', 'in_game_status'];
      expectedKeys.forEach(key => {
        expect(result[0]).toHaveProperty(key);
      });
      // Not checking that each value is the proper type, since that's already been done
      // during data-gen unit tests
    }
    done();
  });

  test('getBadgeById finds the correct details for each badge id', async (done) => {
    for (let i = 1; i <= 16; i++) {
      let result = await getBadgeById(i);
      expect(result.length).toBe(1);
      expect(result[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        xp: expect.any(Number),
        badge_url: expect.stringMatching(/https:\/\/res\.cloudinary/)
      });
    }
    done();
  });
});
