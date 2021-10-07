enum SPECIAL_CHARS {
    NEWLINE = '\n',
    CLEAR_EVERYTHING = '\x1bc',
    CLEAR_LAST_LINE = '\r\x1b[K',
}

export enum COLORS {
    DEFAULT = '\x1b[0m',
    RED = '\x1b[31m',
    GREEN = '\x1b[32m',
    YELLOW = '\x1b[33m',
}

export const UNICODE = {
    FULL_CIRCLE: String.fromCharCode(0x23FA),
    CHECK_MARK: String.fromCharCode(0x2713),
    CROSS_MARK: String.fromCharCode(0x2716),
}

export class Stdout {
    static write(text: string): void {
        process.stdout.write(text)
    }

    static writeLine(text: string): void {
        Stdout.write(text + SPECIAL_CHARS.NEWLINE)
    }

    static clearAll(): void {
        Stdout.write(SPECIAL_CHARS.CLEAR_EVERYTHING)
    }

    static clearLastLine(): void {
        Stdout.write(SPECIAL_CHARS.CLEAR_LAST_LINE)
    }

    static colorize(color: COLORS, text: string): string {
        return `${color}${text}${COLORS.DEFAULT}`
    }
}