import fastify from 'fastify'
import {logger} from './logger';
import fastifyMongodb from '@fastify/mongodb';
import './config';
import * as routes from './routes/';
import * as fs from "fs";
import path from "path";
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifyMultipart, {MultipartFile} from '@fastify/multipart'


    const app = fastify();


    const mongoConnUrl : string = ''

     app.register(fastifyMongodb, {
        forceClose: true,
        url: mongoConnUrl
    })

    app.register(fastifySwagger, {
        exposeRoute: true,
        routePrefix: '/api/docs',
        swagger: {
            info: {
                title: ' API',
                description: ' API documents',
                version: 'v0',
            },
            schemes: ['https', 'http'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    })

    app.register(fastifyMultipart, {
        limits: {
            fieldNameSize: 100, // Max field name size in bytes
            fieldSize: 100, // Max field value size in bytes
            fields: 10, // Max number of non-file fields
            fileSize: 209715200, // For multipart forms, the max file size in bytes
            files: 1, // Max number of file fields
            headerPairs: 2000, // Max number of header key=>value pairs
        },
        // attachFieldsToBody: true,
    })

    app.register(fastifyCors, {
        origin: '*',
    })

    app.register((app, options, done) => {
        app.register(routes.testLoginPhone);
        app.register(routes.testProfile);
        app.register(routes.testProfileUpdate);
        app.register(routes.testCity24);
        app.register(routes.testRegisterPin);
        app.register(routes.testResetProfilePin);
        app.register(routes.testRegisterValidate);
        app.register(routes.testResetPassword);
        app.register(routes.testResetPin);
        app.register(routes.testResetPinCheckOld);
        app.register((app, options, done) => {
            app.decorate('prehandlerSession', async (req, reply) => {
                const parsed_header = req.headers?.authorization?.match(/^ ([a-f\d]{24})$/);
                if (!parsed_header) return reply.code(400).send({ok: false, message: 'incorrect-token-format'});
                const token = parsed_header.pop();
                const user_token = await app.mongo.db.collection('users').findOne({"session": {$elemMatch: {token}}});
                if (!user_token) return reply.code(400).send({ok: false, message: 'unauthorized'});
            });

            app.addHook('preValidation', async (request, reply) => {
                // @ts-ignore
                await app.prehandlerSession(request, reply);
            })
            app.register(routes.testSmsSend);
            app.register(routes.testLoginPin);
            app.register(routes.testProfilePin);
            app.register(routes.testCheckPin);
            app.register(routes.testCheckPassword);
            app.register(routes.testSmsValidate);
            app.register(routes.testTransaction);
            app.register(routes.testUserState);
            app.register(routes.testAppState);
            app.register(routes.testGetUsers);
            app.register(routes.testFileUpload);
            done();
        });

        done();
    }, {prefix: '/v0'});

     app.listen({
        port: parseInt(process.env.PORT) || 3000,
        host: process.env.HOST || '0.0.0.0',
    }, (err, address) => {
        if (err) {
            app.log.error(err)
            process.exit(1)
        }
    });



