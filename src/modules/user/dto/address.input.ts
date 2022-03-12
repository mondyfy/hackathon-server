import { PartialType } from "@nestjs/swagger";
import { User } from "src/database/models/user.entity";

export class AddressInput {
    cityName?: string;
    countryName?: string;
    streetName?: string;
    title?: string;
    description?: string;
    longitude?: string;
    latitude?: string;
    user: User;
}

export class UpdateAddressInput extends PartialType(AddressInput) { }