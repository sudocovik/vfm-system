import { Domain } from '../../types/Domain'

export class DigitalOceanDomain implements Domain {
    name(): string {
        return 'zarafleet.com';
    }
}