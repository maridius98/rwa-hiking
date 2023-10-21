import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log("creating typeorm options:");
    const isTest = process.env.NODE_ENV === 'test';
    console.log(isTest);
    return isTest ? require('./typeorm.config.test').typeOrmConfigTest : require('./typeorm.config.development').typeOrmConfigDevelopment;
  }
}