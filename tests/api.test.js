const request = require('supertest');
const app = require('../index');

describe('Electricity API Endpoints', () => {

    // Test Case 1: Total Usage
    describe('GET /api/usage/total-by-year', () => {
        it('should return total electricity usage for each year', async () => {
            const res = await request(app).get('/api/usage/total-by-year');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(typeof res.body).toBe('object');
            // Check that we have year keys (e.g., 2566, 2565, 2564)
            expect(Object.keys(res.body).length).toBeGreaterThan(0);
        });

        it('should return numeric values for total usage', async () => {
            const res = await request(app).get('/api/usage/total-by-year');
            expect(res.statusCode).toEqual(200);
            for (const year in res.body) {
                expect(typeof res.body[year]).toBe('number');
                expect(res.body[year]).toBeGreaterThan(0);
            }
        });
    });

    // Test Case 2: Specific Province Usage
    describe('GET /api/usage/:province/:year', () => {
        it('should return usage data for a specific province and year', async () => {
            const res = await request(app).get('/api/usage/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(res.body.province_name).toEqual('Bangkok');
            expect(res.body.year).toEqual(2566);
        });

        it('should return message when data not found', async () => {
            const res = await request(app).get('/api/usage/InvalidProvince/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Data not found');
        });

        it('should return usage data with all required fields', async () => {
            const res = await request(app).get('/api/usage/Krabi/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('year');
            expect(res.body).toHaveProperty('province_code');
            expect(res.body).toHaveProperty('province_name');
            expect(res.body).toHaveProperty('residential_kwh');
        });
    });

    // Test Case 3: Verify Data Structure for Users
    describe('GET /api/users/:province/:year', () => {
        it('should return user data for a specific province and year', async () => {
            const res = await request(app).get('/api/users/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeDefined();
            expect(res.body.province_name).toEqual('Bangkok');
            expect(res.body.year).toEqual(2566);
        });

        it('should return user data with count fields', async () => {
            const res = await request(app).get('/api/users/Krabi/2566');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('residential_count');
            expect(res.body).toHaveProperty('small_business_count');
            expect(res.body).toHaveProperty('medium_business_count');
        });

        it('should return numeric values for user counts', async () => {
            const res = await request(app).get('/api/users/Bangkok/2566');
            expect(res.statusCode).toEqual(200);
            expect(typeof res.body.residential_count).toBe('number');
            expect(res.body.residential_count).toBeGreaterThan(0);
        });
    });

    // // Test Case 4: Total Users by Year
    // describe('GET /api/users/total-by-year', () => {
    //     it('should return total electricity users for each year', async () => {
    //         const res = await request(app).get('/api/users/total-by-year');
    //         expect(res.statusCode).toEqual(200);
    //         expect(res.body).toBeDefined();
    //         expect(typeof res.body).toBe('object');
    //         expect(Object.keys(res.body).length).toBeGreaterThan(0);
    //     });

    //     it('should return numeric values for total users', async () => {
    //         const res = await request(app).get('/api/users/total-by-year');
    //         expect(res.statusCode).toEqual(200);
    //         for (const year in res.body) {
    //             expect(typeof res.body[year]).toBe('number');
    //             expect(res.body[year]).toBeGreaterThan(0);
    //         }
    //     });
    // });

    // // Test Case 5: Usage History for Province
    // describe('GET /api/usage-history/:province', () => {
    //     it('should return usage history for a specific province', async () => {
    //         const res = await request(app).get('/api/usage-history/Bangkok');
    //         expect(res.statusCode).toEqual(200);
    //         expect(res.body).toBeDefined();
    //         expect(Array.isArray(res.body)).toBe(true);
    //         expect(res.body.length).toBeGreaterThan(0);
    //     });

    //     it('should return multiple years of data for a province', async () => {
    //         const res = await request(app).get('/api/usage-history/Krabi');
    //         expect(res.statusCode).toEqual(200);
    //         expect(res.body.length).toBeGreaterThanOrEqual(1);
    //         expect(res.body[0]).toHaveProperty('year');
    //         expect(res.body[0]).toHaveProperty('province_name');
    //     });
    // });

    // // Test Case 6: User History for Province
    // describe('GET /api/users-history/:province', () => {
    //     it('should return user history for a specific province', async () => {
    //         const res = await request(app).get('/api/users-history/Bangkok');
    //         expect(res.statusCode).toEqual(200);
    //         expect(res.body).toBeDefined();
    //         expect(Array.isArray(res.body)).toBe(true);
    //         expect(res.body.length).toBeGreaterThan(0);
    //     });

    //     it('should return user data with count fields for all years', async () => {
    //         const res = await request(app).get('/api/users-history/Krabi');
    //         expect(res.statusCode).toEqual(200);
    //         res.body.forEach(yearData => {
    //             expect(yearData).toHaveProperty('residential_count');
    //             expect(yearData).toHaveProperty('year');
    //         });
    //     });
    // });

});