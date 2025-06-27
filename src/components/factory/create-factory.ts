import type { FactoryPayload } from "./factory";
import type { PolymorphicFactoryPayload } from "./polymorphic-factory";

export type Factory<Payload extends FactoryPayload> = Payload;
export type PolymorphicFactory<Payload extends PolymorphicFactoryPayload> = Payload;
