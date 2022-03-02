// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { ApplicantsController } from './applicants.controller';

describe('ApplicantsController', () => {

  let controller: ApplicantsController;

  beforeEach(() => controller = createController(ApplicantsController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ApplicantsController, 'foo'), 'GET');
      strictEqual(getPath(ApplicantsController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
