#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CustomerStack } from '../lib/customer-stack';

const app = new cdk.App();
new CustomerStack(app, 'CustomerStack', {});
