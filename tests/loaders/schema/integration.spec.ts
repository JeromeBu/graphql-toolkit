import { buildASTSchema, isSchema, GraphQLSchema } from 'graphql';
import { loadSchema } from '../../../src';

describe('', () => {
  it('should work with graphql-tag and gatsby by default and not throw on files without those parsers', async () => {
    const schemaPath = './tests/loaders/schema/test-files/schema-dir/type-defs/*.ts';
    const built = await loadSchema(schemaPath);
    let schema: GraphQLSchema;
  
    if (!isSchema(built)) {
      schema = buildASTSchema(built);
    }
  
    expect(schema.getTypeMap()['User']).toBeDefined();
    expect(schema.getTypeMap()['Query']).toBeDefined();
  });
  
  it('should work with ts files and without globs correctly', async () => {
    const schemaPath = './tests/loaders/schema/test-files/schema-dir/type-defs/graphql-tag.ts';
    const built = await loadSchema(schemaPath);
    let schema: GraphQLSchema;
  
    if (!isSchema(built)) {
      schema = buildASTSchema(built);
    }
  
    expect(schema.getTypeMap()['User']).toBeDefined();
    expect(schema.getTypeMap()['Query']).toBeDefined();
  });
  
  it('should work with graphql files and without globs correctly', async () => {
    const schemaPath = './tests/loaders/schema/test-files/schema-dir/user.graphql';
    const built = await loadSchema(schemaPath);
    let schema: GraphQLSchema;
  
    if (!isSchema(built)) {
      schema = buildASTSchema(built);
    }
  
    expect(schema.getTypeMap()['User']).toBeDefined();
  });
});
