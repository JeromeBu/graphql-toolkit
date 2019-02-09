import { existsSync } from 'fs';
import { extname, isAbsolute, resolve as resolvePath } from 'path';
import isValidPath from 'is-valid-path';
import { buildASTSchema, buildClientSchema, DocumentNode, GraphQLSchema, IntrospectionQuery, parse } from 'graphql';
import { SchemaLoader } from './schema-loader';

export class SchemaFromExport implements SchemaLoader {
  canHandle(pointerToSchema: string): boolean {
    const fullPath = isAbsolute(pointerToSchema) ? pointerToSchema : resolvePath(process.cwd(), pointerToSchema);

    return isValidPath(pointerToSchema) && existsSync(fullPath) && extname(pointerToSchema) !== '.json';
  }

  async handle(file: string): Promise<GraphQLSchema> {
    const fullPath = isAbsolute(file) ? file : resolvePath(process.cwd(), file);

    if (existsSync(fullPath)) {
      const exports = require(fullPath);

      if (exports) {
        let rawExport = exports.default || exports.schema || exports;

        if (rawExport) {
          let schema = await rawExport;

          try {
            const schemaResult = await this.resolveSchema(schema);

            return schemaResult;
          } catch (e) {
            throw new Error('Exported schema must be of type GraphQLSchema, text, AST, or introspection JSON.');
          }
        } else {
          throw new Error(`Invalid export from export file ${fullPath}: missing default export or 'schema' export!`);
        }
      } else {
        throw new Error(`Invalid export from export file ${fullPath}: empty export!`);
      }
    } else {
      throw new Error(`Unable to locate introspection from export file: ${fullPath}`);
    }
  }

  isSchemaText(obj: any): obj is string {
    return typeof obj === 'string';
  }

  isWrappedSchemaJson(obj: any): obj is { data: IntrospectionQuery } {
    const json = obj as { data: IntrospectionQuery };

    return json.data !== undefined && json.data.__schema !== undefined;
  }

  isSchemaJson(obj: any): obj is IntrospectionQuery {
    const json = obj as IntrospectionQuery;

    return json !== undefined && json.__schema !== undefined;
  }

  isSchemaObject(obj: any): obj is GraphQLSchema {
    return obj instanceof GraphQLSchema;
  }

  isSchemaAst(obj: string | DocumentNode): obj is DocumentNode {
    return (obj as DocumentNode).kind !== undefined;
  }

  isPromise(obj: any): obj is Promise<any> {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
  }

  async resolveSchema(schema: any): Promise<any> {
    if (this.isSchemaObject(schema)) {
      return schema;
    } else if (this.isSchemaAst(schema)) {
      return buildASTSchema(schema);
    } else if (this.isSchemaText(schema)) {
      const ast = parse(schema);
      return buildASTSchema(ast);
    } else if (this.isWrappedSchemaJson(schema)) {
      return buildClientSchema(schema.data);
    } else if (this.isSchemaJson(schema)) {
      return buildClientSchema(schema);
    } else {
      throw new Error('Unexpected schema type provided!');
    }
  }
}
