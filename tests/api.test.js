const request = require('supertest');
const app = require('../index');

describe('Electricity API Test Suite', () => {
    // API 1: Total electricity usages for each year
    describe('API 1: GET /api/usage/total-by-year', () => {
        it('VALID: should return total electricity usage for each year', async () => {
            const res = await request(app).get('/api/usage/total-by-year');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(typeof res.body).toBe('object');
            expect(Object.keys(res.body).length).toBeGreaterThan(0);
        });

        it('INVALID: should return 404 for non-existent endpoint', async () => {
            const res = await request(app).get('/api/usage/invalid-endpoint');
            expect(res.statusCode).toEqual(404);
        });
    });

    // API 2: Total electricity users for each year
    describe('API 2: GET /api/users/total-by-year', () => {
        it('VALID: should return total electricity users for each year', async () => {
            const res = await request(app).get('/api/users/total-by-year');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(typeof res.body).toBe('object');
            expect(Object.keys(res.body).length).toBeGreaterThan(0);
        });

        it('INVALID: should return 404 for non-existent endpoint', async () => {
            const res = await request(app).get('/api/users/invalid-endpoint');
            expect(res.statusCode).toEqual(404);
        });
    });

    // API 3: Usage of specific province by specific year
    describe('API 3: GET /api/usage/:province/:year', () => {
        it('VALID: should return usage data for Bangkok year 2566', async () => {
            const res = await request(app).get('/api/usage/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body.province_name).toEqual('Bangkok');
            expect(res.body.year).toEqual(2566);
            expect(res.body).toHaveProperty('residential_kwh');
        });

        it('INVALID: should return "Data not found" for invalid province', async () => {
            const res = await request(app).get('/api/usage/InvalidProvince/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });
    });

    // API 4: Users of specific province by specific year
    describe('API 4: GET /api/users/:province/:year', () => {
        it('VALID: should return user data for Bangkok year 2566', async () => {
            const res = await request(app).get('/api/users/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body.province_name).toEqual('Bangkok');
            expect(res.body.year).toEqual(2566);
            expect(res.body).toHaveProperty('residential_count');
        });

        it('INVALID: should return "Data not found" for invalid year', async () => {
            const res = await request(app).get('/api/users/Bangkok/9999');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });
    });

    // API 5: Usage history by specific province
    describe('API 5: GET /api/usage-history/:province', () => {
        it('VALID: should return usage history for Bangkok', async () => {
            const res = await request(app).get('/api/usage-history/Bangkok');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('year');
            expect(res.body[0]).toHaveProperty('province_name');
        });

        it('INVALID: should return empty array for non-existent province', async () => {
            const res = await request(app).get('/api/usage-history/NonExistentProvince');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });

    // API 6: User history by specific province
    describe('API 6: GET /api/users-history/:province', () => {
        it('VALID: should return user history for Krabi', async () => {
            const res = await request(app).get('/api/users-history/Krabi');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('year');
            expect(res.body[0]).toHaveProperty('residential_count');
        });

        it('INVALID: should return empty array for non-existent province', async () => {
            const res = await request(app).get('/api/users-history/FakeProvince');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });

    // Error Handling Tests
    describe('Error Handling', () => {
        it('should handle non-numeric year values', async () => {
            const res = await request(app).get('/api/usage/Bangkok/abc');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });

        it('should handle very long province names', async () => {
            const longName = 'A'.repeat(1000);
            const res = await request(app).get(`/api/usage/${longName}/2566`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });
    });

});