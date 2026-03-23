const request = require('supertest');
const app = require('../index');

describe('Electricity API Comprehensive Test Suite', () => {

    // ========================================================================
    // API 1: Total electricity usages for each year
    // Endpoint: GET /api/usage/total-by-year
    // Description: Aggregates all electricity usage (in kWh) across all provinces
    //              for each year by summing all fields ending with '_kwh'
    // ========================================================================
    describe('GET /api/usage/total-by-year', () => {
        it('should return total electricity usage for each year', async () => {
            const res = await request(app).get('/api/usage/total-by-year');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(typeof res.body).toBe('object');
            // Verify we have year data (e.g., 2566, 2565, 2564)
            expect(Object.keys(res.body).length).toBeGreaterThan(0);
        });

        it('should return numeric values greater than zero for all years', async () => {
            const res = await request(app).get('/api/usage/total-by-year');
            expect(res.statusCode).toEqual(200);
            for (const year in res.body) {
                expect(typeof res.body[year]).toBe('number');
                expect(res.body[year]).toBeGreaterThan(0);
            }
        });

        it('should include all years present in the data', async () => {
            const res = await request(app).get('/api/usage/total-by-year');
            expect(res.statusCode).toEqual(200);
            // Data should have years 2564, 2565, 2566 (Buddhist Era)
            expect(Object.keys(res.body).length).toBeGreaterThanOrEqual(3);
        });
    });

    // ========================================================================
    // API 2: Total electricity users for each year
    // Endpoint: GET /api/users/total-by-year
    // Description: Aggregates all electricity user counts across all provinces
    //              for each year by summing all fields ending with '_count'
    // ========================================================================
    describe('GET /api/users/total-by-year', () => {
        it('should return total electricity users for each year', async () => {
            const res = await request(app).get('/api/users/total-by-year');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(typeof res.body).toBe('object');
            expect(Object.keys(res.body).length).toBeGreaterThan(0);
        });

        it('should return numeric values greater than zero for all years', async () => {
            const res = await request(app).get('/api/users/total-by-year');
            expect(res.statusCode).toEqual(200);
            for (const year in res.body) {
                expect(typeof res.body[year]).toBe('number');
                expect(res.body[year]).toBeGreaterThan(0);
            }
        });

        it('should aggregate user counts from all provinces', async () => {
            const res = await request(app).get('/api/users/total-by-year');
            expect(res.statusCode).toEqual(200);
            // Total users should be in millions for Thailand
            for (const year in res.body) {
                expect(res.body[year]).toBeGreaterThan(1000000);
            }
        });
    });

    // ========================================================================
    // API 3: Usage of specific province by specific year
    // Endpoint: GET /api/usage/:province/:year
    // Description: Returns detailed electricity usage data for a given province
    //              and year, including residential, business, and other categories
    // ========================================================================
    describe('GET /api/usage/:province/:year', () => {
        it('should return usage data for Bangkok year 2566', async () => {
            const res = await request(app).get('/api/usage/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(res.body.province_name).toEqual('Bangkok');
            expect(res.body.year).toEqual(2566);
            expect(res.body).toHaveProperty('residential_kwh');
        });

        it('should return usage data with all required fields', async () => {
            const res = await request(app).get('/api/usage/Krabi/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('year');
            expect(res.body).toHaveProperty('province_code');
            expect(res.body).toHaveProperty('province_name');
            expect(res.body).toHaveProperty('residential_kwh');
            expect(res.body).toHaveProperty('small_business_kwh');
            expect(res.body).toHaveProperty('medium_business_kwh');
            expect(res.body).toHaveProperty('large_business_kwh');
        });

        it('should return "Data not found" for invalid province', async () => {
            const res = await request(app).get('/api/usage/InvalidProvince/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });

        it('should return "Data not found" for invalid year', async () => {
            const res = await request(app).get('/api/usage/Bangkok/9999');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });

        it('should handle case-insensitive province names', async () => {
            const res = await request(app).get('/api/usage/bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body.province_name).toEqual('Bangkok');
        });
    });

    // ========================================================================
    // API 4: Users of specific province by specific year
    // Endpoint: GET /api/users/:province/:year
    // Description: Returns detailed electricity user count data for a given
    //              province and year, including residential, business categories
    // ========================================================================
    describe('GET /api/users/:province/:year', () => {
        it('should return user data for Bangkok year 2566', async () => {
            const res = await request(app).get('/api/users/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(res.body.province_name).toEqual('Bangkok');
            expect(res.body.year).toEqual(2566);
            expect(res.body).toHaveProperty('residential_count');
        });

        it('should return user data with all count fields', async () => {
            const res = await request(app).get('/api/users/Krabi/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('year');
            expect(res.body).toHaveProperty('province_code');
            expect(res.body).toHaveProperty('province_name');
            expect(res.body).toHaveProperty('residential_count');
            expect(res.body).toHaveProperty('small_business_count');
            expect(res.body).toHaveProperty('medium_business_count');
            expect(res.body).toHaveProperty('large_business_count');
        });

        it('should return "Data not found" for invalid province', async () => {
            const res = await request(app).get('/api/users/InvalidProvince/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });

        it('should return numeric values for user counts', async () => {
            const res = await request(app).get('/api/users/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body.residential_count).toBe('number');
            expect(res.body.residential_count).toBeGreaterThan(0);
            expect(typeof res.body.small_business_count).toBe('number');
        });
    });

    // ========================================================================
    // API 5: Usage history by specific province
    // Endpoint: GET /api/usage-history/:province
    // Description: Returns all historical electricity usage records for a
    //              given province across all available years
    // ========================================================================
    describe('GET /api/usage-history/:province', () => {
        it('should return usage history for Bangkok', async () => {
            const res = await request(app).get('/api/usage-history/Bangkok');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return multiple years of data for a province', async () => {
            const res = await request(app).get('/api/usage-history/Krabi');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            // Each record should have year and province info
            res.body.forEach(record => {
                expect(record).toHaveProperty('year');
                expect(record).toHaveProperty('province_name');
                expect(record).toHaveProperty('residential_kwh');
            });
        });

        it('should return empty array for non-existent province', async () => {
            const res = await request(app).get('/api/usage-history/NonExistent');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it('should handle case-insensitive province names', async () => {
            const res = await request(app).get('/api/usage-history/bangkok');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].province_name).toEqual('Bangkok');
        });
    });

    // ========================================================================
    // API 6: User history by specific province
    // Endpoint: GET /api/users-history/:province
    // Description: Returns all historical electricity user count records for
    //              a given province across all available years
    // ========================================================================
    describe('GET /api/users-history/:province', () => {
        it('should return user history for Bangkok', async () => {
            const res = await request(app).get('/api/users-history/Bangkok');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return multiple years of user data for a province', async () => {
            const res = await request(app).get('/api/users-history/Krabi');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            // Each record should have year and count fields
            res.body.forEach(record => {
                expect(record).toHaveProperty('year');
                expect(record).toHaveProperty('province_name');
                expect(record).toHaveProperty('residential_count');
            });
        });

        it('should return empty array for non-existent province', async () => {
            const res = await request(app).get('/api/users-history/NonExistent');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it('should return numeric count values for all categories', async () => {
            const res = await request(app).get('/api/users-history/Bangkok');
            expect(res.statusCode).toEqual(200);
            res.body.forEach(record => {
                expect(typeof record.residential_count).toBe('number');
                expect(typeof record.small_business_count).toBe('number');
                expect(typeof record.medium_business_count).toBe('number');
            });
        });
    });

    // ========================================================================
    // Error Handling Tests
    // Description: Tests for edge cases, invalid inputs, and error responses
    // ========================================================================
    describe('Error Handling', () => {
        it('should handle empty province name', async () => {
            const res = await request(app).get('/api/usage//2566');
            // Empty province results in 404 or "Data not found"
            expect([200, 404]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('message', 'Data not found');
            }
        });

        it('should handle non-numeric year values', async () => {
            const res = await request(app).get('/api/usage/Bangkok/abc');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });

        it('should handle special characters in province name', async () => {
            const res = await request(app).get('/api/usage/<script>alert(1)</script>/2566');
            // Special characters may result in 404 due to URL encoding
            expect([200, 404]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('message', 'Data not found');
            }
        });

        it('should handle very long province names', async () => {
            const longName = 'A'.repeat(1000);
            const res = await request(app).get(`/api/usage/${longName}/2566`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });
    });

});