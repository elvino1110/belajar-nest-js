import { Reflector } from '@nestjs/core';

//Reflector untuk sebelum ke decorator agar lebih mudah
export const Roles = Reflector.createDecorator<string[]>()