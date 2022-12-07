const express = require('express');
const chai = require("chai");
const request = require("supertest");

const app = express();

describe('POST Create User', () => {
    it('should create user', () => {
        request(app)
            .post('/user')
            .send({
                "username": "hajsgdashdjgshdgausd",
                "password": "password1",
                "role": "buyer"
            })
            .expect(200)
            .then((res) => {
                expect(res.headers.location).to.be.eql('/user');
                expect(res.status).to.be.eql(200);
            });
    });
});

describe('POST login User', () => {
    it('should login user', () => {
        request(app)
            .post('/user/login')
            .send({
                "username": "hajsgdashdjgshdgausd",
                "password": "password1"
            })
            .expect(200)
            .then((res) => {
                expect(res.headers.location).to.be.eql('/user/login');
            });
    });
})

describe('GET retreive all users', () => {
    it('should get all users', () => {
        request(app)
            .get('/user')
            .send({})
            .expect(200)
            .then((res) => {
                expect(res.headers.location).to.be.eql('/user');
            })
    })
})

describe('GET a single user', () => {
    it('should get a user', () => {
        request(app)
            .get('/user/hahsdbsh')
            .send({})
            .expect(200)
            .then((res) => {
                expect(res.headers.location).to.be.eql('/user');
            })
    })
})