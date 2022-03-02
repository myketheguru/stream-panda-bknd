// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { QuestionsController } from './questions.controller';

describe('QuestionsController', () => {

  let controller: QuestionsController;

  beforeEach(() => controller = createController(QuestionsController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(QuestionsController, 'foo'), 'GET');
      strictEqual(getPath(QuestionsController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
