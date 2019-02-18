import { ObjectType, Field, InputObjectType, InputField } from 'graphql-toolkit';

@ObjectType({ injector: ({ injector }) => injector })
@InputObjectType({ name: 'AuthorInput'})
export class Author {
  constructor({ id, name }: any) {
    this.id  = id;
    this.name = name;
  }
  @Field()
  @InputField()
  id: number;
  @Field()
  @InputField()
  name: string;
}