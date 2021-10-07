import type { Project } from '../../types/Project'

export class DigitalOceanProject implements Project {
    name(): string {
        return 'VFM';
    }

    environment(): string {
        return 'Production';
    }

    description(): string {
        return 'Vehicle Fleet Management infrastructure';
    }

    purpose(): string {
        return 'Web Application';
    }
}