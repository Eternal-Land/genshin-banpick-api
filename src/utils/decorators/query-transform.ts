import { Transform } from "class-transformer";

export type BooleanTransformMode = "string" | "string-or-boolean";

export interface TransformArrayOptions<T> {
	defaultValue?: T[] | undefined;
}

export interface BooleanArrayOptions extends TransformArrayOptions<boolean> {
	mode?: BooleanTransformMode;
}

const getDefaultValue = <T>(
	options: TransformArrayOptions<T> | undefined,
	fallback: T[],
): T[] | undefined => {
	if (options && "defaultValue" in options) {
		return options.defaultValue;
	}
	return fallback;
};

const mapToArray = <T>(
	value: unknown,
	mapFn: (item: unknown) => T,
	defaultValue: T[] | undefined,
): T[] | undefined => {
	if (value === undefined || value === null) {
		return defaultValue;
	}
	if (Array.isArray(value)) {
		return value.map(mapFn);
	}
	return [mapFn(value)];
};

const toBoolean = (value: unknown, mode: BooleanTransformMode): boolean => {
	if (mode === "string") {
		return value === "true";
	}
	return String(value) === "true";
};

export const TransformToNumberArray = (
	options?: TransformArrayOptions<number>,
) =>
	Transform(({ value }) =>
		mapToArray(value, (item) => Number(item), getDefaultValue(options, [])),
	);

export const TransformToBooleanArray = (options?: BooleanArrayOptions) => {
	const mode = options?.mode ?? "string-or-boolean";
	return Transform(({ value }) =>
		mapToArray(
			value,
			(item) => toBoolean(item, mode),
			getDefaultValue(options, []),
		),
	);
};
